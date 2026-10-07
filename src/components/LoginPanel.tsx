"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth, type AuthProviderName } from "./AuthProvider";
import { FacebookIcon, GoogleIcon } from "./Icons";

export function LoginPanel({ nextPath }: { nextPath: string }) {
  const { ready, isAuthenticated, user, signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const completeSignIn = (provider: AuthProviderName) => {
    signIn(provider);
    router.replace(nextPath);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const password = String(data.get("password") ?? "");
    if (email !== "admin@admin.com" || password !== "123") {
      setError("Demo için admin@admin.com ve 123 bilgilerini kullanın.");
      return;
    }
    completeSignIn("demo");
  };

  if (!ready) return <div className="auth-card auth-loading" aria-label="Oturum bilgileri yükleniyor"/>;

  if (isAuthenticated) {
    return <div className="auth-card auth-success">
      <span className="auth-kicker">Oturum açık</span>
      <h1>Tekrar hoş geldiniz.</h1>
      <p>{user?.email} hesabıyla giriş yaptınız.</p>
      <button className="auth-primary" type="button" onClick={() => router.replace(nextPath)}>Devam et <span>→</span></button>
    </div>;
  }

  return <div className="auth-card">
    <span className="auth-kicker">DESKOOM hesabı</span>
    <h1>Tekrar hoş geldiniz.</h1>
    <p>Favorilerinizi saklayın, siparişlerinizi takip edin ve ödeme adımını daha hızlı tamamlayın.</p>

    <div className="social-login" aria-label="Sosyal giriş seçenekleri">
      <button type="button" onClick={() => completeSignIn("google")}><GoogleIcon/><span>Google ile devam et</span></button>
      <button type="button" onClick={() => completeSignIn("facebook")}><FacebookIcon/><span>Facebook ile devam et</span></button>
    </div>

    <div className="auth-divider"><span>veya demo hesabıyla</span></div>

    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">E-posta adresi</label>
      <input id="login-email" name="email" type="email" defaultValue="admin@admin.com" autoComplete="email" required/>
      <div className="password-label"><label htmlFor="login-password">Şifre</label><span>Demo şifresi: 123</span></div>
      <input id="login-password" name="password" type="password" defaultValue="123" autoComplete="current-password" required/>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <button className="auth-primary" type="submit">Giriş yap <span>→</span></button>
    </form>

    <p className="auth-legal">Bu bir demo oturumudur. Gerçek Google ve Facebook kimlik doğrulaması henüz bağlı değildir.</p>
    <Link className="guest-shopping" href="/urunler">Üye olmadan alışverişe devam et →</Link>
  </div>;
}
