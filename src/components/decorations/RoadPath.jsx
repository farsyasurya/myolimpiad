import React from 'react';

/**
 * RoadPath Component
 * Draws connecting curved adventure road between level nodes
 */
export default function RoadPath({ nodes = [] }) {
  if (!nodes || nodes.length < 2) return null;

  // Build SVG path data connecting nodes
  const pathD = nodes.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    const prev = nodes[index - 1];
    // Bezier control points for smooth serpentine road
    const cy = (prev.y + point.y) / 2;
    return `${acc} C ${prev.x} ${cy}, ${point.x} ${cy}, ${point.x} ${point.y}`;
  }, '');

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <filter id="roadShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Outer Road Border */}
      <path
        d={pathD}
        stroke="#78350f"
        strokeWidth="28"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#roadShadow)"
      />

      {/* Road Surface (Warm dirt / cobblestone trail) */}
      <path
        d={pathD}
        stroke="#fde68a"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Cobblestone Dashes */}
      <path
        d={pathD}
        stroke="#d97706"
        strokeWidth="4"
        strokeDasharray="6 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
