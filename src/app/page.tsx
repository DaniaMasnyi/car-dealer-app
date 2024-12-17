'use client';

import React, { useEffect, useState } from 'react';
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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
      <h1 className="text-3xl font-extrabold mb-6">Car Dealer App</h1>
      <div className="w-full max-w-md space-y-6">
        <select
          value={selectedMake}
          onChange={(e) => setSelectedMake(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
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
          className="w-full p-3 rounded bg-white text-black"
        >
          <option value="">Select Model Year</option>
          {Array.from({ length: new Date().getFullYear() - 2014 }, (_, i) => (
            <option key={`year-${2015 + i}`} value={2015 + i}>
              {2015 + i}
            </option>
          ))}
        </select>
        <Link
          href={
            isButtonEnabled ? `/result/${selectedMake}/${selectedYear}` : '#'
          }
        >
          <button
            disabled={!isButtonEnabled}
            className={`w-full mt-6 py-3 rounded ${
              isButtonEnabled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
}
