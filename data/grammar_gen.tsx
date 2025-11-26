import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_GEN: Record<string, GrammarTopic[]> = {
  'gen_a1': [
    {
      title: "To Be (Am/Is/Are)",
      content: <div><p>I am, You are, He/She/It is.</p></div>
    },
    {
      title: "Possessives",
      content: <div><p>My, Your, His, Her... / 's (Ali's book).</p></div>
    },
    {
      title: "Present Simple",
      content: <div><p>Genel doğrular ve rutinler.</p></div>
    }
  ],
  'gen_a2': [
    {
      title: "Past Simple",
      content: <div><p>Geçmiş zaman (regular/irregular verbs).</p></div>
    },
    {
      title: "Present Continuous",
      content: <div><p>Şu an yapılan eylemler ve gelecek planları.</p></div>
    },
    {
      title: "Comparatives / Superlatives",
      content: <div><p>Karşılaştırma ve en üstünlük sıfatları.</p></div>
    }
  ],
  'gen_b1': [
    {
      title: "Present Perfect",
      content: <div><p>Deneyimler ve etkisi süren olaylar (Have/Has + V3).</p></div>
    },
    {
      title: "First & Second Conditional",
      content: (
        <div>
          <p>Type 1: If + Present, Will (Gerçek)</p>
          <p>Type 2: If + Past, Would (Hayali)</p>
        </div>
      )
    },
    {
      title: "Passive Voice",
      content: <div><p>Edilgen yapı (Simple tenses).</p></div>
    }
  ],
  'gen_b2': [
    {
      title: "Third Conditional",
      content: <div><p>If + Past Perfect, Would have V3 (Geçmiş pişmanlık).</p></div>
    },
    {
      title: "Reported Speech",
      content: <div><p>Dolaylı anlatım, zaman uyumu.</p></div>
    },
    {
      title: "Future Perfect",
      content: <div><p>Will have done (Gelecekte tamamlanmış olacak).</p></div>
    }
  ],
  'gen_c1': [
    {
      title: "Inversion",
      content: <div><p>Devrik yapılar (Never have I...).</p></div>
    },
    {
      title: "Mixed Conditionals",
      content: <div><p>Karışık zamanlı koşul cümleleri.</p></div>
    },
    {
      title: "Subjunctive",
      content: <div><p>Resmi istek kipi (It is important that he be there).</p></div>
    }
  ]
};