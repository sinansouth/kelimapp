
import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G3: Record<string, GrammarTopic[]> = {
  'g3u1': [
    { 
      title: "Greeting & Meeting (Selamlaşma)", 
      content: (
        <div>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Hello / Hi:</strong> Merhaba</li>
            <li><strong>Good morning:</strong> Günaydın</li>
            <li><strong>Good afternoon:</strong> Tünaydın</li>
            <li><strong>Good evening:</strong> İyi akşamlar</li>
            <li><strong>Have a nice day:</strong> İyi günler</li>
          </ul>
        </div>
      )
    },
    {
      title: "What is your name?",
      content: (
        <div>
          <p><strong>Soru:</strong> What is your name? (Adın ne?)</p>
          <p><strong>Cevap:</strong> My name is Ali. / I am Ali.</p>
          <br/>
          <p><strong>Soru:</strong> How are you? (Nasılsın?)</p>
          <p><strong>Cevap:</strong> I am fine, thanks. (İyiyim, teşekkürler.)</p>
        </div>
      ) 
    }
  ],
  'g3u2': [
    {
      title: "This is... (Bu...)",
      content: (
        <div>
          <p>Aile bireylerini tanıtırken:</p>
          <p><strong>This is</strong> my mother. (Bu benim annem.)</p>
          <p><strong>This is</strong> my brother. (Bu benim erkek kardeşim.)</p>
        </div>
      )
    },
    {
      title: "Who is he/she?",
      content: (
        <div>
          <p>Birinin kim olduğunu sorarken:</p>
          <ul className="list-disc pl-4 space-y-2">
            <li>Erkekler için: <strong>Who is he?</strong> (O kim?) <br/> &rarr; <strong>He is</strong> my father.</li>
            <li>Kadınlar için: <strong>Who is she?</strong> (O kim?) <br/> &rarr; <strong>She is</strong> my sister.</li>
          </ul>
        </div>
      )
    }
  ],
  'g3u3': [
    { 
      title: "Can / Can't (Yetenekler)", 
      content: (
        <div>
          <p>Yapabildiklerimiz için <strong>can</strong>, yapamadıklarımız için <strong>can't</strong> kullanırız.</p>
          <p className="text-green-600">I <strong>can</strong> swim. (Yüzebilirim.)</p>
          <p className="text-green-600">She <strong>can</strong> run fast. (O hızlı koşabilir.)</p>
          <p className="text-red-600">I <strong>can't</strong> fly. (Uçamam.)</p>
          <p className="text-red-600">He <strong>can't</strong> play the guitar. (O gitar çalamaz.)</p>
        </div>
      ) 
    }
  ],
  'g3u4': [
    { 
      title: "Feelings (Hisler)", 
      content: (
        <div>
          <p>Nasıl hissettiğimizi anlatırken:</p>
          <p><strong>I am</strong> happy. (Mutluyum.)</p>
          <p><strong>I am</strong> sad. (Üzgünüm.)</p>
          <p><strong>I am</strong> tired. (Yorgunum.)</p>
          <br/>
          <p><strong>Soru:</strong> Are you okay? (İyi misin?)</p>
          <p><strong>Cevap:</strong> Yes, I am. / No, I am not.</p>
        </div>
      ) 
    }
  ],
  'g3u5': [
    { 
      title: "Have got / Has got (Sahiplik)", 
      content: (
        <div>
          <p>Sahip olduğumuz oyuncakları anlatırken:</p>
          <p><strong>I have got</strong> a ball. (Bir topum var.)</p>
          <p><strong>She has got</strong> a doll. (Onun bir bebeği var.)</p>
          <p><strong>He has got</strong> a car. (Onun bir arabası var.)</p>
          <br/>
          <p><strong>Soru:</strong> Have you got a kite? (Uçurtman var mı?)</p>
          <p><strong>Cevap:</strong> Yes, I have. / No, I haven't.</p>
        </div>
      ) 
    },
    {
      title: "Renkler ve Şekiller",
      content: (
        <div>
          <p>It is a <strong>red</strong> ball. (O kırmızı bir toptur.)</p>
          <p>It is a <strong>round</strong> box. (O yuvarlak bir kutudur.)</p>
        </div>
      )
    }
  ],
  'g3u6': [
    { 
      title: "Prepositions (Yer Edatları)", 
      content: (
        <div>
          <p>Nesnelerin nerede olduğunu anlatırken:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>In:</strong> İçinde &rarr; The ball is <strong>in</strong> the box.</li>
            <li><strong>On:</strong> Üstünde &rarr; The cat is <strong>on</strong> the chair.</li>
            <li><strong>Under:</strong> Altında &rarr; The bag is <strong>under</strong> the table.</li>
          </ul>
        </div>
      ) 
    },
    {
      title: "Where is...? (Nerede?)",
      content: (
        <div>
          <p><strong>Soru:</strong> Where is the book? (Kitap nerede?)</p>
          <p><strong>Cevap:</strong> It is on the desk. (Sıranın üzerinde.)</p>
        </div>
      )
    }
  ],
  'g3u7': [
    { 
      title: "Where are you now? (Şu an neredesin?)", 
      content: (
        <div>
          <p>Bulunduğumuz yeri söylerken:</p>
          <p>I am <strong>at school</strong>. (Okuldayım.)</p>
          <p>She is <strong>at home</strong>. (O evde.)</p>
          <p>We are <strong>in the classroom</strong>. (Sınıftayız.)</p>
          <p>He is <strong>at the hospital</strong>. (O hastanede.)</p>
        </div>
      ) 
    }
  ],
  'g3u8': [
    { 
      title: "Transportation (Ulaşım)", 
      content: (
        <div>
          <p>Araçlardan bahsederken:</p>
          <p>It is a <strong>car</strong>. (O bir arabadır.)</p>
          <p>The <strong>bus</strong> is big. (Otobüs büyüktür.)</p>
          <p>The <strong>plane</strong> is fast. (Uçak hızlıdır.)</p>
        </div>
      ) 
    },
    {
      title: "Where is the...? (Konum)",
      content: (
        <div>
          <p>Where is the car? (Araba nerede?)</p>
          <p>It is <strong>here</strong>. (Burada.)</p>
          <p>It is <strong>there</strong>. (Orada.)</p>
        </div>
      )
    }
  ],
  'g3u9': [
    { 
      title: "Weather (Hava Durumu)", 
      content: (
        <div>
          <p>Havayı sormak için:</p>
          <p className="font-bold">How is the weather?</p>
          <p>It is <strong>sunny</strong>. (Güneşli.)</p>
          <p>It is <strong>rainy</strong>. (Yağmurlu.)</p>
          <p>It is <strong>cold</strong>. (Soğuk.)</p>
          <p>It is <strong>hot</strong>. (Sıcak.)</p>
        </div>
      ) 
    }
  ],
  'g3u10': [
    { 
      title: "Colors & Nature (Doğa ve Renkler)", 
      content: (
        <div>
          <p>Hayvanları ve renklerini tarif etme:</p>
          <p>The frog is <strong>green</strong>. (Kurbağa yeşildir.)</p>
          <p>The elephant is <strong>grey</strong> and <strong>big</strong>. (Fil gri ve büyüktür.)</p>
          <p>The ladybird is <strong>red</strong>. (Uğur böceği kırmızıdır.)</p>
        </div>
      ) 
    },
    {
      title: "Like / Don't Like (Hayvanlar)",
      content: (
        <div>
          <p>I like <strong>dogs</strong>. (Köpekleri severim.)</p>
          <p>I don't like <strong>snakes</strong>. (Yılanları sevmem.)</p>
        </div>
      )
    }
  ]
};
