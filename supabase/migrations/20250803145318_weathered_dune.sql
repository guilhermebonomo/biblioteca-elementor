/*
  # Biblioteca de Seções do Elementor - Schema Inicial

  1. New Tables
    - `sections`
      - `id` (uuid, primary key)
      - `nome` (text) - Nome da seção
      - `categoria` (text) - Categoria da seção (hero, uma-coluna, duas-colunas, depoimentos)
      - `html` (text) - JSON exportado do Elementor
      - `thumb_url` (text) - URL da imagem de thumbnail
      - `created_at` (timestamp) - Data de criação

  2. Storage
    - Bucket `section-thumbnails` para armazenar imagens de preview

  3. Security
    - Enable RLS on `sections` table
    - Add policy for public read access
    - Add policy for authenticated insert
    - Public access to storage bucket for thumbnails
*/

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria text NOT NULL CHECK (categoria IN ('hero', 'uma-coluna', 'duas-colunas', 'depoimentos')),
  html text NOT NULL,
  thumb_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Create policies for sections table
CREATE POLICY "Allow public read access to sections"
  ON sections
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to sections"
  ON sections
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create storage bucket for thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('section-thumbnails', 'section-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public access
CREATE POLICY "Public Access to section thumbnails"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'section-thumbnails');

CREATE POLICY "Public Upload to section thumbnails"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'section-thumbnails');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sections_categoria ON sections(categoria);
CREATE INDEX IF NOT EXISTS idx_sections_created_at ON sections(created_at DESC);