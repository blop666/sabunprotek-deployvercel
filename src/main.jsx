import React,{useState,useEffect} from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import Header from './header.jsx';
import Kalkulator from './kalkulator.jsx';
import Blog from './blog.jsx';
import BlogDetail from './blogDetail.jsx';
import Login from './login.jsx';
import Dashboard from './dashboard.jsx';

const A='/assets/';
const assets={hero:A+'hero.png', story:'/section-picture.png', texture:A+'texture.png', house:A+'house.png', outro:A+'outro.png', logo:A+'logo.png', icon:A+'icon-check.svg'};
const goCalc=()=>location.hash='#/kalkulator';
const goBlog=()=>location.hash='#/blog';

const cheap=['Harga per liter rendah','Dosis pakai tidak diketahui pasti','Tidak ada pembanding riil','Klaim manfaat tanpa data'];
const efficient=['Total biaya per kg linen rendah','Dosis presisi, terukur, teruji','Dibandingkan otomatis dengan kalkulator','Estimasi nilai tambah terukur'];
function Card({title,items,good}){return <div className={'compare-card '+(good?'good':'')}><h3>{title}</h3>{items.map(x=><div className="point" key={x}><img src={assets.icon}/><span>{x}</span></div>)}</div>}
const steps=[['Input data RS Anda','Berat linen kotor harian, jenis linen, jumlah mesin, hari operasional'],['Input dosis & harga chemical yang dipakai','baik Protek maupun produk lain'],['Hitung otomatis','biaya chemical per hari, minggu, bulan, tahun'],['Bandingkan','lihat selisih biaya dan persentase penghematan secara transparan'],['Lihat nilai tambah','manfaat tambahan yang didapat jika beralih ke Protek']];
function Landing(){return <main><Header/><section className="hero"><div className="shade"/><div className="hero-copy"><h1>Efisiensi Rumah Sakit Dimulai dari Hal yang Sering Terlewat yaitu Pengelolaan Laundry</h1><p>Murah di harga belum tentu murah di biaya. Hitung dulu, baru putuskan.</p><button onClick={goCalc}>Hitung Kebutuhan &amp; Biaya Chemical Laundry RS Anda</button></div></section><section className="why"><div className="intro"><h2>Mengapa Laundry Jadi Titik Efisiensi yang Sering Terlewat?</h2><p>Rumah sakit umumnya fokus efisiensi pada listrik, obat, dan SDM, padahal laundry adalah unit operasional yang berjalan setiap hari, menyerap chemical, air, listrik mesin, dan tenaga kerja dalam volume besar dan berkelanjutan.</p></div><div className="story"><img src={assets.story}/><div className="texture"/><p className="note n1">Linen merupakan aset yang bersentuhan langsung dengan pasien, sehingga kualitas pencuciannya berpengaruh signifikan terhadap Pencegahan dan Pengendalian Infeksi (PPI).</p><p className="note n2">Evaluasi biaya laundry kerap kali berfokus pada harga beli bahan kimia per liter, bukan pada total biaya per kilogram linen yang dicuci.</p><p className="note n3">Perbandingan yang valid harus mengacu pada kalkulasi dosis pakai riil, bukan sekadar asumsi.</p></div></section><section className="comparison"><div className="intro"><h2>Terkesan Murah VS Benar-Benar Murah</h2><p>Chemical berharga rendah cenderung butuh dosis lebih tinggi dan berisiko merusak linen serta standar PPI akibat residu. Sebaliknya, chemical yang tampak mahal justru bisa lebih hemat karena efisiensi dosisnya.</p></div><div className="cards"><Card title="Terkesan Murah" items={cheap}/><Card title="Benar-Benar Efisien" items={efficient} good/></div><button className="cta" onClick={goCalc}>Mulai Hitung Sekarang →</button></section><section className="steps"><h2>Bagaimana Kalkulator Ini<br/>Membantu Anda</h2><div className="step-list">{steps.map(([title,text],i)=><div className="step" key={title}><b>{i+1}</b><strong>{title}</strong><small>{text}</small></div>)}</div></section><section className="trust"><img src={assets.house}/><div><h2>Transparansi adalah<br/>Kunci Kepercayaan</h2><p>Semua asumsi dosis dan harga yang digunakan kalkulator ini bisa Anda sesuaikan sendiri. Kami tidak ingin Anda percaya pada klaim dan kami ingin Anda melihat sendiri hasil perhitungannya</p></div></section><section className="outro"><img src={assets.outro}/><div><h2>Setelah Anda Tahu Angkanya...</h2><p>Setelah mengetahui potensi penghematan chemical, banyak RS partner kami memilih melangkah lebih jauh: menyerahkan pengelolaan laundry sepenuhnya kepada kami sehingga fokus RS kembali ke pelayanan pasien, bukan operasional cucian.</p><button>Pelajari Layanan Pengelolaan Laundry RS →</button></div></section></main>}
function App(){
 const [route,setRoute]=useState(location.hash||'#/');
 useEffect(()=>{const f=()=>{setRoute(location.hash||'#/');window.scrollTo(0,0)};window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f)},[]);
 if(route==='#/kalkulator')return <Kalkulator/>;
 if(route==='#/blog')return <Blog/>;
 if(route.startsWith('#/blog/'))return <BlogDetail/>;
 if(route==='#/login')return <Login/>;
 if(route==='#/admin')return <Dashboard/>;
 return <Landing/>;
}
createRoot(document.getElementById('root')).render(<App/>);
