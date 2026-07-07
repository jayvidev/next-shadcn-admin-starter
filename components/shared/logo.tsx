import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ width = 512, height = 512, className }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      className={className}
    >
      <rect
        id="r4"
        width="512"
        height="512"
        x="0"
        y="0"
        rx="128"
        fill="currentColor"
        strokeWidth="0"
        paintOrder="stroke"
      />
      <clipPath id="clip">
        <use xlinkHref="#r4" />
      </clipPath>
      <g
        stroke="var(--primary-foreground)"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(100.996 100.996) scale(12.917)"
      >
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <rect x="15" y="5" width="4" height="12" rx="1" />
        <rect x="7" y="8" width="4" height="9" rx="1" />
      </g>
    </svg>
  )
}
