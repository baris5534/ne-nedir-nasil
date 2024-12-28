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
      <CodeScreen title="Terminal" code="? Select a framework: › - Use arrow-keys. Return to submit.
❯   Vanilla
    Vue
    React
    Preact
    Lit
    Svelte
    Solid
    Qwik
    Angular
    Others" />
    <p>Karşımıza bu seçenekler çıkar. Burada kullanıcağımız dili seçiyoruz.</p>
    <CodeScreen title="Terminal" code="✔ Select a framework: › React
? Select a variant: › - Use arrow-keys. Return to submit.
❯   TypeScript
    TypeScript + SWC
    JavaScript
    JavaScript + SWC
    React Router v7 ↗" />
    <p>Bu adımda ise react'ı hangi dil seçeneği ile kullanacağımızı seçiyoruz. Seçtikten sonra projemiz kurulmuş oluyor.</p>
    <CodeScreen title="Terminal" code="Done. Now run:

  cd proje-ismi
  npm install
  npm run dev"/>
<p>Bu son adımımızda projemizi çalıştırmak için gerekli komutları çalıştırıyoruz.
  Artık projemiz hazır ve çalışır durumda.
</p>


    </div>

  );
}
