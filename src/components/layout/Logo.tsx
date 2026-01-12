const LOGO_PATHS = [
  { d: 'M6 24c0-4 3-7 7-7s7 3 7 7-3 7-7 7c-2 0-4-1-5-2', dashArray: 50, duration: 1.2, delay: 0 },
  { d: 'M6 24h14', dashArray: 14, duration: 0.6, delay: 0.4 },
  { d: 'M24 31V20c0-3 2-5 5-5', dashArray: 20, duration: 0.8, delay: 0.6 },
  { d: 'M22 22h7', dashArray: 7, duration: 0.4, delay: 1 },
  { d: 'M34 17v10c0 2.5 2 4 4.5 4s4.5-1.5 4.5-4V17', dashArray: 30, duration: 1, delay: 1.2 },
] as const

export default function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      {LOGO_PATHS.map(({ d, dashArray, duration, delay }, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashArray,
            animation: `draw ${duration}s ease forwards ${delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  )
}
