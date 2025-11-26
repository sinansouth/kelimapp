
import React from 'react';
import { Lightbulb, BookOpen, Target, RefreshCw, Trophy, ShoppingBag, Zap, Shield } from 'lucide-react';

interface InfoViewProps {
  onBack: () => void;
}

const InfoView: React.FC<InfoViewProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-6 shadow-sm">
          <Lightbulb size={40} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-4" style={{color: 'var(--color-text-main)'}}>Uygulama Rehberi</h1>
        <p className="max-w-lg mx-auto text-lg" style={{color: 'var(--color-text-muted)'}}>
          KelimApp ile İngilizce öğrenme yolculuğunda sana yardımcı olacak ipuçları ve özellikler.
        </p>
      </div>

      <div className="space-y-6 pb-12">
        
        {/* Card 0: Gamification */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 sm:p-8 shadow-xl shadow-orange-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 items-start text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
                <Trophy size={28} />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">XP, Seviye ve Market</h3>
                <p className="text-orange-100 leading-relaxed mb-4 text-sm">
                    Çalıştıkça XP kazanır ve seviye atlarsın. Seviye atladıkça yeni <strong>Avatarların</strong> kilidi açılır. 
                    XP'lerinle marketten tema, çerçeve ve güçlendirme alabilirsin. 
                    <br/><br/>
                    ⚠️ <strong>Dikkat:</strong> XP harcadığında seviyen düşebilir ve yüksek seviyeli avatarlar kilitlenebilir!
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-orange-50">
                    <div className="bg-white/10 p-2 rounded-lg">👀 Kart İnceleme: <strong>+10 XP</strong></div>
                    <div className="bg-white/10 p-2 rounded-lg">🎯 Quiz Doğru: <strong>+15 XP</strong></div>
                    <div className="bg-white/10 p-2 rounded-lg">⚡ XP Boost: <strong>2x Puan</strong></div>
                    <div className="bg-white/10 p-2 rounded-lg">🏆 Mükemmel Quiz: <strong>+60 XP</strong></div>
                </div>
            </div>
        </div>

        {/* Card 0.5: Market */}
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl p-6 sm:p-8 shadow-xl shadow-yellow-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 items-start text-white relative overflow-hidden">
             <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
                <ShoppingBag size={28} />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">XP Market Öğeleri</h3>
                <ul className="space-y-2 text-sm text-yellow-50">
                    <li className="flex items-center gap-2">
                        <Shield size={16} /> <strong>Seri Dondurma:</strong> Bir gün girmeyi unutursan serini korur.
                    </li>
                    <li className="flex items-center gap-2">
                        <Zap size={16} /> <strong>XP Boost:</strong> 30 dakika boyunca tüm etkinliklerden iki kat puan kazandırır.
                    </li>
                     <li className="flex items-center gap-2">
                        <Target size={16} /> <strong>Çerçeveler & Temalar:</strong> Profilini özelleştir.
                    </li>
                </ul>
            </div>
        </div>


        {/* Card 1: Kelime Çalış */}
        <div className="rounded-3xl p-6 sm:p-8 border shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 items-start" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <BookOpen size={28} />
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-text-main)'}}>Kelime Kartları (Flashcards)</h3>
                <p className="leading-relaxed mb-3 text-sm" style={{color: 'var(--color-text-muted)'}}>
                    Kelimeleri öğrenmenin en etkili yolu. Kartın ön yüzünde İngilizce kelimeyi görürsün. Karta tıklayarak arka yüzdeki Türkçe anlamını, örnek cümleyi ve bağlamı görebilirsin.
                </p>
                <div className="flex flex-wrap gap-2">
                   <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold" style={{color: 'var(--color-text-muted)'}}>Sağa/Sola Kaydır</span>
                   <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold" style={{color: 'var(--color-text-muted)'}}>Tıkla Çevir</span>
                </div>
            </div>
        </div>

        {/* Card 2: Quizler */}
        <div className="rounded-3xl p-6 sm:p-8 border shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 items-start" style={{backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)'}}>
            <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                <Target size={28} />
            </div>
            <div>
                <h3 className="text-xl font-bold mb-2" style={{color: 'var(--color-text-main)'}}>Quiz Modları</h3>
                <p className="leading-relaxed mb-3 text-sm" style={{color: 'var(--color-text-muted)'}}>
                    Öğrendiklerini pekiştirmek için farklı quiz seçeneklerini kullanabilirsin.
                </p>
                <ul className="space-y-2 text-sm" style={{color: 'var(--color-text-muted)'}}>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> <strong>Standart Quiz:</strong> Ünitedeki kelimelerden karışık test.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div> <strong>Favori Testi:</strong> Sadece favoriye eklediğin (zorlandığın) kelimelerden oluşur.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> <strong>Ezber Testi:</strong> "Ezberledim" olarak işaretlediğin kelimeleri tekrar etmeni sağlar.</li>
                </ul>
            </div>
        </div>

        {/* Card 3: Akıllı Tekrar */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 items-start text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
                <RefreshCw size={28} />
            </div>
            <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Akıllı Tekrar Sistemi (SRS)</h3>
                <p className="text-indigo-100 leading-relaxed mb-4 text-sm">
                    Uygulama, "Kelime Çalış" modunda kartları çevirdiğinde bu kelimeleri hafızaya alır. Unutmaya başlamadan hemen önce (1 gün, 3 gün, 1 hafta...) sana tekrar hatırlatır.
                </p>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs font-medium text-indigo-50">
                    💡 Ana sayfadaki "Günlük Tekrar" butonuna basarak o gün tekrar etmen gereken kelimeleri görebilirsin.
                </div>
            </div>
        </div>

      </div>

      <div className="mt-auto flex justify-center pb-8">
         <button
            onClick={onBack}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98]"
          >
            Anladım
          </button>
      </div>

    </div>
  );
};

export default InfoView;
