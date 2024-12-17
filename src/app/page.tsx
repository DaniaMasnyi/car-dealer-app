'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchMakes, Make } from '@/utils/api';

export default function HomePage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const fetchedMakes = await fetchMakes();
        setMakes(fetchedMakes);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('An unknown error occurred.');
        }
      }
    })();
  }, []);

  useEffect(() => {
    setIsButtonEnabled(!!selectedMake && !!selectedYear);
  }, [selectedMake, selectedYear]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Car Dealer App</h1>
      <select
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
        className="p-2 mb-4 border rounded"
      >
        <option value="">Select Vehicle Make</option>
        {makes.map((make) => (
          <option key={make.MakeId} value={make.MakeId}>
            {make.MakeName}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="p-2 mb-4 border rounded"
      >
        <option value="">Select Model Year</option>
        {Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => (
          <option key={2015 + i} value={2015 + i}>
            {2015 + i}
          </option>
        ))}
      </select>
      <Link
        href={isButtonEnabled ? `/result/${selectedMake}/${selectedYear}` : '#'}
      >
        <button
          disabled={!isButtonEnabled}
          className={`px-4 py-2 rounded ${
            isButtonEnabled
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-500'
          }`}
        >
          Next
        </button>
      </Link>
    </div>
  );
}
