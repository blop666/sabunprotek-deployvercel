import { useState, useEffect } from 'react';
import './blog.css';
import Header from './header.jsx';
import { supabase } from './supabaseClient.js';

const A='/assets/';

// Format date dari database (YYYY-MM-DD) ke format Indonesia
const formatDate=(dateStr)=>{
  const date=new Date(dateStr);
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function Blog(){
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchQuery,setSearchQuery]=useState('');
  const [activeFilter,setActiveFilter]=useState('Semua');
  const [currentPage,setCurrentPage]=useState(1);
  const [categories,setCategories]=useState(['Semua']);
  const [isMobile,setIsMobile]=useState(window.innerWidth<=768);
  
  // Check screen size
  useEffect(()=>{
    const handleResize=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener('resize',handleResize);
    return()=>window.removeEventListener('resize',handleResize);
  },[]);
  
  const articlesPerPage=isMobile?3:6;
  
  // Fetch articles and categories from Supabase
  useEffect(()=>{
    fetchArticles();
    fetchCategories();
  },[]);
  
  const fetchCategories=async()=>{
    try{
      const {data,error}=await supabase.from('categories').select('name').order('name',{ascending:true});
      if(error) throw error;
      const categoryNames=['Semua',...(data||[]).map(cat=>cat.name)];
      setCategories(categoryNames);
    }catch(error){
      console.error('Error loading categories:',error);
    }
  };
  
  const fetchArticles=async()=>{
    try{
      const {data,error}=await supabase
        .from('articles')
        .select('*')
        .eq('status','published')
        .order('date',{ascending:false});
      
      if(error) throw error;
      
      // Transform data untuk UI
      const transformedData=data.map(article=>({
        id:article.id,
        slug:article.slug,
        title:article.title,
        excerpt:article.excerpt,
        content:article.content,
        category:article.category,
        date:formatDate(article.date),
        readTime:article.read_time,
        image:article.image,
        featured:article.featured
      }));
      
      setArticles(transformedData);
      setLoading(false);
    }catch(error){
      console.error('Error fetching articles:',error);
      setLoading(false);
    }
  };
  
  // Filter artikel dengan search dan kategori
  const featuredArticles=articles.filter(a=>a.featured);
  
  let filteredArticles=articles.filter(a=>!a.featured);
  
  // Filter by category
  if(activeFilter!=='Semua'){
    filteredArticles=filteredArticles.filter(a=>a.category===activeFilter);
  }
  
  // Search suggestions
  let searchSuggestions=[];
  if(searchQuery.trim()){
    const query=searchQuery.toLowerCase();
    searchSuggestions=filteredArticles.filter(a=>
      a.title.toLowerCase().includes(query)||
      a.excerpt.toLowerCase().includes(query)||
      a.category.toLowerCase().includes(query)
    ).slice(0,5);
    
    // Filter by search query
    filteredArticles=filteredArticles.filter(a=>
      a.title.toLowerCase().includes(query)||
      a.excerpt.toLowerCase().includes(query)||
      a.category.toLowerCase().includes(query)
    );
  }
  
  const handleSuggestionClick=(slug)=>{
    window.location.hash=`#/blog/${slug}`;
    setSearchQuery('');
  };
  
  // Pagination
  const totalPages=Math.ceil(filteredArticles.length/articlesPerPage);
  const startIndex=(currentPage-1)*articlesPerPage;
  const paginatedArticles=filteredArticles.slice(startIndex,startIndex+articlesPerPage);
  
  // Reset to page 1 when filter or search changes
  useEffect(()=>{
    setCurrentPage(1);
  },[activeFilter,searchQuery]);
  
  return <div className="blog-page">
    <Header/>
    <section className="blog-hero">
      <div className="bh-content">
        <h1>Insight untuk Laundry Rumah Sakit yang Lebih Efisien</h1>
        <p>Temukan informasi, tips dan insight seputar pengelolaan laundry rumah sakit, penggunaan chemical, efisiensi biaya, hingga perawatan linen.</p>
        <div className="bh-search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <input type="text" placeholder="Cari artikel" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
          {searchQuery&&searchSuggestions.length>0&&<div className="search-suggestions">
            {searchSuggestions.map(article=><div key={article.id} className="search-suggestion-item" onClick={()=>handleSuggestionClick(article.slug)}>
              <div className="ssi-icon">📄</div>
              <div className="ssi-content">
                <div className="ssi-title">{article.title}</div>
                <div className="ssi-category">{article.category}</div>
              </div>
            </div>)}
          </div>}
        </div>
      </div>
    </section>
    
    {loading?<div style={{textAlign:'center',padding:'80px 20px',color:'#7a8ba5',fontSize:'16px'}}>Loading artikel...</div>:<>
    <section className="blog-featured">
      {featuredArticles.map(article=><div className="bf-card" key={article.id}>
        <div className="bf-image"><img src={article.image} alt={article.title}/></div>
        <div className="bf-content">
          <span className="bf-category">{article.category.toUpperCase()}</span>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <div className="bf-meta">
            <span className="bf-date"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#2C7EFB" strokeWidth="1.5"/><path d="M11 1.5v3M5 1.5v3M2 6.5h12" stroke="#2C7EFB" strokeWidth="1.5" strokeLinecap="round"/></svg>{article.date}</span>
            <span className="bf-time"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#2C7EFB" strokeWidth="1.5"/><path d="M8 5v3.5l2 1.5" stroke="#2C7EFB" strokeWidth="1.5" strokeLinecap="round"/></svg>{article.readTime}</span>
          </div>
          <a href={`#/blog/${article.slug}`} className="bf-link">Baca Selengkapnya →</a>
        </div>
      </div>)}
    </section>
    
    <section className="blog-articles">
      <div className="ba-header">
        <h2>Artikel Terbaru</h2>
        <p>Informasi praktis untuk membantu Anda memahami dan mengelola operasional laundry dengan lebih efisien.</p>
      </div>
      
      <div className="ba-filters">
        {categories.map(cat=><button key={cat} className={'ba-filter'+(activeFilter===cat?' active':'')} onClick={()=>setActiveFilter(cat)}>{cat}</button>)}
      </div>
      
      {paginatedArticles.length===0?<div className="ba-empty">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3>Belum Ada Post / Blog</h3>
        <p>{searchQuery?'Tidak ada artikel yang sesuai dengan pencarian Anda.':'Belum ada artikel di kategori ini.'}</p>
      </div>:<>
      <div className="ba-grid">
        {paginatedArticles.map(article=><div className="ba-card" key={article.id}>
          <div className="bac-image"><img src={article.image} alt={article.title}/></div>
          <div className="bac-content">
            <span className="bac-category">{article.category}</span>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
            <div className="bac-meta">
              <span className="bac-date"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="11" rx="2" stroke="#2C7EFB" strokeWidth="1.5"/><path d="M11 1.5v3M5 1.5v3M2 6.5h12" stroke="#2C7EFB" strokeWidth="1.5" strokeLinecap="round"/></svg>{article.date}</span>
              <span className="bac-time"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#2C7EFB" strokeWidth="1.5"/><path d="M8 5v3.5l2 1.5" stroke="#2C7EFB" strokeWidth="1.5" strokeLinecap="round"/></svg>{article.readTime}</span>
            </div>
            <a href={`#/blog/${article.slug}`} className="bac-link">Baca Selengkapnya →</a>
          </div>
        </div>)}
      </div>
      
      {totalPages>1&&<div className="ba-pagination">
        <button className="bap-btn" disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)}>← Sebelumnya</button>
        {[...Array(totalPages)].map((_,i)=><button key={i+1} className={'bap-page'+(currentPage===i+1?' active':'')} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>)}
        <button className="bap-btn" disabled={currentPage===totalPages} onClick={()=>setCurrentPage(currentPage+1)}>Selanjutnya →</button>
      </div>}
      </>}
    </section>
    </>}
  </div>;
}
