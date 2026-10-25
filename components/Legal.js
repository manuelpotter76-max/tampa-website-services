export default function Legal({ title, updated, children }) {
  return (
    <section className="container section">
      <div className="prose">
        <h1 className="h1" style={{ margin: '0 0 8px', color: 'var(--ink)' }}>{title}</h1>
        <p className="small">Last updated: {updated}</p>
        {children}
      </div>
    </section>
  );
}
