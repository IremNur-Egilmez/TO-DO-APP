const API_URL = "https://crudcrud.com/api/0d1b5a16aefb4f07a8c2b2ef9f9cc83d/todos";



import {
  kullaniciBilgileriniKaydet,
  gorevleriYukle,
  gorevleriKaydet,
} from "./storage.js"; // Gerekli yardımcı fonksiyonları içeri aktar

let gorevler = []; // Görevleri tutacak olan dizi

// Sayfa tamamen yüklendiğinde çalışacak olan ana işleyici.
document.addEventListener("DOMContentLoaded", function () {
  // API'den görevleri al ve DOM'a ekle
fetch(API_URL)
  .then(res => res.json())
  .then(veriler => {
    gorevler = veriler.map(g => ({
      id: g._id,
      metin: g.task,
      tamam: g.done
    }));
    gorevler.forEach(gorev => gorevEkleDOM(gorev));
  })
  .catch(err => console.error("Görevler yüklenemedi", err));

  const form = document.getElementById("kullaniciGirisForm");
  const gorevAlani = document.getElementById("gorevAlani");
  const gorevInput = document.getElementById("gorevInput");
  const ekleBtn = document.getElementById("ekleBtn");
  const gorevListesi = document.getElementById("gorevListesi");

  // kullanıcı girişi
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    // Form alanlarındaki verileri al
    const ad = document.getElementById("fname").value.trim();
    const soyad = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Kullanıcı bilgilerini kaydet
    kullaniciBilgileriniKaydet(ad, soyad, email, password);

    alert("Giriş başarıyla kaydedildi!"); // Geri bildirim mesajı göster
    form.style.display = "none"; // Giriş formunu gizle
    gorevAlani.style.display = "block"; // Görev alanını göster

    // Önceden kaydedilmiş görevleri yükle
    gorevler = gorevleriYukle();
    gorevler.forEach((gorev) => gorevEkleDOM(gorev)); // DOM'a görevleri ekle
  });

  // Yeni bir görevi listeye ekleyen fonksiyon
  function gorevEkleDOM(gorev) {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="gorevCheckbox" ${
        gorev.tamam ? "checked" : ""
      }>
      <span class="${gorev.tamam ? "completed" : ""}">${gorev.metin}</span>
      <button class="silBtn">Sil</button>
    `;
    gorevListesi.appendChild(li); // Görevi listeye ekle
  }

  // "Ekle" butonuna tıklanınca yeni görev ekleme
  ekleBtn.addEventListener("click", function () {
    const gorevMetni = gorevInput.value.trim();
    if (gorevMetni === "") return; // Boş görev eklenmesini engelle

    const yeniGorev = { metin: gorevMetni, tamam: false }; // Yeni görev nesnesi oluştur
    gorevler.push(yeniGorev); // Görevi diziye ekle
    gorevleriKaydet(gorevler); // Güncel görev listesini kaydet
    gorevEkleDOM(yeniGorev); // Görevi DOM'a ekle
    gorevInput.value = ""; // Input alanını temizle
  });

  // Görev listesi içindeki etkileşimleri dinle (tamamlandı işareti veya silme)
  gorevListesi.addEventListener("click", function (e) {
    const hedef = e.target;
    const li = hedef.closest("li");

    // Eğer görev tamamlandıysa checkbox işaretlenmiş olur
    if (hedef.classList.contains("gorevCheckbox")) {
      const span = hedef.nextElementSibling;
      span.classList.toggle("completed"); // Görsel olarak tamamlandı stilini değiştir -toggle-

      const gorevMetni = span.textContent;
      // Görev tamam bilgisini tersine çevir
      gorevler = gorevler.map((g) => {
        if (g.metin === gorevMetni) {
          return { ...g, tamam: !g.tamam };
        }
        return g;
      });

      // Güncel görevleri kaydet
      gorevleriKaydet(gorevler);
    }

    // Sil butonuna tıklanırsa görevi listeden ve veri kaynağından kaldır
    if (hedef.classList.contains("silBtn")) {
      const span = li.querySelector("span");
      const gorevMetni = span.textContent;

      // Silinecek görev hariç yeni görev dizisi oluştur
      gorevler = gorevler.filter((g) => g.metin !== gorevMetni);
      gorevleriKaydet(gorevler); // Güncellenmiş listeyi kaydet
      li.remove(); // Görevi DOM'dan sil
    }
  });
});

// Rastgele görev getiren buton işleyici
document.getElementById("randomTaskBtn").addEventListener("click", function () {
  fetch("https://jsonplaceholder.typicode.com/todos/1") // API'den görev al
    .then((response) => response.json())
    .then((data) => {
      const taskText = data.title;

      // Yeni liste elemanı oluştur
      const li = document.createElement("li");
      li.textContent = taskText;

      // Listeye ekle
      document.getElementById("taskList").appendChild(li);
    })
    .catch((error) => {
      console.error("Görev alınamadı:", error); // Hata varsa konsola yazdır
    });
});
