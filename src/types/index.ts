export interface Section {
  id: string;
  nome: string;
  categoria: string;
  html: string;
  thumb_url: string;
  created_at: string;
}

export interface NewSection {
  nome: string;
  categoria: string;
  html: string;
  thumb_url: string;
}

export type SectionCategory = 'hero' | 'uma-coluna' | 'duas-colunas' | 'depoimentos' | 'pagina-completa' | 'todas';

export interface User {
  id: string;
  email: string;
  password: string;
  created_at: string;
}