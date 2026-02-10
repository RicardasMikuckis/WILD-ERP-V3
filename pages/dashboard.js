function Dash({t,mats,ords,go}){
    return(<><div className="mh"><div><h2>{t.d.t}</h2><p>{t.d.s}</p></div></div><div className="mb">
    <div className="sg">
        <div className="sc"><div className="sl">{t.d.mat}</div><div className="sv">{mats.length}</div></div>
        <div className="sc"><div className="sl">{t.d.ord}</div><div className="sv">{ords.length}</div></div>
        <div className="sc"><div className="sl">{t.d.inp}</div><div className="sv">{ords.filter(o=>o.status==='production').length}</div></div>
        <div className="sc"><div className="sl">{t.d.mod}</div><div className="sv">{TUB.length+SAU.length}</div></div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div className="card"><div className="ch"><h3>{t.d.qa}</h3></div><div className="cb" style={{display:'flex',flexDirection:'column',gap:8}}>
            <button className="btn bp" onClick={()=>go('calc')} style={{justifyContent:'center'}}><I n="calc"/> {t.nav.calc}</button>
            <button className="btn bg" onClick={()=>go('mat')} style={{justifyContent:'center'}}><I n="mat"/> {t.nav.mat}</button>
            <button className="btn bg" onClick={()=>go('ord')} style={{justifyContent:'center'}}><I n="ord"/> {t.nav.ord}</button>
        </div></div>
        <div className="card"><div className="ch"><h3>{t.d.ord}</h3></div><div className="cb">
            {ords.length===0?<div className="empty"><p>{t.x.nodata}</p></div>:
            <div className="tw"><table><thead><tr><th>{t.o.nr}</th><th>{t.o.st}</th><th>{t.o.tot}</th></tr></thead>
            <tbody>{ords.slice(0,5).map(o=><tr key={o.id}><td className="mn">{o.number}</td><td><span className={`badge ${o.status==='production'?'b-yl':'b-bl'}`}>{o.status}</span></td><td className="mn">{fmt(o.total)}</td></tr>)}</tbody></table></div>}
        </div></div>
    </div></div></>);
}
