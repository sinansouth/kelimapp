
export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  isNew?: boolean;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_002', // Her yeni duyuru için bu ID'yi değiştirin (örn: ann_002)
    title: "Yeni Özellikler",
    date: "26.11.2025",
    content: "Avatar, Çerçeve, XP, Seviye, Market, Rozetler ve birçok özellik eklendi.",
    isNew: true
  },
  {
    id: 'ann_001', // Her yeni duyuru için bu ID'yi değiştirin (örn: ann_002)
    title: "KelimApp'e Hoşgeldiniz",
    date: "25.11.2025",
    content: "Genel İngilizce dışında tüm düzeylerin kelimeleri tamamlandı ve gramer konuları kısaca eklendi.",
    isNew: true
  },
  // Yeni duyuruları buraya ekleyebilirsiniz. En üstteki en güncel kabul edilir.
];
