import { Header } from "@/components/Header";
import { ProductRail } from "@/components/ProductRail";
import { allProducts, categories } from "@/data/products";

const footerGroups = [
  { title: "Shop", links: ["Desk", "Organization", "Comfort", "Space", "Bundles"] },
  { title: "Help", links: ["Shipping", "Returns", "FAQ", "Contact"] },
  { title: "About", links: ["Our Story", "Materials", "Journal"] },
  { title: "Legal", links: ["Privacy", "Terms", "Distance Sales Agreement"] },
];

export default function Home() {
  return <main id="top">
    <Header />

    <section className="retail-hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p>Build a better space</p><h1 id="hero-title">Designed for the way you work.</h1><span>Thoughtful essentials for work, play and everything in between.</span><a className="corner-button" href="#shop">Shop now <b>→</b></a></div>
    </section>

    <section className="benefits container" aria-label="Shopping benefits"><div><strong>01</strong><span><b>Free shipping</b>Over ₺1,500</span></div><div><strong>02</strong><span><b>Easy returns</b>Simple, stress-free returns</span></div><div><strong>03</strong><span><b>Secure payment</b>Protected checkout</span></div></section>

    <ProductRail title="Best Seller" products={allProducts} id="shop" tabs />

    <section className="category-showcase container" id="desk">
      <div className="category-heading"><span>Best Categories</span><p>Explore the foundations of a better workspace.</p><h2>Browse Categories</h2></div>
      <div className="category-stagger">{categories.map((category) => <a href="#shop" className="category-tile" key={category.name}><div className={`sheet-image ${category.crop}`} style={{ backgroundImage: "url(/images/categories.png)" }} /><h3>{category.name}</h3></a>)}</div>
    </section>

    <section className="campaign-pair container" id="organization"><a className="campaign-card campaign-clean" href="#shop"><div><p>Clean desk</p><h2>Less clutter.<br/>More focus.</h2><span>Shop organization →</span></div></a><a className="campaign-card campaign-work" href="#shop"><div><p>Work better</p><h2>Built for longer sessions.</h2><span>Explore comfort →</span></div></a></section>

    <ProductRail title="Workspace Essentials" products={allProducts.slice(0, 6)} />

    <section className="setup-banner" id="bundles"><div className="setup-copy"><p>Shop the setup</p><h2>Build your workspace one detail at a time.</h2><span>Desk Mat · Laptop Stand · Headphone Stand · Cable Kit</span><a className="corner-button" href="#shop">Shop bundles <b>→</b></a></div></section>

    <section className="social-section" id="space"><div className="social-heading container"><h2>Spaces by Deskoom<span>.</span></h2><p>Workspaces made personal. <b>#deskoom</b></p></div><div className="social-grid">{[1,2,3,4,5].map((item) => <a href="#space" aria-label={`Deskoom community workspace ${item}`} key={item} className={`social-cell social-${item}`} style={{ backgroundImage: "url(/images/community.png)" }}><span>↗</span></a>)}</div></section>

    <section className="split-campaign container"><div className="split-photo"/><div className="split-offer"><div><p>Beyond the desk</p><h2>Make the whole room yours.</h2><span>Objects, prints and details designed for your space.</span><a className="corner-button" href="#space">Explore space <b>→</b></a></div></div></section>

    <section className="newsletter"><span className="newsletter-ghost">Newsletter</span><div className="newsletter-inner"><h2>Make space for what&apos;s next.</h2><p>New products, workspace ideas and occasional offers.</p><form><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email address" required/><button type="submit" aria-label="Subscribe">→</button></form></div></section>

    <footer><div className="footer-inner container"><div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>{link}</a>)}</div>)}</div><div className="footer-brand"><a className="wordmark" href="#top">DESKOOM<span>.</span></a><p>Build a better space.</p><div><a href="#instagram">Instagram</a><a href="#pinterest">Pinterest</a><a href="#tiktok">TikTok</a></div></div><div className="footer-bottom"><span>© 2026 DESKOOM</span><span>Workspace essentials, thoughtfully made.</span></div></div></footer>
  </main>;
}
