import React, { useState, useEffect } from "react";

export default function PopupNotification() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 15000); // auto-close after 15s
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div
        className={`bg-white rounded-2xl shadow-2xl relative overflow-hidden w-[1086px] h-[566px] max-w-[95%] transform transition-transform duration-500 scale-100 animate-zoomIn`}
      >
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-red-600 transition z-50"
        >
          ✕
        </button>

        {/* Image Section with Overlay Title */}
        <div className="relative w-full h-[70%]">
          <img
            src="/images/d2.avif" // <-- update with your image path
            alt="Drone Cleaning Services"
            className="w-full h-full object-cover"
          />
          <h2 className="absolute top-6 left-1/2 transform -translate-x-1/2 text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-2 rounded-lg shadow-lg">
            🚀 Coming Soon
          </h2>
        </div>

        {/* Message */}
        <div className="p-6 text-center h-[30%] flex flex-col justify-center">
          <p className="text-gray-700 text-lg">
            Stay tuned! We’re bringing innovative drone-powered cleaning
            solutions to make your spaces shine effortlessly.
          </p>
        </div>
      </div>

      {/* Zoom Animation */}
      <style>
        {`
          @keyframes zoomIn {
            from {
              transform: scale(0.5);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-zoomIn {
            animation: zoomIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
}
