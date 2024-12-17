'use client';

import React, { useEffect, useState } from 'react';

interface VehicleModel {
  Model_ID: string;
  Model_Name: string;
}

export default function ResultPage({
  params,
}: {
  params: { makeId: string; year: string };
}) {
  const { makeId, year } = params;
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleModels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
        );
        const data = await response.json();
        setModels(data.Results as VehicleModel[]);
        setError(null);
      } catch (error) {
        setError('Failed to fetch vehicle models. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleModels();
  }, [makeId, year]);

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
        Vehicle Models for Make ID {makeId} in Year {year}
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
