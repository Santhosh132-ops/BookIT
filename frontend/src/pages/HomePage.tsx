// frontend/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExperienceCard from '../components/ExperienceCard';
import { Experience } from '../types/experience';

const API_BASE_URL = 'http://localhost:5000/api'; // Match your Express server port

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await axios.get<Experience[]>(`${API_BASE_URL}/experiences`);
        setExperiences(response.data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError("Failed to load experiences. Check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // --- Rendering Logic ---

  if (loading) {
    // Clear feedback for loading state
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-indigo-600">Loading Experiences...</h2>
        {/* You can add a simple spinner or skeleton UI here based on Figma */}
      </div>
    );
  }

  if (error) {
    // Clear feedback for error state
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    // Clear feedback for no data state
    return (
      <div className="text-center p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">No Experiences Found</h2>
        <p>Please ensure your database is seeded.</p>
      </div>
    );
  }

  // Success State: Render the grid
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900">Explore Our Top Experiences</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiences.map(exp => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;