import { useState, useMemo, useEffect } from 'react';
import './kalkulator.css';
import Header from './header.jsx';

const A='/assets/';
const icon={hospital:A+'icon-hospital.svg',scale:A+'icon-scale.svg',user:A+'icon-user.svg',washing:A+'icon-washing-machine.svg',calendar:A+'icon-calendar.svg',flask:A+'icon-flask.svg'};

// Toast Notification Component
function Toast({message,type,onClose}){
  useEffect(()=>{
    const timer=setTimeout(()=>onClose(),3000);
    return()=>clearTimeout(timer);
  },[onClose]);
  
  return <div className={`toast toast-${type}`}>
    <div className="toast-icon">
      {type==='success'&&<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {type==='error'&&<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {type==='warning'&&<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <div className="toast-content">
      <div className="toast-message">{message}</div>
    </div>
    <button className="toast-close" onClick={onClose}>×</button>
  </div>;
}

// Confirm Dialog Component
function ConfirmDialog({title,message,onConfirm,onCancel}){
  return <div className="confirm-overlay">
    <div className="confirm-dialog">
      <div className="confirm-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="btn-secondary" onClick={onCancel}>Batal</button>
        <button className="btn-danger" onClick={onConfirm}>Ya, Hapus</button>
      </div>
    </div>
  </div>;
}

// Data produk PROTEK sesuai spesifikasi
const protekProducts=[
  {id:'avenger-l',nama:'Avenger L',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:5},
  {id:'launtex-l',nama:'Launtex L',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:5},
  {id:'protek-oxygen',nama:'Protek Oxygen Active',hargaPerGalon:1283028,volumeKemasan:25,dosisNonInfeksius:2,dosisInfeksius:6},
  {id:'protek-fabric',nama:'Protek Fabric Soft',hargaPerGalon:1305234,volumeKemasan:25,dosisNonInfeksius:6,dosisInfeksius:6},
  {id:'sentry-l',nama:'Sentry L',hargaPerGalon:1238293,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:2},
  {id:'action',nama:'Action',hargaPerGalon:1579786,volumeKemasan:25,dosisNonInfeksius:1,dosisInfeksius:2}
];

// Default chemicals pembanding
const defaultPembanding=[
  {id:1,nama:'Detergent A',kategori:'Detergent',hargaPerKemasan:1700000,volumeKemasan:25,dosisNonInfeksius:1.2,dosisInfeksius:6},
  {id:2,nama:'Detergent B',kategori:'Detergent',hargaPerKemasan:1700000,volumeKemasan:25,dosisNonInfeksius:1.2,dosisInfeksius:6},
  {id:3,nama:'Bleach A',kategori:'Bleach',hargaPerKemasan:1670000,volumeKemasan:25,dosisNonInfeksius:2.5,dosisInfeksius:7.5},
  {id:4,nama:'Softener A',kategori:'Softener',hargaPerKemasan:1700000,volumeKemasan:25,dosisNonInfeksius:7,dosisInfeksius:7},
  {id:5,nama:'Sanitizer A',kategori:'Sanitizer',hargaPerKemasan:1610000,volumeKemasan:25,dosisNonInfeksius:1.2,dosisInfeksius:2.5},
  {id:6,nama:'Disinfectant A',kategori:'Sanitizer',hargaPerKemasan:2050000,volumeKemasan:25,dosisNonInfeksius:1.2,dosisInfeksius:2.5}
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
 const [jenis,setJenis]=useState(0); // 0=Infeksius, 1=Non Infeksius
 const [beratLinenHarian,setBeratLinenHarian]=useState(500);
 const [hariOperasional,setHariOperasional]=useState(30);
 const [kapasitasMesin,setKapasitasMesin]=useState(35);
 const [namaRS,setNamaRS]=useState('Rumah Sakit Hermina');
 
 // State untuk dosis produk Protek (editable)
 const [dosisProtek,setDosisProtek]=useState(protekProducts.map(p=>{
   return jenis===1?p.dosisNonInfeksius:p.dosisInfeksius;
 }));
 
 // State untuk produk pembanding (user bisa CRUD)
 const [produkPembanding,setProdukPembanding]=useState(()=>{
   const saved=localStorage.getItem('produkPembanding');
   return saved?JSON.parse(saved):defaultPembanding;
 });
 
  // State untuk modal
  const [showModal,setShowModal]=useState(false);
  const [modalMode,setModalMode]=useState('add'); // 'add' or 'edit'
  const [editingId,setEditingId]=useState(null);
  const [formData,setFormData]=useState({
    nama:'',
    kategori:'Detergent',
    hargaPerKemasan:0,
    volumeKemasan:25,
    dosisNonInfeksius:0,
    dosisInfeksius:0
  });
  
  // State untuk toast dan confirm
  const [toast,setToast]=useState(null);
  const [confirm,setConfirm]=useState(null);
  
  const showToast=(message,type='success')=>{
    setToast({message,type});
  };
  
  const showConfirm=(title,message,onConfirm)=>{
    setConfirm({title,message,onConfirm});
  };
 
 // Save to localStorage whenever produkPembanding changes
 useEffect(()=>{
   localStorage.setItem('produkPembanding',JSON.stringify(produkPembanding));
 },[produkPembanding]);
 
 // Update dosis saat jenis linen berubah
 const updateJenis=(newJenis)=>{
   setJenis(newJenis);
   setDosisProtek(protekProducts.map(p=>{
     return newJenis===1?p.dosisNonInfeksius:p.dosisInfeksius;
   }));
 };
 
 // Modal handlers
 const openAddModal=()=>{
   setModalMode('add');
   setFormData({
     nama:'',
     kategori:'Detergent',
     hargaPerKemasan:0,
     volumeKemasan:25,
     dosisNonInfeksius:0,
     dosisInfeksius:0
   });
   setShowModal(true);
 };
 
 const openEditModal=(produk)=>{
   setModalMode('edit');
   setEditingId(produk.id);
   setFormData({
     nama:produk.nama,
     kategori:produk.kategori,
     hargaPerKemasan:produk.hargaPerKemasan,
     volumeKemasan:produk.volumeKemasan,
     dosisNonInfeksius:produk.dosisNonInfeksius,
     dosisInfeksius:produk.dosisInfeksius
   });
   setShowModal(true);
 };
 
 const closeModal=()=>{
   setShowModal(false);
   setEditingId(null);
 };
 
  const handleSave=()=>{
    if(!formData.nama.trim()){
      showToast('Nama produk harus diisi!','error');
      return;
    }
    
    if(modalMode==='add'){
      const newId=Math.max(...produkPembanding.map(p=>p.id),0)+1;
      setProdukPembanding([...produkPembanding,{...formData,id:newId}]);
      showToast('Produk berhasil ditambahkan!','success');
    }else{
      setProdukPembanding(produkPembanding.map(p=>p.id===editingId?{...formData,id:editingId}:p));
      showToast('Produk berhasil diupdate!','success');
    }
    closeModal();
  };
  
  const handleDelete=(id)=>{
    if(produkPembanding.length<=1){
      showToast('Minimal harus ada 1 produk pembanding!','warning');
      return;
    }
    
    const produk=produkPembanding.find(p=>p.id===id);
    showConfirm(
      'Hapus Produk',
      `Yakin ingin menghapus "${produk.nama}" dari daftar?`,
      ()=>{
        setProdukPembanding(produkPembanding.filter(p=>p.id!==id));
        showToast('Produk berhasil dihapus!','success');
        setConfirm(null);
      }
    );
  };
 
 // Perhitungan untuk satu set produk (Protek atau Pembanding)
 const hitungBiaya=(products,isProtek=false)=>{
   const totalLinenBulanan=beratLinenHarian*hariOperasional;
   
   let totalBiaya=0;
   const details=products.map((p,i)=>{
     let hargaPerLiter,dosisPerKg;
     
     if(isProtek){
       hargaPerLiter=p.hargaPerGalon/p.volumeKemasan;
       dosisPerKg=dosisProtek[i];
     }else{
       hargaPerLiter=p.hargaPerKemasan/p.volumeKemasan;
       dosisPerKg=jenis===1?p.dosisNonInfeksius:p.dosisInfeksius;
     }
     
     const costPerKg=(dosisPerKg/1000)*hargaPerLiter;
     const totalBiayaProduk=costPerKg*totalLinenBulanan;
     
     totalBiaya+=totalBiayaProduk;
     
     return {
       nama:p.nama,
       costPerKg,
       totalBiayaProduk,
       dosis:dosisPerKg
     };
   });
   
   return {
     totalBiaya,
     biayaHarian:totalBiaya/hariOperasional,
     biayaMingguan:(totalBiaya/hariOperasional)*7,
     biayaTahunan:totalBiaya*12,
     details,
     avgCostPerKg:totalBiaya/totalLinenBulanan,
     avgDosis:details.reduce((sum,d)=>sum+d.dosis,0)/details.length
   };
 };
 
 // Hitung biaya Protek dan Pembanding
 const biayaProtek=useMemo(()=>hitungBiaya(protekProducts,true),[dosisProtek,jenis,beratLinenHarian,hariOperasional,kapasitasMesin]);
 const biayaPembanding=useMemo(()=>hitungBiaya(produkPembanding,false),[produkPembanding,jenis,beratLinenHarian,hariOperasional,kapasitasMesin]);
 
 // Perhitungan perbandingan
 const selisihRp=biayaPembanding.totalBiaya-biayaProtek.totalBiaya;
 const persenHemat=(selisihRp/biayaPembanding.totalBiaya)*100;
 
 // Radar chart scores berdasarkan perhitungan riil
 const scores=[
   clamp(1-(biayaProtek.avgDosis-2)/3), // Efektivitas (semakin rendah dosis semakin efektif)
   clamp(0.8), // Kualitas (fixed untuk Protek)
   clamp(1-(biayaProtek.avgDosis-1.5)/4), // Efisiensi Dosis
   clamp(1-(biayaProtek.avgCostPerKg-500)/1000), // Biaya per Kg
   jenis===0?0.9:0.62 // PPI based on jenis (Infeksius tinggi, Non Infeksius rendah)
 ];
  const scoresKomp=[
    clamp(1-(biayaPembanding.avgDosis-2)/3), // Efektivitas (semakin rendah dosis semakin efektif)
    clamp(0.68), // Kualitas (fixed untuk kompetitor, lebih rendah dari Protek)
    clamp(1-(biayaPembanding.avgDosis-2)/4), // Efisiensi Dosis
    clamp(1-(biayaPembanding.avgCostPerKg-500)/1000), // Biaya per Kg (dinamis dari user input)
    0.4 // PPI (fixed rendah untuk kompetitor)
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
      title:isProtek?'PROTEK':'Produk Lain',
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
       <Field icon={icon.user} label="Jenis Linen"><div className="cf-tabs">{['Infeksius','Non Infeksius'].map((t,i)=><button key={t} type="button" className={'cf-tab'+(i===jenis?' on':'')} onClick={()=>updateJenis(i)}>{t}</button>)}</div></Field>
       <Field icon={icon.washing} label="Kapasitas Mesin"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={kapasitasMesin||''} onChange={e=>handleNumberInput(e,setKapasitasMesin)}/><span className="cf-unit">kg/load</span></div></Field>
       <Field icon={icon.calendar} label="Hari Operasional"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={hariOperasional||''} onChange={e=>handleNumberInput(e,setHariOperasional)}/><span className="cf-unit">hari/bulan</span></div></Field>
      </div>
    </div>
    <div className="cf-card side pembanding">
      <div className="cf-badge pembanding">Dosis Produk Pembanding - Input Dosis Produk Lain</div>
      <div className="cf-fields">
       {produkPembanding.map((p)=><div className="cf-prod" key={p.id}>
         <Flask/>
         <div className="cf-prow">
           <span>{p.nama}</span>
           <div className="cf-dose-wrap">
             <span className="cf-unit-inline">{jenis===1?p.dosisNonInfeksius:p.dosisInfeksius} ml/kg</span>
           </div>
         </div>
         <div className="cf-actions">
           <button className="cf-icon-btn edit" onClick={()=>openEditModal(p)} title="Edit">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
           <button className="cf-icon-btn delete" onClick={()=>handleDelete(p.id)} title="Hapus">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </button>
         </div>
       </div>)}
       <button className="cf-add-btn" onClick={openAddModal}>
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
         Tambah Chemical
       </button>
      </div>
     </div>
     <div className="cf-card side protek">
      <div className="cf-badge protek">Dosis Produk PROTEK - Input Dosis Produk</div>
      <div className="cf-fields">
       {protekProducts.map((p,i)=><div className="cf-prod" key={p.id}><Flask/><div className="cf-prow"><span>{p.nama}</span><div className="cf-dose-wrap"><input className="cf-dose" type="number" step="0.1" min="0" value={dosisProtek[i]||''} onChange={e=>setDosisProtek(dosisProtek.map((v,j)=>j===i?num(e.target.value):v))}/><span className="cf-unit-inline">ml/kg</span></div></div></div>)}
      </div>
     </div>
   </section>
   <div className="calc-forms-action">
    <button className="cf-submit-full" type="button" onClick={toResult}>Hitung Perbandingan →</button>
   </div>
   
   {showModal&&<div className="modal-overlay" onClick={closeModal}>
     <div className="modal-content" onClick={e=>e.stopPropagation()}>
       <div className="modal-header">
         <h3>{modalMode==='add'?'Tambah Produk Pembanding':'Edit Produk Pembanding'}</h3>
         <button className="modal-close" onClick={closeModal}>×</button>
       </div>
       <div className="modal-body">
         <div className="modal-field">
           <label>Nama Produk *</label>
           <input type="text" value={formData.nama} onChange={e=>setFormData({...formData,nama:e.target.value})} placeholder="Contoh: Detergent X"/>
         </div>
         <div className="modal-field">
           <label>Kategori</label>
           <select value={formData.kategori} onChange={e=>setFormData({...formData,kategori:e.target.value})}>
             <option value="Detergent">Detergent</option>
             <option value="Bleach">Bleach</option>
             <option value="Softener">Softener</option>
             <option value="Sanitizer">Sanitizer</option>
           </select>
         </div>
         <div className="modal-row">
           <div className="modal-field">
             <label>Harga per Kemasan (Rp) *</label>
             <input type="number" value={formData.hargaPerKemasan||''} onChange={e=>setFormData({...formData,hargaPerKemasan:num(e.target.value)})} placeholder="1500000"/>
           </div>
           <div className="modal-field">
             <label>Volume Kemasan (Liter)</label>
             <input type="number" value={formData.volumeKemasan||''} onChange={e=>setFormData({...formData,volumeKemasan:num(e.target.value)})} placeholder="25"/>
           </div>
         </div>
         <div className="modal-row">
           <div className="modal-field">
             <label>Dosis Non-Infeksius (ml/kg) *</label>
             <input type="number" step="0.1" value={formData.dosisNonInfeksius||''} onChange={e=>setFormData({...formData,dosisNonInfeksius:num(e.target.value)})} placeholder="1.2"/>
           </div>
           <div className="modal-field">
             <label>Dosis Infeksius (ml/kg) *</label>
             <input type="number" step="0.1" value={formData.dosisInfeksius||''} onChange={e=>setFormData({...formData,dosisInfeksius:num(e.target.value)})} placeholder="6"/>
           </div>
         </div>
       </div>
       <div className="modal-footer">
         <button className="modal-btn secondary" onClick={closeModal}>Batal</button>
         <button className="modal-btn primary" onClick={handleSave}>Simpan</button>
       </div>
     </div>
   </div>}
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
      <div className="ct-c">{biayaPembanding.avgDosis.toFixed(1)} ml/kg</div>
      <div className="ct-c">{fmt(biayaPembanding.avgCostPerKg)}</div>
      <div className="ct-c">{Math.round(kapasitasMesin*0.8)} kg</div>
      <div className="ct-c">Cukup bersih, warna lebih cepat pudar</div>
      <div className="ct-c">Standar</div>
      <div className="ct-c">Terbatas</div>
     </div>
     <div className="ct-col">
       <div className="ct-h">Selisih</div>
       <div className="ct-c ct-sel">
         <b>{Math.abs(biayaPembanding.avgDosis-biayaProtek.avgDosis).toFixed(1)} ml/kg</b>
         <small>({biayaProtek.avgDosis < biayaPembanding.avgDosis ? 'lebih rendah' : 'lebih tinggi'})</small>
       </div>
       <div className="ct-c ct-sel">
         <b>{fmt(Math.abs(biayaPembanding.avgCostPerKg-biayaProtek.avgCostPerKg))}</b>
         <small>({biayaProtek.avgCostPerKg < biayaPembanding.avgCostPerKg ? 'lebih hemat' : 'lebih mahal'})</small>
       </div>
       <div className="ct-c ct-sel">
         <b>+{Math.round(kapasitasMesin*0.2)} kg</b>
         <small>(lebih banyak)</small>
       </div>
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
  {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
  {confirm&&<ConfirmDialog title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)}/>}
 </div>;
}
