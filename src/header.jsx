const A='/assets/';
export default function Header(){return <header><div className="brand"><img src={A+'logo.png'}/></div><nav><a onClick={()=>location.hash='#/'}>Beranda</a><a>Tentang Kami</a><a>Produk</a><a>Layanan</a><a>Blog</a></nav><button>Hubungi Kami</button></header>}
