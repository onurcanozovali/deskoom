export type Product = {
  id: string; name: string; variant?: string; price: string;
  image: string; crop: string; hoverImage?: string;
};

export const bestSellers: Product[] = [
  { id: "core-desk-mat", name: "Core Desk Mat", variant: "Graphite", price: "₺899", image: "/images/best-sellers.png", crop: "crop-tl", hoverImage: "/images/setup.png" },
  { id: "rise-laptop-stand", name: "Rise Laptop Stand", variant: "Matte Black", price: "₺1,099", image: "/images/best-sellers.png", crop: "crop-tr", hoverImage: "/images/setup.png" },
  { id: "arc-headphone-stand", name: "Arc Headphone Stand", variant: "Matte Black", price: "₺649", image: "/images/best-sellers.png", crop: "crop-bl", hoverImage: "/images/setup.png" },
  { id: "dock-desk-tray", name: "Dock Desk Tray", variant: "Oak / Black", price: "₺549", image: "/images/best-sellers.png", crop: "crop-br", hoverImage: "/images/setup.png" },
];

export const newArrivals: Product[] = [
  { id: "level-monitor-riser", name: "Level Monitor Riser", variant: "Natural Oak", price: "₺1,299", image: "/images/new-arrivals.png", crop: "crop-tl" },
  { id: "underdesk-hook", name: "Underdesk Headphone Hook", variant: "Matte Black", price: "₺299", image: "/images/new-arrivals.png", crop: "crop-tr" },
  { id: "underdesk-cable-tray", name: "Underdesk Cable Tray", variant: "Matte Black", price: "₺599", image: "/images/new-arrivals.png", crop: "crop-bl" },
  { id: "cable-kit", name: "Cable Kit", variant: "Black", price: "₺249", image: "/images/new-arrivals.png", crop: "crop-br" },
];

export const categories = [
  { name: "Desk", copy: "Everything your workspace starts with.", crop: "crop-tl" },
  { name: "Organization", copy: "Less clutter. More focus.", crop: "crop-tr" },
  { name: "Comfort", copy: "Made for longer sessions.", crop: "crop-bl" },
  { name: "Space", copy: "Beyond the desk.", crop: "crop-br" },
];

export const bundles = [
  { name: "Starter Setup", items: "Desk Mat + Cable Kit", crop: "crop-tl" },
  { name: "Clean Desk", items: "Desk Mat + Laptop Stand + Cable Kit", crop: "crop-tr" },
  { name: "Full Setup", items: "Desk Mat + Laptop Stand + Headphone Stand + Desk Tray + Cable Kit", crop: "crop-bl" },
];
