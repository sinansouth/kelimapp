
import { GradeDef, UnitDef, ThemeType } from '../types';
import { 
  BookOpen, GraduationCap, Star, School, Globe, 
  MapPin, Film, Calendar, Zap, Smile, User, Utensils, Shirt, Home, Tent, 
  Play, BookType, CheckCircle, Layers, Flame, Award, PenTool,
  ListChecks, Clock as ClockIcon, Brain as BrainIcon,
  PartyPopper, Lightbulb, MessageCircle, Sparkles,
  History, Palette, Microscope, Stethoscope, 
  Laptop, Gavel, Leaf, Plane, ShoppingBag as ShoppingBagIcon, Cpu, Crown,
  Bell, Settings, CircleHelp, Home as HomeIcon, UserCircle, Signal, Music, Heart, Tv, Briefcase
} from 'lucide-react';
import React from 'react';

// THEME CONFIGURATION
export const THEME_COLORS: Record<ThemeType, { primary: string, bgMain: string, bgCard: string, textMain: string, textMuted: string, border: string }> = {
    'light': { primary: '#4f46e5', bgMain: '#f8fafc', bgCard: '#ffffff', textMain: '#0f172a', textMuted: '#64748b', border: '#e2e8f0' },
    'dark': { primary: '#818cf8', bgMain: '#0f172a', bgCard: '#1e293b', textMain: '#f8fafc', textMuted: '#94a3b8', border: '#334155' },
    'neon': { primary: '#39ff14', bgMain: '#000000', bgCard: '#111111', textMain: '#39ff14', textMuted: '#228b22', border: '#33ff00' },
    'ocean': { primary: '#0ea5e9', bgMain: '#0c4a6e', bgCard: '#075985', textMain: '#e0f2fe', textMuted: '#7dd3fc', border: '#0369a1' },
    'sunset': { primary: '#f97316', bgMain: '#431407', bgCard: '#7c2d12', textMain: '#ffedd5', textMuted: '#fdba74', border: '#9a3412' },
    'forest': { primary: '#22c55e', bgMain: '#052e16', bgCard: '#14532d', textMain: '#dcfce7', textMuted: '#86efac', border: '#15803d' },
    'royal': { primary: '#fbbf24', bgMain: '#312e81', bgCard: '#4338ca', textMain: '#fef3c7', textMuted: '#ddd6fe', border: '#fbbf24' },
    'candy': { primary: '#ec4899', bgMain: '#831843', bgCard: '#9d174d', textMain: '#fce7f3', textMuted: '#fbcfe8', border: '#be185d' },
    'cyberpunk': { primary: '#facc15', bgMain: '#18181b', bgCard: '#27272a', textMain: '#facc15', textMuted: '#a1a1aa', border: '#facc15' },
    'coffee': { primary: '#d7ccc8', bgMain: '#3e2723', bgCard: '#4e342e', textMain: '#d7ccc8', textMuted: '#a1887f', border: '#6d4c41' },
    'galaxy': { primary: '#d8b4fe', bgMain: '#0f172a', bgCard: '#2e1065', textMain: '#e9d5ff', textMuted: '#a855f7', border: '#6b21a8' },
    'retro': { primary: '#b58900', bgMain: '#fdf6e3', bgCard: '#eee8d5', textMain: '#657b83', textMuted: '#93a1a1', border: '#b58900' },
    'matrix': { primary: '#00ff41', bgMain: '#000000', bgCard: '#001100', textMain: '#00ff41', textMuted: '#008F11', border: '#003b00' },
    'midnight': { primary: '#94a3b8', bgMain: '#020617', bgCard: '#0f172a', textMain: '#e2e8f0', textMuted: '#64748b', border: '#334155' },
    'volcano': { primary: '#ef4444', bgMain: '#1a0505', bgCard: '#450a0a', textMain: '#fee2e2', textMuted: '#f87171', border: '#7f1d1d' },
    'ice': { primary: '#22d3ee', bgMain: '#083344', bgCard: '#164e63', textMain: '#cffafe', textMuted: '#67e8f9', border: '#155e75' },
    'lavender': { primary: '#c084fc', bgMain: '#2e1065', bgCard: '#4c1d95', textMain: '#ede9fe', textMuted: '#a78bfa', border: '#6d28d9' },
    'gamer': { primary: '#ef4444', bgMain: '#000000', bgCard: '#111111', textMain: '#ffffff', textMuted: '#9ca3af', border: '#ef4444' },
    'luxury': { primary: '#fbbf24', bgMain: '#1a1a1a', bgCard: '#262626', textMain: '#fcfcd4', textMuted: '#a8a29e', border: '#fbbf24' },
    'comic': { primary: '#000000', bgMain: '#ffffff', bgCard: '#f3f4f6', textMain: '#000000', textMuted: '#4b5563', border: '#000000' },
    'nature_soft': { primary: '#65a30d', bgMain: '#f0fdf4', bgCard: '#ffffff', textMain: '#14532d', textMuted: '#84cc16', border: '#84cc16' },
};

