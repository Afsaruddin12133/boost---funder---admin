import React from 'react';

/**
 * Animated Logo Component for Admin Panel
 * 
 * Features:
 * - High-fidelity SVG reproduction of the BoostFundr logo
 * - "Running circle" animations on the swooshes
 * - Responsive sizes (sm, md, lg, xl)
 * - Premium gradient styling
 */
const Logo = ({ className = '', size = 'md', animated = true }) => {
  // Define size mappings
  const sizeMap = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
    full: 'w-full'
  };

  const containerClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center justify-center ${containerClass} ${className}`}>
      <svg
        viewBox="0 0 400 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto overflow-visible"
      >
        <defs>
          {/* Premium Green Gradient */}
          <linearGradient id="logoGreenGradientAdmin" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87c344" />
            <stop offset="50%" stopColor="#a3d655" />
            <stop offset="100%" stopColor="#87c344" />
          </linearGradient>

          {/* Animation Styles */}
          <style>
            {`
              @keyframes running-circle-admin {
                0% {
                  stroke-dashoffset: 300;
                  opacity: 0.3;
                }
                50% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 0.3;
                }
              }
              
              .swoosh-admin {
                stroke-dasharray: 150;
                stroke-width: 8;
                stroke-linecap: round;
                filter: drop-shadow(0 0 8px rgba(163, 214, 85, 0.4));
              }
              
              .swoosh-animated-admin {
                animation: running-circle-admin 3s linear infinite;
              }
              
              .swoosh-top-admin {
                animation-delay: -1.5s;
              }
              
              .logo-text-admin {
                font-family: 'Inter', system-ui, sans-serif;
                font-weight: 900;
                letter-spacing: -0.02em;
                filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.2));
              }
            `}
          </style>
        </defs>

        {/* BOOSTFUNDR Text */}
        <text
          x="200"
          y="70"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#logoGreenGradientAdmin)"
          className="logo-text-admin"
          style={{ fontSize: '56px', textTransform: 'uppercase' }}
        >
          BOOSTFUNDR
        </text>

        {/* Top Swoosh (over FUNDR) */}
        <path
          d="M220 30 C260 15, 340 15, 380 35"
          stroke="url(#logoGreenGradientAdmin)"
          className={`swoosh-admin ${animated ? 'swoosh-animated-admin swoosh-top-admin' : ''}`}
          fill="none"
        />

        {/* Bottom Swoosh (under BOOST) */}
        <path
          d="M20 90 C60 110, 140 110, 180 95"
          stroke="url(#logoGreenGradientAdmin)"
          className={`swoosh-admin ${animated ? 'swoosh-animated-admin' : ''}`}
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Logo;
