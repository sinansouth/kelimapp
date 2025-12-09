import React, { useState } from 'react';
import { Lightbulb, BookOpen, Trophy, ShoppingBag, Target, ShieldCheck, Sparkles, Gamepad2, Grid3X3, Search, ArrowRight, User, Swords, Palette, Layout, Users, Calendar, Zap, Repeat, GraduationCap, Medal, Crown, Brain, ListChecks } from 'lucide-react';

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
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Test Çöz</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                                Test modunda bilgini pekiştir. Doğru cevaplarla XP kazan!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center shrink-0 font-bold text-sm">4</div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Günlük Tekrar</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                                                Ana sayfadaki "Günlük Tekrar" butonu, unutmaya başladığın kelimeleri sana hatırlatır.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-base font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                    <Brain className="text-purple-500" size={18} /> Akıllı Tekrar Sistemi (SRS)
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                                    KelimApp, ezberlediğin kelimeleri bilimsel tekrar aralıklarıyla sana hatırlatır. "Ezberledim" işaretlediğin kelimeler:
                                </p>
                                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                    <li className="flex gap-2"><span className="text-green-500">•</span> 1 gün, 3 gün, 7 gün, 14 gün, 30 gün sonra tekrar edilir</li>
                                    <li className="flex gap-2"><span className="text-green-500">•</span> Unutmadan önce hatırlatılır, kalıcı öğrenme sağlar</li>
                                    <li className="flex gap-2"><span className="text-green-500">•</span> Ana sayfadaki "Günlük Tekrar" butonu ile erişilebilir</li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h3 className="text-base font-black text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                                    <GraduationCap className="text-blue-500" size={18} /> Gramer ve Özel Çalışma
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Gramer</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Her ünitede gramer konuları ve açıklamaları bulunur. Ünite seçtikten sonra "Gramer" butonuna tıkla.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Özel Çalışma</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            Sadece istediğin kelimeleri seç ve onlarla çalış. Kart veya test modunda öğren.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-base font-black mb-1 flex items-center gap-2">
                                        <Sparkles size={18} /> Gün Serisi (Streak)
                                    </h3>
                                    <p className="text-xs opacity-90 leading-relaxed">
                                        Her gün uygulamaya girerek "Gün Seri"ni koru. Seri arttıkça XP çarpanın büyür ve daha hızlı seviye atlarsın!
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
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl shrink-0">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Test (Quiz)</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                        Klasik test modu. Kelimelerin anlamlarını seçeneklerden seç. 5 farklı zorluk seviyesi var.
                                    </p>
                                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/10 py-0.5 px-2 rounded">
                                        Doğru: 20 XP
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl shrink-0">
                                    <Swords size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Düello</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                        Arkadaşlarına veya herkese açık rakiplere meydan oku! Aynı kelime testini çözün, en yüksek puanı alan kazanır.
                                    </p>
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/10 py-0.5 px-2 rounded">
                                        Zafer: +3 Düello Puanı
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
                                        İngilizce kelimeleri ve Türkçe karşılıklarını en kısa sürede eşleştir. Hafıza ve hızını test et!
                                    </p>
                                    <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/10 py-0.5 px-2 rounded">
                                        5 XP / Eşleşme
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex gap-4 items-start">
                                <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl shrink-0">
                                    <Search size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Bulmaca</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                        Harfler arasına gizlenmiş kelimeleri bul. Dikkat ve gözlem yeteneğini konuştur.
                                    </p>
                                    <span className="text-[10px] font-bold text-cyan-500 bg-cyan-50 dark:bg-cyan-900/10 py-0.5 px-2 rounded">
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
                                        Hayaletlerden kaç, doğru kelimenin olduğu kapıyı bul ve çıkışa ulaş. Heyecan dolu öğrenme!
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

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-3">
                                    <Trophy size={16} className="text-yellow-500" /> XP ve Seviye Sistemi
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                                    Aktivitelerle XP kazan, seviye atla ve yeni özellikler aç!
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Quiz Doğru</div>
                                        <div className="text-sm font-black text-indigo-600">20 XP</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Ezberleme</div>
                                        <div className="text-sm font-black text-green-600">10 XP</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Hatasız Test</div>
                                        <div className="text-sm font-black text-purple-600">100 XP</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Görevler</div>
                                        <div className="text-sm font-black text-orange-600">100+ XP</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
                                <h4 className="flex items-center gap-2 font-bold text-sm mb-2">
                                    <Zap size={16} /> XP Boost (2x)
                                </h4>
                                <p className="text-xs opacity-95 leading-relaxed">
                                    Marketten satın al veya özel etkinliklerle kazan. 30 dakika boyunca kazandığın tüm XP ikiye katlanır!
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <ListChecks size={16} className="text-green-500" /> Günlük Görevler
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                    Her gün yeni görevler! Tamamla ve büyük XP ödülleri kazan:
                                </p>
                                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Kartları incele</li>
                                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Test çöz</li>
                                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Oyunları oyna</li>
                                    <li className="flex gap-2"><span className="text-indigo-500">•</span> Düelloya katıl</li>
                                </ul>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <Crown size={16} className="text-purple-500" /> Turnuvalar
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                    Büyük yarışmalara katıl, eleme turlarını geç ve şampiyon ol!
                                </p>
                                <div className="flex gap-2 text-[10px] font-bold">
                                    <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">
                                        🥇 1.000 XP
                                    </span>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                                        🥈 500 XP
                                    </span>
                                    <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-1 rounded">
                                        🥉 250 XP
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <Medal size={16} className="text-blue-500" /> Liderlik Tablosu
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                                    Farklı kategorilerde yarış ve en iyiler arasına gir:
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">Haftalık</div>
                                        <div className="text-[10px] text-slate-500">Bu hafta sıfırdan başla</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">Tüm Zamanlar</div>
                                        <div className="text-[10px] text-slate-500">Toplam XP sıralaması</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">Arkadaşlar</div>
                                        <div className="text-[10px] text-slate-500">Sadece arkadaşların</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded p-2">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">Özel Modlar</div>
                                        <div className="text-[10px] text-slate-500">Quiz, Oyunlar, Düello</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <ShieldCheck size={16} className="text-emerald-500" /> Rozetler
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Belirli başarıları tamamlayarak rozetler kazan ve profilinde sergile. Her rozet özel bir başarının kanıtı!
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <ShoppingBag size={16} className="text-pink-500" /> XP Market
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                                    Kazandığın XP'leri harcayarak yeni temalar, çerçeveler ve avatarlar satın al. Profilini özelleştir!
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-pink-500"><Palette size={14} /></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-purple-500"><Layout size={14} /></div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-500"><User size={14} /></div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <h4 className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm mb-2">
                                    <Users size={16} className="text-blue-500" /> Arkadaş Sistemi
                                </h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Profilinden "Arkadaş Kodu"nu paylaş. Arkadaşın seni eklediğinde, sen de onu otomatik olarak eklersin! Birlikte yarışın.
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