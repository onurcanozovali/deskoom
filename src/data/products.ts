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
  summary: string;
  material: string;
  dimensions: string;
};

export const bestSellers: Product[] = [
  { id: "core-desk-mat", name: "Core Masa Pedi", collection: "work", category: "accessories", variant: "Antrasit", price: "₺899", image: "/images/work-products.png", crop: "crop-tr", summary: "Geniş ve sakin yüzeyiyle çalışma alanını toparlayan, masanızı günlük kullanıma karşı koruyan keçe masa pedi.", material: "Geri dönüştürülmüş keçe", dimensions: "80 × 35 cm" },
  { id: "rise-laptop-stand", name: "Rise Laptop Standı", collection: "work", category: "accessories", variant: "Mat Siyah", price: "₺1.099", image: "/images/work-products.png", crop: "crop-bl", summary: "Ekranı daha rahat bir görüş yüksekliğine taşıyan, masada az yer kaplayan dengeli ve yalın dizüstü bilgisayar standı.", material: "Toz boyalı alüminyum", dimensions: "25 × 22 × 15 cm" },
  { id: "pipe-desk-lamp", name: "Pipe Masa Lambası", collection: "work", category: "lighting", variant: "Mat Siyah", price: "₺1.299", image: "/images/work-products.png", crop: "crop-tl", summary: "Endüstriyel çizgileri sıcak ve odaklı bir ışıkla birleştiren, kompakt çalışma alanları için tasarlanmış masa lambası.", material: "Toz boyalı çelik", dimensions: "18 × 18 × 46 cm" },
  { id: "arc-headphone-stand", name: "Arc Kulaklık Standı", collection: "work", category: "accessories", variant: "Siyah / Meşe", price: "₺649", image: "/images/work-products.png", crop: "crop-br", summary: "Kulaklığınızı erişilebilir tutarken masanızda görsel düzen sağlayan kompakt ve dengeli stand.", material: "Alüminyum ve meşe", dimensions: "14 × 12 × 27 cm" },
  { id: "brick-desk-lamp", name: "Brick Masa Lambası", collection: "kids", category: "lighting", variant: "Mercan / Krem", price: "₺899", image: "/images/kids-products.png", crop: "crop-tl", summary: "Renkli eklem detaylarıyla yönü kolayca ayarlanan, çalışma ve okuma köşelerine neşe katan masa lambası.", material: "Boyalı metal ve polimer", dimensions: "16 × 16 × 39 cm" },
  { id: "pixel-night-light", name: "Pixel Gece Lambası", collection: "kids", category: "lighting", variant: "Çok Renkli", price: "₺749", image: "/images/kids-products.png", crop: "crop-tr", summary: "Yumuşak ışığı ve geometrik renkleriyle çocuk ve genç odalarında sıcak bir atmosfer oluşturan gece lambası.", material: "Opal akrilik ve polimer", dimensions: "22 × 7 × 28 cm" },
  { id: "name-light", name: "İsim Lambası", collection: "kids", category: "lighting", variant: "Kişiselleştirilmiş", price: "₺999’dan", image: "/images/kids-products.png", crop: "crop-bl", summary: "Odaya kişisel bir imza ekleyen, isim ve renk seçeneğiyle size özel hazırlanan dekoratif ışık.", material: "Akrilik ve ahşap", dimensions: "İsme göre değişir" },
  { id: "color-desk-organizer", name: "Renkli Masa Düzenleyici", collection: "kids", category: "organization", variant: "Renk Karışımı", price: "₺449", image: "/images/kids-products.png", crop: "crop-br", summary: "Kalemleri ve küçük eşyaları düzenlerken çalışma masasına kontrollü bir renk dokunuşu ekleyen modüler set.", material: "Dayanıklı polimer", dimensions: "32 × 20 × 12 cm" },
];

export const newArrivals: Product[] = [
  { id: "level-monitor-riser", name: "Level Monitör Yükseltici", collection: "work", category: "organization", variant: "Doğal Meşe", price: "₺1.299", image: "/images/new-arrivals.png", crop: "crop-tl", summary: "Monitörü yükseltirken altındaki alanı günlük ekipmanlar için kullanılabilir hâle getiren yalın masa üstü çözümü.", material: "Masif meşe ve çelik", dimensions: "56 × 22 × 11 cm" },
  { id: "underdesk-hook", name: "Masa Altı Kulaklık Askısı", collection: "work", category: "organization", variant: "Mat Siyah", price: "₺299", image: "/images/new-arrivals.png", crop: "crop-tr", summary: "Kulaklığınızı masa yüzeyinden kaldırıp elinizin altında tutan, görünümü sade masa altı askısı.", material: "Toz boyalı çelik", dimensions: "5 × 9 × 6 cm" },
  { id: "animal-light", name: "Hayvan Figürlü Lamba", collection: "kids", category: "lighting", variant: "Sıcak Beyaz", price: "₺699", image: "/images/kids-products.png", crop: "crop-bl", summary: "Yumuşak hatları ve sıcak ışığıyla gece rutinlerine eşlik eden, sevimli ama rafine oda lambası.", material: "Mat silikon ve polimer", dimensions: "18 × 14 × 20 cm" },
  { id: "custom-brick-lamp", name: "Özel Renk Brick Lamba", collection: "kids", category: "lighting", variant: "Renklerini Seç", price: "₺999’dan", image: "/images/kids-products.png", crop: "crop-tl", summary: "Seçtiğiniz renklerle hazırlanan, odanın karakterine uyum sağlayan kişiselleştirilebilir Brick masa lambası.", material: "Boyalı metal ve polimer", dimensions: "16 × 16 × 39 cm" },
  { id: "underdesk-cable-tray", name: "Masa Altı Kablo Kanalı", collection: "work", category: "organization", variant: "Mat Siyah", price: "₺599", image: "/images/new-arrivals.png", crop: "crop-bl", summary: "Adaptör ve kabloları görüş alanından uzaklaştırarak daha sakin bir çalışma yüzeyi oluşturan masa altı kanal.", material: "Toz boyalı çelik", dimensions: "60 × 12 × 8 cm" },
  { id: "mini-storage", name: "Mini Saklama Seti", collection: "kids", category: "organization", variant: "Renk Karışımı", price: "₺549", image: "/images/kids-products.png", crop: "crop-br", summary: "Küçük eşyaları gruplandırmayı kolaylaştıran, farklı boyut ve renklerde dört parçalı saklama seti.", material: "Dayanıklı polimer", dimensions: "4 parçalı set" },
];

export const allProducts: Product[] = [...bestSellers, ...newArrivals];
export const workProducts = allProducts.filter((product) => product.collection === "work");
export const kidsProducts = allProducts.filter((product) => product.collection === "kids");
