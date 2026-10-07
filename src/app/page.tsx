import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductRail } from "@/components/ProductRail";
import { bestSellers, kidsProducts, newArrivals, workProducts } from "@/data/products";
import Link from "next/link";

const values = [
  ["İşlevsel", "Önce fayda."],
  ["Kişisel", "Size ait hissettirmek için."],
  ["Özenle tasarlandı", "Her detayın bir nedeni var."],
  ["Alanınız için", "Çalışma, oyun ve hayatın geri kalanı."],
];

function CollectionFeature({ world }: { world: "work" | "kids" }) {
  const isWork = world === "work";
  const products = isWork ? workProducts.slice(0, 2) : kidsProducts.slice(0, 2);
  return <section className={`collection-feature container ${world}`} id={world}>
    <div className="collection-lifestyle" />
    <div className="collection-merch"><div className="collection-copy"><p>Deskoom {isWork ? "Work" : "Kids"}</p><h2>DESKOOM {isWork ? "WORK" : "KIDS"}</h2><span>{isWork ? "Daha iyi çalışan bir çalışma alanı için araçlar." : "Biraz daha fazla renk. Çok daha fazla karakter."}</span><Link className="text-action" href={isWork ? "/work" : "/kids"}>{isWork ? "Work koleksiyonunu" : "Kids koleksiyonunu"} keşfet →</Link></div><div className="feature-products">{products.map((product) => <ProductCard product={product} key={product.id}/>)}</div></div>
  </section>;
}

export default function Home() {
  return <main id="top">
    <Header />

    <section className="retail-hero brand-hero" aria-labelledby="hero-title"><div className="hero-copy"><p>Deskoom</p><h1 id="hero-title">Alanını kendine göre tasarla.</h1><span>Yaşadığınız, çalıştığınız ve büyüdüğünüz alanlar için tasarlanmış işlevsel ürünler, aydınlatma ve aksesuarlar.</span><div className="hero-actions"><Link className="corner-button" href="/work">Work ürünleri <b>→</b></Link><Link className="corner-button light" href="/kids">Kids ürünleri <b>→</b></Link></div></div></section>

    <section className="benefits container" aria-label="Alışveriş avantajları"><div><strong>01</strong><span><b>Ücretsiz kargo</b>₺1.500 üzeri</span></div><div><strong>02</strong><span><b>Kolay iade</b>Basit ve zahmetsiz iade</span></div><div><strong>03</strong><span><b>Güvenli ödeme</b>Korumalı ödeme</span></div></section>

    <section className="world-entry container" aria-label="Deskoom koleksiyonları"><Link href="/work" className="world-card work"><div><p>Deskoom Work</p><h2>Çalışma alanını kur.</h2><span>Daha iyi görünen, daha iyi çalışan alanlar için ürünler.</span><b>Work ürünleri →</b></div></Link><Link href="/kids" className="world-card kids"><div><p>Deskoom Kids</p><h2>Odası ona özel olsun.</h2><span>Genç alanlar için eğlenceli, işlevsel ve kişisel parçalar.</span><b>Kids ürünleri →</b></div></Link></section>

    <ProductRail title="Çok Satanlar" products={bestSellers} id="shop" tabs={["all", "work", "kids"]} />

    <CollectionFeature world="work" />
    <CollectionFeature world="kids" />

    <section className="personalized container" id="personalized"><div className="personalized-products"/><div className="personalized-copy"><p>Alanınıza özel</p><h2>Senin adın.<br/>Senin rengin.<br/>Senin alanın.</h2><span>Bazı alanlar gerçekten size ait bir şeyi hak eder.</span><a className="corner-button" href="#personalized">Kişiselleştirmeyi keşfet <b>→</b></a></div></section>

    <section className="lighting-section" id="lighting"><div className="lighting-work"/><div className="lighting-copy"><p>Work + Kids</p><h2>Aydınlatma</h2><span>Odaklı çalışmalardan huzurlu gecelere.</span><Link className="corner-button" href="/urunler?kategori=lighting">Aydınlatmayı keşfet <b>→</b></Link></div><div className="lighting-kids"/></section>

    <ProductRail title="Yeni Gelenler" products={newArrivals} id="new-arrivals" />

    <section className="brand-values container"><div className="values-heading"><p>Deskoom DNA&apos;sı</p><h2>Gerçek alanlar için tasarlandı.</h2></div><div className="values-list">{values.map(([title, copy], index) => <div key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}</div></section>

    <section className="social-section"><div className="social-heading container"><h2>Deskoom Alanları<span>.</span></h2><p>Kişiselleştirilmiş çalışma alanları, odalar ve köşeler. <b>#deskoom</b></p></div><div className="social-grid worlds">{[1,2,3,4,5,6].map((item) => <a href="#space" aria-label={`Deskoom topluluk alanı ${item}`} key={item} className={`social-cell social-${item}`} style={{ backgroundImage: "url(/images/community-worlds.png)" }}><span>↗</span></a>)}</div></section>

    <section className="newsletter"><span className="newsletter-ghost">Bülten</span><div className="newsletter-inner"><h2>Yeniliklere yer açın.</h2><p>Yeni ürünler, oda fikirleri ve ara sıra özel teklifler.</p><form><label className="sr-only" htmlFor="email">E-posta adresi</label><input id="email" type="email" placeholder="E-posta adresinizi girin" required/><button type="submit" aria-label="Abone ol">→</button></form></div></section>

    <Footer />
  </main>;
}
