import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductRail({ title, products, id, tabs = false }: { title: string; products: Product[]; id?: string; tabs?: boolean }) {
  return <section className="commerce-section container" id={id}>
    <div className="commerce-heading"><h2>{title}</h2>{tabs ? <div className="product-tabs" aria-label="Product categories"><button className="active">All</button><button>Desk</button><button>Organization</button><button>Comfort</button><button>Space</button></div> : <a className="outline-link" href="#shop">All products <span>→</span></a>}</div>
    <div className={tabs ? "product-rail" : "product-grid"}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    {tabs && <div className="rail-dots" aria-hidden="true"><i className="active"/><i/><i/><i/></div>}
  </section>;
}
