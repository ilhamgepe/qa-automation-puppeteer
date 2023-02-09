# qa-automation-puppeteer
automation test purwantara dengan [puppeteer](https://pptr.dev/) & [whatsapp-web.js](https://wwebjs.dev/)

## fitur
- login
- buat paymentlink
- buat semua channel yang aktif
- kirim error dengan whatsapp

# setup
1. clone repo ini
2. edit .env, change *chatID*, *email*, *password* dengan akun mu
3. jalankan ``npm run i Or yarn add`` untuk memasang semua package yang di butuhkan
4. jalankan ``npm run wa`` di terminal pertama, untuk menjalankan whatsapp. agar kita bisa kirim pesan setelah selesai menjalankan test
5. mohon tunggu sampai whatsapp client sudah ready, agar dapat mengirim pesan ketika sudah selesai menjalankan test
6. lalu untuk menjalankan test, jalankan ``npm run start``.

   
