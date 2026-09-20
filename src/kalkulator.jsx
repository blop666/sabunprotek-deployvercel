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
 const [beratLinenHarian,setBeratLinenHarian]=useState(500);
 const [beratLinenInfeksius,setBeratLinenInfeksius]=useState(350); // kg/hari
 const [beratLinenNonInfeksius,setBeratLinenNonInfeksius]=useState(150); // kg/hari
 const [hariOperasional,setHariOperasional]=useState(30);
 const [kapasitasMesin,setKapasitasMesin]=useState(35);
 const [namaRS,setNamaRS]=useState('Rumah Sakit Hermina');
 
 // Calculate ratio from berat linen
 const rasioInfeksius=beratLinenHarian>0?(beratLinenInfeksius/beratLinenHarian)*100:70;
 const rasioNonInfeksius=beratLinenHarian>0?(beratLinenNonInfeksius/beratLinenHarian)*100:30;
 
 // State untuk dosis produk Protek (editable)
 const [dosisProtek,setDosisProtek]=useState(protekProducts.map(p=>{
   return (p.dosisInfeksius * rasioInfeksius / 100) + (p.dosisNonInfeksius * rasioNonInfeksius / 100);
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
    hargaPerKemasan:0,
    volumeKemasan:25,
    dosisNonInfeksius:0,
    dosisInfeksius:0,
    rejectRate:0
  });
  
  // State untuk reject rate popup
  const [showRejectModal,setShowRejectModal]=useState(false);
  const [rejectModalMode,setRejectModalMode]=useState('standalone'); // 'standalone' or 'nested'
  const [rejectFormData,setRejectFormData]=useState({
    beratLinenReject:0,
    rejectRate:0,
    saveToProduct:false
  });
  const [showRejectInfo,setShowRejectInfo]=useState(false);
  
  // State untuk toast dan confirm
  const [toast,setToast]=useState(null);
  const [confirm,setConfirm]=useState(null);
  const [hasCompared,setHasCompared]=useState(false);
  
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
  
  // Update dosis saat ratio berubah
  useEffect(()=>{
    setDosisProtek(protekProducts.map(p=>{
      return (p.dosisInfeksius * rasioInfeksius / 100) + (p.dosisNonInfeksius * rasioNonInfeksius / 100);
    }));
  },[rasioInfeksius,rasioNonInfeksius]);
  
  // Handler untuk input berat linen infeksius (auto-calculate non-infeksius)
  const handleBeratInfeksiusChange=(value)=>{
    const infeksius=Math.max(0,Math.min(value,beratLinenHarian));
    setBeratLinenInfeksius(infeksius);
    setBeratLinenNonInfeksius(beratLinenHarian-infeksius);
  };
  
  // Handler untuk input berat linen non-infeksius (auto-calculate infeksius)
  const handleBeratNonInfeksiusChange=(value)=>{
    const nonInfeksius=Math.max(0,Math.min(value,beratLinenHarian));
    setBeratLinenNonInfeksius(nonInfeksius);
    setBeratLinenInfeksius(beratLinenHarian-nonInfeksius);
  };

  const handleRatioPercentChange=(value,isInfeksius)=>{
    const percent=Math.max(0,Math.min(100,value));
    const infeksiusPercent=isInfeksius?percent:100-percent;
    const infeksius=Math.round(beratLinenHarian*infeksiusPercent/100);
    setBeratLinenInfeksius(infeksius);
    setBeratLinenNonInfeksius(beratLinenHarian-infeksius);
  };
  
  // Handler untuk total berat linen (adjust proporsi)
  const handleBeratLinenHarianChange=(value)=>{
    const newTotal=Math.max(0,value);
    const oldTotal=beratLinenHarian;
    if(oldTotal>0){
      const ratio=newTotal/oldTotal;
      setBeratLinenInfeksius(Math.round(beratLinenInfeksius*ratio));
      setBeratLinenNonInfeksius(Math.round(beratLinenNonInfeksius*ratio));
    }
    setBeratLinenHarian(newTotal);
  };
  
  // Preset ratio templates
  const setRatioPreset=(percentInfeksius,percentNonInfeksius)=>{
    const infeksius=Math.round(beratLinenHarian*percentInfeksius/100);
    const nonInfeksius=beratLinenHarian-infeksius;
    setBeratLinenInfeksius(infeksius);
    setBeratLinenNonInfeksius(nonInfeksius);
  };
  
  // Reject Rate Modal handlers
  const openRejectModalStandalone=()=>{
    setRejectModalMode('standalone');
    setRejectFormData({
      beratLinenReject:0,
      rejectRate:0,
      saveToProduct:false
    });
    setShowRejectModal(true);
  };
  
  const openRejectModalNested=()=>{
    setRejectModalMode('nested');
    setRejectFormData({
      beratLinenReject:0,
      rejectRate:0,
      saveToProduct:true
    });
    setShowRejectModal(true);
  };
  
  const closeRejectModal=()=>{
    setShowRejectModal(false);
  };
  
  const handleRejectCalculate=()=>{
    const rejectRate=(rejectFormData.beratLinenReject/beratLinenHarian)*100;
    setRejectFormData({...rejectFormData,rejectRate});
  };
  
  const handleRejectSave=()=>{
    if(rejectModalMode==='nested'&&rejectFormData.saveToProduct){
      setFormData({...formData,rejectRate:rejectFormData.rejectRate});
    }
    closeRejectModal();
    showToast('Reject rate berhasil dihitung!','success');
  };
  
  // Modal handlers
  const openAddModal=()=>{
    setModalMode('add');
    setFormData({
      nama:'',
      hargaPerKemasan:0,
      volumeKemasan:25,
      dosisNonInfeksius:0,
      dosisInfeksius:0,
      rejectRate:0
    });
    setShowModal(true);
  };
  
  const openEditModal=(produk)=>{
    setModalMode('edit');
    setEditingId(produk.id);
    setFormData({
      nama:produk.nama,
      hargaPerKemasan:produk.hargaPerKemasan,
      volumeKemasan:produk.volumeKemasan,
      dosisNonInfeksius:produk.dosisNonInfeksius,
      dosisInfeksius:produk.dosisInfeksius,
      rejectRate:produk.rejectRate||0
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
    let totalBiayaInfeksius=0;
    let totalBiayaNonInfeksius=0;
    let totalRejectRate=0;
    
    const details=products.map((p,i)=>{
      let hargaPerLiter,dosisInfeksius,dosisNonInfeksius,rejectRate;
      
      if(isProtek){
        hargaPerLiter=p.hargaPerGalon/p.volumeKemasan;
        dosisInfeksius=p.dosisInfeksius;
        dosisNonInfeksius=p.dosisNonInfeksius;
        rejectRate=0; // PROTEK assume 0% reject
      }else{
        hargaPerLiter=p.hargaPerKemasan/p.volumeKemasan;
        dosisInfeksius=p.dosisInfeksius;
        dosisNonInfeksius=p.dosisNonInfeksius;
        rejectRate=p.rejectRate||0;
      }
      
      // Weighted average dosis berdasarkan ratio
      const dosisWeighted=(dosisInfeksius*rasioInfeksius/100)+(dosisNonInfeksius*rasioNonInfeksius/100);
      
      // Adjust dengan reject rate (chemical usage increase)
      const dosisAdjusted=dosisWeighted*(1+rejectRate/100);
      
      // Cost per kg untuk masing-masing jenis
      const costPerKgInfeksius=(dosisInfeksius/1000)*hargaPerLiter*(1+rejectRate/100);
      const costPerKgNonInfeksius=(dosisNonInfeksius/1000)*hargaPerLiter*(1+rejectRate/100);
      
      // Weighted average cost
      const costPerKg=(costPerKgInfeksius*rasioInfeksius/100)+(costPerKgNonInfeksius*rasioNonInfeksius/100);
      
      const totalBiayaProduk=costPerKg*totalLinenBulanan;
      
      totalBiaya+=totalBiayaProduk;
      totalBiayaInfeksius+=costPerKgInfeksius;
      totalBiayaNonInfeksius+=costPerKgNonInfeksius;
      totalRejectRate+=rejectRate;
      
      return {
        nama:p.nama,
        costPerKg,
        costPerKgInfeksius,
        costPerKgNonInfeksius,
        totalBiayaProduk,
        dosis:dosisWeighted,
        dosisAdjusted,
        rejectRate
      };
    });
    
    const avgCostPerKgInfeksius=totalBiayaInfeksius/details.length;
    const avgCostPerKgNonInfeksius=totalBiayaNonInfeksius/details.length;
    const avgCostPerKg=totalBiaya/totalLinenBulanan;
    const avgRejectRate=totalRejectRate/details.length;
    
    const biayaHarian=avgCostPerKg*beratLinenHarian;
    const biayaBulanan=biayaHarian*hariOperasional;
    const biayaTahunan=biayaBulanan*12;
    
    return {
      totalBiaya,
      biayaHarian,
      biayaBulanan,
      biayaTahunan,
      details,
      avgCostPerKg,
      avgCostPerKgInfeksius,
      avgCostPerKgNonInfeksius,
      avgDosis:details.reduce((sum,d)=>sum+d.dosis,0)/details.length,
      avgRejectRate
    };
  };
 
 // Hitung biaya Protek dan Pembanding
 const biayaProtek=useMemo(()=>hitungBiaya(protekProducts,true),[dosisProtek,rasioInfeksius,rasioNonInfeksius,beratLinenHarian,hariOperasional]);
 const biayaPembanding=useMemo(()=>hitungBiaya(produkPembanding,false),[produkPembanding,rasioInfeksius,rasioNonInfeksius,beratLinenHarian,hariOperasional]);
 
 // Perhitungan perbandingan
 const selisihRp=biayaPembanding.totalBiaya-biayaProtek.totalBiaya;
 const persenHemat=(selisihRp/biayaPembanding.totalBiaya)*100;
 
  // Konsumsi chemical dipakai sebagai metrik yang bisa dihitung dari data input.
  // Karena linen harian sama untuk kedua sisi, perbandingan konsumsi mengikuti dosis rata-rata.
  const konsumsiScore=(dosisA,dosisB)=>{
    const total=dosisA+dosisB;
    return total>0?clamp(dosisB/total):.5;
  };
  const biayaInfeksiusScore=(costA,costB)=>{
    const total=costA+costB;
    return total>0?clamp(costB/total):.5;
  };

  // Radar chart scores berdasarkan data yang tersedia
  const scores=[
    clamp(1-(biayaProtek.avgRejectRate/10)), // [0] Efektivitas Pembersihan: dari Reject Rate (0%=100%, 10%=0%)
    konsumsiScore(biayaProtek.avgDosis,biayaPembanding.avgDosis), // [1] Konsumsi Chemical: dosis lebih rendah mendapat skor relatif lebih tinggi
    clamp(1-(biayaProtek.avgDosis-1.5)/4), // [2] Efisiensi Dosis: semakin kecil dosis = lebih efisien
   clamp(1-(biayaProtek.avgCostPerKg-500)/1500), // [3] Efisiensi Biaya: semakin murah = lebih efisien
    biayaInfeksiusScore(biayaProtek.avgCostPerKgInfeksius,biayaPembanding.avgCostPerKgInfeksius) // [4] Biaya Linen Infeksius
 ];
  const scoresKomp=[
    clamp(1-(biayaPembanding.avgRejectRate/10)), // [0] Efektivitas Pembersihan
    konsumsiScore(biayaPembanding.avgDosis,biayaProtek.avgDosis), // [1] Konsumsi Chemical: skor relatif terhadap PROTEK
    clamp(1-(biayaPembanding.avgDosis-1.5)/4), // [2] Efisiensi Dosis
    clamp(1-(biayaPembanding.avgCostPerKg-500)/1500), // [3] Efisiensi Biaya
    biayaInfeksiusScore(biayaPembanding.avgCostPerKgInfeksius,biayaProtek.avgCostPerKgInfeksius) // [4] Biaya Linen Infeksius
  ];
 
  const mk=(s,f=1)=>AX.map(([x,y],i)=>[C[0]+(x-C[0])*clamp(s[i])*f,C[1]+(y-C[1])*clamp(s[i])*f]);
  const pts=mk(scores);
  const ptsO=mk(scoresKomp);
  const poly='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
  const polyO='M'+ptsO.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';
  
  // Tooltip state
  const [tooltip,setTooltip]=useState({show:false,x:0,y:0,title:'',value:'',label:''});
  const radarLabels=['Efektivitas Pembersihan','Konsumsi Chemical','Efisiensi Dosis','Efisiensi Biaya','Biaya Linen Infeksius'];
  
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
  
  const toResult=()=>{
    setHasCompared(true);
    window.setTimeout(()=>document.querySelector('.comparison-summary')?.scrollIntoView({behavior:'smooth',block:'start'}),0);
  };
 return <div className="kalkulator">
  <Header/>
  <div className="calc-page">
   <section className="calc-hero">
    <div className="ch-shade"/>
    <h1>Bandingkan Produk Laundry</h1>
    <p>Jangan hanya membandingkan harga. Bandingkan total efisiensi. dosis, hasil, dan nilai yang Anda dapatkan.</p>
   </section>
       <div className="top-reject-action">
        <button className="reject-cta-card" type="button" onClick={openRejectModalStandalone}>
         <span className="reject-cta-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="2.5" width="14" height="19" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 6h8v3H8zM8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
         </span>
         <span className="reject-cta-copy">
          <strong>Hitung Reject Rate</strong>
          <span>Ukur efektivitas cucian dan lihat dampaknya terhadap biaya laundry.</span>
          <span className="reject-cta-link">Mulai perhitungan <span aria-hidden="true">→</span></span>
         </span>
        </button>
       </div>
      <section className="calc-forms">
      <div className="cf-card">
       <div className="cf-badge">Data Operasional - Input Data Laundry</div>
         <div className="cf-fields">
          <Field icon={icon.hospital} label="Nama Rumah Sakit"><input className="cf-input" value={namaRS} onChange={e=>setNamaRS(e.target.value)}/></Field>
          <Field icon={icon.scale} label="Berat Linen Kotor"><div className="cf-inputs"><input className="cf-input" type="number" min="0" value={beratLinenHarian||''} onChange={e=>handleNumberInput(e,handleBeratLinenHarianChange)}/><span className="cf-unit">kg/hari</span></div></Field>
           <div className="cf-row ratio-row">
             <img src={icon.user}/>
             <div className="cf-field">
             <div className="cf-ratio-inputs">
              <div className="cf-ratio-input-group">
                <label>Linen Infeksius</label>
                <div className="cf-inputs">
                  <input className="cf-input" type="number" min="0" max="100" value={rasioInfeksius.toFixed(0)} onChange={e=>handleNumberInput(e,v=>handleRatioPercentChange(v,true))}/>
                  <span className="cf-unit">%</span>
                </div>
                <span className="cf-ratio-percent">{rasioInfeksius.toFixed(0)}%</span>
              </div>
              <div className="cf-ratio-input-group">
                <label>Linen Non-Infeksius</label>
                <div className="cf-inputs">
                  <input className="cf-input" type="number" min="0" max="100" value={rasioNonInfeksius.toFixed(0)} onChange={e=>handleNumberInput(e,v=>handleRatioPercentChange(v,false))}/>
                  <span className="cf-unit">%</span>
                </div>
                <span className="cf-ratio-percent">{rasioNonInfeksius.toFixed(0)}%</span>
              </div>
             </div>
             </div>
           </div>
         </div>
      </div>
      <div className="cf-card side pembanding">
        <div className="cf-badge pembanding">Dosis Produk Pembanding - Input Dosis Produk Lain</div>
        <div className="cf-fields">
         {produkPembanding.map((p)=>{
           const hargaPerMl=(p.hargaPerKemasan/(p.volumeKemasan*1000));
           const dosisWeighted=(p.dosisInfeksius*rasioInfeksius/100)+(p.dosisNonInfeksius*rasioNonInfeksius/100);
           return <div className="cf-prod" key={p.id}>
           <Flask/>
           <div className="cf-prow">
             <div className="cf-prod-info">
               <span className="cf-prod-name">{p.nama}</span>
               <span className="cf-prod-price">{fmt(p.hargaPerKemasan)} / {p.volumeKemasan}L</span>
               <span className="cf-prod-perml">Rp {Math.round(hargaPerMl)}/ml</span>
             </div>
             <div className="cf-dose-wrap">
               <span className="cf-unit-inline">{dosisWeighted.toFixed(1)} ml/kg</span>
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
         </div>
         })}
         <button className="cf-add-btn" onClick={openAddModal}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           Tambah Chemical
         </button>
        </div>
       </div>
     <div className="cf-card side protek">
       <div className="cf-badge protek">Dosis Produk PROTEK - Input Dosis Produk</div>
       <div className="cf-fields">
        {protekProducts.map((p,i)=>{
          const hargaPerMl=(p.hargaPerGalon/(p.volumeKemasan*1000));
          return <div className="cf-prod" key={p.id}>
          <Flask/>
          <div className="cf-prow">
            <div className="cf-prod-info">
              <span className="cf-prod-name">{p.nama}</span>
              <span className="cf-prod-price">{fmt(p.hargaPerGalon)} / {p.volumeKemasan}L</span>
              <span className="cf-prod-perml">Rp {Math.round(hargaPerMl)}/ml</span>
            </div>
             <div className="cf-dose-wrap">
               <input className="cf-dose" type="number" step="0.1" min="0" value={dosisProtek[i]?dosisProtek[i].toFixed(1):''} onChange={e=>setDosisProtek(dosisProtek.map((v,j)=>j===i?num(e.target.value):v))}/>
               <span className="cf-unit-inline">ml/kg</span>
             </div>
          </div>
        </div>
        })}
       </div>
      </div>
   </section>
    <div className="calc-forms-action">
        <button className="cf-reject-btn legacy-reject-position" type="button" onClick={openRejectModalStandalone}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11H7a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2zM15 11h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM9 17H7a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2zM15 17h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      Hitung Reject Rate
    </button>
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
           <input type="text" value={formData.nama} onChange={e=>setFormData({...formData,nama:e.target.value})} placeholder="Contoh: Surf, Rinso, Attack"/>
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
         <div className="modal-field">
           <label>Reject Rate (%) - Opsional</label>
           <div className="modal-reject-input">
             <input type="number" step="0.1" min="0" max="100" value={formData.rejectRate||''} onChange={e=>setFormData({...formData,rejectRate:num(e.target.value)})} placeholder="0"/>
             <button type="button" className="modal-btn-calc" onClick={openRejectModalNested}>Kalkulasi</button>
           </div>
           <small className="modal-hint">Kosongkan jika tidak ada data reject rate</small>
         </div>
       </div>
       <div className="modal-footer">
         <button className="modal-btn secondary" onClick={closeModal}>Batal</button>
         <button className="modal-btn primary" onClick={handleSave}>Simpan</button>
       </div>
     </div>
   </div>}
   
   {showRejectModal&&<div className="modal-overlay" onClick={closeRejectModal} style={{zIndex:10000}}>
     <div className="modal-content modal-reject" onClick={e=>e.stopPropagation()}>
       <div className="modal-header">
         <h3>Kalkulator Reject Rate</h3>
         <button className="modal-close" onClick={closeRejectModal}>×</button>
       </div>
       <div className="modal-body">
         <div className="reject-info-btn">
            <button type="button" className="info-btn" onClick={()=>setShowRejectInfo(true)}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M12 16v-4M12 8h.01" strokeWidth="2" strokeLinecap="round"/></svg>
              Apa itu Reject Rate?
            </button>
            {showRejectInfo&&<div className="reject-info-panel">
              <div className="reject-info-panel-head"><strong>Apa itu Reject Rate?</strong><button type="button" onClick={()=>setShowRejectInfo(false)}>×</button></div>
              <p>Persentase linen yang masih kotor setelah pencucian dan perlu diproses ulang.</p>
              <div className="reject-info-rule"><span>≤ 2%</span><strong>Efektif</strong></div>
              <div className="reject-info-rule warning"><span>&gt; 2%</span><strong>Perlu evaluasi</strong></div>
              <p className="reject-info-example"><b>Contoh:</b> 15 kg reject dari 500 kg linen = 3%.</p>
            </div>}
         </div>
         <div className="modal-field">
           <label>Berat Linen Kotor (otomatis dari Data Operasional)</label>
           <input type="number" value={beratLinenHarian} disabled style={{background:'#f5f5f5',cursor:'not-allowed'}}/>
           <small>kg/hari</small>
         </div>
         <div className="modal-field">
           <label>Berat Linen Reject</label>
           <input type="number" step="0.1" min="0" value={rejectFormData.beratLinenReject||''} onChange={e=>setRejectFormData({...rejectFormData,beratLinenReject:num(e.target.value)})} placeholder="Contoh: 15"/>
           <small>kg/hari (linen yang masih kotor setelah dicuci)</small>
         </div>
         <button type="button" className="modal-btn-calc-full" onClick={handleRejectCalculate}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
           Hitung Reject Rate
         </button>
         {rejectFormData.rejectRate>0&&<div className="reject-result">
           <div className="reject-result-header">
             <span className="reject-rate-value">{rejectFormData.rejectRate.toFixed(1)}%</span>
             <span className={'reject-status '+(rejectFormData.rejectRate<=2?'efektif':'tidak-efektif')}>
                {rejectFormData.rejectRate<=2?'Efektif':'Tidak Efektif'}
             </span>
           </div>
           <div className="reject-impact">
             <p><strong>Dampak Biaya:</strong></p>
             <p>• Biaya chemical naik {rejectFormData.rejectRate.toFixed(1)}%</p>
             <p>• Estimasi tambahan biaya: Rp {Math.round(biayaPembanding.biayaBulanan*(rejectFormData.rejectRate/100)).toLocaleString('id-ID')}/bulan</p>
           </div>
           {rejectModalMode==='nested'&&<div className="modal-field">
             <label className="checkbox-label">
               <input type="checkbox" checked={rejectFormData.saveToProduct} onChange={e=>setRejectFormData({...rejectFormData,saveToProduct:e.target.checked})}/>
               <span>Simpan ke produk yang ditambahkan</span>
             </label>
           </div>}
         </div>}
       </div>
       <div className="modal-footer">
         <button className="modal-btn secondary" onClick={closeRejectModal}>Tutup</button>
         {rejectFormData.rejectRate>0&&<button className="modal-btn primary" onClick={handleRejectSave}>Simpan</button>}
       </div>
     </div>
   </div>}
   
      <div className="old-result-reject-action">
      <button className="cf-reject-btn" type="button" onClick={openRejectModalStandalone}>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11H7a2 2 0 01-2-2V7a2 2 0 012 2h2a2 2 0 012 2v2a2 2 0 01-2 2zM15 11h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM9 17H7a2 2 0 01-2-2v-2a2 2 0 012 2v2a2 2 0 01-2 2zM15 17h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
       Hitung Reject Rate
      </button>
      </div>
      {hasCompared&&<section className="comparison-summary">
      <div className="summary-heading">
        <div>
          <span className="summary-kicker">Rangkuman hasil</span>
          <h2>Perbandingan Singkat</h2>
        </div>
        <p>Ringkasan dari dosis, biaya, volume linen, dan reject rate.</p>
      </div>
      <div className="summary-table-wrap">
        <table className="summary-table">
          <thead><tr><th>Indikator</th><th>PROTEK</th><th>Produk Laundry Lain</th><th>Ringkasan</th></tr></thead>
          <tbody>
            <tr><td>Dosis rata-rata</td><td>{biayaProtek.avgDosis.toFixed(1)} ml/kg</td><td>{biayaPembanding.avgDosis.toFixed(1)} ml/kg</td><td>{biayaProtek.avgDosis<=biayaPembanding.avgDosis?'PROTEK lebih rendah':'Produk lain lebih rendah'}</td></tr>
            <tr><td>Reject rate</td><td>{biayaProtek.avgRejectRate.toFixed(1)}%</td><td>{biayaPembanding.avgRejectRate.toFixed(1)}%</td><td>{biayaProtek.avgRejectRate<=biayaPembanding.avgRejectRate?'PROTEK lebih rendah':'Produk lain lebih rendah'}</td></tr>
            <tr><td>Biaya operasional / bulan</td><td>{fmt(biayaProtek.biayaBulanan)}</td><td>{fmt(biayaPembanding.biayaBulanan)}</td><td>{biayaProtek.biayaBulanan<=biayaPembanding.biayaBulanan?'PROTEK lebih hemat':'Produk lain lebih hemat'}</td></tr>
            <tr><td>Estimasi konsumsi chemical / hari</td><td>{(biayaProtek.avgDosis*beratLinenHarian/1000).toFixed(2)} L</td><td>{(biayaPembanding.avgDosis*beratLinenHarian/1000).toFixed(2)} L</td><td>{biayaProtek.avgDosis<=biayaPembanding.avgDosis?'PROTEK lebih rendah':'Produk lain lebih rendah'}</td></tr>
          </tbody>
        </table>
      </div>
    </section>}
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
       <span className="rlabel" style={{left:0,top:314}}>Biaya Linen<br/>Infeksius</span>
      <span className="rlabel rlabel-top">Efektivitas Pembersihan</span>
      <span className="rlabel" style={{left:208,top:757.5}}>Efisiensi Biaya</span>
      <span className="rlabel" style={{left:721,top:757.5}}>Efisiensi Dosis</span>
      <span className="rlabel" style={{left:1003,top:309}}>Konsumsi<br/>Chemical</span>
      </div></div>
     </section>
     {tooltip.show&&<div className="radar-tooltip show" style={{position:'fixed',left:tooltip.x+'px',top:tooltip.y+'px',transform:'translate(-50%, -100%)'}}><div className="tt-title">{tooltip.title}</div><div className="tt-value">{tooltip.value}</div><div className="tt-label">{tooltip.label}</div></div>}
    <section className="calc-table">
     <div className="ct-title"><h2>Hasil Perbandingan Detail</h2></div>
     <div className="ct-grid">
      <div className="ct-col">
       <div className="ct-h">Aspek</div>
       <div className="ct-c"><Flask/>Dosis Pemakaian (ml/kg/linen)</div>
       <div className="ct-c"><Flask/>Reject Rate (%)</div>
       <div className="ct-c"><Flask/>Biaya per kg Linen Infeksius (Rp)</div>
       <div className="ct-c"><Flask/>Biaya per kg Linen Non-Infeksius (Rp)</div>
       <div className="ct-c"><Flask/>Biaya per Hari (Rp)</div>
       <div className="ct-c"><Flask/>Biaya per Bulan (Rp)</div>
       <div className="ct-c"><Flask/>Biaya per Tahun (Rp)</div>
       <div className="ct-c"><Flask/>Hasil Pencucian</div>
       <div className="ct-c"><Flask/>Efisiensi Operasional</div>
       <div className="ct-c"><Flask/>Dukungan PPI</div>
      </div>
       <div className="ct-col">
        <div className="ct-h">PROTEK Laundry Solution</div>
        <div className="ct-c">{biayaProtek.avgDosis.toFixed(1)} ml/kg</div>
        <div className="ct-c">{biayaProtek.avgRejectRate.toFixed(1)}%</div>
        <div className="ct-c">{fmt(biayaProtek.avgCostPerKgInfeksius)}</div>
        <div className="ct-c">{fmt(biayaProtek.avgCostPerKgNonInfeksius)}</div>
        <div className="ct-c">{fmt(biayaProtek.biayaHarian)}</div>
        <div className="ct-c">{fmt(biayaProtek.biayaBulanan)}</div>
        <div className="ct-c">{fmt(biayaProtek.biayaTahunan)}</div>
        <div className="ct-c">Bersih optimal, warna tetap terjaga</div>
        <div className="ct-c">Lebih hemat, produktivitas meningkat</div>
        <div className="ct-c">Ya (teruji dan sesuai standar kesehatan)</div>
       </div>
       <div className="ct-col">
        <div className="ct-h">Produk Laundry Lain</div>
        <div className="ct-c">{biayaPembanding.avgDosis.toFixed(1)} ml/kg</div>
        <div className="ct-c">{biayaPembanding.avgRejectRate.toFixed(1)}%</div>
        <div className="ct-c">{fmt(biayaPembanding.avgCostPerKgInfeksius)}</div>
        <div className="ct-c">{fmt(biayaPembanding.avgCostPerKgNonInfeksius)}</div>
        <div className="ct-c">{fmt(biayaPembanding.biayaHarian)}</div>
        <div className="ct-c">{fmt(biayaPembanding.biayaBulanan)}</div>
        <div className="ct-c">{fmt(biayaPembanding.biayaTahunan)}</div>
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
           <b>{Math.abs(biayaPembanding.avgRejectRate-biayaProtek.avgRejectRate).toFixed(1)}%</b>
           <small>({biayaProtek.avgRejectRate < biayaPembanding.avgRejectRate ? 'lebih baik' : 'lebih buruk'})</small>
         </div>
         <div className="ct-c ct-sel">
           <b>{fmt(Math.abs(biayaPembanding.avgCostPerKgInfeksius-biayaProtek.avgCostPerKgInfeksius))}</b>
           <small>({biayaProtek.avgCostPerKgInfeksius < biayaPembanding.avgCostPerKgInfeksius ? 'lebih hemat' : 'lebih mahal'})</small>
         </div>
         <div className="ct-c ct-sel">
           <b>{fmt(Math.abs(biayaPembanding.avgCostPerKgNonInfeksius-biayaProtek.avgCostPerKgNonInfeksius))}</b>
           <small>({biayaProtek.avgCostPerKgNonInfeksius < biayaPembanding.avgCostPerKgNonInfeksius ? 'lebih hemat' : 'lebih mahal'})</small>
         </div>
         <div className="ct-c ct-sel">
           <b>{fmt(Math.abs(biayaPembanding.biayaHarian-biayaProtek.biayaHarian))}</b>
           <small>({biayaProtek.biayaHarian < biayaPembanding.biayaHarian ? 'lebih hemat' : 'lebih mahal'})</small>
         </div>
         <div className="ct-c ct-sel">
           <b>{fmt(Math.abs(biayaPembanding.biayaBulanan-biayaProtek.biayaBulanan))}</b>
           <small>({biayaProtek.biayaBulanan < biayaPembanding.biayaBulanan ? 'lebih hemat' : 'lebih mahal'})</small>
         </div>
         <div className="ct-c ct-sel">
           <b>{fmt(Math.abs(biayaPembanding.biayaTahunan-biayaProtek.biayaTahunan))}</b>
           <small>({biayaProtek.biayaTahunan < biayaPembanding.biayaTahunan ? 'lebih hemat' : 'lebih mahal'})</small>
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
