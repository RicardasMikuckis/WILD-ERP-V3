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
