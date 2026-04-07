🏥 MedCloud: Tibbi Portal və Kiber-Təhlükəsizlik Laboratoriyası
MedCloud, pasiyentlərin qeydiyyatı, sağlamlıq göstəricilərinin izlənilməsi və admin (həkim) nəzarətini simulyasiya edən müasir bir veb tətbiqdir. Layihə həm Full-Stack development, həm də Penetration Testing (Sızma Testləri) üçün praktiki nümunə rolunu oynayır.

🚀 Layihənin Əsas İmkanları
Pasiyent Portalı: Hər bir pasiyent öz FIN kodu ilə qeydiyyatdan keçir və öz fərdi panelinə daxil olur.

Dinamik Dashboard: Pasiyentlər öz ürək döyüntüsü, təzyiq və digər tibbi məlumatlarını real vaxtda daxil edə və nəticəni ekranda görə bilərlər.

Həkim (Admin) Paneli: Sistem administratoru (və ya baş həkim) bütün pasiyentlərin siyahısını, FIN kodlarını və qan qruplarını mərkəzləşdirilmiş cədvəldə görür.

Dinamik UI: Sistem daxil olan istifadəçini tanıyır, onun adını və avatarını sağ yuxarı küncdə avtomatik göstərir.

🔒 Kiber-Təhlükəsizlik Bölməsi (SQL Injection)
Bu layihənin ən mühüm tərəfi, daxilindəki bilərəkdən yerləşdirilmiş SQL Injection zəifliyidir.

🧨 Zəiflik Nədir?
server.js faylında login prosesi zamanı istifadəçi məlumatları SQL sorğusuna birbaşa (string concatenation) əlavə edilir:

JavaScript
const sql = "SELECT * FROM patients WHERE fin_code = '" + fin + "' AND password = '" + pass + "'";
Bu üsul hücumçulara şifrəni bilmədən bazaya sızmağa imkan verir.

🛠️ Hücum Ssenarisi
Login hissəsində FIN kod yerinə aşağıdakı payload-u yazdıqda:
' OR 1=1 --

Sistem bazadakı ilk istifadəçi (adətən admin) olaraq girişə icazə verir. Çünki 1=1 şərti hər zaman doğrudur və -- işarəsi sorğunun qalan hissəsini (şifrə yoxlanışını) ləğv edir.

✅ Həll Yolu (Təhlükəsiz Kod)
Bu boşluğu bağlamaq üçün Prepared Statements (Parametrləşdirilmiş sorğular) istifadə edilməlidir:

JavaScript
const sql = "SELECT * FROM patients WHERE fin_code = ? AND password = ?";
db.get(sql, [fin, pass], (err, row) => { ... });
🛠️ Texnoloji Struktur (Stack)
Backend: Node.js & Express.js

Verilənlər Bazası: SQLite (Fiziki fayl: medcloud.sqlite)

Frontend: HTML5, CSS3 (Modern UI/UX), JavaScript (Vanilla)

Qrafiklər: Chart.js (Tibbi analizlərin vizuallaşdırılması üçün)

📂 Fayl Strukturu və İzahı
server.js — Layihənin "beyni". Serveri işə salır, bazanı yaradır və API-ları idarə edir.

index.html — Giriş (Login) səhifəsi. Portala giriş qapısıdır.

register.html — Yeni pasiyentlərin qeydiyyat forması.

portal.html — Pasiyentlərin öz göstəricilərini gördüyü və yenilədiyi şəxsi kabinet.

admin.html — Həkimlər üçün bütün bazaya nəzarət paneli.

⚙️ Quraşdırılma Təlimatı
Layihəni öz kompyuterində başlatmaq üçün:

Repository-ni yüklə və qovluğa daxil ol.

Lazımi kitabxanaları yaz:

Bash
npm install express sqlite3
Serveri başlat:

Bash
node server.js
Brauzerdə aç: http://localhost:3000

⚠️ Xəbərdarlıq
Bu tətbiq tədris məqsədlidir. Buradakı SQL Injection boşluğu real saytlarda necə təhlükə yarada biləcəyini göstərmək üçün qoyulub. Real layihələrdə həmişə təhlükəsiz kodlaşdırma standartlarından istifadə edin!
