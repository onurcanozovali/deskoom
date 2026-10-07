"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";

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
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return <>
    <header className="site-header"><div className="header-inner container">
      <Link className="wordmark" href="/" aria-label="Deskoom ana sayfa">DESKOOM<span>.</span></Link>
      <nav className="desktop-nav" aria-label="Ana menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} key={link.href} href={link.href}>{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</Link>)}</nav>
      <div className="header-actions">
        <button className="header-action" aria-label="Ara"><SearchIcon /><span>Ara</span></button>
        <button className="header-action desktop-action" aria-label="Hesabım"><UserIcon /><span>Hesabım</span></button>
        <button className="header-action desktop-action" aria-label="İstek listesi"><HeartIcon /><em>0</em></button>
        <Link className="header-action" href="/sepet" aria-label={`Sepet, ${itemCount} ürün`}><BagIcon /><em>{itemCount > 99 ? "99+" : itemCount}</em></Link>
        <button className="menu-button" aria-label="Menüyü aç" onClick={() => setOpen(true)}><MenuIcon /></button>
      </div>
    </div></header>
    <aside className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="drawer-top"><span className="wordmark">DESKOOM<span>.</span></span><button className="icon-button" aria-label="Menüyü kapat" onClick={() => setOpen(false)}><CloseIcon /></button></div><nav aria-label="Mobil menü">{links.map((link) => <Link className={link.kids ? "kids-nav-link" : undefined} onClick={() => setOpen(false)} key={link.href} href={link.href}><span className="mobile-nav-label">{link.kids && <i className="kids-spark" aria-hidden="true"/>}{link.label}</span><span>→</span></Link>)}</nav><div className="drawer-tools"><a href="#account"><UserIcon />Hesabım</a><a href="#wishlist"><HeartIcon />İstek Listesi</a></div></aside>
    {open && <button className="drawer-backdrop" aria-label="Menüyü kapat" onClick={() => setOpen(false)} />}
  </>;
}
