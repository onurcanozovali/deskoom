import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
export function ProductRail({ title, products, id }: { title: string; products: Product[]; id?: string }) { return <section className="section products-section" id={id}><div className="section-head"><h2>{title}</h2><a className="text-link" href="#shop">Shop all</a></div><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>; }
