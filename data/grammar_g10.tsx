import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G10: Record<string, GrammarTopic[]> = {
  'g10u1': [
    {
      title: "Simple Present vs. Present Continuous",
      content: (
        <div>
          <p>Genel alışkanlıklar ile şu an yapılan eylemlerin karşılaştırılması.</p>
          <p><strong>Simple Present:</strong> I <em>usually</em> <strong>wake up</strong> at 7.</p>
          <p><strong>Present Continuous:</strong> I <strong>am studying</strong> <em>now</em>.</p>
        </div>
      )
    },
    {
      title: "Stative Verbs",
      content: (
        <div>
          <p>Durum bildiren ve genellikle -ing almayan fiiller (like, love, hate, know, understand, believe).</p>
          <p><strong>Doğru:</strong> I <strong>know</strong> the answer.</p>
          <p><strong>Yanlış:</strong> I am knowing the answer.</p>
        </div>
      )
    }
  ],
  'g10u2': [
    {
      title: "Future Plans (Be going to)",
      content: (
        <div>
          <p>Önceden planlanmış eylemler için kullanılır.</p>
          <p>I <strong>am going to</strong> visit my grandparents this weekend.</p>
          <p>We <strong>are going to</strong> meet at the cinema.</p>
        </div>
      )
    },
    {
      title: "Future (Will)",
      content: (
        <div>
          <p>Konuşma anında verilen kararlar ve tahminler için kullanılır.</p>
          <p>I think it <strong>will</strong> rain.</p>
          <p>I <strong>will</strong> help you.</p>
        </div>
      )
    }
  ],
  'g10u3': [
    {
      title: "Simple Past Tense",
      content: (
        <div>
          <p>Geçmişte tamamlanmış eylemler.</p>
          <p>Atatürk <strong>founded</strong> the Turkish Republic.</p>
          <p>He <strong>was</strong> a great leader.</p>
        </div>
      )
    },
    {
      title: "Past Continuous Tense",
      content: (
        <div>
          <p>Geçmişte belli bir süre devam etmiş eylemler (was/were + Ving).</p>
          <p>I <strong>was reading</strong> a book at 8 pm yesterday.</p>
          <p>They <strong>were fighting</strong> in the war.</p>
        </div>
      )
    }
  ],
  'g10u4': [
    {
      title: "Used to",
      content: (
        <div>
          <p>Geçmişte yapılan ama artık yapılmayan alışkanlıklar.</p>
          <p>People <strong>used to</strong> travel on horses.</p>
          <p>I <strong>used to</strong> play with dolls when I was a child.</p>
        </div>
      )
    },
    {
      title: "Simple Past vs Used to",
      content: (
        <div>
          <p>Tek seferlik olaylar için Simple Past, alışkanlıklar için Used to.</p>
        </div>
      )
    }
  ],
  'g10u5': [
    {
      title: "Present Perfect Tense",
      content: (
        <div>
          <p>Geçmişte başlamış, etkisi devam eden veya zamanı belirsiz eylemler (have/has + V3).</p>
          <p>I <strong>have visited</strong> London.</p>
          <p>She <strong>has bought</strong> a ticket.</p>
        </div>
      )
    },
    {
      title: "Ever / Never / Just / Already / Yet",
      content: (
        <div>
          <p><strong>Ever:</strong> Hiç (Have you ever...?)</p>
          <p><strong>Never:</strong> Asla (I have never...)</p>
          <p><strong>Just:</strong> Henüz (I have just finished.)</p>
          <p><strong>Already:</strong> Çoktan (I have already done it.)</p>
          <p><strong>Yet:</strong> Henüz (I haven't finished yet.)</p>
        </div>
      )
    }
  ],
  'g10u6': [
    {
      title: "Modals of Advice (Should / Ought to / Had better)",
      content: (
        <div>
          <p>Tavsiye verirken kullanılır.</p>
          <p>You <strong>should</strong> study hard.</p>
          <p>You <strong>ought to</strong> be careful.</p>
          <p>You <strong>had better</strong> see a doctor (yoksa kötü olur).</p>
        </div>
      )
    },
    {
      title: "If Clause Type 1",
      content: (
        <div>
          <p>Gerçekleşmesi muhtemel durumlar.</p>
          <p>If you <strong>study</strong>, you <strong>will pass</strong> the exam.</p>
        </div>
      )
    }
  ],
  'g10u7': [
    {
      title: "Passive Voice (Present)",
      content: (
        <div>
          <p>Eylemi yapanın değil, yapılan işin önemli olduğu durumlar (am/is/are + V3).</p>
          <p>Turkish delight <strong>is served</strong> with coffee.</p>
          <p>Festivals <strong>are celebrated</strong> every year.</p>
        </div>
      )
    },
    {
      title: "Passive Voice (Past)",
      content: (
        <div>
          <p>was/were + V3</p>
          <p>The telephone <strong>was invented</strong> by Bell.</p>
        </div>
      )
    }
  ],
  'g10u8': [
    {
      title: "Relative Clauses (Defining)",
      content: (
        <div>
          <p>Niteleme cümlecikleri.</p>
          <ul className="list-disc pl-4">
            <li><strong>Who:</strong> İnsanlar için (The man <strong>who</strong> works here...)</li>
            <li><strong>Which:</strong> Nesneler için (The phone <strong>which</strong> I bought...)</li>
            <li><strong>Where:</strong> Yerler için (The city <strong>where</strong> I live...)</li>
            <li><strong>That:</strong> Who ve Which yerine kullanılabilir.</li>
          </ul>
        </div>
      )
    }
  ],
  'g10u9': [
    {
      title: "Wish Clauses (Present)",
      content: (
        <div>
          <p>Şu anki durumdan memnuniyetsizlik ve dilek bildirme (I wish + Past Simple).</p>
          <p>I wish I <strong>were</strong> taller. (Keşke daha uzun olsaydım.)</p>
          <p>I wish I <strong>had</strong> a car. (Keşke arabam olsaydı.)</p>
        </div>
      )
    },
    {
      title: "If Clause Type 2",
      content: (
        <div>
          <p>Hayali durumlar.</p>
          <p>If I <strong>were</strong> you, I <strong>would</strong> study.</p>
        </div>
      )
    }
  ],
  'g10u10': [
    {
      title: "Reported Speech (Statements)",
      content: (
        <div>
          <p>Dolaylı anlatım. Zaman bir derece geçmişe alınır.</p>
          <p>Direct: "I like shopping," she said.</p>
          <p>Reported: She said (that) she <strong>liked</strong> shopping.</p>
        </div>
      )
    }
  ]
};