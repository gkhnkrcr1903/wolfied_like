# Draw and See

Volfied tarzı bir bulmaca oyunu ve bir dünya turu. Ekranı çiz, böcekleri tuzağa düşür, dünyanın 20 harika manzarasını ortaya çıkar.

- **20 bölüm, kolaydan zora:** Kapadokya'dan Everest'e. Böcek sayısı ve çeşidi, hız ve kenar kıvılcımları artıyor, hedef yüzde %72'den %88'e çıkıyor. Bölüm uzadıkça böcekler hızlanıyor.
- **Böcekler:**
  - Uğur böceği
  - Yanardöner bokböceği
  - Zikzak çizen eşek arısı
  - Boynuzlu geyik böceği
  - Ateş böceği: aniden atılır
  - Örümcek: çizerken seni kovalar
  - Patronlar: Kral Geyik Böceği, Kraliçe Arı, Tarantula
- **Ödüller:** Üzerinden geç ya da alanın içine hapset.
  - ⚡ hızlı çizim
  - ❄️ dondurma
  - 🛡️ kalkan
  - 🐌 yavaşlatma
  - ❤️ +1 can
  - 💥 böcek ilacı
- **Kendi resmin:** Menüden kendi resmini arkaplan yapabilirsin.
- **Kontroller:** Klavye (ok tuşları / WASD), kaydırma ve dokunmatik yön tuşları. Telefon, tablet ve masaüstüne uyumlu.

## Fotoğraflar

Arkaplan fotoğrafları Wikimedia Commons'tan alındı ve özgür lisanslı (CC BY, CC BY-SA, FAL, CC0). Her fotoğrafın sahibi, lisansı ve kaynağı `assets/bg/credits.json` dosyasında ve oyundaki "Fotoğraf künyesi" bölümünde yer alıyor. Fotoğraf yüklenemezse oyun kodla çizilmiş bir yedek sahne gösterir (`js/scenes.js`).

## Yerelde çalıştırma

```bash
python -m http.server 5173
```

## Yayınlama

Statik bir site, derleme adımı yok. Klasörü olduğu gibi GitHub Pages, Netlify, Vercel veya Cloudflare Pages'e yükleyebilirsin.
