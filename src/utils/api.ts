export interface Make {
  MakeId: string;
  MakeName: string;
}

export interface VehicleModel {
  Model_ID: string;
  Model_Name: string;
}

const API_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export async function fetchMakes(): Promise<Make[]> {
  const response = await fetch(
    `${API_BASE_URL}/GetMakesForVehicleType/car?format=json`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle makes');
  }
  const data = await response.json();
  return data.Results as Make[];
}

export async function fetchVehicleModels(
  makeId: string,
  year: string
): Promise<VehicleModel[]> {
  const response = await fetch(
    `${API_BASE_URL}/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch vehicle models');
  }
  const data = await response.json();
  return data.Results as VehicleModel[];
}
