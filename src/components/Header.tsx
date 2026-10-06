"use client";
import { useEffect, useState } from "react";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
const links = ["Shop", "Desk", "Organization", "Comfort", "Space", "Bundles"];
export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return <><div className="announcement">Free shipping on orders over ₺1,500</div><header className="site-header"><div className="header-inner">
    <button className="icon-button mobile-only" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></button><a className="wordmark" href="#top" aria-label="Deskoom home">DESKOOM</a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</nav>
    <div className="header-actions"><button className="icon-button search-action" aria-label="Search"><SearchIcon /><span>Search</span></button><button className="icon-button desktop-action" aria-label="Account"><UserIcon /></button><button className="icon-button desktop-action" aria-label="Wishlist"><HeartIcon /></button><button className="icon-button cart-action" aria-label="Cart, 0 items"><BagIcon /><span className="cart-count">0</span></button></div>
  </div></header><div className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="drawer-top"><span className="wordmark">DESKOOM</span><button className="icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button></div><nav aria-label="Mobile navigation">{links.map((link) => <a onClick={() => setOpen(false)} key={link} href={`#${link.toLowerCase()}`}>{link}<span>→</span></a>)}</nav><div className="drawer-footer"><a href="#account"><UserIcon /> Account</a><a href="#wishlist"><HeartIcon /> Wishlist</a></div></div>{open && <button className="drawer-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}</>;
}
