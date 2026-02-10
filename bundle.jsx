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
function Saus({t}){
    return(<><div className="mh"><div><h2>{t.nav.sau}</h2><p>{SAU.length} {t.d.mod}</p></div></div><div className="mb">
    <div className="card"><div className="tw"><table>
    <thead><tr><th>{t.c.mod}</th>{['2','2.5','3','3.5','4','4.5','5','5.5','6'].map(l=><th key={l}>{l}m</th>)}</tr></thead>
    <tbody>{SAU.map(m=><tr key={m.id}><td style={{fontWeight:600}}>{m.n}</td>
    {['2','2.5','3','3.5','4','4.5','5','5.5','6'].map(l=><td key={l} className="mn">{m.c[l]?fmt(m.c[l]):'-'}</td>)}</tr>)}</tbody></table></div></div></div></>);
}
function Calc({t}){
    const[type,setType]=useState('tub');
    const[mid,setMid]=useState('');
    const[hid,setHid]=useState('none');
    const[cid,setCid]=useState('none');
    const[clid,setClid]=useState('dg');
    const[ins,setIns]=useState(false);
    const[sl,setSl]=useState('3');
    const[onr,setOnr]=useState('');
    const[cnr,setCnr]=useState('');
    const[cnt,setCnt]=useState('DE');

    const mod=type==='tub'?TUB.find(m=>m.id===mid):SAU.find(m=>m.id===mid);
    const ht=HEAT.find(h=>h.id===hid);
    const cv=COV.find(c=>c.id===cid);
    const cl=COL.find(c=>c.id===clid);

    const pr=useMemo(()=>{
        if(!mod)return null;
        if(type==='tub'){
            const hP=ht?ht.p:0,cP=cv?cv.p:0,clP=cl?cl.p:0,insP=ins?30:0;
            const total=mod.tc+hP+cP+clP+insP;
            return{mc:mod.mc+clP+insP,lc:mod.lc,lh:mod.lh,tc:total,b2b:mod.b2b+hP+cP+clP+insP,b2c:mod.b2c+hP+cP+clP+insP,
                items:[{n:mod.n,p:mod.tc},ht?.p>0&&{n:ht.n,p:ht.p},cv?.p>0&&{n:cv.n,p:cv.p},cl?.p>0&&{n:cl.n,p:cl.p},insP>0&&{n:t.c.ins,p:insP}].filter(Boolean)};
        }else{
            const cost=mod.c[sl]||0;
            return{mc:cost,lc:Math.round(cost*.3),lh:Math.round(cost*.03),tc:cost,b2b:Math.round(cost*1.15),b2c:Math.round(cost*1.38),
                items:[{n:mod.n+' '+sl+'m',p:cost}]};
        }
    },[mod,ht,cv,cl,ins,sl,type]);

    const genPDF=(isProd)=>{
        if(!mod||!pr)return;
        const{jsPDF}=window.jspdf;const doc=new jsPDF();
        doc.setFont('helvetica','bold');doc.setFontSize(20);
        doc.text(isProd?'WILD - Gamybos lapas':'WILD - Komercinis pasiulymas',14,20);
        doc.setFontSize(10);doc.setFont('helvetica','normal');
        doc.text('Data: '+new Date().toLocaleDateString('lt-LT'),14,30);
        if(onr)doc.text('Uzsakymo Nr: '+onr,14,36);
        if(cnr)doc.text('Kliento Nr: '+cnr,14,42);
        if(cnt)doc.text('Salis: '+cnt,14,48);
        let y=58;doc.setFont('helvetica','bold');doc.setFontSize(14);
        doc.text(type==='tub'?(mod.pn||mod.n):(mod.n+' '+sl+'m'),14,y);y+=12;
        if(isProd){
            const rows=[];
            if(type==='tub'){rows.push([t.c.mod,mod.pn||mod.n]);if(cl)rows.push([t.c.col,cl.n]);if(ht)rows.push([t.c.heat,ht.n]);if(cv)rows.push([t.c.cover,cv.n]);rows.push([t.c.ins,ins?t.c.yes:t.c.no])}
            else{rows.push([t.c.mod,mod.n]);rows.push([t.c.len,sl+' m'])}
            doc.autoTable({startY:y,head:[[t.c.opt,'']],body:rows,theme:'grid',headStyles:{fillColor:[91,141,239]},styles:{fontSize:10}});
            y=doc.lastAutoTable.finalY+10;
        }
        const pRows=pr.items.map(i=>[i.n,fmt(i.p)]);
        pRows.push([t.c.tc,fmt(pr.tc)]);
        if(!isProd){pRows.push([t.c.b2b,fmt(pr.b2b)]);pRows.push([t.c.b2c,fmt(pr.b2c)])}
        doc.autoTable({startY:y,body:pRows,theme:'striped',headStyles:{fillColor:[91,141,239]},styles:{fontSize:10}});
        doc.save('WILD_'+(isProd?'gamyba':'pasiulymas')+'_'+(onr||'draft')+'_'+new Date().toISOString().split('T')[0]+'.pdf');
    };

    return(<><div className="mh"><div><h2>{t.c.t}</h2><p>{t.c.s}</p></div>
        <div style={{display:'flex',gap:8}}>
            <button className="btn bg bsm" onClick={()=>genPDF(true)} disabled={!mod}><I n="pdf"/> {t.c.gprod}</button>
            <button className="btn bp bsm" onClick={()=>genPDF(false)} disabled={!mod}><I n="pdf"/> {t.c.gpdf}</button>
        </div></div>
    <div className="mb">
        <div className="fr" style={{marginBottom:16}}>
            <div className="fg"><label className="fl">{t.o.nr}</label><input className="fi" value={onr} onChange={e=>setOnr(e.target.value)} placeholder="WILD_xxx"/></div>
            <div className="fg"><label className="fl">{t.o.cnr}</label><input className="fi" value={cnr} onChange={e=>setCnr(e.target.value)}/></div>
        </div>
        <div className="cg"><div>
            <div className="cs"><div className="cst">{t.c.type}</div>
            <div className="tabs" style={{marginBottom:0}}><button className={`tab ${type==='tub'?'on':''}`} onClick={()=>{setType('tub');setMid('')}}>{t.c.tub}</button>
            <button className={`tab ${type==='sau'?'on':''}`} onClick={()=>{setType('sau');setMid('')}}>{t.c.sau}</button></div></div>

            <div className="cs"><div className="cst">{t.c.mod}</div>
            <div className="og">{(type==='tub'?TUB:SAU).map(m=>
                <div key={m.id} className={`oc ${mid===m.id?'sel':''}`} onClick={()=>setMid(m.id)}>
                    <div className="on">{m.n}</div><div className="op">{type==='tub'?fmt(m.b2b):fmt(m.c?.['3']||0)}</div>
                </div>
            )}</div></div>

            {type==='sau'&&mod&&<div className="cs"><div className="cst">{t.c.len}</div>
            <div className="og">{['2','2.5','3','3.5','4','4.5','5','5.5','6'].map(l=>
                <div key={l} className={`oc ${sl===l?'sel':''}`} onClick={()=>setSl(l)}><div className="on">{l} m</div><div className="op">{mod.c[l]?fmt(mod.c[l]):'-'}</div></div>
            )}</div></div>}

            {type==='tub'&&mod&&<>
                <div className="cs"><div className="cst">{t.c.col}</div><div className="og">{COL.map(c=><div key={c.id} className={`oc ${clid===c.id?'sel':''}`} onClick={()=>setClid(c.id)}><div className="on">{c.n}</div><div className="op">{c.p>0?'+'+fmt(c.p):'-'}</div></div>)}</div></div>
                <div className="cs"><div className="cst">{t.c.heat}</div><div className="og">{HEAT.map(h=><div key={h.id} className={`oc ${hid===h.id?'sel':''}`} onClick={()=>setHid(h.id)}><div className="on">{h.n}</div><div className="op">{fmt(h.p)}</div></div>)}</div></div>
                <div className="cs"><div className="cst">{t.c.cover}</div><div className="og">{COV.map(c=><div key={c.id} className={`oc ${cid===c.id?'sel':''}`} onClick={()=>setCid(c.id)}><div className="on">{c.n}</div><div className="op">{c.p>0?fmt(c.p):'-'}</div></div>)}</div></div>
                <div className="cs"><div className="cst">{t.c.ins}</div><div className="og">
                    <div className={`oc ${!ins?'sel':''}`} onClick={()=>setIns(false)}><div className="on">{t.c.no}</div></div>
                    <div className={`oc ${ins?'sel':''}`} onClick={()=>setIns(true)}><div className="on">{t.c.yes}</div><div className="op">+€30</div></div>
                </div></div>
            </>}
        </div>
        <div className="ps"><div className="card"><div className="ch"><h3>{t.c.ps}</h3></div><div className="cb">
            {!pr?<div className="empty" style={{padding:20}}><p>{t.c.mod}...</p></div>:<>
                {pr.items.map((i,x)=><div key={x} className="pr"><span>{i.n}</span><span className="pv">{fmt(i.p)}</span></div>)}
                <div className="pr" style={{borderTop:'1px solid var(--brd)',paddingTop:12,marginTop:8}}><span style={{fontWeight:700}}>{t.c.mc}</span><span className="pv">{fmt(pr.mc)}</span></div>
                <div className="pr"><span>{t.c.lc} ({pr.lh}h)</span><span className="pv">{fmt(pr.lc)}</span></div>
                <div className="pr" style={{borderTop:'2px solid var(--brd)',paddingTop:10,marginTop:6,fontWeight:700}}><span>{t.c.tc}</span><span className="pv">{fmt(pr.tc)}</span></div>
                <div className="pr" style={{marginTop:12,color:'var(--ac)'}}><span style={{fontWeight:600}}>{t.c.b2b}</span><span className="pv" style={{fontSize:18,fontWeight:700}}>{fmt(pr.b2b)}</span></div>
                <div className="pr tot"><span>{t.c.b2c}</span><span className="pv" style={{color:'var(--ok)'}}>{fmt(pr.b2c)}</span></div>
                <div className="pr" style={{color:'var(--t3)',fontSize:12}}><span>{t.c.mrg}</span><span className="pv">{((pr.b2b-pr.tc)/pr.b2b*100).toFixed(1)}%</span></div>
            </>}
        </div></div></div></div>
    </div></>);
}
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
const{useState,useEffect,useMemo}=React;

