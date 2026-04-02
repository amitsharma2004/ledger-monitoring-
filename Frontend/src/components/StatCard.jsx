/**
 * StatCard — accepts an SVG icon component via the `icon` prop.
 */
export default function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-header">
        <span className="stat-icon">
          {Icon && <Icon size={24} color={color} />}
        </span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  )
}