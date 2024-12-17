'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchVehicleModels, VehicleModel } from '@/utils/api';

interface Params {
  makeId: string;
  year: string;
}

export default function ResultPage({
  params: paramsPromise,
}: {
  params: Promise<Params>;
}) {
  const [params, setParams] = useState<Params | null>(null);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await paramsPromise;
        if (!resolvedParams.makeId || !resolvedParams.year) {
          setError('Missing required parameters: makeId or year');
          return;
        }
        setParams(resolvedParams);

        const fetchedModels = await fetchVehicleModels(
          resolvedParams.makeId,
          resolvedParams.year
        );

        const uniqueModels = fetchedModels.filter(
          (model, index, self) =>
            index === self.findIndex((m) => m.Model_ID === model.Model_ID)
        );

        setModels(uniqueModels);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [paramsPromise]);

  if (!params && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-500">
        <p className="text-xl font-semibold text-white">
          Resolving parameters...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-500">
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

  if (!isLoading && models.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-500">
        <p className="text-xl font-semibold text-white">
          Unfortunately, no vehicle models were found for the selected make and
          year.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-600 to-blue-500 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Available Models for Selected Make and Year
      </h1>
      <p className="text-lg mb-4">
        Below is the list of available vehicle models for Make ID{' '}
        <strong>{params?.makeId}</strong> and Year{' '}
        <strong>{params?.year}</strong>:
      </p>
      <ul className="list-disc pl-6 space-y-2 max-w-lg text-left">
        {models.map((model, index) => (
          <li key={`${model.Model_ID}-${index}`} className="text-lg">
            {model.Model_Name}
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100"
      >
        Go Back
      </button>
    </div>
  );
}
