import React from 'react';
import { GrammarTopic } from '../types';

export const GRAMMAR_G2: Record<string, GrammarTopic[]> = {
  'g2u1': [
    {
      title: "A / An (Bir)",
      content: (
        <div>
          <p className="mb-3">İngilizcede tekil nesnelerden önce <strong>a</strong> veya <strong>an</strong> kullanılır.</p>
          <ul className="list-disc pl-4 space-y-3">
            <li>
              <strong className="text-indigo-600 dark:text-indigo-400">a</strong>: Sessiz harfle başlayan kelimelerden önce gelir.
              <br/>
              <span className="text-sm text-slate-500 dark:text-slate-400">Örnek: <strong>a</strong> doctor (bir doktor), <strong>a</strong> lemon (bir limon)</span>
            </li>
            <li>
              <strong className="text-indigo-600 dark:text-indigo-400">an</strong>: Sesli harfle (a, e, i, o, u) başlayan kelimelerden önce gelir.
              <br/>
              <span className="text-sm text-slate-500 dark:text-slate-400">Örnek: <strong>an</strong> ambulance (bir ambulans)</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "What is this?",
      content: (
        <div>
          <p className="mb-2">Bir nesnenin ne olduğunu sormak için:</p>
          <p><strong>Soru:</strong> What is this? (Bu nedir?)</p>
          <p><strong>Cevap:</strong> It is a lemon. (O bir limondur.)</p>
        </div>
      )
    }
  ],
  'g2u2': [
    {
      title: "Selamlaşma (Greetings)",
      content: (
        <div>
          <ul className="space-y-2">
            <li><strong>Hello / Hi:</strong> Merhaba</li>
            <li><strong>Good morning:</strong> Günaydın</li>
            <li><strong>Good afternoon:</strong> Tünaydın</li>
            <li><strong>Good evening:</strong> İyi akşamlar</li>
            <li><strong>Good night:</strong> İyi geceler</li>
            <li><strong>Goodbye:</strong> Hoşça kal</li>
          </ul>
        </div>
      )
    },
    {
      title: "How are you?",
      content: (
        <div>
          <p>Birinin halini hatırını sormak için:</p>
          <p className="font-bold text-indigo-600">How are you? (Nasılsın?)</p>
          <p><strong>I am fine.</strong> (İyiyim.)</p>
          <p><strong>I am great.</strong> (Harikayım.)</p>
          <p><strong>I am okay.</strong> (İdare eder.)</p>
        </div>
      )
    }
  ],
  'g2u3': [
    {
      title: "Emir Cümleleri (Imperatives)",
      content: (
        <div>
          <p className="mb-2">Sınıf içinde kullanılan komutlar:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Open</strong> the door. (Kapıyı aç.)</li>
            <li><strong>Close</strong> the window. (Pencereyi kapat.)</li>
            <li><strong>Stand up.</strong> (Ayağa kalk.)</li>
            <li><strong>Sit down.</strong> (Otur.)</li>
            <li><strong>Turn right.</strong> (Sağa dön.)</li>
          </ul>
        </div>
      )
    }
  ],
  'g2u4': [
    {
      title: "How many? (Kaç tane?)",
      content: (
        <div>
          <p className="mb-2">Sayıları sormak için kullanılır.</p>
          <p><strong>Soru:</strong> How many lemons? (Kaç tane limon?)</p>
          <p><strong>Cevap:</strong> Three lemons. (Üç limon.)</p>
          <p className="text-xs text-slate-500 mt-2">*Birden fazla ise kelimenin sonuna <strong>-s</strong> takısı gelir (lemon<strong>s</strong>).</p>
        </div>
      )
    },
    {
      title: "How old are you?",
      content: (
        <div>
          <p>Yaş sormak için:</p>
          <p><strong>Soru:</strong> How old are you? (Kaç yaşındasın?)</p>
          <p><strong>Cevap:</strong> I am seven. (Yediyim.)</p>
        </div>
      )
    }
  ],
  'g2u5': [
    {
      title: "Renkler (Colors)",
      content: (
        <div>
          <p>Bir şeyin rengini sormak için:</p>
          <p><strong>What color is it?</strong> (O ne renk?)</p>
          <p>It is <strong>red</strong>. (O kırmızıdır.)</p>
          <p>It is <strong>blue</strong>. (O mavidir.)</p>
        </div>
      )
    },
    {
      title: "Like / Don't Like",
      content: (
        <div>
          <p>Sevdiğimiz renkleri söylerken:</p>
          <p>I <strong>like</strong> pink. (Pembeyi severim.)</p>
          <p>I <strong>don't like</strong> black. (Siyahı sevmem.)</p>
        </div>
      )
    }
  ],
  'g2u6': [
    {
      title: "Let's ... (Haydi ...)",
      content: (
        <div>
          <p className="mb-2">Arkadaşımıza bir şey teklif ederken kullanırız.</p>
          <ul className="list-disc pl-4 space-y-2">
            <li><strong>Let's</strong> run. (Haydi koşalım.)</li>
            <li><strong>Let's</strong> jump. (Haydi zıplayalım.)</li>
            <li><strong>Let's</strong> play football. (Haydi futbol oynayalım.)</li>
            <li><strong>Let's</strong> dance. (Haydi dans edelim.)</li>
          </ul>
        </div>
      )
    }
  ]
};