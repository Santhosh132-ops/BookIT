// frontend/src/components/ExperienceCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../types/experience';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the Details Page using the experience ID
    navigate(`/experiences/${experience.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={experience.imageUrl}
          alt={experience.title}
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
          {experience.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {experience.description}
        </p>

        {/* Price and Button */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-2xl font-bold text-indigo-600">
            ${experience.price.toFixed(2)}
          </span>
          <button
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={(e) => {
                e.stopPropagation(); // Prevents double navigation
                handleClick();
            }}
          >
            View Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;