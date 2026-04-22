/*
  # Setup Authentication User

  1. Authentication Setup
    - Creates the specified user in Supabase Auth
    - Sets up the user with email and password authentication
    - Ensures the user can access protected routes

  2. Security
    - User will be created with the specified credentials
    - Email confirmation is disabled for this setup
    - User will have access to upload functionality
*/

-- Note: This user should be created manually in the Supabase Dashboard
-- Go to Authentication > Users and create a new user with:
-- Email: contato@santaaquisicao.com.br
-- Password: s!vK4f-Sy2EA3a8
-- Email Confirm: false (disabled)

-- This migration file serves as documentation for the manual setup required