"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface InteractiveSectionProps {
  yojanas: string[];
  addMoney: () => void;
}

const InteractiveSection: React.FC<InteractiveSectionProps> = ({
  yojanas,
  addMoney,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    addMoney();
    const randomQuote = yojanas[Math.floor(Math.random() * yojanas.length)];
    alert(randomQuote);
    router.refresh();
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold">
        Pradhan Mantri Unlimited Money Yojana!
      </h2>
      <button
        className="bg-blue-600 p-2 text-white m-1 rounded-lg"
        onClick={handleButtonClick}
      >
        Add Money
      </button>
    </div>
  );
};

export default InteractiveSection;
