import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: 'Layout' },
  { id: 'frameworks', label: 'Frameworks', icon: 'Code2' },
  { id: 'business', label: 'Business', icon: 'Building2' },
  { id: 'productivity', label: 'Productivity', icon: 'LineChart' },
  { id: 'ecommerce', label: 'E-commerce', icon: 'ShoppingCart' },
  { id: 'education', label: 'Education', icon: 'GraduationCap' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Gamepad2' },
  { id: 'social', label: 'Social', icon: 'Users' },
  { id: 'ai-ml', label: 'AI & ML', icon: 'Brain' },
  { id: 'dashboards', label: 'Dashboards', icon: 'LayoutDashboard' },
  { id: 'creative', label: 'Creative', icon: 'Palette' },
  { id: 'utilities', label: 'Utilities', icon: 'Wrench' }
] as const;