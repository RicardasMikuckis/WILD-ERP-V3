function Saus({t}){
    return(<><div className="mh"><div><h2>{t.nav.sau}</h2><p>{SAU.length} {t.d.mod}</p></div></div><div className="mb">
    <div className="card"><div className="tw"><table>
    <thead><tr><th>{t.c.mod}</th>{['2','2.5','3','3.5','4','4.5','5','5.5','6'].map(l=><th key={l}>{l}m</th>)}</tr></thead>
    <tbody>{SAU.map(m=><tr key={m.id}><td style={{fontWeight:600}}>{m.n}</td>
    {['2','2.5','3','3.5','4','4.5','5','5.5','6'].map(l=><td key={l} className="mn">{m.c[l]?fmt(m.c[l]):'-'}</td>)}</tr>)}</tbody></table></div></div></div></>);
}
