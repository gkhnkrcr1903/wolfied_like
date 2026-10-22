# Draw and See

Volfied tarzı bir bulmaca oyunu: ekranı çiz, böcekleri tuzağa düşür, gizli resmi ortaya çıkar.

- 10 bölüm var ve kolaydan zora gidiyor. Her bölümde böcek sayısı, hız ve kenar kıvılcımları artıyor; hedef yüzde de %70'ten %85'e çıkıyor.
- Arkaplanlar kodla çizilen sahneler (`js/scenes.js`), bu yüzden harici resim dosyası gerekmiyor.
- Menüden kendi resmini arkaplan olarak yükleyebilirsin.
- Klavye (ok tuşları / WASD), kaydırma ve dokunmatik yön tuşlarıyla oynanıyor. Telefon, tablet ve masaüstüne uyumlu.

## Yerelde çalıştırma

```bash
python -m http.server 5173
```

## Yayınlama

Statik bir site, derleme adımı yok. Klasörü olduğu gibi Netlify, Vercel, GitHub Pages veya Cloudflare Pages'e yükleyebilirsin.
