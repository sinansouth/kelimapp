import React, { useState } from 'react';
import { Lightbulb, BookOpen, Trophy, ShoppingBag, Target, ShieldCheck, Sparkles, Gamepad2, Grid3X3, Search, ArrowRight, User, Swords, Palette, Layout, Users } from 'lucide-react';

interface InfoViewProps {
  onBack: () => void;
}

const InfoView: React.FC<InfoViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'games' | 'system'>('general');

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      
      <div className="text-center mb-6 shrink-0">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl mb-2 shadow-lg shadow-indigo-500/30">
          <Lightbulb size={28} />
        </div>
        <h1 className="text-xl font-black mb-1 text-slate-800 dark:text-white">Uygulama Rehberi</h1>
        <p className="max-w-xs mx-auto text-xs font-medium text-slate-500 dark:text-slate-400">
          KelimApp'i en verimli şekilde kullanmak için ipuçları.
        </p>
      </div>

      {/* Compact Tabs for Mobile */}
      <div className="grid grid-cols-3 gap-1 mb-4 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setActiveTab('general')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'general' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
              <BookOpen size={16} /> Genel
          </button>
          <button 
            onClick={() => setActiveTab('games')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'games' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
              <Gamepad2 size={16} /> Oyunlar
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${activeTab === 'system' ? 'bg-white dark:bg-slate-700 text-orange-500 dark:text-orange-400 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
              <Trophy size={16} /> Sistem
          </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
        <div className="space-y-4">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                            <Target className="text-indigo-500" size={18} /> Nasıl Çalışmalıyım?
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Kartlar</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                        Önce kelime kartlarını incele. Karta dokunarak anlamını ve örnek cümlesini gör.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">İşaretle</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                        Bildiğin kelimeleri "Ezberledim", zorlandıklarını "Favori" yap.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">Günlük Tekrar</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                        Ana sayfadaki "Günlük Tekrar" butonu, unutmaya başladığın kelimeleri sana hatırlatır.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-base font-black mb-1 flex items-center gap-2">
                                <Sparkles size={18} /> İpucu
                            </h3>
                            <p className="text-xs opacity-90 leading-relaxed">
                                Her gün uygulamaya girerek "Gün Seri"ni (Streak) koru. Seri yaptıkça XP çarpanın artar!
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>
            )}

            {/* GAMES TAB */}
            {activeTab === 'games' && (
                <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl shrink-0">
                            <Swords size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Düello</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                Arkadaşlarına veya rastgele rakiplere meydan oku! Aynı kelime testini çözün, en yüksek puanı alan kazanır.
                            </p>
                            <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/10 py-0.5 px-2 rounded">
                                Zafer: +3 Puan
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl shrink-0">
                            <Grid3X3 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Eşleştirme</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                İngilizce kelimeleri ve Türkçe karşılıklarını en kısa sürede eşleştir.
                            </p>
                            <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/10 py-0.5 px-2 rounded">
                                5 XP / Eşleşme
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl shrink-0">
                            <Search size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Bulmaca</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                Harfler arasına gizlenmiş kelimeleri bul. Gözlem yeteneğini konuştur.
                            </p>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/10 py-0.5 px-2 rounded">
                                10 XP / Kelime
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl shrink-0">
                            <Gamepad2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Labirent</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                Hayaletlerden kaç, doğru kelimenin olduğu kapıyı bul ve çıkışa ulaş.
                            </p>
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/10 py-0.5 px-2 rounded">
                                50 XP / Seviye
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* SYSTEM TAB */}
            {activeTab === 'system' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    
                    <div className="grid grid-cols-2 gap-3">
                         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-bold text-sm mb-2">
                                <Trophy size={16} /> XP Puanları
                            </h4>
                            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                                <li className="flex justify-between"><span>Quiz Doğru</span> <strong>20 XP</strong></li>
                                <li className="flex justify-between"><span>Ezberleme</span> <strong>10 XP</strong></li>
                                <li className="flex justify-between"><span>Hatasız Test</span> <strong>100 XP</strong></li>
                                <li className="flex justify-between"><span>Görevler</span> <strong>100+ XP</strong></li>
                            </ul>
                         </div>

                         <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                            <h4 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm mb-2">
                                <ShieldCheck size={16} /> Rozetler
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-tight">
                                Belirli başarıları tamamlayarak rozetler kazan. Profilinde sergile.
                            </p>
                         </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                            <ShoppingBag size={16} className="text-pink-500" /> XP Market
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                            Kazandığın XP'leri harcayarak yeni temalar, çerçeveler ve avatarlar satın al.
                        </p>
                        <div className="flex gap-2 justify-center">
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-pink-500"><Palette size={14} /></div>
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-purple-500"><Layout size={14} /></div>
                             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-500"><User size={14} /></div>
                        </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                            <Users size={16} className="text-blue-500" /> Arkadaşlar
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            Profilinden "Arkadaş Kodu"nu paylaş. Arkadaşın seni eklediğinde, sen de onu otomatik olarak eklersin!
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full px-4 flex justify-center">
         <button
            onClick={onBack}
            className="w-full max-w-xs px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
          >
            Anlaşıldı <ArrowRight size={16} />
          </button>
      </div>

    </div>
  );
};

export default InfoView;