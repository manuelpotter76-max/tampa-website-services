'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from './Logo';

const GREETING = "Hi, I'm the Tampa Website Services AI assistant. Ask me anything about a website for your business.";

function useSession() {
  const [id, setId] = useState('');
  useEffect(() => {
    let v = '';
    try {
      v = sessionStorage.getItem('tws-chat') || '';
      if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('tws-chat', v); }
    } catch { v = Math.random().toString(36).slice(2); }
    setId(v);
  }, []);
  return id;
}

export function ChatBox({ compact = false, autoFocus = false }) {
  const path = usePathname();
  const session = useSession();
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: GREETING }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }); }, [msgs, busy]);

  async function send(e) {
    e.preventDefault();
    const q = text.trim();
    if (!q || busy) return;
    const next = [...msgs, { role: 'user', content: q }];
    setMsgs(next); setText(''); setBusy(true);
    try {
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(1), sessionId: session, page: path }) });
      const j = await r.json();
      setMsgs([...next, { role: 'assistant', content: j.reply || 'Sorry, something went wrong. Try again?' }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'Sorry, I lost the connection. Try again?' }]);
    }
    setBusy(false);
  }

  return (
    <div className="stack gap-3" style={{ height: '100%', minHeight: 0 }}>
      <div ref={logRef} className="chat-log" aria-live="polite" style={{ flex: '1 1 auto', minHeight: compact ? 150 : 0, maxHeight: compact ? 260 : 'none', paddingRight: 4 }}>
        {msgs.map((m, i) => (
          <div key={i} className={'bubble ' + (m.role === 'user' ? 'me' : 'ai')} style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
        ))}
        {busy && <div className="bubble ai" aria-label="Assistant is typing"><span className="typing"><span /><span /><span /></span></div>}
      </div>
      <form onSubmit={send} className="row gap-2" style={{ flexWrap: 'nowrap' }}>
        <label htmlFor={compact ? 'chat-inline' : 'chat-panel'} className="sr-only">Ask a question</label>
        <input id={compact ? 'chat-inline' : 'chat-panel'} className="input" style={{ minHeight: 44 }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything about your site" autoFocus={autoFocus} maxLength={1000} />
        <button type="submit" className="btn btn-primary" aria-label="Send" style={{ minHeight: 44, width: 44, padding: 0, flex: '0 0 44px' }} disabled={busy}><Icon name="arrow" size={18} /></button>
      </form>
      <p className="tiny muted">AI assistant. Prices are starting points; a person confirms every quote.</p>
    </div>
  );
}

export default function ConciergeLauncher() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener('tws:open-chat', h);
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('tws:open-chat', h); window.removeEventListener('keydown', esc); };
  }, []);
  return (
    <>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with our AI assistant">
          <div className="row between center" style={{ padding: '14px 16px', borderBottom: '1px solid var(--hairline)' }}>
            <div className="row gap-3 center">
              <span aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--accent)' }} /></span>
              <strong style={{ fontSize: 15 }}>AI assistant</strong>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="btn btn-secondary" style={{ minHeight: 40, width: 40, padding: 0 }}><Icon name="close" size={18} /></button>
          </div>
          <div style={{ flex: '1 1 auto', minHeight: 0, padding: 16 }}>
            <ChatBox autoFocus />
          </div>
        </div>
      )}
      <button type="button" className="chat-fab" aria-label={open ? 'Close chat' : 'Chat with our AI assistant'} aria-expanded={open} onClick={() => setOpen(!open)}>
        <Icon name={open ? 'close' : 'chat'} size={26} />
      </button>
    </>
  );
}
