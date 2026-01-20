import { BookOpen } from 'lucide-react';
import React from 'react';

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 200,
  height = 200,
  className = ''
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b4cca" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </linearGradient>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      <foreignObject x="60" y="0" width="80" height="100">
        <BookOpen className="h-20 w-20 text-white" />
      </foreignObject>

      <text
        x="100"
        y="140"
        textAnchor="middle"
        fontFamily="'Segoe UI', system-ui, sans-serif"
        fontWeight="800"
        fontSize="60"
        fill="url(#textGradient)"
        filter="url(#shadow)"
        letterSpacing="2"
      >
        ERPR
      </text>
    </svg>
  );
};

export default Logo;
