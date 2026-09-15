import { useState, useEffect } from 'react';
import './blogDetail.css';
import Header from './header.jsx';
import { supabase } from './supabaseClient.js';

// Format date dari database (YYYY-MM-DD) ke format Indonesia
const formatDate=(dateStr)=>{
  const date=new Date(dateStr);
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function BlogDetail(){
  const [article,setArticle]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);
  
  useEffect(()=>{
    fetchArticle();
  },[]);
  
  const fetchArticle=async()=>{
    try{
      // Ambil slug dari hash URL
      const hash=window.location.hash;
      const slug=hash.replace('#/blog/','');
      
      // Fetch artikel dari Supabase berdasarkan slug
      const {data,error}=await supabase
        .from('articles')
        .select('*')
        .eq('slug',slug)
        .eq('status','published')
        .single();
      
      if(error) throw error;
      
      if(data){
        // Transform data untuk UI
        setArticle({
          id:data.id,
          slug:data.slug,
          title:data.title,
          excerpt:data.excerpt,
          content:data.content,
          category:data.category,
          date:formatDate(data.date),
          readTime:data.read_time,
          image:data.image,
          featured:data.featured
        });
      }
      
      setLoading(false);
      window.scrollTo(0,0);
    }catch(error){
      console.error('Error fetching article:',error);
      setError('Artikel tidak ditemukan');
      setLoading(false);
    }
  };
  
  const goBack=()=>{
    window.location.hash='#/blog';
  };
  
  if(loading){
    return <div className="blog-detail">
      <Header/>
      <div className="bd-loading">Loading artikel...</div>
    </div>;
  }
  
  if(error||!article){
    return <div className="blog-detail">
      <Header/>
      <div className="bd-loading" style={{color:'#cf1322'}}>
        {error||'Artikel tidak ditemukan'}
        <br/><br/>
        <button onClick={goBack} style={{padding:'10px 20px',background:'#2C7EFB',color:'#fff',border:0,borderRadius:'8px',cursor:'pointer',fontSize:'14px',fontWeight:'600'}}>
          Kembali ke Blog
        </button>
      </div>
    </div>;
  }
  
  return <div className="blog-detail">
    <Header/>
    
    {/* Hero Banner dengan Gambar */}
    <section className="bd-hero" style={{backgroundImage:`url(${article.image})`}}>
      <div className="bd-hero-overlay"/>
      <div className="bd-hero-content">
        <span className="bd-hero-category">{article.category.toUpperCase()}</span>
        <h1>{article.title}</h1>
        <p className="bd-hero-excerpt">{article.excerpt}</p>
        <div className="bd-hero-meta">
          <span className="bd-date">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="white" strokeWidth="1.5"/>
              <path d="M11 1.5v3M5 1.5v3M2 6.5h12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {article.date}
          </span>
          <span className="bd-time">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/>
              <path d="M8 5v3.5l2 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {article.readTime}
          </span>
        </div>
      </div>
    </section>
    
    {/* Konten Artikel */}
    <section className="bd-content">
      <article className="bd-article" dangerouslySetInnerHTML={{__html:article.content}}/>
      
      {/* Tombol Kembali di Bawah */}
      <div className="bd-footer">
        <button className="bd-back-btn" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Kembali ke Blog
        </button>
      </div>
    </section>
  </div>;
}
