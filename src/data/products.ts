export type Collection = "work" | "kids";
export type ProductCategory = "lighting" | "organization" | "accessories";

export type Product = {
  id: string;
  name: string;
  collection: Collection;
  category: ProductCategory;
  variant?: string;
  price: string;
  image: string;
  crop: string;
};

export const bestSellers: Product[] = [
  { id: "core-desk-mat", name: "Core Masa Pedi", collection: "work", category: "accessories", variant: "Antrasit", price: "₺899", image: "/images/work-products.png", crop: "crop-tr" },
  { id: "rise-laptop-stand", name: "Rise Laptop Standı", collection: "work", category: "accessories", variant: "Mat Siyah", price: "₺1.099", image: "/images/work-products.png", crop: "crop-bl" },
  { id: "pipe-desk-lamp", name: "Pipe Masa Lambası", collection: "work", category: "lighting", variant: "Mat Siyah", price: "₺1.299", image: "/images/work-products.png", crop: "crop-tl" },
  { id: "arc-headphone-stand", name: "Arc Kulaklık Standı", collection: "work", category: "accessories", variant: "Siyah / Meşe", price: "₺649", image: "/images/work-products.png", crop: "crop-br" },
  { id: "brick-desk-lamp", name: "Brick Masa Lambası", collection: "kids", category: "lighting", variant: "Mercan / Krem", price: "₺899", image: "/images/kids-products.png", crop: "crop-tl" },
  { id: "pixel-night-light", name: "Pixel Gece Lambası", collection: "kids", category: "lighting", variant: "Çok Renkli", price: "₺749", image: "/images/kids-products.png", crop: "crop-tr" },
  { id: "name-light", name: "İsim Lambası", collection: "kids", category: "lighting", variant: "Kişiselleştirilmiş", price: "₺999’dan", image: "/images/kids-products.png", crop: "crop-bl" },
  { id: "color-desk-organizer", name: "Renkli Masa Düzenleyici", collection: "kids", category: "organization", variant: "Renk Karışımı", price: "₺449", image: "/images/kids-products.png", crop: "crop-br" },
];

export const newArrivals: Product[] = [
  { id: "level-monitor-riser", name: "Level Monitör Yükseltici", collection: "work", category: "organization", variant: "Doğal Meşe", price: "₺1.299", image: "/images/new-arrivals.png", crop: "crop-tl" },
  { id: "underdesk-hook", name: "Masa Altı Kulaklık Askısı", collection: "work", category: "organization", variant: "Mat Siyah", price: "₺299", image: "/images/new-arrivals.png", crop: "crop-tr" },
  { id: "animal-light", name: "Hayvan Figürlü Lamba", collection: "kids", category: "lighting", variant: "Sıcak Beyaz", price: "₺699", image: "/images/kids-products.png", crop: "crop-bl" },
  { id: "custom-brick-lamp", name: "Özel Renk Brick Lamba", collection: "kids", category: "lighting", variant: "Renklerini Seç", price: "₺999’dan", image: "/images/kids-products.png", crop: "crop-tl" },
  { id: "underdesk-cable-tray", name: "Masa Altı Kablo Kanalı", collection: "work", category: "organization", variant: "Mat Siyah", price: "₺599", image: "/images/new-arrivals.png", crop: "crop-bl" },
  { id: "mini-storage", name: "Mini Saklama Seti", collection: "kids", category: "organization", variant: "Renk Karışımı", price: "₺549", image: "/images/kids-products.png", crop: "crop-br" },
];

export const allProducts: Product[] = [...bestSellers, ...newArrivals];
export const workProducts = allProducts.filter((product) => product.collection === "work");
export const kidsProducts = allProducts.filter((product) => product.collection === "kids");
