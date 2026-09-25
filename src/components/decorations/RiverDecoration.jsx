import React from 'react';

export default function RiverDecoration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 400 150"
      className={`w-full h-auto select-none pointer-events-none opacity-60 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-20 80 Q90 20, 200 80 T420 50 L420 120 Q310 150, 200 90 T-20 120 Z"
        fill="#38bdf8"
      />
      <path
        d="M-10 88 Q90 32, 200 88 T410 60"
        stroke="#bae6fd"
        strokeWidth="3"
        strokeDasharray="10 15"
        strokeLinecap="round"
      />
    </svg>
  );
}
