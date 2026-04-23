/*
  # Criar tabela de usuários

  1. Nova Tabela
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text, hash da senha)
      - `created_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela `users`
    - Adicionar política para leitura pública (para login)

  3. Dados Iniciais
    - Inserir usuário padrão: contato@santaaquisicao.com.br
*/

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (necessário para login)
CREATE POLICY "Allow public read for authentication"
  ON users
  FOR SELECT
  TO public
  USING (true);

-- Inserir usuário padrão
-- Senha: s!vK4f-Sy2EA3a8 (será hasheada no frontend)
INSERT INTO users (email, password) 
VALUES ('contato@santaaquisicao.com.br', 's!vK4f-Sy2EA3a8')
ON CONFLICT (email) DO NOTHING;