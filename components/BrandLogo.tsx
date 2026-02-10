import React from 'react';

export const BrandLogo: React.FC<{ 
  className?: string; 
  variant?: 'dark' | 'light';
  withPrefix?: boolean; // If true, shows "Verify Your" above
}> = ({ className = "", variant = 'dark', withPrefix = false }) => {
  // Colors
  const textMain = variant === 'dark' ? '#0f172a' : '#f8fafc'; // slate-900 : slate-50
  const wheelColor = variant === 'dark' ? '#64748b' : '#94a3b8'; // slate-500 : slate-400
  const checkGradientStart = '#34d399'; // emerald-400
  const checkGradientEnd = '#10b981'; // emerald-500

  return (
    <div 
      className={`inline-flex flex-col items-start ${className} select-none`}
      style={{ aspectRatio: '200/80' }}
    >
      <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="checkGrad" x1="0" y1="0" x2="100%" y2="0">
            <stop offset="0%" stopColor={checkGradientStart} />
            <stop offset="100%" stopColor={checkGradientEnd} />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Optional Prefix */}
        {withPrefix && (
            <text x="2" y="10" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="10" fontWeight="800" fill={variant === 'dark' ? '#64748b' : '#94a3b8'} letterSpacing="0.1em" style={{ textTransform: 'uppercase' }}>
            Verify Your
            </text>
        )}

        <g transform="translate(0, 15)">
            {/* --- The 'C' (Cart) --- */}
            
            {/* Handle Bar */}
            <path d="M 0 12 L 14 12" stroke={textMain} strokeWidth="6" strokeLinecap="round" />

            {/* C Body shape */}
            <path 
                d="M 46 15 C 20 15 14 18 14 36 C 14 54 20 57 46 57" 
                stroke={textMain} 
                strokeWidth="8" 
                strokeLinecap="round" 
                fill="none"
            />

            {/* Wheels */}
            <circle cx="22" cy="70" r="5" fill={wheelColor} />
            <circle cx="48" cy="70" r="5" fill={wheelColor} />

            {/* --- Checkmark Swoosh --- */}
            {/* Starts inside C, checks downward, then swooshes up over the text */}
            <path 
                d="M 28 35 L 38 45 L 80 8" 
                stroke="url(#checkGrad)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                filter="url(#glow)"
            />

            {/* AI Dots */}
            <circle cx="88" cy="6" r="2.5" fill={checkGradientStart} opacity="0.9" />
            <circle cx="94" cy="4" r="2" fill={checkGradientStart} opacity="0.6" />
            <circle cx="99" cy="2" r="1.5" fill={checkGradientStart} opacity="0.4" />

            {/* --- Text 'ART' --- */}
            <text x="58" y="57" fontFamily='"Plus Jakarta Sans", sans-serif' fontSize="48" fontWeight="800" fill={textMain} letterSpacing="-0.03em">
                ART
            </text>
        </g>
      </svg>
    </div>
  );
};