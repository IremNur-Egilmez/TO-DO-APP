export function kullaniciBilgileriniKaydet(ad, soyad, email, password) {
  localStorage.setItem("fname", ad);
  localStorage.setItem("lname", soyad);
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
}

export function gorevleriKaydet(gorevler) {
  localStorage.setItem("gorevler", JSON.stringify(gorevler));
}

export function gorevleriYukle() {
  const kayitli = localStorage.getItem("gorevler");
  return kayitli ? JSON.parse(kayitli) : [];
}