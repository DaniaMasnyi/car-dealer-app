'use client';

import React, { useEffect, useState } from 'react';
import { fetchVehicleModels, VehicleModel } from '@/utils/api';

export default function ResultPage({
  params: paramsPromise,
}: {
  params: Promise<{ makeId: string; year: string }>;
}) {
  const [params, setParams] = useState<{ makeId: string; year: string } | null>(
    null
  );
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await paramsPromise;
        setParams(resolvedParams);

        const fetchedModels = await fetchVehicleModels(
          resolvedParams.makeId,
          resolvedParams.year
        );
        setModels(fetchedModels);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [paramsPromise]);

  if (!params) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Resolving parameters...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Loading vehicle models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">
          No models found for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Vehicle Models for Make ID {params.makeId} in Year {params.year}
      </h1>
      <ul className="list-disc pl-6">
        {models.map((model) => (
          <li key={model.Model_ID} className="text-lg text-gray-700">
            {model.Model_Name}
          </li>
        ))}
      </ul>
    </div>
  );
}
