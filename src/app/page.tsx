import Image from "next/image";
import { Header } from "@/components/Header";
import { ArrowIcon } from "@/components/Icons";
import { ProductRail } from "@/components/ProductRail";
import { bestSellers, bundles, categories, newArrivals } from "@/data/products";

const footerGroups = [
  { title: "Shop", links: ["Desk", "Organization", "Comfort", "Space", "Bundles"] },
  { title: "Help", links: ["Shipping", "Returns", "FAQ", "Contact"] },
  { title: "About", links: ["Our Story", "Materials", "Journal"] },
  { title: "Legal", links: ["Privacy", "Terms", "Distance Sales Agreement"] },
];

export default function Home() {
  return <main id="top">
    <Header />
    <section className="hero">
      <Image src="/images/hero.png" alt="A warm, modern home office furnished with Deskoom-style desk accessories" fill priority sizes="100vw" />
      <div className="hero-overlay" />
      <div className="hero-content"><p className="eyebrow">Build a better space</p><h1>Designed for the way you work.</h1><p>Thoughtful essentials for work, play and everything in between.</p><div className="hero-actions"><a className="button button-light" href="#desk">Shop Desk</a><a className="button button-ghost" href="#about">Explore Deskoom</a></div></div>
    </section>

    <section className="trust-strip" aria-label="Shopping benefits"><span>Free shipping over ₺1,500</span><span>Easy returns</span><span>Secure payment</span></section>
    <ProductRail title="Best Sellers" products={bestSellers} id="shop" />

    <section className="section categories" id="desk"><div className="section-head"><h2>Shop by Category</h2></div><div className="category-grid">{categories.map((category) => <a href="#shop" className="category-card" key={category.name}><div className={`sheet-image ${category.crop}`} style={{ backgroundImage: "url(/images/categories.png)" }} /><div className="category-copy"><div><h3>{category.name}</h3><p>{category.copy}</p></div><ArrowIcon /></div></a>)}</div></section>

    <section className="setup-section" id="organization"><div className="setup-image"><Image src="/images/setup.png" alt="A complete warm oak and graphite Deskoom workspace setup" fill sizes="(max-width: 800px) 100vw, 65vw" /></div><div className="setup-panel"><p className="eyebrow">The complete workspace</p><h2>Shop the Setup</h2><p>A workspace built one detail at a time.</p><ol>{bestSellers.map((product, index) => <li key={product.id}><span>0{index + 1}</span><a href="#shop">{product.name}</a><b>{product.price}</b></li>)}</ol><a className="text-link" href="#shop">Shop the setup</a></div></section>

    <section className="editorial organization-editorial"><Image src="/images/categories.png" alt="A neatly organized wooden desk drawer" fill sizes="100vw" /><div className="editorial-shade" /><div className="editorial-copy"><p className="eyebrow">Deskoom / Organization</p><h2>A clear desk changes how you work.</h2><a className="button button-light" href="#organization">Explore Organization</a></div></section>

    <ProductRail title="New Arrivals" products={newArrivals} />

    <section className="space-editorial" id="space"><div className="space-copy"><p className="eyebrow">Beyond the desk</p><h2>Your workspace doesn&apos;t end at the desk.</h2><p>Objects, prints and details designed to make the whole room yours.</p><a className="text-link" href="#space">Explore Space</a></div><div className="space-image"><div className="community-cell cell-shelves" style={{ backgroundImage: "url(/images/community.png)" }} /></div></section>

    <section className="section bundles" id="bundles"><div className="section-head"><div><p className="eyebrow">Curated sets</p><h2>Built to work together.</h2></div><a className="text-link" href="#bundles">View bundles</a></div><div className="bundle-grid">{bundles.map((bundle) => <a href="#bundles" className="bundle-card" key={bundle.name}><div className={`sheet-image ${bundle.crop}`} style={{ backgroundImage: "url(/images/categories.png)" }} /><div><p>{bundle.name}</p><span>{bundle.items}</span></div></a>)}</div></section>

    <section className="community section"><div className="community-head"><div><p className="eyebrow">#deskoom</p><h2>Spaces by Deskoom</h2></div><p>Workspaces made personal.</p></div><div className="community-grid">{[1,2,3,4,5,6].map((cell) => <div key={cell} className={`community-cell community-${cell}`} style={{ backgroundImage: "url(/images/community.png)" }} />)}</div></section>

    <section className="newsletter"><div><p className="eyebrow">The Deskoom Edit</p><h2>Make space for what&apos;s next.</h2><p>New products, workspace ideas and occasional offers.</p></div><form className="newsletter-form"><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Email address" required /><button type="submit">Subscribe</button></form></section>

    <footer id="about"><div className="footer-brand"><a className="wordmark" href="#top">DESKOOM</a><p>Build a better space.</p><div className="socials"><a href="#instagram">Instagram</a><a href="#pinterest">Pinterest</a><a href="#tiktok">TikTok</a></div></div><div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>{link}</a>)}</div>)}</div><div className="footer-bottom"><span>© 2026 DESKOOM</span><span>Build a better space.</span></div></footer>
  </main>;
}
