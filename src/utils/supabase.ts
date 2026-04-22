import { createClient } from '@supabase/supabase-js';
import type { Section, NewSection } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const authAPI = {
  async signIn(email: string, password: string): Promise<{ user: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error || !data) {
        return { user: null, error: 'Email ou senha incorretos' };
      }
      
      // Armazenar usuário no localStorage
      localStorage.setItem('user', JSON.stringify(data));
      
      return { user: data };
    } catch (error) {
      return { user: null, error: 'Erro ao fazer login' };
    }
  },

  async signOut(): Promise<void> {
    localStorage.removeItem('user');
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export const sectionsAPI = {
  async getAll(): Promise<Section[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(section: NewSection): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .insert([section])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, section: Partial<NewSection>): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update(section)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error('Seção não encontrada ou não foi possível atualizar');
    }
    
    return data[0];
  },

  async getById(id: string): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('section-thumbnails')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('section-thumbnails')
      .getPublicUrl(fileName);
    
    return publicUrl;
  }
};