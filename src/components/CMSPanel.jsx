import { useState } from 'react';
import { VISUAL_LABELS } from './SceneContent';

const SCROLLBAR_CSS = `
  .cms-scroll::-webkit-scrollbar { width: 4px; }
  .cms-scroll::-webkit-scrollbar-track { background: transparent; }
  .cms-scroll::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 2px; }
  .cms-scroll::-webkit-scrollbar-thumb:hover { background: #444; }
`;

const C = {
  bg:          'rgba(8,8,16,0.97)',
  border:      '#1e1e2e',
  border2:     '#2a2a3e',
  accent:      '#4488ff',
  muted:       'rgba(180,180,200,0.4)',
  text:        '#c8c8d8',
  danger:      '#ff4466',
  input:       'rgba(255,255,255,0.05)',
  inputBorder: '#2a2a3e',
};

const mono = '"JetBrains Mono","Fira Code","Cascadia Code",Consolas,monospace';
const base = { fontFamily: mono, fontSize: 11, color: C.text, boxSizing: 'border-box' };

export function CMSPanel({ phases, actions, currentIndex, goTo }) {
  const [open, setOpen]       = useState(false);
  const [selected, setSelected] = useState(0);
  const [tab, setTab]         = useState('phase'); // 'phase' | 'story'

  const phase = phases[selected] ?? phases[0];
  if (!phase) return null;

  // ── Phase field helpers ──────────────────────────────────────────
  function updateField(field, val) {
    actions.updatePhase(phase.id, { [field]: val });
  }
  function updateLine(i, val) {
    const next = [...phase.lines]; next[i] = val;
    actions.updatePhase(phase.id, { lines: next });
  }
  function addLine()       { actions.updatePhase(phase.id, { lines: [...phase.lines, ''] }); }
  function deleteLine(i)   { actions.updatePhase(phase.id, { lines: phase.lines.filter((_, j) => j !== i) }); }

  // ── Storyline beat helpers ───────────────────────────────────────
  const storyline = phase.storyline ?? [];
  function updateBeat(i, patch) {
    const next = storyline.map((b, j) => j === i ? { ...b, ...patch } : b);
    actions.updatePhase(phase.id, { storyline: next });
  }
  function addBeat() {
    actions.updatePhase(phase.id, {
      storyline: [...storyline, { date: '2025.00', headline: 'New Milestone', detail: 'Describe this moment.', nodeIndex: storyline.length }],
    });
  }
  function deleteBeat(i) {
    actions.updatePhase(phase.id, { storyline: storyline.filter((_, j) => j !== i) });
  }

  return (
    <>
      <style>{SCROLLBAR_CSS}</style>

      {/* Toggle */}
      <button onClick={() => setOpen(o => !o)} style={{
        ...base,
        position: 'fixed', top: 16, left: 16, zIndex: 300,
        background: open ? C.bg : 'rgba(8,8,16,0.88)',
        border: `1px solid ${open ? C.accent : C.border2}`,
        color: open ? C.accent : C.muted,
        padding: '5px 12px', cursor: 'pointer', letterSpacing: '0.15em',
        transition: 'all 0.2s',
      }}>
        {open ? '✕ CMS' : '⬡ CMS'}
      </button>

      {open && (
        <div onWheel={e => e.stopPropagation()} style={{
          ...base,
          position: 'fixed', top: 44, left: 16, zIndex: 200,
          width: 360, maxHeight: 'calc(100vh - 60px)',
          background: C.bg, border: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}>

          {/* Header */}
          <div style={{
            padding: '7px 12px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            letterSpacing: '0.12em', color: C.muted, flexShrink: 0,
          }}>
            <span>NEURAL GALLERY CMS</span>
            <span style={{ color: C.accent }}>{phases.length} PHASES</span>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* Sidebar */}
            <div className="cms-scroll" style={{
              width: 100, borderRight: `1px solid ${C.border}`,
              overflowY: 'auto', flexShrink: 0,
            }}>
              {phases.map((p, i) => (
                <div key={p.id} onClick={() => { setSelected(i); goTo(i); }} style={{
                  padding: '8px 10px', cursor: 'pointer',
                  borderLeft: `2px solid ${selected === i ? p.color : 'transparent'}`,
                  background: selected === i ? 'rgba(255,255,255,0.04)' : 'transparent',
                  display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'background 0.15s',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0,
                    boxShadow: selected === i ? `0 0 6px ${p.color}` : 'none',
                  }} />
                  <span style={{
                    color: selected === i ? p.color : C.muted,
                    fontSize: 10, letterSpacing: '0.08em',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{p.label}</span>
                </div>
              ))}
              <div onClick={actions.addPhase} style={{
                padding: '8px 10px', cursor: 'pointer', color: C.muted,
                fontSize: 10, letterSpacing: '0.1em',
                borderTop: `1px solid ${C.border}`, textAlign: 'center',
                transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.accent}
                onMouseLeave={e => e.currentTarget.style.color = C.muted}
              >+ ADD</div>
            </div>

            {/* Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Tab bar */}
              <div style={{
                display: 'flex', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
              }}>
                {['phase', 'story'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    ...base,
                    flex: 1, padding: '6px 0', background: 'none', cursor: 'pointer',
                    border: 'none', borderBottom: `2px solid ${tab === t ? phase.color : 'transparent'}`,
                    color: tab === t ? phase.color : C.muted,
                    letterSpacing: '0.15em', transition: 'all 0.15s',
                  }}>
                    {t === 'phase' ? 'ORBIT' : 'DIVE'}
                  </button>
                ))}
              </div>

              <div className="cms-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                {tab === 'phase' ? (
                  <>
                    <Field label="LABEL"><Input value={phase.label} onChange={v => updateField('label', v)} /></Field>
                    <Field label="PERIOD"><Input value={phase.period} onChange={v => updateField('period', v)} /></Field>
                    <Field label="TITLE"><Input value={phase.title} onChange={v => updateField('title', v)} /></Field>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <Field label="COLOR">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="color" value={phase.color} onInput={e => updateField('color', e.target.value)}
                            style={{ width: 28, height: 22, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
                          <span style={{ color: phase.color, fontSize: 10 }}>{phase.color}</span>
                        </div>
                      </Field>
                      <Field label="VISUAL" style={{ flex: 1 }}>
                        <select value={phase.nodeType} onChange={e => updateField('nodeType', e.target.value)}
                          style={{ ...base, width: '100%', background: C.input, border: `1px solid ${C.inputBorder}`, color: C.text, padding: '3px 6px', outline: 'none' }}>
                          {Object.entries(VISUAL_LABELS).map(([k, v]) => (
                            <option key={k} value={k} style={{ background: '#0a0a12' }}>{v}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div>
                      <div style={{ color: C.muted, fontSize: 9, letterSpacing: '0.15em', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                        <span>BULLETS</span><span>{phase.lines.length} lines</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {phase.lines.map((line, i) => (
                          <div key={i} style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                            <span style={{ color: phase.color, paddingTop: 4, flexShrink: 0 }}>›</span>
                            <textarea value={line} onChange={e => updateLine(i, e.target.value)}
                              rows={Math.max(1, Math.ceil(line.length / 36))}
                              style={{ ...base, flex: 1, background: C.input, border: `1px solid ${C.inputBorder}`, color: C.text, padding: '3px 6px', resize: 'none', outline: 'none', lineHeight: 1.5 }}
                              onFocus={e => e.target.style.borderColor = phase.color}
                              onBlur={e => e.target.style.borderColor = C.inputBorder}
                            />
                            <button onClick={() => deleteLine(i)} style={{ ...base, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', paddingTop: 3, flexShrink: 0 }}
                              onMouseEnter={e => e.currentTarget.style.color = C.danger}
                              onMouseLeave={e => e.currentTarget.style.color = C.muted}>×</button>
                          </div>
                        ))}
                      </div>
                      <Dashed onClick={addLine} color={C} label="+ ADD LINE" />
                    </div>

                    <DangerBtn disabled={phases.length <= 1} onClick={() => {
                      if (phases.length <= 1) return;
                      actions.deletePhase(phase.id);
                      setSelected(Math.max(0, selected - 1));
                    }} label="DELETE PHASE" />
                  </>
                ) : (
                  // ── DIVE / STORYLINE TAB ──────────────────────────────
                  <>
                    <div style={{ color: C.muted, fontSize: 9, letterSpacing: '0.15em', marginBottom: 4 }}>
                      DIVE STORYLINE — {storyline.length} BEATS
                    </div>
                    <div style={{ fontSize: 9, color: '#444455', letterSpacing: '0.1em', marginBottom: 8, lineHeight: 1.6 }}>
                      Each beat maps to an AI-viz node (0-indexed). Scroll inside the dive to advance.
                    </div>

                    {storyline.map((beat, i) => (
                      <div key={i} style={{
                        border: `1px solid ${C.border2}`,
                        padding: '8px 10px',
                        display: 'flex', flexDirection: 'column', gap: 6,
                        position: 'relative',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: phase.color, fontSize: 9, letterSpacing: '0.15em' }}>BEAT {i + 1}</span>
                          <button onClick={() => deleteBeat(i)} style={{ ...base, background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = C.danger}
                            onMouseLeave={e => e.currentTarget.style.color = C.muted}>× remove</button>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <Field label="DATE" style={{ flex: '0 0 80px' }}>
                            <Input value={beat.date} onChange={v => updateBeat(i, { date: v })} />
                          </Field>
                          <Field label="NODE IDX" style={{ flex: '0 0 60px' }}>
                            <input type="number" min={0} max={9} value={beat.nodeIndex}
                              onChange={e => updateBeat(i, { nodeIndex: parseInt(e.target.value) || 0 })}
                              style={{ ...base, width: '100%', background: C.input, border: `1px solid ${C.inputBorder}`, color: C.text, padding: '3px 6px', outline: 'none' }}
                              onFocus={e => e.target.style.borderColor = phase.color}
                              onBlur={e => e.target.style.borderColor = C.inputBorder}
                            />
                          </Field>
                        </div>

                        <Field label="HEADLINE">
                          <Input value={beat.headline} onChange={v => updateBeat(i, { headline: v })} />
                        </Field>

                        <Field label="DETAIL">
                          <textarea value={beat.detail} onChange={e => updateBeat(i, { detail: e.target.value })}
                            rows={Math.max(2, Math.ceil(beat.detail.length / 36))}
                            style={{ ...base, width: '100%', background: C.input, border: `1px solid ${C.inputBorder}`, color: C.text, padding: '3px 6px', resize: 'none', outline: 'none', lineHeight: 1.5 }}
                            onFocus={e => e.target.style.borderColor = phase.color}
                            onBlur={e => e.target.style.borderColor = C.inputBorder}
                          />
                        </Field>
                      </div>
                    ))}

                    <Dashed onClick={addBeat} color={C} label="+ ADD BEAT" />
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Tiny helpers ────────────────────────────────────────────────────
function Field({ label, children, style }) {
  return (
    <div style={style}>
      <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(180,180,200,0.4)', marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}
function Input({ value, onChange }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{
      fontFamily: mono, fontSize: 11, color: '#c8c8d8', boxSizing: 'border-box',
      width: '100%', background: 'rgba(255,255,255,0.05)',
      border: '1px solid #2a2a3e', padding: '3px 6px', outline: 'none',
    }}
      onFocus={e => e.target.style.borderColor = '#4488ff'}
      onBlur={e => e.target.style.borderColor = '#2a2a3e'}
    />
  );
}
function Dashed({ onClick, color: C, label }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: mono, fontSize: 11, boxSizing: 'border-box',
      marginTop: 6, background: 'none', border: `1px dashed ${C.border2}`,
      color: C.muted, width: '100%', padding: '4px 0', cursor: 'pointer',
      letterSpacing: '0.12em', transition: 'all 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.color = C.muted; }}
    >{label}</button>
  );
}
function DangerBtn({ onClick, disabled, label }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: mono, fontSize: 11, boxSizing: 'border-box',
      marginTop: 6, background: 'rgba(255,68,102,0.07)',
      border: `1px solid ${disabled ? '#2a2a3e' : '#ff4466'}`,
      color: disabled ? 'rgba(180,180,200,0.4)' : '#ff4466',
      width: '100%', padding: '5px 0',
      cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: '0.12em', opacity: disabled ? 0.4 : 1,
      transition: 'opacity 0.15s',
    }}>{label}</button>
  );
}
