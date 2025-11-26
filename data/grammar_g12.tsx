
import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G12: Record<string, GrammarTopic[]> = {
  'g12u1': [
    {
      title: "Expressing Preferences",
      content: (
        <div>
          <p>Tercih bildirme yapıları.</p>
          <p><strong>Prefer:</strong> I prefer pop to rock.</p>
          <p><strong>Would rather:</strong> I would rather listen to jazz than classical.</p>
          <p><strong>Would prefer:</strong> I would prefer to stay home.</p>
        </div>
      )
    },
    {
      title: "Expressing Opinions",
      content: (
        <div>
          <p>Fikir beyan etme.</p>
          <p>I think / I believe / In my opinion / To me...</p>
        </div>
      )
    }
  ],
  'g12u2': [
    {
      title: "Adjectives describing Personality",
      content: (
        <div>
          <p>Kişilik sıfatları ve kullanımları.</p>
          <p>Generous, stubborn, reliable, sensible, sensitive...</p>
        </div>
      )
    },
    {
      title: "Phrasal Verbs (Relationships)",
      content: (
        <div>
          <p>Get on well, back up, count on, break up, fall out...</p>
        </div>
      )
    }
  ],
  'g12u3': [
    {
      title: "Expressing Ability",
      content: (
        <div>
          <p><strong>Can / Could:</strong> Genel yetenek.</p>
          <p><strong>Be able to:</strong> Spesifik durumlarda başarma.</p>
          <p><strong>Manage to:</strong> Zor bir işi başarma.</p>
        </div>
      )
    },
    {
      title: "Modals of Prohibition/Necessity",
      content: (
        <div>
          <p>Mustn't (Yasak), Don't have to (Gerek yok), Needn't (Gerek yok).</p>
        </div>
      )
    }
  ],
  'g12u4': [
    {
      title: "Causatives (Ettirgen Çatı)",
      content: (
        <div>
          <p>Bir işi başkasına yaptırma.</p>
          <p><strong>Have something done:</strong> I had my car repaired.</p>
          <p><strong>Get someone to do:</strong> I got him to help me.</p>
          <p><strong>Make someone do:</strong> He made me cry.</p>
        </div>
      )
    }
  ],
  'g12u5': [
    {
      title: "Modals of Deduction (Present)",
      content: (
        <div>
          <p>Şimdiki zaman çıkarımları.</p>
          <p><strong>Must be:</strong> Kesin öyledir.</p>
          <p><strong>Can't be:</strong> Olamaz.</p>
          <p><strong>Might/May/Could be:</strong> Olabilir (ihtimal).</p>
        </div>
      )
    }
  ],
  'g12u6': [
    {
      title: "Mixed Conditionals",
      content: (
        <div>
          <p>Zamanları karışık koşul cümleleri.</p>
          <p>If I <strong>had studied</strong> harder (Past), I <strong>would be</strong> a doctor now (Present).</p>
        </div>
      )
    },
    {
      title: "Passive Voice (Advanced)",
      content: (
        <div>
          <p>It is said that... / He is believed to...</p>
          <p>People say that he is rich &rarr; He is said to be rich.</p>
        </div>
      )
    },
    {
      title: "Inversion",
      content: (
        <div>
          <p>Devrik cümle yapıları (Vurgu için).</p>
          <p><strong>Never have I seen</strong> such a thing.</p>
          <p><strong>Rarely do we</strong> go out.</p>
        </div>
      )
    },
    {
      title: "Conjunctions & Transitions",
      content: (
        <div>
          <p>Not only... but also..., Either... or..., Neither... nor...</p>
          <p>Whatever, Whenever, However...</p>
        </div>
      )
    },
    {
      title: "Emphasis (Cleft Sentences)",
      content: (
        <div>
          <p>Cümlede vurgu yapma.</p>
          <p>It was John <strong>who</strong> broke the window.</p>
          <p>What I need <strong>is</strong> some rest.</p>
        </div>
      )
    }
  ]
};
