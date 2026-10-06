"use client";

import { useEffect, useState } from "react";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";

const links = ["Shop", "Desk", "Organization", "Comfort", "Space", "Bundles"];

export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return <>
    <header className="site-header"><div className="header-inner container">
      <a className="wordmark" href="#top" aria-label="Deskoom home">DESKOOM<span>.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</nav>
      <div className="header-actions">
        <button className="header-action" aria-label="Search"><SearchIcon /><span>Search</span></button>
        <button className="header-action desktop-action" aria-label="Account"><UserIcon /><span>Account</span></button>
        <button className="header-action desktop-action" aria-label="Wishlist"><HeartIcon /><em>0</em></button>
        <button className="header-action" aria-label="Cart, 0 items"><BagIcon /><em>0</em></button>
        <button className="menu-button" aria-label="Open menu" onClick={() => setOpen(true)}><MenuIcon /></button>
      </div>
    </div></header>
    <aside className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}><div className="drawer-top"><span className="wordmark">DESKOOM<span>.</span></span><button className="icon-button" aria-label="Close menu" onClick={() => setOpen(false)}><CloseIcon /></button></div><nav aria-label="Mobile navigation">{links.map((link) => <a onClick={() => setOpen(false)} key={link} href={`#${link.toLowerCase()}`}>{link}<span>→</span></a>)}</nav><div className="drawer-tools"><a href="#account"><UserIcon />Account</a><a href="#wishlist"><HeartIcon />Wishlist</a></div></aside>
    {open && <button className="drawer-backdrop" aria-label="Close menu" onClick={() => setOpen(false)} />}
  </>;
}
