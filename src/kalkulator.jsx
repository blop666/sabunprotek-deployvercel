import { useState, useMemo } from 'react';
import './kalkulator.css';
import Header from './header.jsx';

const A='/assets/';
const icon={hospital:A+'icon-hospital.svg',scale:A+'icon-scale.svg',user:A+'icon-user.svg',washing:A+'icon-washing-machine.svg',calendar:A+'icon-calendar.svg',flask:A+'icon-flask.svg'};

// Data produk PROTEK sesuai spesifikasi
const protekProducts=[
  {id:'avenger-l',nama:'Avenger L',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:5},
  {id:'launtex-l',nama:'Launtex L',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:5},
  {id:'protek-oxygen',nama:'Protek Oxygen Active',hargaPerGalon:1283028,volumeKemasan:25,dosisNonInfeksius:2,dosisInfeksius:6},
  {id:'protek-fabric',nama:'Protek Fabric Soft',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:6,dosisInfeksius:6},
  {id:'sentry-l',nama:'Sentry L',hargaPerGalon:1238293,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:2},
  {id:'action',nama:'Action',hargaPerGalon:1579786,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:2}
];

const Flask=()=><span className="cf-flask"><img src={icon.flask}/></span>;
function Field({icon:ic,label,children}){return <div className="cf-row"><img src={ic}/><div className="cf-field"><label>{label}</label>{children}</div></div>}
const num=v=>parseFloat(String(v).replace(/,/g,''))||0;
const fmt=(n)=>'Rp '+Math.round(n).toLocaleString('id-ID');
const handleNumberInput=(e,setValue)=>{
  const val=e.target.value;
  if(val===''||val==='0'){
    setValue(0);
  }else{
    setValue(num(val));
  }
};

// Radar chart geometry
const C=[386.015,379.069];
const AX=[[389.157,3.069],[773.015,276.069],[617.644,705.069],[162.956,705.069],[3.015,278.363]]; // top(Efektivitas) right(Kualitas) br(Efisiensi) bl(Biaya) left(PPI)
const clamp=v=>Math.max(.15,Math.min(1,v));

