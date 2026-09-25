import React from 'react';

export default function MountainDecoration({ className = '' }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={`w-28 h-20 select-none pointer-events-none drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back Mountain */}
      <polygon points="80,15 45,75 115,75" fill="#475569" />
      <polygon points="80,15 70,35 78,32 85,38 90,32" fill="#f8fafc" />

      {/* Front Mountain */}
      <polygon points="40,25 5,75 75,75" fill="#334155" />
      <polygon points="40,25 30,42 38,40 45,45 50,40" fill="#f1f5f9" />
    </svg>
  );
}
