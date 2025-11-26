import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G11: Record<string, GrammarTopic[]> = {
  'g11u1': [
    {
      title: "Future Tenses Review",
      content: (
        <div>
          <p>Gelecek zaman yapılarının detaylı kullanımı.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Will:</strong> Tahmin, ani karar, söz verme.</li>
            <li><strong>Be going to:</strong> Plan, kanıta dayalı tahmin.</li>
            <li><strong>Present Continuous:</strong> Kesinleşmiş düzenlemeler.</li>
            <li><strong>Future Continuous:</strong> (will be doing) Gelecekte belli bir anda devam edecek eylemler.</li>
          </ul>
        </div>
      )
    }
  ],
  'g11u2': [
    {
      title: "Gerunds and Infinitives",
      content: (
        <div>
          <p>Fiilimsiler.</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Gerund (Ving):</strong> enjoy, like, hate, suggest, mind gibi fiillerden sonra. (I enjoy <strong>swimming</strong>.)</li>
            <li><strong>Infinitive (to V):</strong> want, hope, decide, plan gibi fiillerden sonra. (I want <strong>to swim</strong>.)</li>
            <li><strong>Prepositions:</strong> Edatlardan sonra daima Ving gelir. (Good at <strong>drawing</strong>.)</li>
          </ul>
        </div>
      )
    }
  ],
  'g11u3': [
    {
      title: "Simple Past vs Past Continuous",
      content: (
        <div>
          <p>Geçmişte kesişen olaylar (When / While).</p>
          <p>When I <strong>arrived</strong>, they <strong>were sleeping</strong>.</p>
          <p>While I <strong>was studying</strong>, the phone <strong>rang</strong>.</p>
        </div>
      )
    },
    {
      title: "Past Perfect Tense",
      content: (
        <div>
          <p>Geçmişin geçmişi (had + V3).</p>
          <p>When I got to the station, the train <strong>had left</strong>.</p>
        </div>
      )
    }
  ],
  'g11u4': [
    {
      title: "Used to / Would",
      content: (
        <div>
          <p>Geçmiş alışkanlıklar.</p>
          <p>I <strong>used to</strong> smoke. (Artık içmiyorum)</p>
          <p>My dad <strong>would</strong> take us to the park every Sunday. (Tekrarlanan eylem)</p>
        </div>
      )
    },
    {
      title: "Was/Were going to",
      content: (
        <div>
          <p>Gerçekleşmemiş niyetler.</p>
          <p>I <strong>was going to</strong> call you, but I forgot.</p>
        </div>
      )
    }
  ],
  'g11u5': [
    {
      title: "Relative Clauses (Non-defining)",
      content: (
        <div>
          <p>Ekstra bilgi veren, virgülle ayrılan cümlecikler.</p>
          <p>My father, <strong>who is a doctor</strong>, works hard.</p>
          <p>Izmir, <strong>which is in the west</strong>, is beautiful.</p>
        </div>
      )
    }
  ],
  'g11u6': [
    {
      title: "Wishes and Regrets",
      content: (
        <div>
          <p><strong>Present Wish:</strong> I wish I <strong>were</strong> rich. (Keşke zengin olsam)</p>
          <p><strong>Past Regret:</strong> I wish I <strong>had studied</strong> harder. (Keşke daha çok çalışsaydım)</p>
          <p><strong>If only:</strong> If only I <strong>hadn't said</strong> that.</p>
        </div>
      )
    },
    {
      title: "If Clause Type 3",
      content: (
        <div>
          <p>Geçmişle ilgili değiştirilemez hayali durumlar.</p>
          <p>If I <strong>had known</strong>, I <strong>would have come</strong>.</p>
        </div>
      )
    }
  ],
  'g11u7': [
    {
      title: "Passive Voice",
      content: (
        <div>
          <p>Farklı zamanlarda edilgen çatı.</p>
          <p><strong>Present:</strong> It is made.</p>
          <p><strong>Past:</strong> It was made.</p>
          <p><strong>Present Perfect:</strong> It has been made.</p>
          <p><strong>Future:</strong> It will be made.</p>
        </div>
      )
    }
  ],
  'g11u8': [
    {
      title: "Reported Speech",
      content: (
        <div>
          <p>Dolaylı anlatım detayları.</p>
          <p><strong>Commands:</strong> He told me <strong>to sit</strong> down.</p>
          <p><strong>Questions (Yes/No):</strong> She asked <strong>if</strong> I was ready.</p>
          <p><strong>Questions (Wh-):</strong> He asked <strong>where</strong> I lived.</p>
        </div>
      )
    }
  ],
  'g11u9': [
    {
      title: "Adjective Clauses (Reduction)",
      content: (
        <div>
          <p>Sıfat cümleciklerini kısaltma.</p>
          <p>The boy <strong>sitting</strong> next to me (who is sitting).</p>
          <p>The car <strong>sold</strong> yesterday (which was sold).</p>
        </div>
      )
    }
  ],
  'g11u10': [
    {
      title: "Connectors (Bağlaçlar)",
      content: (
        <div>
          <p><strong>Contrast:</strong> Although, However, Despite.</p>
          <p><strong>Reason:</strong> Because, Since, As, Due to.</p>
          <p><strong>Result:</strong> Therefore, As a result, So.</p>
        </div>
      )
    }
  ]
};