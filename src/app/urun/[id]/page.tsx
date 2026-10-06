import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { ProductPurchase } from "@/components/ProductPurchase";
import { allProducts, type Product } from "@/data/products";

const categoryLabels = {
  lighting: "Aydınlatma",
  organization: "Düzenleme",
  accessories: "Aksesuar",
} as const;

const categoryHighlights = {
  lighting: ["Dengeli ve sıcak ışık", "Kompakt yerleşim", "Odayla uyumlu yalın form"],
  organization: ["Daha düzenli bir yüzey", "Günlük kullanıma uygun", "Kolay yerleşen kompakt form"],
  accessories: ["İşlev odaklı tasarım", "Dayanıklı malzeme seçimi", "Sade ve zamansız görünüm"],
} as const;

function getProduct(id: string) {
  return allProducts.find((product) => product.id === id);
}

export function generateStaticParams() {
  return allProducts.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return { title: "Ürün bulunamadı | DESKOOM" };

  return {
    title: `${product.name} | DESKOOM`,
    description: product.summary,
    openGraph: { title: `${product.name} | DESKOOM`, description: product.summary, images: [product.image] },
  };
}

function ProductFacts({ product }: { product: Product }) {
  const facts = [
    ["Malzeme", product.material],
    ["Ölçüler", product.dimensions],
    ["Koleksiyon", product.collection === "work" ? "DESKOOM Çalışma" : "DESKOOM Çocuk"],
  ];

  return <section className="product-facts container" aria-labelledby="product-details-title">
    <div className="facts-heading"><p>Detaylarda fark yaratır</p><h2 id="product-details-title">Alanınız için düşünülmüş.</h2></div>
    <div className="facts-grid">{facts.map(([label, value], index) => <div key={label}><span>0{index + 1}</span><p>{label}</p><strong>{value}</strong></div>)}</div>
  </section>;
}

export default async function ProductDetailPage({ params }: PageProps<"/urun/[id]">) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const collectionLabel = product.collection === "work" ? "Çalışma" : "Çocuk";
  const relatedProducts = allProducts.filter((item) => item.id !== product.id && item.collection === product.collection).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    image: product.image,
    brand: { "@type": "Brand", name: "DESKOOM" },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price.replace(/\D/g, ""),
      availability: "https://schema.org/InStock",
    },
  };

  return <main id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <Header />

    <nav className="product-breadcrumb container" aria-label="Sayfa yolu">
      <Link href="/">Ana sayfa</Link><span>·</span><Link href={`/#${product.collection}`}>{collectionLabel}</Link><span>·</span><span aria-current="page">{product.name}</span>
    </nav>

    <section className={`product-detail container ${product.collection}`}>
      <div className="product-gallery">
        <div className="detail-primary"><div className={`sheet-image ${product.crop}`} style={{ backgroundImage: `url(${product.image})` }} role="img" aria-label={product.name}/><span>01</span></div>
        <div className={`detail-lifestyle ${product.collection}`} role="img" aria-label={`${collectionLabel} koleksiyonu yaşam alanı`}><span>DESKOOM {collectionLabel.toLocaleUpperCase("tr-TR")}</span></div>
      </div>

      <div className="detail-info">
        <div className="detail-eyebrow"><span>{collectionLabel}</span><span>{categoryLabels[product.category]}</span></div>
        <h1>{product.name}</h1>
        <p className="detail-variant">{product.variant}</p>
        <strong className="detail-price">{product.price}</strong>
        <p className="detail-summary">{product.summary}</p>

        <div className="variant-choice"><span>Seçenek</span><button type="button" aria-pressed="true"><i aria-hidden="true"/>{product.variant}</button></div>
        <ProductPurchase productName={product.name} />

        <ul className="detail-highlights" aria-label="Ürün özellikleri">{categoryHighlights[product.category].map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>

        <div className="detail-disclosures">
          <details><summary>Ürün ve bakım bilgileri <span>+</span></summary><p>Yumuşak ve hafif nemli bir bezle temizleyin. Aşındırıcı temizlik ürünlerinden kaçının.</p></details>
          <details><summary>Teslimat ve iade <span>+</span></summary><p>Siparişiniz özenle paketlenir. Kullanılmamış ürünleri teslimattan sonraki 14 gün içinde iade edebilirsiniz.</p></details>
        </div>
      </div>
    </section>

    <ProductFacts product={product} />

    <section className="related-products container" aria-labelledby="related-title">
      <div className="commerce-heading"><h2 id="related-title">Bunları da sevebilirsiniz</h2><Link className="outline-link" href={`/#${product.collection}`}>Koleksiyonu keşfet <span>→</span></Link></div>
      <div className="related-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item}/>)}</div>
    </section>

    <Footer />
  </main>;
}
