
export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  isNew?: boolean;
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_v1_0',
    title: "KelimApp Deneme Sürümüne Hoş Geldin!",
    date: "25.10.2024",
    content: "Uygulama Rehberi sayfasını ziyaret etmeyi unutma.",
    isNew: false
  }
];
