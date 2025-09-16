export default function YourPayIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 150"
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      <circle cx="75" cy="75" r="65" fill="url(#gradPurple)" />

      <path
        d="M35 55 Q75 85 115 55"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M35 75 Q75 105 115 75"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M35 95 Q75 125 115 95"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
