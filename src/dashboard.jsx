import { useState, useEffect } from 'react';
import './dashboard.css';
import { supabase } from './supabaseClient.js';

// Custom Toast Notification Component
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

// Component: Categories List
function CategoriesList({setActivePage,handleEditCategory,showToast,showConfirm}){
  const [categories,setCategories]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreateForm,setShowCreateForm]=useState(false);
  const [newCategoryName,setNewCategoryName]=useState('');
  const [saving,setSaving]=useState(false);
  
  useEffect(()=>{fetchCategories();},[]);
  
  const fetchCategories=async()=>{
    try{
      // Fetch categories dengan count artikel per kategori
      const {data:categoriesData,error:catError}=await supabase.from('categories').select('*').order('name',{ascending:true});
      if(catError) throw catError;
      
      // Fetch count artikel per kategori
      const {data:articlesData,error:artError}=await supabase.from('articles').select('category');
      if(artError) throw artError;
      
      // Hitung jumlah artikel per kategori
      const categoriesWithCount=categoriesData.map(cat=>{
        const count=articlesData.filter(art=>art.category===cat.name).length;
        return {...cat,article_count:count};
      });
      
      setCategories(categoriesWithCount||[]);
      setLoading(false);
    }catch(error){
      console.error('Error:',error);
      showToast('Gagal memuat kategori','error');
      setLoading(false);
    }
  };
  
  const handleCreate=async(e)=>{
    e.preventDefault();
    if(!newCategoryName.trim()){
      showToast('Nama kategori harus diisi','error');
      return;
    }
    
    setSaving(true);
    try{
      const {error}=await supabase.from('categories').insert([{name:newCategoryName.trim()}]);
      if(error) throw error;
      showToast('Kategori berhasil dibuat!','success');
      setNewCategoryName('');
      setShowCreateForm(false);
      fetchCategories();
    }catch(error){
      showToast('Gagal membuat kategori: '+error.message,'error');
    }
    setSaving(false);
  };
  
  const handleDelete=async(id,name)=>{
    const confirmed=await showConfirm('Hapus Kategori',`Apakah Anda yakin ingin menghapus kategori "${name}"?`);
    if(!confirmed) return;
    
    try{
      const {error}=await supabase.from('categories').delete().eq('id',id);
      if(error) throw error;
      showToast('Kategori berhasil dihapus!','success');
      fetchCategories();
    }catch(error){
      showToast('Gagal menghapus kategori','error');
    }
  };
  
  if(loading) return <div className="loading">Loading...</div>;
  
  return <div className="categories-list">
    <div className="al-header">
      <button className="btn-primary" onClick={()=>setShowCreateForm(!showCreateForm)}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        {showCreateForm?'Batal':'Buat Kategori Baru'}
      </button>
    </div>
    
    {showCreateForm&&<div className="create-form-inline">
      <form onSubmit={handleCreate}>
        <input type="text" value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)} placeholder="Nama kategori baru..." disabled={saving}/>
        <button type="submit" className="btn-primary" disabled={saving}>{saving?'Menyimpan...':'Simpan'}</button>
      </form>
    </div>}
    
    {categories.length===0?<div style={{textAlign:'center',padding:'60px 20px',color:'#7a8ba5'}}>Belum ada kategori</div>:<div className="table-container">
      <table className="articles-table">
        <thead><tr><th>Nama Kategori</th><th>Jumlah Artikel</th><th>Aksi</th></tr></thead>
        <tbody>
          {categories.map(category=><tr key={category.id}>
            <td className="td-title">{category.name}</td>
            <td><span className="badge">{category.article_count||0}</span></td>
            <td>
              <div className="action-buttons">
                <button className="btn-edit" onClick={()=>handleEditCategory(category.id)}>Edit</button>
                <button className="btn-delete" onClick={()=>handleDelete(category.id,category.name)}>Hapus</button>
              </div>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>}
  </div>;
}

// Component: Edit Category
function EditCategory({setActivePage,categoryId,showToast}){
  const [categoryName,setCategoryName]=useState('');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  
  useEffect(()=>{
    fetchCategory();
  },[categoryId]);
  
  const fetchCategory=async()=>{
    try{
      const {data,error}=await supabase.from('categories').select('*').eq('id',categoryId).single();
      if(error) throw error;
      setCategoryName(data.name);
      setLoading(false);
    }catch(error){
      console.error('Error fetching category:',error);
      showToast('Gagal memuat kategori','error');
      setActivePage('categories');
    }
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!categoryName.trim()){
      showToast('Nama kategori harus diisi','error');
      return;
    }
    
    setSaving(true);
    try{
      const {error}=await supabase.from('categories').update({name:categoryName.trim()}).eq('id',categoryId);
      if(error) throw error;
      showToast('Kategori berhasil diupdate!','success');
      setActivePage('categories');
    }catch(error){
      console.error('Error updating category:',error);
      showToast('Gagal mengupdate kategori: '+error.message,'error');
      setSaving(false);
    }
  };
  
  if(loading) return <div className="loading">Loading kategori...</div>;
  
  return <div className="create-article">
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Nama Kategori *</label>
          <input type="text" value={categoryName} onChange={e=>setCategoryName(e.target.value)} placeholder="Masukkan nama kategori" required/>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={()=>setActivePage('categories')} disabled={saving}>Batal</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving?'Menyimpan...':'Update Kategori'}
        </button>
      </div>
    </form>
  </div>;
}

