import React, { useState, useEffect } from "react";

export default function PopupNotification() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 15000); // auto-close after 15s
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl relative overflow-hidden w-full max-w-[600px] sm:max-w-[800px] h-auto sm:h-[566px] transform transition-transform duration-500 scale-100 animate-zoomIn"
      >
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-red-600 transition z-50"
        >
          ✕
        </button>

        {/* Image Section */}
        <div className="relative w-full sm:h-[70%] h-48">
          <img
            src="/images/d2.avif" // Update your image path
            alt="Drone Cleaning Services"
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <h2 className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 
                         text-center text-xl sm:text-4xl font-bold text-white 
                         bg-black bg-opacity-50 px-3 sm:px-6 py-1 sm:py-2 rounded-lg shadow-lg 
                         whitespace-nowrap sm:whitespace-normal">
            🚀 Coming Soon
          </h2>
        </div>

        {/* Message */}
        <div className="p-4 sm:p-6 text-center flex flex-col justify-center">
          <p className="text-gray-700 text-base sm:text-lg">
            Stay tuned! We’re bringing innovative drone-powered cleaning
            solutions to make your spaces shine effortlessly.
          </p>
        </div>
      </div>

      {/* Zoom Animation */}
      <style>
        {`
          @keyframes zoomIn {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-zoomIn {
            animation: zoomIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
}
