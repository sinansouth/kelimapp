
import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G6: Record<string, GrammarTopic[]> = {
  'g6u1': [
    {
      title: "Simple Present Tense (Geniş Zaman)",
      content: (
        <div>
          <p>Günlük rutinlerimizi ve alışkanlıklarımızı anlatırız.</p>
          <ul className="list-disc pl-4 space-y-2">
            <li>I <strong>wake up</strong> at 7:00. (Saat 7'de uyanırım.)</li>
            <li>She <strong>goes</strong> to school by bus. (O okula otobüsle gider.)</li>
            <li>We <strong>don't</strong> have breakfast at 6. (Saat 6'da kahvaltı yapmayız.)</li>
          </ul>
        </div>
      )
    },
    {
      title: "Telling the Time & Dates",
      content: (
        <div>
          <p>Saatleri detaylı söyleme:</p>
          <p>It is <strong>quarter past</strong> three. (3'ü çeyrek geçiyor.)</p>
          <p>It is <strong>twenty to</strong> five. (5'e 20 var.)</p>
          <p><strong>Tarihler:</strong> My birthday is on the 1st of June.</p>
        </div>
      )
    }
  ],
  'g6u2': [
    {
      title: "Likes & Dislikes",
      content: (
        <div>
          <p>Yiyecek tercihlerimizi anlatma:</p>
          <p>I <strong>like</strong> cheese and olives.</p>
          <p>She <strong>loves</strong> pancakes.</p>
          <p>He <strong>dislikes/hates</strong> junk food.</p>
          <p><strong>Do you like</strong> milk? Yes, I do.</p>
        </div>
      )
    },
    {
      title: "Yummy / Yuck",
      content: (
        <div>
          <p><strong>Yummy:</strong> Lezzetli (I like it!)</p>
          <p><strong>Yuck:</strong> İğrenç (I don't like it!)</p>
        </div>
      )
    }
  ],
  'g6u3': [
    {
      title: "Present Continuous Tense (Şimdiki Zaman)",
      content: (
        <div>
          <p>Şu anda yapılan eylemleri anlatırız (am/is/are + Ving).</p>
          <p>I <strong>am feeding</strong> the dog now.</p>
          <p>They <strong>are playing</strong> football in the park.</p>
          <p>She <strong>is waiting</strong> for the bus.</p>
        </div>
      )
    },
    {
      title: "Present Continuous vs Simple Present",
      content: (
        <div>
          <p>İki zaman arasındaki fark:</p>
          <p><strong>Genel:</strong> I always drink tea. (Her zaman çay içerim.)</p>
          <p><strong>Şu an:</strong> I am drinking coffee now. (Şu an kahve içiyorum.)</p>
        </div>
      )
    }
  ],
  'g6u4': [
    {
      title: "Weather Conditions",
      content: (
        <div>
          <p>Havayı sormak:</p>
          <p><strong>What is the weather like?</strong></p>
          <p>It is <strong>sunny</strong> and <strong>hot</strong>.</p>
          <p>It is <strong>rainy</strong> and <strong>wet</strong>.</p>
        </div>
      )
    },
    {
      title: "Emotions (Duygular)",
      content: (
        <div>
          <p>Havaya göre hislerimiz:</p>
          <p>I feel <strong>happy</strong> on sunny days.</p>
          <p>I feel <strong>scared</strong> in stormy weather.</p>
          <p>He feels <strong>sleepy</strong> on rainy days.</p>
        </div>
      )
    }
  ],
  'g6u5': [
    {
      title: "Comparatives (Karşılaştırma)",
      content: (
        <div>
          <p>İki şeyi karşılaştırırken sıfatlara <strong>-er</strong> takısı veya başına <strong>more</strong> getiririz.</p>
          <ul className="list-disc pl-4">
            <li>Fast &rarr; Fast<strong>er</strong> (Daha hızlı)</li>
            <li>Big &rarr; Bigg<strong>er</strong> (Daha büyük)</li>
            <li>Exciting &rarr; <strong>More</strong> exciting (Daha heyecanlı)</li>
            <li>Bad &rarr; <strong>Worse</strong> (Daha kötü - Düzensiz)</li>
            <li>Good &rarr; <strong>Better</strong> (Daha iyi - Düzensiz)</li>
          </ul>
          <p>Örnek: The roller coaster is <strong>faster than</strong> the carousel.</p>
        </div>
      )
    }
  ],
  'g6u6': [
    {
      title: "Occupations (Meslekler)",
      content: (
        <div>
          <p>Mesleklerin ne yaptığını anlatma:</p>
          <p>A teacher <strong>teaches</strong> students.</p>
          <p>A mechanic <strong>repairs</strong> cars.</p>
          <p>A doctor <strong>examines</strong> patients.</p>
        </div>
      )
    },
    {
      title: "Can (Yetenek)",
      content: (
        <div>
          <p>Mesleklerin yapabildikleri:</p>
          <p>A cook <strong>can</strong> cook delicious meals.</p>
          <p>A driver <strong>can</strong> drive cars and buses.</p>
        </div>
      )
    }
  ],
  'g6u7': [
    {
      title: "Simple Past Tense (Geçmiş Zaman - Düzenli)",
      content: (
        <div>
          <p>Geçmişte yaşanan olayları anlatırız. Düzenli fiiller <strong>-ed</strong> takısı alır.</p>
          <p>I <strong>played</strong> football yesterday.</p>
          <p>We <strong>visited</strong> the museum last week.</p>
        </div>
      )
    },
    {
      title: "Simple Past Tense (Düzensiz)",
      content: (
        <div>
          <p>Bazı fiiller tamamen değişir.</p>
          <ul className="list-disc pl-4">
            <li>Go &rarr; <strong>Went</strong> (Gitti)</li>
            <li>Swim &rarr; <strong>Swam</strong> (Yüzdü)</li>
            <li>Eat &rarr; <strong>Ate</strong> (Yedi)</li>
            <li>See &rarr; <strong>Saw</strong> (Gördü)</li>
          </ul>
        </div>
      )
    }
  ],
  'g6u8': [
    {
      title: "Prepositions of Place",
      content: (
        <div>
          <p>Nesnelerin yerini detaylı tarif etme:</p>
          <ul className="list-disc pl-4">
            <li><strong>Between:</strong> Arasında</li>
            <li><strong>In front of:</strong> Önünde</li>
            <li><strong>Behind:</strong> Arkasında</li>
            <li><strong>Next to:</strong> Bitişiğinde</li>
            <li><strong>Near:</strong> Yakınında</li>
          </ul>
          <p>The cat is <strong>under</strong> the table.</p>
        </div>
      )
    }
  ],
  'g6u9': [
    {
      title: "Should / Shouldn't (Tavsiye/Gereklilik)",
      content: (
        <div>
          <p>Çevreyi korumak için öneriler:</p>
          <p>We <strong>should</strong> recycle glass and paper. (Geri dönüştürmeliyiz.)</p>
          <p>We <strong>should</strong> use public transport.</p>
          <p>We <strong>shouldn't</strong> pollute the water. (Kirletmemeliyiz.)</p>
          <p>We <strong>shouldn't</strong> cut down trees.</p>
        </div>
      )
    }
  ],
  'g6u10': [
    {
      title: "Simple Past Tense (Revision)",
      content: (
        <div>
          <p>Seçim süreçlerini anlatırken geçmiş zaman kullanılır.</p>
          <p>He <strong>became</strong> a candidate.</p>
          <p>We <strong>voted</strong> for him.</p>
          <p>She <strong>won</strong> the election.</p>
        </div>
      )
    }
  ]
};
