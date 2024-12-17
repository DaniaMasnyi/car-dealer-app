'use client';

import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchVehicleModels, VehicleModel } from '@/utils/api';

interface Params {
  makeId: string;
  year: string;
}

function ModelsList({ makeId, year }: { makeId: string; year: string }) {
  const [models, setModels] = React.useState<VehicleModel[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const fetchedModels = await fetchVehicleModels(makeId, year);

        const uniqueModels = fetchedModels.filter(
          (model, index, self) =>
            index === self.findIndex((m) => m.Model_ID === model.Model_ID)
        );

        setModels(uniqueModels);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    })();
  }, [makeId, year]);

  if (error) {
    return (
      <p className="text-xl text-red-500">
        {error}. Please go back and try again.
      </p>
    );
  }

  if (!models.length) {
    return (
      <p className="text-lg font-semibold">
        Unfortunately, no vehicle models were found for the selected make and
        year.
      </p>
    );
  }

  return (
    <ul className="list-disc pl-6 space-y-2 max-w-lg text-left">
      {models.map((model) => (
        <li key={model.Model_ID} className="text-lg">
          {model.Model_Name}
        </li>
      ))}
    </ul>
  );
}

export default function ResultPage({
  params: paramsPromise,
}: {
  params: Promise<Params>;
}) {
  const [params, setParams] = useState<Params | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await paramsPromise;
        if (!resolvedParams.makeId || !resolvedParams.year) {
          setError('Missing required parameters: makeId or year');
          return;
        }
        setParams(resolvedParams);
      } catch (err) {
        setError('Invalid parameters provided.');
      }
    })();
  }, [paramsPromise]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-blue-500">
        <p className="text-xl text-red-500">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!params) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-blue-500">
        <p className="text-xl font-semibold text-white">
          Resolving parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-blue-500 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Available Models for Selected Make and Year
      </h1>
      <p className="text-lg mb-4">
        Below is the list of available vehicle models for Make ID{' '}
        <strong>{params.makeId}</strong> and Year <strong>{params.year}</strong>
        :
      </p>
      <Suspense fallback={<p className="text-lg">Loading models...</p>}>
        <ModelsList makeId={params.makeId} year={params.year} />
      </Suspense>
      <button
        onClick={() => router.push('/')}
        className="mt-6 mb-10 px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100"
      >
        Go Back
      </button>
    </div>
  );
}
