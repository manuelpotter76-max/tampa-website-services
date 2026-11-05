'use client';
import { useState } from 'react';

// Private one-time page to connect Zoho CRM. Not linked anywhere and hidden from search engines (see robots).
export default function ZohoSetup() {
  const [key, setKey] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);

  async function go(e) {
    e.preventDefault();
    setBusy(true); setRes(null);
    const r = await fetch('/api/zoho/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, code }) });
    setRes(await r.json().catch(() => ({ ok: false, error: 'Something went wrong.' })));
    setBusy(false);
  }

  return (
    <section className="container section narrow stack gap-6">
      <h1 className="h2">Connect Zoho CRM</h1>
      <form onSubmit={go} className="card-raised stack gap-4" style={{ padding: 24 }}>
        <label className="label">Setup password<input className="input" type="password" value={key} onChange={(e) => setKey(e.target.value)} required autoComplete="off" /></label>
        <label className="label">Zoho code <span className="hint">From the Zoho API Console. Leave empty to just re-check the connection.</span><input className="input mono" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" /></label>
        <button className="btn btn-primary" disabled={busy} style={{ alignSelf: 'flex-start' }}>{busy ? 'Connecting...' : 'Connect'}</button>
      </form>
      {res && (res.ok ? (
        <div className="notice" role="status">
          <p><strong>Connected to Zoho CRM.</strong></p>
          {res.brand?.ok
            ? <p>Brand field found ({res.brand.apiName}) with the &quot;{res.brandValue}&quot; option. New leads will be tagged with it.</p>
            : <p>Heads up: {res.brand?.error} {res.brand?.options?.length ? `Options found: ${res.brand.options.join(', ')}.` : ''}</p>}
        </div>
      ) : <p className="error" role="alert">{res.error}</p>)}
    </section>
  );
}
