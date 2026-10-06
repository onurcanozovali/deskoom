import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductRail";
import { bestSellers, kidsProducts, newArrivals, workProducts } from "@/data/products";

const footerGroups = [
  { title: "Shop", links: ["Work", "Kids", "Lighting", "Organization", "Accessories", "New Arrivals"] },
  { title: "Help", links: ["Shipping", "Returns", "FAQ", "Contact"] },
  { title: "About", links: ["Our Story", "Materials", "Journal"] },
  { title: "Legal", links: ["Privacy", "Terms", "Distance Sales Agreement"] },
];

const values = [
  ["Functional", "Useful first."],
  ["Personal", "Made to feel like yours."],
  ["Thoughtfully designed", "Details with a reason."],
  ["Made for your space", "Work, play and everything around it."],
];

function CollectionFeature({ world }: { world: "work" | "kids" }) {
  const isWork = world === "work";
  const products = isWork ? workProducts.slice(0, 2) : kidsProducts.slice(0, 2);
  return <section className={`collection-feature container ${world}`} id={world}>
    <div className="collection-lifestyle" />
    <div className="collection-merch"><div className="collection-copy"><p>Deskoom {world}</p><h2>DESKOOM {world}</h2><span>{isWork ? "Tools for a workspace that works better." : "A little more color. A lot more personality."}</span><a className="text-action" href="#shop">Shop {world} →</a></div><div className="feature-products">{products.map((product) => <ProductCard product={product} key={product.id}/>)}</div></div>
  </section>;
}

export default function Home() {
  return <main id="top">
    <Header />

    <section className="retail-hero brand-hero" aria-labelledby="hero-title"><div className="hero-copy"><p>Deskoom</p><h1 id="hero-title">Make your space yours.</h1><span>Functional objects, lighting and accessories designed for the spaces you live, work and grow in.</span><div className="hero-actions"><a className="corner-button" href="#work">Shop Work <b>→</b></a><a className="corner-button light" href="#kids">Shop Kids <b>→</b></a></div></div></section>

    <section className="benefits container" aria-label="Shopping benefits"><div><strong>01</strong><span><b>Free shipping</b>Over ₺1,500</span></div><div><strong>02</strong><span><b>Easy returns</b>Simple, stress-free returns</span></div><div><strong>03</strong><span><b>Secure payment</b>Protected checkout</span></div></section>

    <section className="world-entry container" aria-label="Deskoom collections"><a href="#work" className="world-card work"><div><p>Deskoom Work</p><h2>Build your workspace.</h2><span>Products for better-looking, better-working spaces.</span><b>Shop Work →</b></div></a><a href="#kids" className="world-card kids"><div><p>Deskoom Kids</p><h2>Make their room theirs.</h2><span>Playful, functional and personal pieces for younger spaces.</span><b>Shop Kids →</b></div></a></section>

    <ProductRail title="Best Sellers" products={bestSellers} id="shop" tabs={["All", "Work", "Kids"]} />

    <CollectionFeature world="work" />
    <CollectionFeature world="kids" />

    <section className="personalized container" id="personalized"><div className="personalized-products"/><div className="personalized-copy"><p>Made for your space</p><h2>Your name.<br/>Your color.<br/>Your space.</h2><span>Some spaces deserve something that&apos;s actually yours.</span><a className="corner-button" href="#personalized">Explore personalized <b>→</b></a></div></section>

    <section className="lighting-section" id="lighting"><div className="lighting-work"/><div className="lighting-copy"><p>Work + Kids</p><h2>Lighting</h2><span>From focused work to softer nights.</span><a className="corner-button" href="#lighting">Shop lighting <b>→</b></a></div><div className="lighting-kids"/></section>

    <ProductRail title="New Arrivals" products={newArrivals} id="new-arrivals" />

    <section className="brand-values container"><div className="values-heading"><p>The Deskoom DNA</p><h2>Designed around real spaces.</h2></div><div className="values-list">{values.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

    <section className="social-section"><div className="social-heading container"><h2>Spaces by Deskoom<span>.</span></h2><p>Workspaces, rooms and corners made personal. <b>#deskoom</b></p></div><div className="social-grid worlds">{[1,2,3,4,5,6].map((item) => <a href="#space" aria-label={`Deskoom community space ${item}`} key={item} className={`social-cell social-${item}`} style={{ backgroundImage: "url(/images/community-worlds.png)" }}><span>↗</span></a>)}</div></section>

    <section className="newsletter"><span className="newsletter-ghost">Newsletter</span><div className="newsletter-inner"><h2>Make space for what&apos;s next.</h2><p>New products, room ideas and occasional offers.</p><form><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email address" required/><button type="submit" aria-label="Subscribe">→</button></form></div></section>

    <footer><div className="footer-inner container"><div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map((link) => <a href={`#${link.toLowerCase().replaceAll(" ", "-")}`} key={link}>{link}</a>)}</div>)}</div><div className="footer-brand"><a className="wordmark" href="#top">DESKOOM<span>.</span></a><p>Make your space yours.</p><div><a href="#instagram">Instagram</a><a href="#pinterest">Pinterest</a><a href="#tiktok">TikTok</a></div></div><div className="footer-bottom"><span>© 2026 DESKOOM</span><span>Work, play and everything around it.</span></div></div></footer>
  </main>;
}
