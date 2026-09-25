import React from 'react';

export default function TreeDecoration({ type = 'pine', className = '' }) {
  if (type === 'oak') {
    return (
      <svg
        viewBox="0 0 60 70"
        className={`w-12 h-14 drop-shadow-sm select-none pointer-events-none ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="30" cy="65" rx="14" ry="4" fill="#064e3b" fillOpacity="0.3" />
        <rect x="26" y="42" width="8" height="20" rx="3" fill="#78350f" />
        <circle cx="30" cy="30" r="18" fill="#15803d" />
        <circle cx="20" cy="32" r="12" fill="#16a34a" />
        <circle cx="38" cy="34" r="11" fill="#22c55e" />
        <circle cx="30" cy="22" r="13" fill="#4ade80" />
      </svg>
    );
  }

  // Pine tree
  return (
    <svg
      viewBox="0 0 60 80"
      className={`w-12 h-16 drop-shadow-sm select-none pointer-events-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="30" cy="74" rx="16" ry="5" fill="#064e3b" fillOpacity="0.3" />
      <rect x="26" y="52" width="8" height="22" rx="3" fill="#78350f" />
      <polygon points="30,8 10,40 50,40" fill="#047857" />
      <polygon points="30,22 14,50 46,50" fill="#059669" />
      <polygon points="30,36 18,60 42,60" fill="#10b981" />
      <circle cx="30" cy="12" r="2" fill="#fef08a" />
    </svg>
  );
}
