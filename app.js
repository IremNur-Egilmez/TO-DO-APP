// Görevleri saklamak için kullanılan API adresi
const API_URL = "https://crudcrud.com/api/0d1b5a16aefb4f07a8c2b2ef9f9cc83d/todos";

// Dış dosyadan gelen yardımcı fonksiyonları içe aktarıyoruz
import {
  kullaniciBilgileriniKaydet, // Kullanıcı bilgilerini kaydeden fonksiyon
  gorevleriYukle,              // Daha önce kaydedilmiş görevleri geri alan fonksiyon
  gorevleriKaydet              // Görevleri kaydeden fonksiyon (localStorage veya API)
} from "./storage.js";

// Uygulama içindeki görevleri saklamak için boş bir dizi tanımlanır
let gorevler = [];

// Sayfa yüklendiğinde çalışacak olan kod bloğu
document.addEventListener("DOMContentLoaded", function () {
  // API'den daha önce eklenmiş görevleri alıyoruz
  fetch(API_URL)
    .then((res) => res.json()) // Yanıtı JSON formatına çeviriyoruz
    .then((veriler) => {
      // Her görev nesnesini {id, metin, tamam} formatına dönüştürüyoruz
      gorevler = veriler.map((g) => ({
        id: g._id,        // API'den gelen görev ID'si
        metin: g.task,    // Görev metni
        tamam: g.done     // Görev tamamlanma durumu (true/false)
      }));
      //foreach de kullanılabilirdi ama .map yeni dizi oluşturur foreach olan dizi üzerinde işlem yapar

      // Tüm görevleri kullanıcı arayüzüne ekliyoruz
      gorevler.forEach((gorev) => gorevEkleDOM(gorev));
    })
    .catch((err) => console.error("Görevler yüklenemedi", err)); // Hata oluşursa konsola yazdırılır

  // HTML içerisindeki öğeleri JavaScript'e bağlıyoruz
  const form = document.getElementById("kullaniciGirisForm");
  const gorevAlani = document.getElementById("gorevAlani");
  const gorevInput = document.getElementById("gorevInput");
  const ekleBtn = document.getElementById("ekleBtn");
  const gorevListesi = document.getElementById("gorevListesi");

  // Kullanıcı giriş formu gönderildiğinde çalışacak olay
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Formun varsayılan yenileme davranışı engellenir

    // Input alanlarındaki veriler alınır ve boşlukları temizlenir
    const ad = document.getElementById("fname").value.trim();
    const soyad = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Kullanıcı bilgileri saklanır (genellikle localStorage ile)
    kullaniciBilgileriniKaydet(ad, soyad, email, password);

    // Kullanıcıya bilgi verilir
    alert("Giriş başarıyla kaydedildi!");

    // Giriş formu gizlenir
    form.style.display = "none";

    // Görev ekleme alanı görünür hale getirilir
    gorevAlani.style.display = "block";

    // Daha önce kaydedilmiş görevler yüklenir
    gorevler = gorevleriYukle();

    // Görevler tekrar DOM'a eklenir
    gorevler.forEach((gorev) => gorevEkleDOM(gorev));
  });

  // Bir görevi ekrana (listeye) yazdıran fonksiyon
  function gorevEkleDOM(gorev) {
    const li = document.createElement("li"); // <li> öğesi oluşturulur

    // Checkbox, görev metni ve sil butonu içeriği yazılır
    li.innerHTML = `
      <input type="checkbox" class="gorevCheckbox" ${gorev.tamam ? "checked" : ""}>
      <span class="${gorev.tamam ? "completed" : ""}">${gorev.metin}</span>
      <button class="silBtn bg-yellow-800 text-white px-4 py-2 rounded-md hover:bg-yellow-700">Sil</button>
    `;

    // Oluşturulan görev öğesi listeye eklenir
    gorevListesi.appendChild(li);
  }

  // "Ekle" butonuna tıklanınca çalışacak olay
  ekleBtn.addEventListener("click", function () {
    const gorevMetni = gorevInput.value.trim(); // Görev metni alınır

    if (gorevMetni === "") return; // Eğer input boşsa işlem yapılmaz

    // Yeni görev nesnesi oluşturulur
    const yeniGorev = {
      metin: gorevMetni,
      tamam: false // Varsayılan olarak tamamlanmamış
    };

    // Görev diziye eklenir ve kaydedilir
    gorevler.push(yeniGorev);
    gorevleriKaydet(gorevler);

    // Görev DOM’a eklenir
    gorevEkleDOM(yeniGorev);

    // Input temizlenir
    gorevInput.value = "";
  });

  // Liste üzerinde yapılan tıklamaları yakalar (checkbox ve sil)
  gorevListesi.addEventListener("click", function (e) {
    const hedef = e.target; // Tıklanan öğe
    const li = hedef.closest("li"); // İlgili <li> öğesini bulur

    if (hedef.classList.contains("gorevCheckbox")) {
      const span = hedef.nextElementSibling; // Checkbox'tan sonraki <span>
      span.classList.toggle("completed"); // Stil değişimi

      const gorevMetni = span.textContent;

      // Görev tamam durumu ters çevrilir
      gorevler = gorevler.map((g) =>
        g.metin === gorevMetni ? { ...g, tamam: !g.tamam } : g
      );

      // Yeni görev durumu kaydedilir
      gorevleriKaydet(gorevler);
    }

    if (hedef.classList.contains("silBtn")) {
      const span = li.querySelector("span"); // Görev metni alınır
      const gorevMetni = span.textContent;

      // Görev diziden çıkarılır ve tekrar kaydedilir
      gorevler = gorevler.filter((g) => g.metin !== gorevMetni);
      gorevleriKaydet(gorevler);

      // DOM'dan kaldırılır
      li.remove();
    }
  });

  // "Rastgele Görev" butonuna tıklanınca çalışır
  document.getElementById("randomTaskBtn").addEventListener("click", function () {
    fetch("https://dummyjson.com/todos/random")
      .then((response) => response.json())
      .then((data) => {
        const chatContainer = document.getElementById("chatContainer");

        // Yeni bir bot mesaj kutusu oluşturulur
        const div = document.createElement("div");
        div.classList.add("message", "bot");
       
        // Chat alanına eklenir
       div.innerHTML = `
  ${data.todo}
  <button class="accept-btn mt-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">Kabul Et</button>
`;
      // 🔽 Tailwind açıklamaları:
      // mt-2: Üste margin (boşluk) ekler
      // px-4: Yatay iç boşluk (padding-left/right)
      // py-2: Dikey iç boşluk (padding-top/bottom)
      // bg-orange-600: Arka plan rengini koyu turuncu yapar
      // text-white: Yazıyı beyaz yapar
      // rounded-md: Butona orta düzeyde köşe yuvarlaklığı verir
      // hover:bg-orange-700: Üzerine gelindiğinde turuncuyu daha koyu yapar
      // transition: Hover geçişini yumuşak hale getirir

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight; // Otomatik aşağı kaydır
      })
      .catch((error) => {
        console.error("Görev alınamadı:", error);
      });
  });

  // Kullanıcı, “Kabul Et” butonuna tıkladığında çalışır
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("accept-btn")) {
      const mesajDiv = e.target.closest(".message"); // İlgili mesaj kutusu
      const gorevMetni = mesajDiv.textContent.replace("Kabul Et", "").trim(); // Buton hariç metin alınır

      // Mesaj tipi kullanıcıya dönüştürülür (stil için)
      mesajDiv.classList.remove("bot");
      mesajDiv.classList.add("user");

      // Kabul Et butonu silinir
      e.target.remove();

      // Yeni görev olarak eklenir
      const yeniGorev = { metin: gorevMetni, tamam: false };
      gorevler.push(yeniGorev);
      gorevleriKaydet(gorevler);
      gorevEkleDOM(yeniGorev);
    }
    
  });
});

// Görevler hem localStorage üzerinden hem de CRUD API aracılığıyla senkronize ediliyor.
