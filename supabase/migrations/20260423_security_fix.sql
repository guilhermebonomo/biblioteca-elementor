/*
  # Correção de Segurança: Autenticação e RLS

  Este script irá:
  1. Deletar a tabela "users" obsoleta e insegura
  2. Substituir todas as políticas de RLS da tabela "sections" para que INSERT, UPDATE e DELETE sejam permitidos apenas para usuários autenticados.
  3. Substituir a política de upload no storage para apenas usuários autenticados.
*/

-- 1. DELETAR TABELA OBSOLETA
DROP TABLE IF EXISTS users;

-- 2. RECRIAR POLÍTICAS DA TABELA SECTIONS
-- Primeiro, deletamos as políticas existentes na tabela "sections"
DROP POLICY IF EXISTS "Allow public read access to sections" ON sections;
DROP POLICY IF EXISTS "Allow public insert to sections" ON sections;
DROP POLICY IF EXISTS "Allow public update to sections" ON sections;
DROP POLICY IF EXISTS "Allow public delete to sections" ON sections;

-- Leitura: Qualquer um pode ler
CREATE POLICY "Leitura publica permitida"
  ON sections FOR SELECT
  TO public
  USING (true);

-- Inserção: Apenas usuários logados
CREATE POLICY "Criacao apenas para autenticados"
  ON sections FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

-- Atualização: Apenas usuários logados
CREATE POLICY "Edicao apenas para autenticados"
  ON sections FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Deleção: Apenas usuários logados
CREATE POLICY "Delecao apenas para autenticados"
  ON sections FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');


-- 3. RECRIAR POLÍTICAS DO STORAGE (section-thumbnails)
-- Deletar a política de upload pública antiga
DROP POLICY IF EXISTS "Public Upload to section thumbnails" ON storage.objects;

-- Criar política de upload restrita
CREATE POLICY "Upload apenas para autenticados"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'section-thumbnails' AND auth.role() = 'authenticated');
