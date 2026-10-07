import type { Collection, Product, ProductCategory } from "@/data/products";

export const categoryLabels: Record<ProductCategory, string> = {
  lighting: "Aydınlatma",
  organization: "Düzenleme",
  accessories: "Aksesuarlar",
};

export const collectionLabels: Record<Collection, string> = {
  work: "Work",
  kids: "Kids",
};

export function normalizeCatalogText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function productSearchText(product: Product) {
  const collectionTerms = product.collection === "work" ? "work çalışma calisma ofis" : "kids çocuk cocuk genç genc";
  const categoryTerms: Record<ProductCategory, string> = {
    lighting: "aydınlatma aydinlatma ışık isik lamba",
    organization: "düzenleme duzenleme organizasyon saklama",
    accessories: "aksesuar aksesuarlar",
  };
  return normalizeCatalogText([
    product.name,
    product.variant ?? "",
    product.summary,
    product.material,
    product.dimensions,
    collectionTerms,
    categoryTerms[product.category],
  ].join(" "));
}

export function matchesProductQuery(product: Product, query: string) {
  const terms = normalizeCatalogText(query).split(" ").filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = productSearchText(product);
  return terms.every((term) => haystack.includes(term));
}