// UI ICONS
export const UI_ICONS = {
    home: React.createElement(HomeIcon, { size: 24 }),
    profile: React.createElement(UserCircle, { size: 24 }),
    settings: React.createElement(Settings, { size: 24 }),
    info: React.createElement(CircleHelp, { size: 24 }),
    notifications: React.createElement(Bell, { size: 24 }),
};

// GRADES
export const GRADE_DATA: Record<string, GradeDef> = {
    'PRIMARY_SCHOOL': { id: 'PRIMARY_SCHOOL', label: 'İlkokul', subLabel: '2-4. Sınıflar', icon: React.createElement(Star, { size: 28 }) },
    'MIDDLE_SCHOOL': { id: 'MIDDLE_SCHOOL', label: 'Ortaokul', subLabel: '5-8. Sınıflar', icon: React.createElement(School, { size: 28 }) },
    'HIGH_SCHOOL': { id: 'HIGH_SCHOOL', label: 'Lise', subLabel: '9-12. Sınıflar', icon: React.createElement(GraduationCap, { size: 28 }) },
    'GENERAL_ENGLISH': { id: 'GENERAL_ENGLISH', label: 'Genel İngilizce', subLabel: 'A1 - C1 Seviyeleri', icon: React.createElement(Globe, { size: 28 }) },
    '2': { id: '2', label: '2. Sınıf', icon: React.createElement(Star, { size: 24 }) },
    '3': { id: '3', label: '3. Sınıf', icon: React.createElement(Star, { size: 24 }) },
    '4': { id: '4', label: '4. Sınıf', icon: React.createElement(Star, { size: 24 }) },
    '5': { id: '5', label: '5. Sınıf', icon: React.createElement(School, { size: 24 }) },
    '6': { id: '6', label: '6. Sınıf', icon: React.createElement(School, { size: 24 }) },
    '7': { id: '7', label: '7. Sınıf', icon: React.createElement(School, { size: 24 }) },
    '8': { id: '8', label: '8. Sınıf', icon: React.createElement(School, { size: 24 }) },
    '9': { id: '9', label: '9. Sınıf', icon: React.createElement(GraduationCap, { size: 24 }) },
    '10': { id: '10', label: '10. Sınıf', icon: React.createElement(GraduationCap, { size: 24 }) },
    '11': { id: '11', label: '11. Sınıf', icon: React.createElement(GraduationCap, { size: 24 }) },
    '12': { id: '12', label: '12. Sınıf', icon: React.createElement(GraduationCap, { size: 24 }) },
    'A1': { id: 'A1', label: 'A1 Seviye', icon: React.createElement(Signal, { size: 24, className: "text-green-500" }) },
    'A2': { id: 'A2', label: 'A2 Seviye', icon: React.createElement(Signal, { size: 24, className: "text-blue-500" }) },
    'B1': { id: 'B1', label: 'B1 Seviye', icon: React.createElement(Signal, { size: 24, className: "text-yellow-500" }) },
    'B2': { id: 'B2', label: 'B2 Seviye', icon: React.createElement(Signal, { size: 24, className: "text-orange-500" }) },
    'C1': { id: 'C1', label: 'C1 Seviye', icon: React.createElement(Signal, { size: 24, className: "text-red-500" }) },
};

// NOTE: UNIT_ASSETS, FRAMES, BACKGROUNDS, AVATARS, and BADGES have been moved to Supabase system_content table.
// They are now fetched dynamically via contentService.ts.
// The empty export below is just to satisfy any lingering imports until full migration is verified.
export const UNIT_ASSETS: Record<string, UnitDef[]> = {}; 
export const FRAMES = [];
export const BACKGROUNDS = [];
export const AVATARS = [];
export const BADGES = [];
