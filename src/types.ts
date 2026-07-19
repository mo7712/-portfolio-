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
}

export interface CategoryItem {
  key: string;
  labelAr: string;
  labelEn: string;
}
