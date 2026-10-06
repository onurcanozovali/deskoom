import Link from "next/link";

const footerGroups = [
  {
    title: "Mağaza",
    links: [
      ["Çalışma", "/#work"],
      ["Çocuk", "/#kids"],
      ["Aydınlatma", "/#lighting"],
      ["Düzenleme", "/#organization"],
      ["Aksesuarlar", "/#accessories"],
      ["Yeni Gelenler", "/#new-arrivals"],
    ],
  },
  { title: "Yardım", links: [["Kargo", "#kargo"], ["İade", "#iade"], ["Sıkça Sorulanlar", "#sss"], ["İletişim", "#iletisim"]] },
  { title: "Hakkımızda", links: [["Hikâyemiz", "#hikayemiz"], ["Malzemeler", "#malzemeler"], ["Günlük", "#gunluk"]] },
  { title: "Yasal", links: [["Gizlilik", "#gizlilik"], ["Koşullar", "#kosullar"], ["Mesafeli Satış Sözleşmesi", "#mesafeli-satis"]] },
];

export function Footer() {
  return <footer><div className="footer-inner container">
    <div className="footer-links">{footerGroups.map((group) => <div key={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}</div>
    <div className="footer-brand"><Link className="wordmark" href="/">DESKOOM<span>.</span></Link><p>Alanını kendine göre tasarla.</p><div><a href="#instagram">Instagram</a><a href="#pinterest">Pinterest</a><a href="#tiktok">TikTok</a></div></div>
    <div className="footer-bottom"><span>© 2026 DESKOOM</span><span>Çalışma, oyun ve hayatın geri kalanı.</span></div>
  </div></footer>;
}

