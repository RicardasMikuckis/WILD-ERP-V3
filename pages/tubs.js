function Tubs({t}){
    const[tp,setTp]=useState('');
    const f=tp?TUB.filter(m=>m.tp===tp):TUB;
    return(<><div className="mh"><div><h2>{t.nav.tub}</h2><p>{TUB.length} {t.d.mod}</p></div></div><div className="mb">
    <div className="tabs"><button className={`tab ${!tp?'on':''}`} onClick={()=>setTp('')}>{t.m.all}</button>
    <button className={`tab ${tp==='ST'?'on':''}`} onClick={()=>setTp('ST')}>ST (Stiklo pluoštas)</button>
    <button className={`tab ${tp==='AK'?'on':''}`} onClick={()=>setTp('AK')}>AK (Akrilas)</button>
    <button className={`tab ${tp==='PP'?'on':''}`} onClick={()=>setTp('PP')}>PP (Polipropilenas)</button></div>
    <div className="card"><div className="tw"><table>
    <thead><tr><th>{t.c.mod}</th><th>{t.c.mc}</th><th>{t.c.lc}</th><th>{t.c.lh}</th><th>{t.c.tc}</th><th>{t.c.b2b}</th><th>{t.c.b2c}</th><th>{t.c.mrg}</th></tr></thead>
    <tbody>{f.map(m=><tr key={m.id}><td style={{fontWeight:600}}>{m.n}</td><td className="mn">{fmt(m.mc)}</td><td className="mn">{fmt(m.lc)}</td><td className="mn">{m.lh}h</td>
    <td className="mn" style={{fontWeight:600}}>{fmt(m.tc)}</td><td className="mn" style={{color:'var(--ac)'}}>{fmt(m.b2b)}</td><td className="mn" style={{color:'var(--ok)'}}>{fmt(m.b2c)}</td>
    <td className="mn">{((m.b2b-m.tc)/m.b2b*100).toFixed(0)}%</td></tr>)}</tbody></table></div></div></div></>);
}
