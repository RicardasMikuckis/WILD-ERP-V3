function Ords({t,ords,setOrds}){
    const[show,setShow]=useState(false);const[ed,setEd]=useState(null);
    const doS=d=>{if(ed)setOrds(ords.map(o=>o.id===ed.id?{...o,...d}:o));else setOrds([...ords,{...d,id:Date.now()}]);setShow(false);setEd(null)};
    const doD=id=>{if(confirm(t.m.dc))setOrds(ords.filter(o=>o.id!==id))};
    return(<><div className="mh"><div><h2>{t.o.t}</h2><p>{t.o.s}</p></div><button className="btn bp" onClick={()=>{setEd(null);setShow(true)}}><I n="plus"/> {t.o.add}</button></div>
    <div className="mb"><div className="card"><div className="tw"><table>
    <thead><tr><th>{t.o.nr}</th><th>{t.o.cnr}</th><th>{t.o.date}</th><th>{t.o.cnt}</th><th>{t.o.cust}</th><th>{t.o.prod}</th><th>{t.o.st}</th><th>{t.o.tot}</th><th>{t.m.act}</th></tr></thead>
    <tbody>{ords.map(o=><tr key={o.id}>
        <td className="mn" style={{fontWeight:600}}>{o.number}</td><td>{o.clientNr}</td><td>{o.date}</td><td>{o.country}</td><td>{o.customer}</td><td>{o.product}</td>
        <td><span className={`badge ${o.status==='draft'?'b-bl':o.status==='production'?'b-yl':o.status==='completed'?'b-gr':'b-rd'}`}>{t.o[o.status]||o.status}</span></td>
        <td className="mn">{fmt(o.total)}</td>
        <td><div style={{display:'flex',gap:4}}><button className="bi" onClick={()=>{setEd(o);setShow(true)}}><I n="edit"/></button><button className="bi" onClick={()=>doD(o.id)} style={{borderColor:'var(--er)'}}><I n="del"/></button></div></td>
    </tr>)}</tbody></table>
    {ords.length===0&&<div className="empty"><p>{t.x.nodata}</p></div>}</div></div>
    {show&&<OModal t={t} ord={ed} onX={()=>{setShow(false);setEd(null)}} onS={doS}/>}
    </div></>);
}

function OModal({t,ord,onX,onS}){
    const[f,sf]=useState(ord||{number:'WILD_',clientNr:'',date:new Date().toISOString().split('T')[0],country:'DE',customer:'',address:'',product:'Kubilas',status:'draft',total:0});
    return(<div className="mo" onClick={onX}><div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdh"><h3>{ord?t.m.ed:t.o.add}</h3><button className="bi" onClick={onX}><I n="x"/></button></div>
        <div className="mdb">
            <div className="fr"><div className="fg"><label className="fl">{t.o.nr}</label><input className="fi" value={f.number} onChange={e=>sf({...f,number:e.target.value})}/></div>
            <div className="fg"><label className="fl">{t.o.cnr}</label><input className="fi" value={f.clientNr} onChange={e=>sf({...f,clientNr:e.target.value})}/></div></div>
            <div className="fr"><div className="fg"><label className="fl">{t.o.date}</label><input className="fi" type="date" value={f.date} onChange={e=>sf({...f,date:e.target.value})}/></div>
            <div className="fg"><label className="fl">{t.o.cnt}</label><input className="fi" value={f.country} onChange={e=>sf({...f,country:e.target.value})}/></div></div>
            <div className="fg"><label className="fl">{t.o.cust}</label><input className="fi" value={f.customer} onChange={e=>sf({...f,customer:e.target.value})}/></div>
            <div className="fg"><label className="fl">{t.o.addr}</label><input className="fi" value={f.address||''} onChange={e=>sf({...f,address:e.target.value})}/></div>
            <div className="fr"><div className="fg"><label className="fl">{t.o.prod}</label><select className="fs" value={f.product} onChange={e=>sf({...f,product:e.target.value})}><option>{t.c.tub}</option><option>{t.c.sau}</option></select></div>
            <div className="fg"><label className="fl">{t.o.st}</label><select className="fs" value={f.status} onChange={e=>sf({...f,status:e.target.value})}><option value="draft">{t.o.draft}</option><option value="confirmed">{t.o.conf}</option><option value="production">{t.o.production}</option><option value="completed">{t.o.done}</option><option value="shipped">{t.o.ship}</option></select></div></div>
            <div className="fg"><label className="fl">{t.o.tot} (€)</label><input className="fi" type="number" step="0.01" value={f.total} onChange={e=>sf({...f,total:parseFloat(e.target.value)||0})}/></div>
        </div>
        <div className="mdf"><button className="btn bg" onClick={onX}>{t.x.cancel}</button><button className="btn bp" onClick={()=>onS(f)}>{t.x.save}</button></div>
    </div></div>);
}
