import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G4: Record<string, GrammarTopic[]> = {
  'g4u1': [
    {
      title: "Imperatives (Emir Kipleri)",
      content: (
        <div>
          <p>Sınıf kurallarını söylerken fiili cümlenin başında kullanırız.</p>
          <ul className="list-disc pl-4 mt-2">
            <li><strong>Open</strong> the window. (Pencereyi aç.)</li>
            <li><strong>Close</strong> the door. (Kapıyı kapat.)</li>
            <li><strong>Clean</strong> the board. (Tahtayı temizle.)</li>
            <li><strong>Be</strong> quiet. (Sessiz ol.)</li>
          </ul>
          <p className="mt-2 text-sm text-slate-500">Kibar olmak için sonuna "please" ekleyebiliriz: "Open the door, please."</p>
        </div>
      )
    },
    {
      title: "Numbers (Sayılar)",
      content: (
        <div>
          <p>1'den 50'ye kadar sayıları öğreniyoruz.</p>
          <p>10 - ten, 20 - twenty, 30 - thirty, 40 - forty, 50 - fifty.</p>
          <p>21 - twenty-one, 35 - thirty-five.</p>
        </div>
      )
    }
  ],
  'g4u2': [
    {
      title: "Where are you from?",
      content: (
        <div>
          <p>Birinin ülkesini sormak için:</p>
          <p className="font-bold">Where are you from?</p>
          <p>I am from <strong>Turkey</strong>. (Ben Türkiye'denim.)</p>
          <p>He is from <strong>Japan</strong>. (O Japonya'dan.)</p>
        </div>
      )
    },
    {
      title: "Nationality (Milliyet)",
      content: (
        <div>
          <p>Milliyetimizi söylerken:</p>
          <p>I am <strong>Turkish</strong>. (Ben Türküm.)</p>
          <p>She is <strong>German</strong>. (O Alman.)</p>
          <p>They are <strong>English</strong>. (Onlar İngiliz.)</p>
        </div>
      )
    }
  ],
  'g4u3': [
    {
      title: "Can / Can't (Yetenek)",
      content: (
        <div>
          <p>Yapabildiklerimiz için 'Can', yapamadıklarımız için 'Can't' kullanırız.</p>
          <p className="text-green-600">I <strong>can</strong> swim. (Yüzebilirim.)</p>
          <p className="text-green-600">A bird <strong>can</strong> fly. (Bir kuş uçabilir.)</p>
          <p className="text-red-600">I <strong>can't</strong> drive a car. (Araba süremem.)</p>
          <p className="text-red-600">A fish <strong>can't</strong> run. (Bir balık koşamaz.)</p>
        </div>
      )
    },
    {
      title: "Possessive Adjectives (Sahiplik)",
      content: (
        <div>
          <p><strong>My:</strong> Benim (My guitar)</p>
          <p><strong>Your:</strong> Senin (Your bike)</p>
          <p><strong>His:</strong> Onun - Erkek (His car)</p>
          <p><strong>Her:</strong> Onun - Kadın (Her doll)</p>
        </div>
      )
    }
  ],
  'g4u4': [
    {
      title: "Like / Don't Like",
      content: (
        <div>
          <p>Sevdiğimiz ve sevmediğimiz aktiviteleri anlatırken:</p>
          <p>I <strong>like</strong> reading comics. (Çizgi roman okumayı severim.)</p>
          <p>I <strong>don't like</strong> watching cartoons. (Çizgi film izlemeyi sevmem.)</p>
          <br/>
          <p><strong>Soru:</strong> Do you like swimming?</p>
          <p><strong>Cevap:</strong> Yes, I do. / No, I don't.</p>
        </div>
      )
    }
  ],
  'g4u5': [
    {
      title: "Telling the Time (Saatler)",
      content: (
        <div>
          <p>Saati sormak için: <strong>What time is it?</strong></p>
          <ul className="list-disc pl-4">
            <li>Tam saatler: It is seven <strong>o'clock</strong>. (Saat 7.)</li>
            <li>Buçuklu saatler: It is <strong>half past</strong> eight. (Saat 8 buçuk.)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Daily Routines (Günlük Rutin)",
      content: (
        <div>
          <p>Geniş zamanda günlük işlerimizi anlatırız.</p>
          <p>I <strong>wake up</strong> at 7 o'clock.</p>
          <p>I <strong>wash</strong> my face.</p>
          <p>I <strong>go</strong> to school.</p>
        </div>
      )
    }
  ],
  'g4u6': [
    {
      title: "Prepositions of Place (Yer Edatları)",
      content: (
        <div>
          <p>Nesnelerin yerini tarif etmek için:</p>
          <ul className="list-disc pl-4 mt-2">
            <li><strong>In:</strong> İçinde</li>
            <li><strong>On:</strong> Üstünde</li>
            <li><strong>Under:</strong> Altında</li>
            <li><strong>Behind:</strong> Arkasında</li>
            <li><strong>In front of:</strong> Önünde</li>
            <li><strong>Near:</strong> Yanında/Yakınında</li>
          </ul>
        </div>
      )
    },
    {
      title: "Where is...? (Nerede?)",
      content: (
        <div>
          <p>Where is the brush?</p>
          <p>It is <strong>in</strong> the glass.</p>
        </div>
      )
    }
  ],
  'g4u7': [
    {
      title: "Jobs (Meslekler)",
      content: (
        <div>
          <p>Birinin mesleğini sormak için:</p>
          <p className="font-bold">What is your job?</p>
          <p>I am a <strong>teacher</strong>. (Ben bir öğretmenim.)</p>
          <p>He is a <strong>doctor</strong>. (O bir doktordur.)</p>
        </div>
      )
    },
    {
      title: "What does he/she do?",
      content: (
        <div>
          <p>Mesleklerin ne iş yaptığını anlatırken:</p>
          <p>A vet helps animals. (Veteriner hayvanlara yardım eder.)</p>
          <p>A chef cooks food. (Aşçı yemek pişirir.)</p>
        </div>
      )
    }
  ],
  'g4u8': [
    {
      title: "Seasons (Mevsimler)",
      content: (
        <div>
          <p>Dört mevsimi öğreniyoruz:</p>
          <ul className="list-disc pl-4">
            <li><strong>Summer:</strong> Yaz (It is hot and sunny.)</li>
            <li><strong>Winter:</strong> Kış (It is cold and snowy.)</li>
            <li><strong>Spring:</strong> İlkbahar (It is warm.)</li>
            <li><strong>Autumn (Fall):</strong> Sonbahar (It is cool and windy.)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Clothes (Kıyafetler)",
      content: (
        <div>
          <p>Hava durumuna göre giydiklerimiz:</p>
          <p>In summer, I wear a <strong>t-shirt</strong>.</p>
          <p>In winter, I wear a <strong>coat</strong> and <strong>boots</strong>.</p>
        </div>
      )
    }
  ],
  'g4u9': [
    {
      title: "Have got / Has got (Dış Görünüş)",
      content: (
        <div>
          <p>İnsanların fiziksel özelliklerini anlatırken:</p>
          <p>I <strong>have got</strong> blue eyes.</p>
          <p>She <strong>has got</strong> long hair.</p>
          <p>He <strong>has got</strong> a moustache.</p>
        </div>
      )
    },
    {
      title: "Adjectives (Sıfatlar)",
      content: (
        <div>
          <p>Kişileri tarif ederken kullandığımız sıfatlar:</p>
          <p>Tall (uzun) - Short (kısa)</p>
          <p>Old (yaşlı) - Young (genç)</p>
          <p>Slim (zayıf) - Fat (şişman)</p>
        </div>
      )
    }
  ],
  'g4u10': [
    {
      title: "Offers (Teklifler)",
      content: (
        <div>
          <p>Bir şey istemek veya teklif etmek için <strong>Would you like...?</strong> kalıbı kullanılır.</p>
          <p className="font-bold">Would you like some milk?</p>
          <p>Yes, please. (Evet, lütfen.)</p>
          <p>No, thanks. I am full. (Hayır, teşekkürler. Tokum.)</p>
        </div>
      )
    },
    {
      title: "Food & Drinks",
      content: (
        <div>
          <p>Maybe (Belki), Yummy (Lezzetli), Hungry (Aç), Thirsty (Susamış).</p>
          <p>I am hungry. I want some pizza.</p>
          <p>I am thirsty. Can I have water?</p>
        </div>
      )
    }
  ]
};