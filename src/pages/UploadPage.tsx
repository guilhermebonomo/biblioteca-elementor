import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, FileText, Tag, Save, ArrowLeft } from 'lucide-react';
import { sectionsAPI } from '../utils/supabase';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    html: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'hero', label: 'Hero' },
    { value: 'uma-coluna', label: 'Uma Coluna' },
    { value: 'duas-colunas', label: 'Duas Colunas' },
    { value: 'depoimentos', label: 'Depoimentos' },
    { value: 'pagina-completa', label: 'Página Completa' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.html || !thumbnail) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      const thumbUrl = await sectionsAPI.uploadImage(thumbnail);
      
      await sectionsAPI.create({
        ...formData,
        thumb_url: thumbUrl,
      });

      toast.success('Seção salva com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao salvar seção');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar para Biblioteca</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adicionar Nova Seção</h1>
          <p className="text-gray-600">Faça upload de uma nova seção do Elementor para a biblioteca</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="nome" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    <span>Nome da Seção</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Hero com Botão CTA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="categoria" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4" />
                    <span>Categoria</span>
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="thumbnail" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Image className="w-4 h-4" />
                    <span>Thumbnail</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="thumbnail"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      required
                    />
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">Clique para selecionar imagem</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="html" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>JSON do Elementor</span>
                </label>
                <textarea
                  id="html"
                  name="html"
                  value={formData.html}
                  onChange={handleInputChange}
                  placeholder="Cole aqui o JSON exportado do Elementor..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Exporte a seção do Elementor e cole o conteúdo JSON aqui
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{loading ? 'Salvando...' : 'Salvar Seção'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}