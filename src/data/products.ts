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
  { id: "core-desk-mat", name: "Core Desk Mat", collection: "work", category: "accessories", variant: "Graphite", price: "₺899", image: "/images/work-products.png", crop: "crop-tr" },
  { id: "rise-laptop-stand", name: "Rise Laptop Stand", collection: "work", category: "accessories", variant: "Matte Black", price: "₺1,099", image: "/images/work-products.png", crop: "crop-bl" },
  { id: "pipe-desk-lamp", name: "Pipe Desk Lamp", collection: "work", category: "lighting", variant: "Matte Black", price: "₺1,299", image: "/images/work-products.png", crop: "crop-tl" },
  { id: "arc-headphone-stand", name: "Arc Headphone Stand", collection: "work", category: "accessories", variant: "Black / Oak", price: "₺649", image: "/images/work-products.png", crop: "crop-br" },
  { id: "brick-desk-lamp", name: "Brick Desk Lamp", collection: "kids", category: "lighting", variant: "Coral / Cream", price: "₺899", image: "/images/kids-products.png", crop: "crop-tl" },
  { id: "pixel-night-light", name: "Pixel Night Light", collection: "kids", category: "lighting", variant: "Multi", price: "₺749", image: "/images/kids-products.png", crop: "crop-tr" },
  { id: "name-light", name: "Name Light", collection: "kids", category: "lighting", variant: "Personalized", price: "From ₺999", image: "/images/kids-products.png", crop: "crop-bl" },
  { id: "color-desk-organizer", name: "Color Desk Organizer", collection: "kids", category: "organization", variant: "Color Mix", price: "₺449", image: "/images/kids-products.png", crop: "crop-br" },
];

export const newArrivals: Product[] = [
  { id: "level-monitor-riser", name: "Level Monitor Riser", collection: "work", category: "organization", variant: "Natural Oak", price: "₺1,299", image: "/images/new-arrivals.png", crop: "crop-tl" },
  { id: "underdesk-hook", name: "Underdesk Headphone Hook", collection: "work", category: "organization", variant: "Matte Black", price: "₺299", image: "/images/new-arrivals.png", crop: "crop-tr" },
  { id: "animal-light", name: "Animal Light", collection: "kids", category: "lighting", variant: "Warm White", price: "₺699", image: "/images/kids-products.png", crop: "crop-bl" },
  { id: "custom-brick-lamp", name: "Custom Color Brick Lamp", collection: "kids", category: "lighting", variant: "Pick Your Colors", price: "From ₺999", image: "/images/kids-products.png", crop: "crop-tl" },
  { id: "underdesk-cable-tray", name: "Underdesk Cable Tray", collection: "work", category: "organization", variant: "Matte Black", price: "₺599", image: "/images/new-arrivals.png", crop: "crop-bl" },
  { id: "mini-storage", name: "Mini Storage Set", collection: "kids", category: "organization", variant: "Color Mix", price: "₺549", image: "/images/kids-products.png", crop: "crop-br" },
];

export const allProducts: Product[] = [...bestSellers, ...newArrivals];
export const workProducts = allProducts.filter((product) => product.collection === "work");
export const kidsProducts = allProducts.filter((product) => product.collection === "kids");
