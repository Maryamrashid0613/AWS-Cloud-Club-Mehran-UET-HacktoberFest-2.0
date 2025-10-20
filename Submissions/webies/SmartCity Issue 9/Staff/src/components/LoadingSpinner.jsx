// components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = ({ size = "large", text = "Loading..." }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-16 w-16"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div 
        className={`animate-spin rounded-full border-b-2 border-green-600 ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-4 text-green-700">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;