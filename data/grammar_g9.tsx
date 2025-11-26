
import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G9: Record<string, GrammarTopic[]> = {
  'g9u1': [
    {
      title: "Verb 'to be' (Am/Is/Are)",
      content: (
        <div>
          <p>Olmak fiili: İsim cümlelerinde kullanılır.</p>
          <p>I <strong>am</strong> a student.</p>
          <p>She <strong>is</strong> from Italy.</p>
          <p>They <strong>are</strong> happy.</p>
        </div>
      )
    },
    {
      title: "Subject Pronouns & Possessive Adjectives",
      content: (
        <div>
          <p>I - My (Ben - Benim)</p>
          <p>You - Your (Sen - Senin)</p>
          <p>He - His (O - Onun)</p>
          <p>She - Her (O - Onun)</p>
          <p>It - Its (O - Onun)</p>
          <p>We - Our (Biz - Bizim)</p>
          <p>They - Their (Onlar - Onların)</p>
        </div>
      )
    },
    {
      title: "Have got / Has got",
      content: (
        <div>
          <p>Sahiplik bildirir.</p>
          <p>I <strong>have got</strong> a computer.</p>
          <p>She <strong>has got</strong> blue eyes.</p>
        </div>
      )
    }
  ],
  'g9u2': [
    {
      title: "Prepositions of Place",
      content: (
        <div>
          <p>Yer edatları (In, On, At, Under, Next to, Behind, Between, In front of, Opposite).</p>
          <p>The bank is <strong>opposite</strong> the park.</p>
          <p>The books are <strong>on</strong> the shelf.</p>
        </div>
      )
    },
    {
      title: "Imperatives (Yön Tarifi)",
      content: (
        <div>
          <p>Go straight ahead. (Düz git.)</p>
          <p>Turn left. (Sola dön.)</p>
          <p>Take the second right. (İkinci sağdan dön.)</p>
        </div>
      )
    },
    {
      title: "Comparatives",
      content: (
        <div>
          <p>Şehirleri ve yerleri karşılaştırma:</p>
          <p>Istanbul is <strong>more crowded than</strong> Ankara.</p>
          <p>A village is <strong>quieter than</strong> a city.</p>
        </div>
      )
    }
  ],
  'g9u3': [
    {
      title: "Simple Present Tense",
      content: (
        <div>
          <p>Genel doğrular, alışkanlıklar ve film konuları anlatılırken.</p>
          <p>I <strong>watch</strong> movies every Friday.</p>
          <p>She <strong>likes</strong> action films.</p>
        </div>
      )
    },
    {
      title: "Adverbs of Frequency",
      content: (
        <div>
          <p>Always, usually, often, sometimes, rarely, never.</p>
          <p>I <strong>never</strong> watch horror movies.</p>
          <p>She <strong>usually</strong> goes to the cinema.</p>
        </div>
      )
    },
    {
      title: "Making Suggestions",
      content: (
        <div>
          <p>Let's watch a comedy.</p>
          <p>Shall we go to the cinema?</p>
          <p>Why don't we eat popcorn?</p>
        </div>
      )
    }
  ],
  'g9u4': [
    {
      title: "Adverbs of Manner",
      content: (
        <div>
          <p>Eylemin nasıl yapıldığını anlatır (Sıfat + ly).</p>
          <p>Slow &rarr; <strong>Slowly</strong> (Yavaşça)</p>
          <p>Careful &rarr; <strong>Carefully</strong> (Dikkatlice)</p>
          <p>Good &rarr; <strong>Well</strong> (İyi - Düzensiz)</p>
          <p>She speaks English <strong>fluently</strong>.</p>
        </div>
      )
    },
    {
      title: "Present Continuous vs Simple Present",
      content: (
        <div>
          <p>Doğal yaşamı ve şu anki durumu anlatırken:</p>
          <p>People <strong>are destroying</strong> the forests (Şu anki süreç).</p>
          <p>Trees <strong>give</strong> us oxygen (Genel gerçek).</p>
        </div>
      )
    }
  ],
  'g9u5': [
    {
      title: "Present Continuous Tense (Şimdiki Zaman)",
      content: (
        <div>
          <p>Şu an olan olaylar (am/is/are + Ving).</p>
          <p>I <strong>am studying</strong> now.</p>
          <p>He <strong>is sleeping</strong> at the moment.</p>
        </div>
      )
    },
    {
      title: "Describing People (Physical & Personality)",
      content: (
        <div>
          <p>She <strong>is</strong> tall and slim.</p>
          <p>He <strong>has got</strong> short dark hair.</p>
          <p>She is very <strong>generous</strong>.</p>
        </div>
      )
    }
  ],
  'g9u6': [
    {
      title: "Present Continuous for Future",
      content: (
        <div>
          <p>Gelecek zaman anlamında şimdiki zaman (Planlanmış eylemler).</p>
          <p>I <strong>am flying</strong> to London tomorrow.</p>
          <p>We <strong>are visiting</strong> the museum next week.</p>
        </div>
      )
    },
    {
      title: "Question Tags",
      content: (
        <div>
          <p>Değil mi? anlamı katar.</p>
          <p>You are Turkish, <strong>aren't you?</strong></p>
          <p>She isn't coming, <strong>is she?</strong></p>
        </div>
      )
    }
  ],
  'g9u7': [
    {
      title: "Simple Past Tense (Was/Were)",
      content: (
        <div>
          <p>Geçmiş zamanın isim cümleleri.</p>
          <p>I <strong>was</strong> in Ephesus yesterday.</p>
          <p>The pyramids <strong>were</strong> amazing.</p>
        </div>
      )
    },
    {
      title: "Simple Past Tense (Regular Verbs)",
      content: (
        <div>
          <p>Düzenli fiiller -ed alır.</p>
          <p>We <strong>visited</strong> the museum.</p>
          <p>They <strong>lived</strong> in ancient times.</p>
        </div>
      )
    },
    {
      title: "Simple Past Tense (Irregular Verbs)",
      content: (
        <div>
          <p>Go &rarr; Went, See &rarr; Saw, Build &rarr; Built.</p>
          <p>He <strong>built</strong> a castle.</p>
        </div>
      )
    }
  ],
  'g9u8': [
    {
      title: "Should / Shouldn't / Must / Mustn't",
      content: (
        <div>
          <p>Tavsiye ve zorunluluklar.</p>
          <p>You <strong>should</strong> see a doctor. (Tavsiye)</p>
          <p>You <strong>must</strong> fasten your seatbelt. (Zorunluluk)</p>
        </div>
      )
    },
    {
      title: "Have to / Has to",
      content: (
        <div>
          <p>Dış kaynaklı zorunluluklar.</p>
          <p>She <strong>has to</strong> wear a uniform.</p>
        </div>
      )
    }
  ],
  'g9u9': [
    {
      title: "Future Tense (Be going to)",
      content: (
        <div>
          <p>Planlanmış gelecek zaman.</p>
          <p>I <strong>am going to</strong> have a party.</p>
          <p>She <strong>is going to</strong> invite her friends.</p>
        </div>
      )
    },
    {
      title: "Making Invitations",
      content: (
        <div>
          <p>Would you like to come?</p>
          <p>Why don't you join us?</p>
        </div>
      )
    }
  ],
  'g9u10': [
    {
      title: "Superlatives",
      content: (
        <div>
          <p>En üstünlük derecesi.</p>
          <p>The <strong>best</strong> movie.</p>
          <p>The <strong>most interesting</strong> show.</p>
        </div>
      )
    },
    {
      title: "Quantifiers (A lot of, some, a little)",
      content: (
        <div>
          <p>Miktar belirtme.</p>
          <p>There is <strong>a lot of</strong> news.</p>
          <p>I have <strong>a little</strong> time.</p>
        </div>
      )
    }
  ]
};
