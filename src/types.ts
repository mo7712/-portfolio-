export interface PortfolioItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  categoryKey: string;
  image: string;
  description: string;
  descriptionEn?: string;
  client: string;
  clientEn?: string;
  year: string;
  tools: string[];
  gallery: string[];
  videoUrl?: string;
  status?: 'published' | 'scheduled' | 'draft' | 'hidden';
  hidden?: boolean;
  scheduledAt?: string;
}

export interface CategoryItem {
  key: string;
  labelAr: string;
  labelEn: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'supervisor' | 'editor' | 'member';
  addedAt: string;
  lastActive?: string;
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  permissions?: string[];
}