const LS={get:(k,d=null)=>{try{const v=localStorage.getItem('w3_'+k);return v?JSON.parse(v):d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('w3_'+k,JSON.stringify(v))}catch(e){}}};
const fmt=n=>'€'+Number(n||0).toFixed(2);

const I=({n})=>{const m={
dash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
mat:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
tub:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 14a4 4 0 008 0"/></svg>,
sau:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>,
calc:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
ord:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
prod:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 20h20M6 20V4l6 4V4l6 4v12"/></svg>,
srch:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
plus:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
x:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
pdf:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
edit:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
del:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
};return m[n]||null};

function App(){
    const[pg,setPg]=useState('dash');
    const[ln,setLn]=useState(LS.get('ln','lt'));
    const[mats,setMats]=useState(()=>{
        const saved=LS.get('mats');
        const ver=LS.get('mats_ver',0);
        if(!saved||ver<3){LS.set('mats_ver',3);return MATS_INIT}
        return saved;
    });
    const[ords,setOrds]=useState(LS.get('ords',[]));
    const t=T[ln]||T.lt;
    useEffect(()=>{LS.set('ln',ln)},[ln]);
    useEffect(()=>{LS.set('mats',mats)},[mats]);
    useEffect(()=>{LS.set('ords',ords)},[ords]);
    const P={dash:<Dash t={t} mats={mats} ords={ords} go={setPg}/>,mat:<Mats t={t} mats={mats} setMats={setMats}/>,tub:<Tubs t={t}/>,sau:<Saus t={t}/>,calc:<Calc t={t}/>,ord:<Ords t={t} ords={ords} setOrds={setOrds}/>,prod:<Prod t={t} ords={ords}/>};
    return(<div className="app"><div className="sidebar">
        <div className="sb-brand"><h1>{t.brand}</h1><p>{t.sub}</p></div>
        <nav className="sb-nav">
            <div className="nav-sec">{t.sec.main}</div>
            {[['dash','dash'],['mat','mat']].map(([k,i])=><div key={k} className={`nav-i ${pg===k?'on':''}`} onClick={()=>setPg(k)}><I n={i}/><span>{t.nav[k]}</span></div>)}
            <div className="nav-sec">{t.sec.prod}</div>
            {[['tub','tub'],['sau','sau'],['calc','calc']].map(([k,i])=><div key={k} className={`nav-i ${pg===k?'on':''}`} onClick={()=>setPg(k)}><I n={i}/><span>{t.nav[k]}</span></div>)}
            <div className="nav-sec">{t.sec.mgmt}</div>
            {[['ord','ord'],['prod','prod']].map(([k,i])=><div key={k} className={`nav-i ${pg===k?'on':''}`} onClick={()=>setPg(k)}><I n={i}/><span>{t.nav[k]}</span></div>)}
        </nav>
        <div className="sb-ft"><div className="lng">{['lt','en','de','ru','fr','it'].map(l=><button key={l} className={ln===l?'on':''} onClick={()=>setLn(l)}>{l.toUpperCase()}</button>)}</div></div>
    </div><div className="main">{P[pg]}</div></div>);
}

ReactDOM.render(<App/>,document.getElementById('root'));