// Custom Confirm Dialog Component
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
        <button className="btn-danger" onClick={onConfirm}>Ya, Lanjutkan</button>
      </div>
    </div>
  </div>;
}

const formatDateForInput=(dateStr)=>{
  const date=new Date(dateStr);
  const year=date.getFullYear();
  const month=String(date.getMonth()+1).padStart(2,'0');
  const day=String(date.getDate()).padStart(2,'0');
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay=(dateStr)=>{
  const date=new Date(dateStr);
  const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function Dashboard(){
  const [adminUser,setAdminUser]=useState('');
  const [activePage,setActivePage]=useState('articles');
  const [editArticleId,setEditArticleId]=useState(null);
  const [editCategoryId,setEditCategoryId]=useState(null);
  const [toast,setToast]=useState(null);
  const [confirm,setConfirm]=useState(null);
  
  useEffect(()=>{
    const loggedIn=localStorage.getItem('admin_logged_in');
    const username=localStorage.getItem('admin_username');
    
    if(!loggedIn){
      window.location.hash='#/login';
      return;
    }
    
    setAdminUser(username);
  },[]);
  
  const showToast=(message,type='success')=>{
    setToast({message,type});
  };
  
  const showConfirm=(title,message)=>{
    return new Promise((resolve)=>{
      setConfirm({
        title,
        message,
        onConfirm:()=>{setConfirm(null);resolve(true);},
        onCancel:()=>{setConfirm(null);resolve(false);}
      });
    });
  };
  
  const handleLogout=async()=>{
    const confirmed=await showConfirm('Logout','Apakah Anda yakin ingin keluar dari dashboard?');
    if(confirmed){
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_username');
      window.location.hash='#/login';
    }
  };
  
  const handleEdit=(id)=>{
    setEditArticleId(id);
    setActivePage('edit');
  };
  
  const handleEditCategory=(id)=>{
    setEditCategoryId(id);
    setActivePage('editCategory');
  };
  
  return <div className="dashboard">
    {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
    {confirm&&<ConfirmDialog {...confirm}/>}
    
    <aside className="dashboard-sidebar">
      <div className="ds-header">
        <img src="/assets/logo.png" alt="PROTEK" className="ds-logo"/>
        <h3>Admin Dashboard</h3>
      </div>
      
      <nav className="ds-nav">
        <button className={'ds-nav-item'+(activePage==='articles'?' active':'')} onClick={()=>setActivePage('articles')}>
          Daftar Artikel
        </button>
        
        <button className={'ds-nav-item'+(activePage==='create'?' active':'')} onClick={()=>setActivePage('create')}>
          Buat Artikel Baru
        </button>
        
        <button className={'ds-nav-item'+(activePage==='categories'?' active':'')} onClick={()=>setActivePage('categories')}>
          Kelola Kategori
        </button>
      </nav>
      
      <div className="ds-footer">
        <div className="ds-user">
          <div className="ds-user-avatar">{adminUser.charAt(0).toUpperCase()}</div>
          <div className="ds-user-info">
            <div className="ds-user-name">{adminUser}</div>
            <div className="ds-user-role">Administrator</div>
          </div>
        </div>
        <button className="ds-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
    
    <main className="dashboard-content">
      <header className="dc-header">
        <div className="dc-header-left">
          <div className="dc-icon">
            {activePage==='articles'&&<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {activePage==='create'&&<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {activePage==='edit'&&<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {activePage==='categories'&&<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {activePage==='editCategory'&&<svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" stroke="#2C7EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <div className="dc-header-text">
            <h1>{activePage==='articles'?'Daftar Artikel':activePage==='create'?'Buat Artikel Baru':activePage==='edit'?'Edit Artikel':activePage==='categories'?'Kelola Kategori':activePage==='editCategory'?'Edit Kategori':'Dashboard'}</h1>
            <div className="dc-breadcrumb">Dashboard / {activePage==='articles'?'Artikel':activePage==='create'?'Buat Artikel':activePage==='edit'?'Edit Artikel':activePage==='categories'?'Kategori':activePage==='editCategory'?'Edit Kategori':'Dashboard'}</div>
          </div>
        </div>
      </header>
      
      <div className="dc-body">
        {activePage==='articles'&&<ArticlesList setActivePage={setActivePage} handleEdit={handleEdit} showToast={showToast} showConfirm={showConfirm}/>}
        {activePage==='create'&&<CreateArticle setActivePage={setActivePage} showToast={showToast}/>}
        {activePage==='edit'&&<EditArticle setActivePage={setActivePage} articleId={editArticleId} showToast={showToast}/>}
        {activePage==='categories'&&<CategoriesList setActivePage={setActivePage} handleEditCategory={handleEditCategory} showToast={showToast} showConfirm={showConfirm}/>}
        {activePage==='editCategory'&&<EditCategory setActivePage={setActivePage} categoryId={editCategoryId} showToast={showToast}/>}
      </div>
    </main>
  </div>;
}

// Component ArticlesList - simpel dulu untuk testing
function ArticlesList({setActivePage,handleEdit,showToast,showConfirm}){
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [currentPage,setCurrentPage]=useState(1);
  const articlesPerPage=10;
  
  useEffect(()=>{fetchArticles();},[]);
  
  const fetchArticles=async()=>{
    try{
      const {data,error}=await supabase.from('articles').select('*').order('created_at',{ascending:false});
      if(error) throw error;
      setArticles(data||[]);
      setLoading(false);
    }catch(error){
      console.error('Error:',error);
      showToast('Gagal memuat artikel','error');
      setLoading(false);
    }
  };
  
  const handleDelete=async(id,title)=>{
    const confirmed=await showConfirm('Hapus Artikel',`Apakah Anda yakin ingin menghapus artikel "${title}"?`);
    if(!confirmed) return;
    
    try{
      const {error}=await supabase.from('articles').delete().eq('id',id);
      if(error) throw error;
      showToast('Artikel berhasil dihapus!','success');
      fetchArticles();
    }catch(error){
      showToast('Gagal menghapus artikel','error');
    }
  };
  
  // Pagination logic
  const indexOfLastArticle=currentPage*articlesPerPage;
  const indexOfFirstArticle=indexOfLastArticle-articlesPerPage;
  const currentArticles=articles.slice(indexOfFirstArticle,indexOfLastArticle);
  const totalPages=Math.ceil(articles.length/articlesPerPage);
  
  const paginate=(pageNumber)=>setCurrentPage(pageNumber);
  
  if(loading) return <div className="loading">Loading...</div>;
  
  return <div className="articles-list">
    <div className="al-header">
      <button className="btn-primary" onClick={()=>setActivePage('create')}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        Buat Artikel Baru
      </button>
    </div>
    
    {articles.length===0?<div style={{textAlign:'center',padding:'60px 20px',color:'#7a8ba5'}}>Belum ada artikel</div>:<>
      <div className="table-container">
        <table className="articles-table">
          <thead><tr><th>Judul</th><th>Kategori</th><th>Tanggal</th><th>Featured</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {currentArticles.map(article=><tr key={article.id}>
              <td className="td-title">{article.title}</td>
              <td><span className="badge">{article.category}</span></td>
              <td>{formatDateForDisplay(article.date)}</td>
              <td>{article.featured?<span className="badge badge-featured">Ya</span>:<span className="badge badge-gray">Tidak</span>}</td>
              <td><span className="badge badge-success">{article.status}</span></td>
              <td>
                <div className="action-buttons">
                  <button className="btn-edit" onClick={()=>handleEdit(article.id)}>Edit</button>
                  <button className="btn-delete" onClick={()=>handleDelete(article.id,article.title)}>Hapus</button>
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      
      {totalPages>1&&<div className="pagination">
        <button className="pagination-btn" onClick={()=>paginate(currentPage-1)} disabled={currentPage===1}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Sebelumnya
        </button>
        
        <div className="pagination-numbers">
          {Array.from({length:totalPages},(_,i)=>i+1).map(number=>(
            <button key={number} className={'pagination-number'+(currentPage===number?' active':'')} onClick={()=>paginate(number)}>
              {number}
            </button>
          ))}
        </div>
        
        <button className="pagination-btn" onClick={()=>paginate(currentPage+1)} disabled={currentPage===totalPages}>
          Selanjutnya
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>}
    </>}
  </div>;
}

// Component: Create Article
function CreateArticle({setActivePage,showToast}){
  const [formData,setFormData]=useState({
    title:'',
    slug:'',
    excerpt:'',
    category:'',
    date:formatDateForInput(new Date()),
    read_time:'5 menit membaca',
    image:'',
    featured:false,
    content:'',
    status:'published'
  });
  const [imagePreview,setImagePreview]=useState('');
  const [uploadMethod,setUploadMethod]=useState('url'); // 'url' or 'file'
  const [saving,setSaving]=useState(false);
  const [categories,setCategories]=useState([]);
  const [loadingCategories,setLoadingCategories]=useState(true);
  
  useEffect(()=>{
    fetchCategories();
  },[]);
  
  const fetchCategories=async()=>{
    try{
      const {data,error}=await supabase.from('categories').select('*').order('name',{ascending:true});
      if(error) throw error;
      setCategories(data||[]);
      if(data&&data.length>0){
        setFormData(prev=>({...prev,category:data[0].name}));
      }
      setLoadingCategories(false);
    }catch(error){
      console.error('Error loading categories:',error);
      setLoadingCategories(false);
    }
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setSaving(true);
    
    try{
      const {data,error}=await supabase
        .from('articles')
        .insert([formData])
        .select();
      
      if(error) throw error;
      
      showToast('Artikel berhasil dibuat!','success');
      setActivePage('articles');
    }catch(error){
      console.error('Error creating article:',error);
      showToast('Gagal membuat artikel: '+error.message,'error');
      setSaving(false);
    }
  };
  
  const handleChange=(field,value)=>{
    setFormData({...formData,[field]:value});
    
    // Auto-generate slug from title
    if(field==='title'){
      const slug=value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g,'')
        .replace(/\s+/g,'-')
        .replace(/-+/g,'-')
        .replace(/(^-|-$)/g,'');
      setFormData(prev=>({...prev,slug}));
    }
    
    // Update image preview
    if(field==='image'){
      setImagePreview(value);
    }
  };
  
  const handleFileUpload=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    
    // Validate file type
    if(!file.type.startsWith('image/')){
      showToast('File harus berupa gambar','error');
      return;
    }
    
    // Validate file size (max 5MB)
    if(file.size>5*1024*1024){
      showToast('Ukuran file maksimal 5MB','error');
      return;
    }
    
    // Create local preview
    const reader=new FileReader();
    reader.onloadend=()=>{
      const dataUrl=reader.result;
      setImagePreview(dataUrl);
      setFormData({...formData,image:dataUrl});
      showToast('Gambar berhasil dimuat','success');
    };
    reader.readAsDataURL(file);
  };
  
  return <div className="create-article">
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Judul Artikel *</label>
          <input type="text" value={formData.title} onChange={e=>handleChange('title',e.target.value)} placeholder="Masukkan judul artikel yang menarik" required/>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Slug (URL) *</label>
          <input type="text" value={formData.slug} onChange={e=>setFormData({...formData,slug:e.target.value})} placeholder="contoh-artikel-slug" required/>
          <small className="form-hint">URL: #/blog/{formData.slug||'slug-artikel'}</small>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Excerpt (Ringkasan) *</label>
          <textarea rows="3" value={formData.excerpt} onChange={e=>setFormData({...formData,excerpt:e.target.value})} placeholder="Ringkasan singkat artikel yang menarik pembaca untuk membaca lebih lanjut..." required/>
        </div>
      </div>
      
      <div className="form-row form-row-2">
        <div className="form-group">
          <label>Kategori *</label>
          <select value={formData.category} onChange={e=>setFormData({...formData,category:e.target.value})} disabled={loadingCategories} required>
            {loadingCategories?<option>Loading...</option>:categories.length===0?<option>Tidak ada kategori</option>:categories.map(cat=><option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label>Tanggal Publikasi *</label>
          <input type="date" value={formData.date} onChange={e=>setFormData({...formData,date:e.target.value})} required/>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Waktu Baca</label>
          <input type="text" value={formData.read_time} onChange={e=>setFormData({...formData,read_time:e.target.value})} placeholder="5 menit membaca"/>
        </div>
      </div>
      
      {/* Image Upload Section */}
      <div className="form-row">
        <div className="form-group">
          <label>Gambar Artikel *</label>
          <div className="upload-tabs">
            <button type="button" className={'upload-tab'+(uploadMethod==='url'?' active':'')} onClick={()=>setUploadMethod('url')}>URL Gambar</button>
            <button type="button" className={'upload-tab'+(uploadMethod==='file'?' active':'')} onClick={()=>setUploadMethod('file')}>Upload File</button>
          </div>
          
          {uploadMethod==='url'&&<div className="upload-section">
            <input type="text" value={formData.image} onChange={e=>handleChange('image',e.target.value)} placeholder="https://example.com/image.jpg atau /card.jpeg" required={!formData.image}/>
            <small className="form-hint">Masukkan URL gambar dari internet atau path file di folder public</small>
          </div>}
          
          {uploadMethod==='file'&&<div className="upload-section">
            <div className="file-upload">
              <input type="file" id="imageUpload" accept="image/*" onChange={handleFileUpload} style={{display:'none'}}/>
              <label htmlFor="imageUpload" className="file-upload-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Klik untuk upload gambar</span>
                <small>PNG, JPG, WEBP (Max 5MB)</small>
              </label>
            </div>
          </div>}
          
          {imagePreview&&<div className="image-preview">
            <img src={imagePreview} alt="Preview"/>
            <button type="button" className="remove-image" onClick={()=>{setImagePreview('');setFormData({...formData,image:''});}}>×</button>
          </div>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group form-checkbox">
          <label>
            <input type="checkbox" checked={formData.featured} onChange={e=>setFormData({...formData,featured:e.target.checked})}/>
            <span>Jadikan artikel featured (tampil di bagian atas halaman blog)</span>
          </label>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Konten Artikel (HTML) *</label>
          <textarea rows="20" value={formData.content} onChange={e=>setFormData({...formData,content:e.target.value})} placeholder="<p>Tulis konten artikel dalam format HTML...</p>&#10;<h2>Judul Section</h2>&#10;<p>Paragraf berikutnya...</p>" required className="content-editor"/>
          <small className="form-hint">Tips: Gunakan tag HTML seperti &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</small>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={()=>setActivePage('articles')} disabled={saving}>Batal</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving?'Menyimpan...':'Publikasikan Artikel'}
        </button>
      </div>
    </form>
  </div>;
}

// Component: Edit Article
function EditArticle({setActivePage,articleId,showToast}){
  const [formData,setFormData]=useState(null);
  const [imagePreview,setImagePreview]=useState('');
  const [uploadMethod,setUploadMethod]=useState('url');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [categories,setCategories]=useState([]);
  const [loadingCategories,setLoadingCategories]=useState(true);
  
  useEffect(()=>{
    fetchArticle();
    fetchCategories();
  },[articleId]);
  
  const fetchCategories=async()=>{
    try{
      const {data,error}=await supabase.from('categories').select('*').order('name',{ascending:true});
      if(error) throw error;
      setCategories(data||[]);
      setLoadingCategories(false);
    }catch(error){
      console.error('Error loading categories:',error);
      setLoadingCategories(false);
    }
  };
  
  const fetchArticle=async()=>{
    try{
      const {data,error}=await supabase
        .from('articles')
        .select('*')
        .eq('id',articleId)
        .single();
      
      if(error) throw error;
      
      setFormData({
        ...data,
        date:formatDateForInput(data.date)
      });
      setImagePreview(data.image);
      setLoading(false);
    }catch(error){
      console.error('Error fetching article:',error);
      showToast('Gagal memuat artikel','error');
      setActivePage('articles');
    }
  };
  
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setSaving(true);
    
    try{
      const {error}=await supabase
        .from('articles')
        .update(formData)
        .eq('id',articleId);
      
      if(error) throw error;
      
      showToast('Artikel berhasil diupdate!','success');
      setActivePage('articles');
    }catch(error){
      console.error('Error updating article:',error);
      showToast('Gagal mengupdate artikel: '+error.message,'error');
      setSaving(false);
    }
  };
  
  const handleChange=(field,value)=>{
    setFormData({...formData,[field]:value});
    
    if(field==='image'){
      setImagePreview(value);
    }
  };
  
  const handleFileUpload=(e)=>{
    const file=e.target.files[0];
    if(!file) return;
    
    if(!file.type.startsWith('image/')){
      showToast('File harus berupa gambar','error');
      return;
    }
    
    if(file.size>5*1024*1024){
      showToast('Ukuran file maksimal 5MB','error');
      return;
    }
    
    const reader=new FileReader();
    reader.onloadend=()=>{
      const dataUrl=reader.result;
      setImagePreview(dataUrl);
      setFormData({...formData,image:dataUrl});
      showToast('Gambar berhasil dimuat','success');
    };
    reader.readAsDataURL(file);
  };
  
  if(loading) return <div className="loading">Loading artikel...</div>;
  if(!formData) return <div className="loading">Artikel tidak ditemukan</div>;
  
  return <div className="create-article">
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label>Judul Artikel *</label>
          <input type="text" value={formData.title} onChange={e=>handleChange('title',e.target.value)} required/>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Slug (URL) *</label>
          <input type="text" value={formData.slug} onChange={e=>handleChange('slug',e.target.value)} required/>
          <small className="form-hint">URL: #/blog/{formData.slug}</small>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Excerpt (Ringkasan) *</label>
          <textarea rows="3" value={formData.excerpt} onChange={e=>handleChange('excerpt',e.target.value)} required/>
        </div>
      </div>
      
      <div className="form-row form-row-2">
        <div className="form-group">
          <label>Kategori *</label>
          <select value={formData.category} onChange={e=>handleChange('category',e.target.value)} disabled={loadingCategories} required>
            {loadingCategories?<option>Loading...</option>:categories.length===0?<option>Tidak ada kategori</option>:categories.map(cat=><option key={cat.id} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label>Tanggal Publikasi *</label>
          <input type="date" value={formData.date} onChange={e=>handleChange('date',e.target.value)} required/>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Waktu Baca</label>
          <input type="text" value={formData.read_time} onChange={e=>handleChange('read_time',e.target.value)}/>
        </div>
      </div>
      
      {/* Image Upload Section */}
      <div className="form-row">
        <div className="form-group">
          <label>Gambar Artikel *</label>
          <div className="upload-tabs">
            <button type="button" className={'upload-tab'+(uploadMethod==='url'?' active':'')} onClick={()=>setUploadMethod('url')}>URL Gambar</button>
            <button type="button" className={'upload-tab'+(uploadMethod==='file'?' active':'')} onClick={()=>setUploadMethod('file')}>Upload File</button>
          </div>
          
          {uploadMethod==='url'&&<div className="upload-section">
            <input type="text" value={formData.image} onChange={e=>handleChange('image',e.target.value)} required/>
            <small className="form-hint">Masukkan URL gambar dari internet atau path file di folder public</small>
          </div>}
          
          {uploadMethod==='file'&&<div className="upload-section">
            <div className="file-upload">
              <input type="file" id="imageUploadEdit" accept="image/*" onChange={handleFileUpload} style={{display:'none'}}/>
              <label htmlFor="imageUploadEdit" className="file-upload-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Klik untuk upload gambar</span>
                <small>PNG, JPG, WEBP (Max 5MB)</small>
              </label>
            </div>
          </div>}
          
          {imagePreview&&<div className="image-preview">
            <img src={imagePreview} alt="Preview"/>
            <button type="button" className="remove-image" onClick={()=>{setImagePreview('');setFormData({...formData,image:''});}}>×</button>
          </div>}
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group form-checkbox">
          <label>
            <input type="checkbox" checked={formData.featured} onChange={e=>handleChange('featured',e.target.checked)}/>
            <span>Jadikan artikel featured</span>
          </label>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Konten Artikel (HTML) *</label>
          <textarea rows="20" value={formData.content} onChange={e=>handleChange('content',e.target.value)} required className="content-editor"/>
          <small className="form-hint">Tips: Gunakan tag HTML seperti &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</small>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={()=>setActivePage('articles')} disabled={saving}>Batal</button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving?'Menyimpan...':'Update Artikel'}
        </button>
      </div>
    </form>
  </div>;
}
