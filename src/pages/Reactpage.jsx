import CodeScreen from "../components/Codescreen";
export default function Reactpage() {
  return (
    <div className="text-white space-y-4">
      <h1 className="text-xl font-bold">React Nedir</h1>
      <p>
        React, kullanıcı ara yüzleri (UI) oluşturmak için kullanılan popüler bir
        JavaScript kütüphanesidir. Facebook tarafından geliştirilmiş ve açık
        kaynak olarak sunulmuştur. React’ın temel özellikleri: Bileşen Tabanlı
        Mimari: React, uygulamaları küçük, yeniden kullanılabilir bileşenlerden
        oluşturmayı kolaylaştırır. Virtual DOM: Performansı artırmak için DOM
        manipülasyonlarını optimize eder. Tek Yönlü Veri Akışı: Verilerin bir
        yönde (parent → child) akması, uygulamaların daha öngörülebilir olmasını
        sağlar. Deklaratif Yapı: Kullanıcı arayüzleri nasıl görünmesi
        gerektiğini tanımlarsınız ve React değişiklikleri otomatik olarak
        yönetir. React, modern web uygulamaları geliştirmeyi hızlı, dinamik ve
        esnek hale getirir. Özellikle SPA (Single Page Application) projelerinde
        sıkça kullanılır.
      </p>
      <h2 className="text-xl font-bold">React Projesi Nasıl Oluşturulur?</h2>
      <CodeScreen title="Terminal" code=" npm create vite@latest proje-ismi" />
      <p>
        Projelerimizi <b>vite</b> ile kurmak daha sağlıklıdır. Çünkü vite
        projelerimizi hızlandırır ve çoğu framework de bunu destekler.
      </p>
    </div>
  );
}
