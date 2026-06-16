export default function StatCard({ label, value, icon: Icon, tone = "violet" }) {
  return (
    <article className={`stat-card glass-panel ${tone}`}>
      <div className="stat-icon">{Icon ? <Icon size={24} /> : null}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}
