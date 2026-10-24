export default function Legal({ title, updated, children }) {
  return (
    <section className="container section">
      <div className="prose">
        <p className="notice" role="note"><strong>Draft for review.</strong> This page is a starting draft and needs a lawyer&apos;s review before launch. Items in [brackets] still need real details.</p>
        <h1 className="h1" style={{ margin: '28px 0 8px', color: 'var(--ink)' }}>{title}</h1>
        <p className="small">Last updated: {updated}</p>
        {children}
      </div>
    </section>
  );
}
