function Mats({t,mats,setMats}){
    const[srch,setSrch]=useState('');const[cat,setCat]=useState('');const[show,setShow]=useState(false);const[ed,setEd]=useState(null);const[al,setAl]=useState(null);const[hShow,setHShow]=useState(null);
    const cats=[...new Set(mats.map(m=>m.category).filter(Boolean))].sort();
    const filt=mats.filter(m=>{const s=srch.toLowerCase();return(!s||m.code.toLowerCase().includes(s)||m.name.toLowerCase().includes(s)||m.sup?.toLowerCase().includes(s))&&(!cat||m.category===cat)});
    const doSave=d=>{
        if(ed){
            const old=mats.find(m=>m.id===ed.id);
            let ph=old.ph||[];
            if(old&&old.price!==d.price){ph=[...ph,{price:d.price,date:new Date().toISOString().split('T')[0]}]}
            setMats(mats.map(m=>m.id===ed.id?{...m,...d,ph}:m))
        }else{
            const newId=Math.max(0,...mats.map(m=>m.id))+1;
            setMats([...mats,{...d,id:newId,ph:[{price:d.price,date:new Date().toISOString().split('T')[0]}]}])
        }
        setShow(false);setEd(null);setAl({t:'ok',m:t.m.ok});setTimeout(()=>setAl(null),3000);
    };
    const doDel=id=>{if(!confirm(t.m.dc))return;setMats(mats.filter(m=>m.id!==id));setAl({t:'ok',m:t.m.del});setTimeout(()=>setAl(null),3000)};
    return(<><div className="mh"><div><h2>{t.m.t}</h2><p>{t.m.s} — {mats.length}</p></div><button className="btn bp" onClick={()=>{setEd(null);setShow(true)}}><I n="plus"/> {t.m.add}</button></div>
    <div className="mb">
        {al&&<div className={`alert ${al.t==='ok'?'a-ok':'a-er'}`}>{al.m}</div>}
        <div className="tb"><div className="tl">
            <div className="sw"><I n="srch"/><input className="si" placeholder={t.m.srch} value={srch} onChange={e=>setSrch(e.target.value)}/></div>
            <select className="fs" style={{width:200}} value={cat} onChange={e=>setCat(e.target.value)}><option value="">{t.m.all} ({mats.length})</option>{cats.map(c=><option key={c} value={c}>{c} ({mats.filter(m=>m.category===c).length})</option>)}</select>
        </div><span style={{color:'var(--t3)',fontSize:12}}>{filt.length}/{mats.length}</span></div>
        <div className="card"><div className="tw"><table><thead><tr><th>{t.m.code}</th><th>{t.m.name}</th><th>{t.m.cat}</th><th>{t.m.unit}</th><th>{t.m.price}</th><th>{t.m.sup}</th><th style={{textAlign:'center'}}>{t.m.act}</th></tr></thead>
        <tbody>{filt.map(m=><tr key={m.id}><td className="mn" style={{fontWeight:600}}>{m.code}</td><td>{m.name}</td><td><span className="badge b-bl">{m.category}</span></td><td>{m.unit}</td>
        <td className="mn" style={{cursor:m.ph&&m.ph.length>1?'pointer':'default',textDecoration:m.ph&&m.ph.length>1?'underline':''}} onClick={()=>{if(m.ph&&m.ph.length>1)setHShow(m)}} title={m.ph&&m.ph.length>1?'Kainos istorija':''}>{fmt(m.price)}{m.ph&&m.ph.length>1&&<span style={{color:'var(--wn)',marginLeft:4,fontSize:10}}>📊</span>}</td>
        <td style={{color:'var(--t3)'}}>{m.sup}</td>
        <td><div style={{display:'flex',gap:4,justifyContent:'center'}}><button className="bi" onClick={()=>{setEd(m);setShow(true)}}><I n="edit"/></button><button className="bi" onClick={()=>doDel(m.id)} style={{borderColor:'var(--er)'}}><I n="del"/></button></div></td></tr>)}</tbody></table>
        {filt.length===0&&<div className="empty"><p>{t.x.nodata}</p></div>}</div></div>
        {show&&<MModal t={t} mat={ed} mats={mats} onX={()=>{setShow(false);setEd(null)}} onS={doSave}/>}
        {hShow&&<PriceHistory mat={hShow} onX={()=>setHShow(null)}/>}
    </div></>);
}

