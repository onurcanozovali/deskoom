"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { useWishlist } from "./WishlistProvider";

const links = [
  { label: "Çalışma", href: "/#work" },
  { label: "Çocuk", href: "/#kids", kids: true },
  { label: "Aydınlatma", href: "/#lighting" },
  { label: "Düzenleme", href: "/#organization" },
  { label: "Aksesuarlar", href: "/#accessories" },
  { label: "Yeni Gelenler", href: "/#new-arrivals" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const accountHref = isAuthenticated ? "/hesabim" : "/giris";
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return <>
    <header className="site-header"><div className="header-inner container">
      <Link className="wordmark" href="/" aria-label="Deskoom ana sayfa">DESKOOM<span>.</span></Link>
      <nav className="desktop-nav" aria-label="Ana menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} key={link.href} href={link.href}>{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</Link>)}</nav>
      <div className="header-actions">
        <button className="header-action" aria-label="Ara"><SearchIcon /><span>Ara</span></button>
        <Link className="header-action desktop-action" href={accountHref} aria-label={isAuthenticated ? "Hesabım" : "Giriş yap"}><UserIcon /><span>Hesabım</span>{isAuthenticated && <i className="account-status" aria-hidden="true"/>}</Link>
        <Link className="header-action desktop-action" href="/istek-listem" aria-label={`İstek listesi, ${wishlistCount} ürün`}><HeartIcon /><em>{wishlistCount > 99 ? "99+" : wishlistCount}</em></Link>
        <Link className="header-action" href="/sepet" aria-label={`Sepet, ${itemCount} ürün`}><BagIcon /><em>{itemCount > 99 ? "99+" : itemCount}</em></Link>
        <button className="menu-button" aria-label="Menüyü aç" onClick={() => setOpen(true)}><MenuIcon /></button>
      </div>
    </div></header>
    <aside className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="drawer-top"><span className="wordmark">DESKOOM<span>.</span></span><button className="icon-button" aria-label="Menüyü kapat" onClick={() => setOpen(false)}><CloseIcon /></button></div><nav aria-label="Mobil menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} onClick={() => setOpen(false)} key={link.href} href={link.href}><span className="mobile-nav-label">{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</span><span>→</span></Link>)}</nav><div className="drawer-tools"><Link href={accountHref} onClick={() => setOpen(false)}><UserIcon />Hesabım</Link><Link href="/istek-listem" onClick={() => setOpen(false)}><HeartIcon />İstek Listesi ({wishlistCount})</Link></div></aside>
    {open && <button className="drawer-backdrop" aria-label="Menüyü kapat" onClick={() => setOpen(false)} />}
  </>;
}
