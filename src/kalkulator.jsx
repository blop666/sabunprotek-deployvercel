import { useState } from 'react';
import './kalkulator.css';
import Header from './header.jsx';

const A='/assets/';
const icon={hospital:A+'icon-hospital.svg',scale:A+'icon-scale.svg',user:A+'icon-user.svg',washing:A+'icon-washing-machine.svg',calendar:A+'icon-calendar.svg',flask:A+'icon-flask.svg'};
const products=[['Avenger L','2.0'],['Launtex L','3.0'],['Protex Oxygen Active','2,5'],['Protex Fabric Soft','1,5'],['Sentry L','1,5'],['Action','1,5']];
const rows=[
 ['Dosis Pemakaian (ml/kg/linen)','1,5 - 3,0','2,5 -4,0',['-0,5 – -1,0','(lebih rendah)']],
 ['Biaya per kg Linen (Rp)','450 - 700','700 - 1.000',['-250 – -300','(lebih hemat)']],
 ['Jumlah Pencucian per Drum','20 -  25 kg','15 - 20 kg',['+5 – 10 kg','(lebih banyak)']],
 ['Hasil Pencucian','Bersih optimal, warna tetap terjaga','Cukup bersih, warna lebih cepat pudar',['Lebih baik','(hasil & kualitas)']],
 ['Efisiensi Operasional','Lebih hemat, produktivitas meningkat','Standar',['Lebih efisien','(waktu & biaya)']],
 ['Dukungan PPI','Ya (teruji dan sesuai standar kesehatan)','Terbatas',['Lebih kuat','(keamanan pasien)']],
];
const Flask=()=><span className="cf-flask"><img src={icon.flask}/></span>;
function Field({icon:ic,label,children}){return <div className="cf-row"><img src={ic}/><div className="cf-field"><label>{label}</label>{children}</div></div>}

// radar geometry (viewBox 776x707.569, center & outer vertices from Figma SVG)
const C=[386.015,379.069];
const AX=[[389.157,3.069],[773.015,276.069],[617.644,705.069],[162.956,705.069],[3.015,278.363]]; // top(Efektivitas) right(Kualitas) br(Efisiensi) bl(Biaya) left(PPI)
const clamp=v=>Math.max(.15,Math.min(1,v));
const num=v=>parseFloat(String(v).replace(',','.'))||0;

export default function Kalkulator(){
 const [jenis,setJenis]=useState(0);
 const [dose,setDose]=useState(products.map(p=>p[1]));
 const vals=dose.map(num);
 const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const scores=[clamp(1-Math.abs(avg-2.2)/1.8),clamp(.55+vals[3]/4),clamp((3.5-avg)/2.5),clamp((3.5-avg)/2.5),[.9,.62,.75][jenis]];
  const other=[.62,.68,.55,.5,.4];
  const mk=(s,f=1)=>AX.map(([x,y],i)=>[C[0]+(x-C[0])*clamp(s[i])*f,C[1]+(y-C[1])*clamp(s[i])*f]);
  const pts=mk(scores);
  const ptsO=mk(other);
  const poly='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
  const polyO='M'+ptsO.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
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
      <Field icon={icon.hospital} label="Nama Rumah Sakit"><input className="cf-input" defaultValue="Rumah Sakit Hermina"/></Field>
      <Field icon={icon.scale} label="Berat Linen Kotor"><div className="cf-inputs"><input className="cf-input" defaultValue="500"/><span className="cf-unit">kg/hari</span></div></Field>
      <Field icon={icon.user} label="Jenis Linen"><div className="cf-tabs">{['Infeksius','Non Infeksius','Keduanya'].map((t,i)=><button key={t} type="button" className={'cf-tab'+(i===jenis?' on':'')} onClick={()=>setJenis(i)}>{t}</button>)}</div></Field>
      <Field icon={icon.washing} label="Jumlah Mesin"><input className="cf-input" defaultValue="500"/></Field>
      <Field icon={icon.calendar} label="Hari Operasional"><div className="cf-inputs"><input className="cf-input" defaultValue="30"/><span className="cf-unit">hari/bulan</span></div></Field>
     </div>
     <button className="cf-submit" type="button" onClick={toResult}>Hitung Perbandingan →</button>
    </div>
    <div className="cf-card side">
     <div className="cf-badge">Dosis Produk PROTEK- Input Dosis Produk</div>
     <div className="cf-fields">
      {products.map(([n],i)=><div className="cf-prod" key={n}><Flask/><div className="cf-prow"><span>{n}</span><input className="cf-dose" value={dose[i]} onChange={e=>setDose(dose.map((v,j)=>j===i?e.target.value:v))}/></div></div>)}
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
       {pts.map(([x,y],i)=><circle key={'p'+i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" fill="#125BBD" stroke="white" strokeWidth="3"/>)}
       {ptsO.map(([x,y],i)=><circle key={'o'+i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="8" fill="#F07C1D" stroke="white" strokeWidth="3"/>)}
     </svg>
     <span className="rlabel" style={{left:0,top:314}}>Dukungan PPI</span>
     <span className="rlabel" style={{left:434,top:0}}>Efektivitas Pembersihan</span>
     <span className="rlabel" style={{left:208,top:757.5}}>Biaya per Kg Linen</span>
     <span className="rlabel" style={{left:721,top:757.5}}>Efisiensi Dosis</span>
     <span className="rlabel" style={{left:1003,top:309}}>Kualitas<br/>Hasil Linen</span>
    </div></div>
   </section>
   <section className="calc-table">
    <div className="ct-title"><h2>Hasil Perbandingan Detail</h2></div>
    <div className="ct-grid">
     <div className="ct-col">
      <div className="ct-h">Aspek</div>
      {rows.map(r=><div className="ct-c" key={r[0]}><Flask/>{r[0]}</div>)}
     </div>
     <div className="ct-col">
      <div className="ct-h">PROTEK Laundry Solution</div>
      {rows.map(r=><div className="ct-c" key={r[0]}>{r[1]}</div>)}
     </div>
     <div className="ct-col">
      <div className="ct-h">Produk Laundry Lain</div>
      {rows.map(r=><div className="ct-c" key={r[0]}>{r[2]}</div>)}
     </div>
     <div className="ct-col">
      <div className="ct-h">Selisih</div>
      {rows.map(r=><div className="ct-c ct-sel" key={r[0]}><b>{r[3][0]}</b><small>{r[3][1]}</small></div>)}
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