function PriceHistory({mat,onX}){
    const hist=mat.ph||[];
    return(<div className="mo" onClick={onX}><div className="md" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
        <div className="mdh"><h3>Kainos istorija: {mat.code}</h3><button className="bi" onClick={onX}><I n="x"/></button></div>
        <div className="mdb">
            <p style={{color:'var(--t2)',marginBottom:12,fontSize:13}}>{mat.name}</p>
            <table><thead><tr><th>Data</th><th>Kaina</th><th>Pokytis</th></tr></thead>
            <tbody>{hist.map((h,i)=>{
                const prev=i>0?hist[i-1].price:h.price;
                const diff=h.price-prev;
                const pct=prev>0?((diff/prev)*100).toFixed(1):0;
                return <tr key={i}><td>{h.date}</td><td className="mn" style={{fontWeight:600}}>{fmt(h.price)}</td>
                <td className="mn" style={{color:diff>0?'var(--er)':diff<0?'var(--ok)':'var(--t3)'}}>{i>0?(diff>0?'+':'')+fmt(diff)+' ('+pct+'%)':'—'}</td></tr>
            })}</tbody></table>
        </div>
    </div></div>);
}

function MModal({t,mat,mats,onX,onS}){
    const cats=[...new Set(mats.map(m=>m.category).filter(Boolean))].sort();
    const genCode=(category)=>{
        const info=CAT_PFX[category];
        if(!info)return '';
        const pfx=info.p;
        let maxN=0;
        mats.forEach(m=>{if(m.code.startsWith(pfx)){const n=parseInt(m.code.slice(pfx.length));if(!isNaN(n)&&n>maxN)maxN=n}});
        return pfx+String(maxN+1).padStart(6,'0');
    };
    const initCat=mat?mat.category:cats[0]||'';
    const[f,sf]=useState(mat?{...mat}:{code:genCode(initCat),name:'',category:initCat,unit:'vnt',qty:1,price:0,sup:'',com:''});
    const onCatChange=(newCat)=>{
        if(!mat){sf({...f,category:newCat,code:genCode(newCat)})}
        else{sf({...f,category:newCat})}
    };
    return(<div className="mo" onClick={onX}><div className="md" onClick={e=>e.stopPropagation()}>
        <div className="mdh"><h3>{mat?t.m.ed:t.m.add}</h3><button className="bi" onClick={onX}><I n="x"/></button></div>
        <div className="mdb">
            <div className="fr">
                <div className="fg"><label className="fl">{t.m.cat} *</label>
                    <select className="fs" value={f.category} onChange={e=>onCatChange(e.target.value)}>
                        {cats.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="fg"><label className="fl">{t.m.code} *</label>
                    <input className="fi" value={f.code} onChange={e=>sf({...f,code:e.target.value})} style={{background:!mat?'var(--acs)':'var(--bg3)',fontWeight:600,fontFamily:'JetBrains Mono'}}/>
                    {!mat&&<span style={{fontSize:10,color:'var(--ok)',marginTop:4,display:'block'}}>✓ Automatiškai sugeneruotas</span>}
                </div>
            </div>
            <div className="fg"><label className="fl">{t.m.name} *</label><input className="fi" value={f.name} onChange={e=>sf({...f,name:e.target.value})}/></div>
            <div className="fr">
                <div className="fg"><label className="fl">{t.m.unit}</label><select className="fs" value={f.unit} onChange={e=>sf({...f,unit:e.target.value})}>{['vnt','m','m2','m3','kg','L','val','kompl'].map(u=><option key={u}>{u}</option>)}</select></div>
                <div className="fg"><label className="fl">{t.m.price} (€) *</label>
                    <input className="fi" type="number" step="0.01" value={f.price} onChange={e=>sf({...f,price:parseFloat(e.target.value)||0})} style={{fontFamily:'JetBrains Mono',fontWeight:600}}/>
                    {mat&&mat.price!==f.price&&<span style={{fontSize:10,color:'var(--wn)',marginTop:4,display:'block'}}>⚠ Kaina pakeista: {fmt(mat.price)} → {fmt(f.price)}</span>}
                </div>
            </div>
            <div className="fg"><label className="fl">{t.m.sup}</label><input className="fi" value={f.sup||''} onChange={e=>sf({...f,sup:e.target.value})}/></div>
            <div className="fg"><label className="fl">{t.m.com}</label><textarea className="fi" rows="2" value={f.com||''} onChange={e=>sf({...f,com:e.target.value})}/></div>
            {mat&&mat.ph&&mat.ph.length>1&&<div style={{background:'var(--wns)',borderRadius:8,padding:12,marginTop:8}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--wn)',marginBottom:6}}>📊 KAINOS ISTORIJA ({mat.ph.length} įrašai)</div>
                {mat.ph.slice(-3).map((h,i)=><div key={i} style={{fontSize:12,color:'var(--t2)'}}>{h.date}: {fmt(h.price)}</div>)}
            </div>}
        </div>
        <div className="mdf"><button className="btn bg" onClick={onX}>{t.x.cancel}</button><button className="btn bp" onClick={()=>onS(f)}>{t.x.save}</button></div>
    </div></div>);
}
