"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { allProducts } from "@/data/products";
import { categoryLabels, collectionLabels, matchesProductQuery } from "@/lib/catalog";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { useWishlist } from "./WishlistProvider";

const links = [
  { label: "Work", href: "/work" },
  { label: "Kids", href: "/kids", kids: true },
  { label: "Aydınlatma", href: "/urunler?kategori=lighting" },
  { label: "Düzenleme", href: "/urunler?kategori=organization" },
  { label: "Aksesuarlar", href: "/urunler?kategori=accessories" },
  { label: "Yeni Gelenler", href: "/#new-arrivals" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const accountHref = isAuthenticated ? "/hesabim" : "/giris";
  const searchResults = useMemo(() => searchQuery.trim() ? allProducts.filter((product) => matchesProductQuery(product, searchQuery)).slice(0, 5) : [], [searchQuery]);
  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setSearchOpen(false); } };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", closeOnEscape); };
  }, [open, searchOpen]);
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    if (!searchQuery.trim()) event.preventDefault();
  };

  return <>
    <header className="site-header"><div className="header-inner container">
      <Link className="wordmark" href="/" aria-label="Deskoom ana sayfa">DESKOOM<span>.</span></Link>
      <nav className="desktop-nav" aria-label="Ana menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} key={link.href} href={link.href}>{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</Link>)}</nav>
      <div className="header-actions">
        <button className="header-action" aria-label="Ara" aria-expanded={searchOpen} onClick={() => { setOpen(false); setSearchOpen(true); }}><SearchIcon /><span>Ara</span></button>
        <Link className="header-action desktop-action" href={accountHref} aria-label={isAuthenticated ? "Hesabım" : "Giriş yap"}><UserIcon /><span>Hesabım</span>{isAuthenticated && <i className="account-status" aria-hidden="true"/>}</Link>
        <Link className="header-action desktop-action" href="/istek-listem" aria-label={`İstek listesi, ${wishlistCount} ürün`}><HeartIcon /><em>{wishlistCount > 99 ? "99+" : wishlistCount}</em></Link>
        <Link className="header-action" href="/sepet" aria-label={`Sepet, ${itemCount} ürün`}><BagIcon /><em>{itemCount > 99 ? "99+" : itemCount}</em></Link>
        <button className="menu-button" aria-label="Menüyü aç" onClick={() => setOpen(true)}><MenuIcon /></button>
      </div>
    </div></header>
    <aside className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="drawer-top"><span className="wordmark">DESKOOM<span>.</span></span><button className="icon-button" aria-label="Menüyü kapat" onClick={() => setOpen(false)}><CloseIcon /></button></div><nav aria-label="Mobil menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} onClick={() => setOpen(false)} key={link.href} href={link.href}><span className="mobile-nav-label">{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</span><span>→</span></Link>)}</nav><div className="drawer-tools"><Link href={accountHref} onClick={() => setOpen(false)}><UserIcon />Hesabım</Link><Link href="/istek-listem" onClick={() => setOpen(false)}><HeartIcon />İstek Listesi ({wishlistCount})</Link></div></aside>
    {open && <button className="drawer-backdrop" aria-label="Menüyü kapat" onClick={() => setOpen(false)} />}
    {searchOpen && <div className="search-layer" role="dialog" aria-modal="true" aria-label="Ürün arama"><button className="search-backdrop" type="button" aria-label="Aramayı kapat" onClick={() => setSearchOpen(false)}/><section className="search-panel"><div className="search-panel-top"><span className="wordmark">DESKOOM<span>.</span></span><button className="icon-button" type="button" aria-label="Aramayı kapat" onClick={() => setSearchOpen(false)}><CloseIcon/></button></div><form action="/arama" method="get" onSubmit={handleSearch}><SearchIcon/><label className="sr-only" htmlFor="site-search">Ürünlerde ara</label><input id="site-search" name="q" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Ürün, kategori, renk veya malzeme ara" autoComplete="off" autoFocus/><button type="submit">Ara <span>→</span></button></form><div className="search-suggestions">{searchQuery.trim() ? <>{searchResults.length > 0 ? <><div className="search-result-heading"><p>Hızlı sonuçlar</p><span>{searchResults.length} ürün</span></div>{searchResults.map((product) => <Link href={`/urun/${product.id}`} onClick={() => setSearchOpen(false)} key={product.id}><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }}/><div><span>{collectionLabels[product.collection]} · {categoryLabels[product.category]}</span><strong>{product.name}</strong><small>{product.variant}</small></div><b>{product.price}</b></Link>)}<Link className="all-search-results" href={`/arama?q=${encodeURIComponent(searchQuery.trim())}`} onClick={() => setSearchOpen(false)}>Tüm sonuçları göster <span>→</span></Link></> : <div className="search-no-result"><p>Sonuç bulunamadı.</p><span>Başka bir ürün adı, renk veya kategori deneyin.</span></div>}</> : <div className="search-shortcuts"><p>Hızlı keşif</p><div><Link href="/work" onClick={() => setSearchOpen(false)}>Work <span>→</span></Link><Link href="/kids" onClick={() => setSearchOpen(false)}>Kids <span>→</span></Link><Link href="/urunler?kategori=lighting" onClick={() => setSearchOpen(false)}>Aydınlatma <span>→</span></Link></div></div>}</div></section></div>}
  </>;
}