export default function Kalkulator(){
 // State management
 const [jenis,setJenis]=useState(0); // 0=Infeksius, 1=Non Infeksius, 2=Keduanya
 const [beratLinenHarian,setBeratLinenHarian]=useState(500);
 const [hariOperasional,setHariOperasional]=useState(30);
 const [kapasitasMesin,setKapasitasMesin]=useState(35);
 const [namaRS,setNamaRS]=useState('Rumah Sakit Hermina');
 
 // State untuk dosis produk Protek (editable)
 const [dosisProtek,setDosisProtek]=useState(protekProducts.map(p=>{
   if(jenis===1) return p.dosisNonInfeksius; // Non Infeksius
   if(jenis===0) return p.dosisInfeksius; // Infeksius
   return (p.dosisNonInfeksius+p.dosisInfeksius)/2; // Keduanya (rata-rata)
 }));
 
 // State untuk data kompetitor
 const [kompetitor,setKompetitor]=useState(protekProducts.map(p=>({
   nama:'',
   hargaPerGalon:0,
   volumeKemasan:25,
   dosisNonInfeksius:0,
   dosisInfeksius:0
 })));
 
 // Update dosis saat jenis linen berubah
 const updateJenis=(newJenis)=>{
   setJenis(newJenis);
   setDosisProtek(protekProducts.map(p=>{
     if(newJenis===1) return p.dosisNonInfeksius;
     if(newJenis===0) return p.dosisInfeksius;
     return (p.dosisNonInfeksius+p.dosisInfeksius)/2;
   }));
 };
 
 // Perhitungan untuk satu set produk (Protek atau Kompetitor)
 const hitungBiaya=(products,dosis,isKompetitor=false)=>{
   const rasioNonInfeksius=jenis===1?100:jenis===0?0:30;
   const rasioInfeksius=100-rasioNonInfeksius;
   
   const totalLinenBulanan=beratLinenHarian*hariOperasional;
   const volumeNonInfeksius=totalLinenBulanan*(rasioNonInfeksius/100);
   const volumeInfeksius=totalLinenBulanan*(rasioInfeksius/100);
   
   let totalBiaya=0;
   const details=products.map((p,i)=>{
     const hargaPerLiter=p.hargaPerGalon/p.volumeKemasan;
     
     let dosisNon,dosisInf;
     if(isKompetitor){
       dosisNon=p.dosisNonInfeksius;
       dosisInf=p.dosisInfeksius;
     }else{
       // Untuk Protek, gunakan dosis yang diinput user atau default berdasarkan jenis
       if(jenis===1){
         dosisNon=dosis[i];
         dosisInf=0;
       }else if(jenis===0){
         dosisNon=0;
         dosisInf=dosis[i];
       }else{
         dosisNon=p.dosisNonInfeksius;
         dosisInf=p.dosisInfeksius;
       }
     }
     
     const costPerLoadNon=(dosisNon*kapasitasMesin/1000)*hargaPerLiter;
     const costPerLoadInf=(dosisInf*kapasitasMesin/1000)*hargaPerLiter;
     const costPerKgNon=costPerLoadNon/kapasitasMesin;
     const costPerKgInf=costPerLoadInf/kapasitasMesin;
     
     const biayaNonBulanan=costPerKgNon*volumeNonInfeksius;
     const biayaInfBulanan=costPerKgInf*volumeInfeksius;
     const totalBiayaProduk=biayaNonBulanan+biayaInfBulanan;
     
     totalBiaya+=totalBiayaProduk;
     
     return {
       nama:p.nama,
       costPerKgNon,
       costPerKgInf,
       totalBiayaProduk,
       dosisNon,
       dosisInf
     };
   });
   
   return {
     totalBiaya,
     biayaHarian:totalBiaya/hariOperasional,
     biayaMingguan:(totalBiaya/hariOperasional)*7,
     biayaTahunan:totalBiaya*12,
     details,
     avgCostPerKg:totalBiaya/totalLinenBulanan,
     avgDosis:details.reduce((sum,d)=>sum+d.dosisNon+d.dosisInf,0)/details.length
   };
 };
 
 // Hitung biaya Protek dan Kompetitor
 const biayaProtek=useMemo(()=>hitungBiaya(protekProducts,dosisProtek,false),[dosisProtek,jenis,beratLinenHarian,hariOperasional,kapasitasMesin]);
 const biayaKompetitor=useMemo(()=>{
   const hasKompetitorData=kompetitor.some(k=>k.hargaPerGalon>0);
   if(!hasKompetitorData){
     // Default kompetitor (estimasi pasar - 30% lebih mahal)
     const defaultKomp=protekProducts.map(p=>({
       ...p,
       hargaPerGalon:p.hargaPerGalon*1.3,
       dosisNonInfeksius:p.dosisNonInfeksius*1.2,
       dosisInfeksius:p.dosisInfeksius*1.2
     }));
     return hitungBiaya(defaultKomp,dosisProtek,true);
   }
   return hitungBiaya(kompetitor,dosisProtek,true);
 },[kompetitor,jenis,beratLinenHarian,hariOperasional,kapasitasMesin]);
 
 // Perhitungan perbandingan
 const selisihRp=biayaKompetitor.totalBiaya-biayaProtek.totalBiaya;
 const persenHemat=(selisihRp/biayaKompetitor.totalBiaya)*100;
 
 // Radar chart scores berdasarkan perhitungan riil
 const scores=[
   clamp(1-(biayaProtek.avgDosis-2)/3), // Efektivitas (semakin rendah dosis semakin efektif)
   clamp(0.8), // Kualitas (fixed untuk Protek)
   clamp(1-(biayaProtek.avgDosis-1.5)/4), // Efisiensi Dosis
   clamp(1-(biayaProtek.avgCostPerKg-500)/1000), // Biaya per Kg
   jenis===0?0.9:jenis===1?0.62:0.75 // PPI based on jenis
 ];
 const scoresKomp=[
   clamp(1-(biayaKompetitor.avgDosis-2)/3),
   clamp(0.68),
   clamp(1-(biayaKompetitor.avgDosis-2)/4),
   clamp(1-(biayaKompetitor.avgCostPerKg-500)/1000),
   0.4
 ];
 
  const mk=(s,f=1)=>AX.map(([x,y],i)=>[C[0]+(x-C[0])*clamp(s[i])*f,C[1]+(y-C[1])*clamp(s[i])*f]);
  const pts=mk(scores);
  const ptsO=mk(scoresKomp);
  const poly='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
  const polyO='M'+ptsO.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
  
  // Tooltip state
  const [tooltip,setTooltip]=useState({show:false,x:0,y:0,title:'',value:'',label:''});
  const radarLabels=['Efektivitas Pembersihan','Kualitas Hasil Linen','Efisiensi Dosis','Biaya per Kg Linen','Dukungan PPI'];
  
  const showTooltip=(i,isProtek,e)=>{
    const score=isProtek?scores[i]:scoresKomp[i];
    const value=(score*100).toFixed(0)+'%';
    const rect=e.currentTarget.getBoundingClientRect();
    setTooltip({
      show:true,
      x:rect.left+rect.width/2,
      y:rect.top-10,
      title:isProtek?'PROTEK':'Kompetitor',
      value:value,
      label:radarLabels[i]
    });
  };
  const hideTooltip=()=>setTooltip({...tooltip,show:false});
  
  const toResult=()=>document.querySelector('.calc-radar').scrollIntoView({behavior:'smooth'});
 return <div className="kalkulator">
  <Header/>
  <div className="calc-page">
   <section className="calc-hero">
    <div className="ch-shade"/>
    <h1>Bandingkan Produk Laundry</h1>
    <p>Jangan hanya membandingkan harga. Bandingkan total efisiensi. dosis, hasil, dan nilai yang Anda dapatkan.</p>
   </section>
   <section className="calc-forms">
    <div className="cf-card">
     <div className="cf-badge">Data Operasional - Input Data Laundry</div>
      <div className="cf-fields">
       <Field icon={icon.hospital} label="Nama Rumah Sakit"><input className="cf-input" value={namaRS} onChange={e=>setNamaRS(e.target.value)}/></Field>
       <Field icon={icon.scale} label="Berat Linen Kotor"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={beratLinenHarian||''} onChange={e=>handleNumberInput(e,setBeratLinenHarian)}/><span className="cf-unit">kg/hari</span></div></Field>
       <Field icon={icon.user} label="Jenis Linen"><div className="cf-tabs">{['Infeksius','Non Infeksius','Keduanya'].map((t,i)=><button key={t} type="button" className={'cf-tab'+(i===jenis?' on':'')} onClick={()=>updateJenis(i)}>{t}</button>)}</div></Field>
       <Field icon={icon.washing} label="Kapasitas Mesin"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={kapasitasMesin||''} onChange={e=>handleNumberInput(e,setKapasitasMesin)}/><span className="cf-unit">kg/load</span></div></Field>
       <Field icon={icon.calendar} label="Hari Operasional"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={hariOperasional||''} onChange={e=>handleNumberInput(e,setHariOperasional)}/><span className="cf-unit">hari/bulan</span></div></Field>
      </div>
     <button className="cf-submit" type="button" onClick={toResult}>Hitung Perbandingan →</button>
    </div>
     <div className="cf-card side">
      <div className="cf-badge">Dosis Produk PROTEK - Input Dosis Produk</div>
      <div className="cf-fields">
       {protekProducts.map((p,i)=><div className="cf-prod" key={p.id}><Flask/><div className="cf-prow"><span>{p.nama}</span><input className="cf-dose" type="number" step="0.1" min="0" value={dosisProtek[i]||''} onChange={e=>setDosisProtek(dosisProtek.map((v,j)=>j===i?num(e.target.value):v))}/></div></div>)}
      </div>
      <button className="cf-submit" type="button" onClick={toResult}>Hitung Perbandingan →</button>
     </div>
   </section>
   <section className="calc-radar">
    <h2>Hasil Perbandingan</h2>
    <div className="radar-legend">
     <span className="rl rl-protek"><i className="dot-protek"/>PROTEK (dari input dosis Anda)</span>
     <span className="rl rl-other"><i className="dot-other"/>Produk Laundry Lain (estimasi pasar)</span>
    </div>
    <div className="radar-scale"><div className="radar">
     <svg className="radar-svg" viewBox="0 0 776 707.569" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M389.157 3.069L3.015 278.363L162.956 705.069H617.644L773.015 276.069L389.157 3.069Z" fill="white" stroke="#BFCEFD" strokeWidth="2"/>
      <path d="M385.419 76.069L80.015 293.716L206.514 631.069H566.131L689.015 291.902L385.419 76.069Z" fill="#EDF0FF" fillOpacity=".5" stroke="#2C7EFB" strokeWidth="2"/>
      <path d="M387.19 158.069L159.015 320.814L253.525 573.069H522.205L614.015 319.458L387.19 158.069Z" fill="#EDF0FF" fillOpacity=".5" stroke="#2C7EFB" strokeWidth="2"/>
      <path d="M385.979 226.069L229.015 337.834L294.03 511.069H478.858L542.015 336.902L385.979 226.069Z" fill="#EDF0FF" fillOpacity=".5" stroke="#BFCEFD" strokeWidth="2"/>
      <path d="M386.015 298.069L301.515 358.069L336.515 451.069H436.015L470.015 357.569L386.015 298.069Z" fill="#EDF0FF" fillOpacity=".5" stroke="#BFCEFD" strokeWidth="2"/>
       <path d={polyO} fill="#F07C1D" fillOpacity=".12" stroke="#F07C1D" strokeWidth="3" strokeLinejoin="round" strokeDasharray="12 8"/>
       <path d={poly} fill="#2C7EFB" fillOpacity=".22" stroke="#2C7EFB" strokeWidth="3" strokeLinejoin="round"/>
       <path d="M386.015 379.069L618.015 703.569" stroke="#BFCEFD" strokeWidth="2"/><path d="M386.015 379.069L163.015 704.569" stroke="#BFCEFD" strokeWidth="2"/><path d="M386.015 378.569L388.015 2.56904" stroke="#BFCEFD" strokeWidth="2"/><path d="M386.015 378.069L774.015 277.069" stroke="#BFCEFD" strokeWidth="2"/><path d="M386.015 379.069L2.01499 278.069" stroke="#BFCEFD" strokeWidth="2"/>
       {pts.map(([x,y],i)=><circle key={'p'+i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" fill="#125BBD" stroke="white" strokeWidth="3" style={{cursor:'pointer'}} onMouseEnter={e=>showTooltip(i,true,e)} onMouseLeave={hideTooltip}/>)}
       {ptsO.map(([x,y],i)=><circle key={'o'+i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" fill="#F07C1D" stroke="white" strokeWidth="3" style={{cursor:'pointer'}} onMouseEnter={e=>showTooltip(i,false,e)} onMouseLeave={hideTooltip}/>)}
     </svg>
     <span className="rlabel" style={{left:0,top:314}}>Dukungan PPI</span>
     <span className="rlabel" style={{left:434,top:0}}>Efektivitas Pembersihan</span>
     <span className="rlabel" style={{left:208,top:757.5}}>Biaya per Kg Linen</span>
     <span className="rlabel" style={{left:721,top:757.5}}>Efisiensi Dosis</span>
     <span className="rlabel" style={{left:1003,top:309}}>Kualitas<br/>Hasil Linen</span>
     </div></div>
    </section>
    {tooltip.show&&<div className="radar-tooltip show" style={{position:'fixed',left:tooltip.x+'px',top:tooltip.y+'px',transform:'translate(-50%, -100%)'}}><div className="tt-title">{tooltip.title}</div><div className="tt-value">{tooltip.value}</div><div className="tt-label">{tooltip.label}</div></div>}
   <section className="calc-table">
    <div className="ct-title"><h2>Hasil Perbandingan Detail</h2></div>
    <div className="ct-grid">
     <div className="ct-col">
      <div className="ct-h">Aspek</div>
      <div className="ct-c"><Flask/>Dosis Pemakaian (ml/kg/linen)</div>
      <div className="ct-c"><Flask/>Biaya per kg Linen (Rp)</div>
      <div className="ct-c"><Flask/>Jumlah Pencucian per Drum</div>
      <div className="ct-c"><Flask/>Hasil Pencucian</div>
      <div className="ct-c"><Flask/>Efisiensi Operasional</div>
      <div className="ct-c"><Flask/>Dukungan PPI</div>
     </div>
     <div className="ct-col">
      <div className="ct-h">PROTEK Laundry Solution</div>
      <div className="ct-c">{biayaProtek.avgDosis.toFixed(1)} ml/kg</div>
      <div className="ct-c">{fmt(biayaProtek.avgCostPerKg)}</div>
      <div className="ct-c">{kapasitasMesin} kg</div>
      <div className="ct-c">Bersih optimal, warna tetap terjaga</div>
      <div className="ct-c">Lebih hemat, produktivitas meningkat</div>
      <div className="ct-c">Ya (teruji dan sesuai standar kesehatan)</div>
     </div>
     <div className="ct-col">
      <div className="ct-h">Produk Laundry Lain</div>
      <div className="ct-c">{biayaKompetitor.avgDosis.toFixed(1)} ml/kg</div>
      <div className="ct-c">{fmt(biayaKompetitor.avgCostPerKg)}</div>
      <div className="ct-c">{Math.round(kapasitasMesin*0.8)} kg</div>
      <div className="ct-c">Cukup bersih, warna lebih cepat pudar</div>
      <div className="ct-c">Standar</div>
      <div className="ct-c">Terbatas</div>
     </div>
     <div className="ct-col">
      <div className="ct-h">Selisih</div>
      <div className="ct-c ct-sel"><b>{(biayaKompetitor.avgDosis-biayaProtek.avgDosis).toFixed(1)} ml/kg</b><small>(lebih rendah)</small></div>
      <div className="ct-c ct-sel"><b>{fmt(biayaKompetitor.avgCostPerKg-biayaProtek.avgCostPerKg)}</b><small>(lebih hemat)</small></div>
      <div className="ct-c ct-sel"><b>+{Math.round(kapasitasMesin*0.2)} kg</b><small>(lebih banyak)</small></div>
      <div className="ct-c ct-sel"><b>Lebih baik</b><small>(hasil & kualitas)</small></div>
      <div className="ct-c ct-sel"><b>Lebih efisien</b><small>(waktu & biaya)</small></div>
      <div className="ct-c ct-sel"><b>Lebih kuat</b><small>(keamanan pasien)</small></div>
     </div>
    </div>
   </section>
   <section className="calc-cta">
    <img src={A+'calc-cta.png'}/>
    <div className="cta-text">
     <h2>Pilih Produk yang Tepat untuk Operasional Anda</h2>
     <p>Dapatkan rekomendasi produk terbaik dari tim ahli PROTEK dan konsultasi kebutuhan laundry rumah sakit Anda secara gratis.</p>
    </div>
    <button className="cta-btn" type="button">Hubungi Kami →</button>
   </section>
  </div>
 </div>;
}
