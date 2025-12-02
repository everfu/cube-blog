export default function SectionDivider() {
  return (
    <div className="section-divider">
      <svg className="divider-line" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="0" x2="100%" y2="0" />
      </svg>
      <div className="divider-stars"></div>
    </div>
  )
}
