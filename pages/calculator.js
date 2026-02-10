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
