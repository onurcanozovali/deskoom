"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useWishlist } from "./WishlistProvider";

const providerLabels = { demo: "Demo hesap", google: "Google", facebook: "Facebook" } as const;

export function AccountPageContent() {
  const { user, ready, isAuthenticated, signOut } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();
  const router = useRouter();

  if (!ready) return <section className="account-shell container"><div className="account-loading"/></section>;

  if (!isAuthenticated || !user) {
    return <section className="account-guard container">
      <p>DESKOOM hesabı</p><h1>Hesabınıza giriş yapın.</h1>
      <span>Siparişlerinizi, profilinizi ve istek listenizi tek bir yerde yönetin.</span>
      <Link className="corner-button" href="/giris?yonlendir=%2Fhesabim">Giriş sayfasına git <b>→</b></Link>
    </section>;
  }

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return <section className="account-shell container">
    <aside className="account-sidebar">
      <div className="account-avatar" aria-hidden="true">AD</div>
      <div><strong>{user.name}</strong><span>{user.email}</span></div>
      <nav aria-label="Hesap menüsü"><a className="active" href="#overview">Genel bakış <span>01</span></a><a href="#orders">Siparişler <span>02</span></a><Link href="/istek-listem">İstek listem <span>{String(wishlistCount).padStart(2, "0")}</span></Link><a href="#profile">Profil bilgileri <span>03</span></a></nav>
      <button type="button" onClick={handleSignOut}>Çıkış yap</button>
    </aside>

    <div className="account-main" id="overview">
      <div className="account-welcome"><p>Hesabım</p><h1>Merhaba, Admin.</h1><span>DESKOOM alanınızı buradan yönetin.</span></div>

      <div className="account-stats" aria-label="Hesap özeti"><div><span>01</span><strong>0</strong><p>Aktif sipariş</p></div><div><span>02</span><strong>{wishlistCount}</strong><p>İstek listesinde</p></div><div><span>03</span><strong>₺0</strong><p>Toplam alışveriş</p></div></div>

      <section className="account-section" id="orders"><div className="account-section-heading"><div><p>Siparişler</p><h2>Son siparişler</h2></div><span>Henüz sipariş yok</span></div><div className="account-empty-order"><div aria-hidden="true">↗</div><div><h3>İlk alanınızı oluşturmaya başlayın.</h3><p>Sipariş verdiğinizde teslimat durumunu ve geçmişinizi burada görebileceksiniz.</p></div><Link href="/urunler">Ürünleri keşfet →</Link></div></section>

      <div className="account-grid">
        <section className="account-tile" id="profile"><span>Profil</span><h2>Hesap bilgileri</h2><dl><div><dt>Ad</dt><dd>{user.name}</dd></div><div><dt>E-posta</dt><dd>{user.email}</dd></div><div><dt>Giriş yöntemi</dt><dd>{providerLabels[user.provider]}</dd></div></dl><button type="button">Bilgileri düzenle →</button></section>
        <section className="account-tile accent"><span>İstek listeniz</span><h2>{wishlistCount ? `${wishlistCount} ürün sizi bekliyor.` : "İlhamı kaydetmeye başlayın."}</h2><p>Beğendiğiniz parçaları tek yerde tutun; hazır olduğunuzda sepetinize ekleyin.</p><Link href="/istek-listem">İstek listeme git →</Link></section>
      </div>
    </div>
  </section>;
}
