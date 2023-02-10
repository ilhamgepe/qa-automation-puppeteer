# qa-automation-puppeteer
automation test purwantara dengan [puppeteer](https://pptr.dev/) & [whatsapp-web.js](https://wwebjs.dev/)

## fitur
- login.
- buat paymentlink.
- buat semua channel yang aktif.
- kirim error dengan whatsapp.

# setup
1. clone repo ini.
2. edit .env, change *chatID*, *email*, *password* dengan akun mu.pastikan jika kirim ke personal, ganti chatID dengan 62xxx atau bisa oprek sendiri pake slice
3. jalankan ``npm run i Or yarn add`` untuk memasang semua package yang di butuhkan.
4. jalankan ``npm run wa`` di terminal pertama, untuk menjalankan whatsapp. agar kita bisa kirim pesan setelah selesai menjalankan test.
5. untuk pertama kali nanti akan muncul scan QR untuk login whatsapp. tunggu sampai selesai memang rada lama untuk mendapatkan QR nya. lalu scan dengan aplikasi whatsapp
6. mohon tunggu sampai whatsapp client sudah ready, agar dapat mengirim pesan ketika sudah selesai menjalankan test.
7. lalu untuk menjalankan test, jalankan ``npm run start``.



jika tidak setelah scan ada error ``Error: Evaluation failed: TypeError: Cannot read properties of undefined (reading 'queryExists')``
pergi ke node_modules\whatsapp-web.js\src\util\Injected.js
search ``window.Store.QueryExist``
original = ``window.Store.QueryExist = window.mR.findModule('queryExists')[0].queryExists;``
edited = ``window.Store.QueryExist = window.mR.findModule('queryExists')[0]?.queryExists;``

![image](https://user-images.githubusercontent.com/67534909/218006751-ee4cf742-fcf0-4607-95d5-b536773a4bc3.png)
