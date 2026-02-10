function Prod({t,ords}){
    const p=ords.filter(o=>o.status==='production'||o.status==='confirmed');
    return(<><div className="mh"><div><h2>{t.nav.prod}</h2><p>{p.length} {t.d.inp}</p></div></div><div className="mb">
    {p.length===0?<div className="card"><div className="cb"><div className="empty"><p>{t.x.nodata}</p></div></div></div>:
    <div className="card"><div className="tw"><table>
    <thead><tr><th>{t.o.nr}</th><th>{t.o.cust}</th><th>{t.o.prod}</th><th>{t.o.cnt}</th><th>{t.o.st}</th><th>{t.o.tot}</th></tr></thead>
    <tbody>{p.map(o=><tr key={o.id}><td className="mn" style={{fontWeight:600}}>{o.number}</td><td>{o.customer}</td><td>{o.product}</td><td>{o.country}</td>
    <td><span className={`badge ${o.status==='production'?'b-yl':'b-bl'}`}>{t.o[o.status]||o.status}</span></td><td className="mn">{fmt(o.total)}</td></tr>)}</tbody></table></div></div>}
    </div></>);
}
