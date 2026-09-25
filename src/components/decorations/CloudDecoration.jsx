import React from 'react';

export default function CloudDecoration({ className = '', opacity = 'opacity-85' }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className={`w-20 h-10 select-none pointer-events-none drop-shadow-sm ${opacity} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25 40 A15 15 0 0 1 20 20 A22 22 0 0 1 50 12 A25 25 0 0 1 80 20 A15 15 0 0 1 78 40 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
