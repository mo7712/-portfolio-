import { pgTable, text, serial, integer, primaryKey, jsonb } from 'drizzle-orm/pg-core';

// Portfolio items table
export const portfolioItemsTable = pgTable('portfolio_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleEn: text('title_en'),
  category: text('category').notNull(),
  categoryEn: text('category_en'),
  categoryKey: text('category_key').notNull(),
  image: text('image').notNull(),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  client: text('client').notNull(),
  clientEn: text('client_en'),
  year: text('year').notNull(),
  tools: jsonb('tools').$type<string[]>().notNull(),
  gallery: jsonb('gallery').$type<string[]>().notNull(),
  videoUrl: text('video_url'),
});

// Categories table
export const categoriesTable = pgTable('categories', {
  key: text('key').primaryKey(),
  labelAr: text('label_ar').notNull(),
  labelEn: text('label_en').notNull(),
});

// Partner logos table
export const partnerLogosTable = pgTable('partner_logos', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

// Custom translations table (to store translations dynamically)
export const customTranslationsTable = pgTable('custom_translations', {
  lang: text('lang').notNull(), // 'ar' or 'en'
  key: text('key').notNull(),
  value: text('value').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.lang, table.key] }),
  };
});
