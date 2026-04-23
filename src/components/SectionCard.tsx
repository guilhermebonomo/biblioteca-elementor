import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { sectionsAPI } from '../utils/supabase';
import type { Section } from '../types';

interface SectionCardProps {
  section: Section;
  onDelete?: (id: string) => void;
}

export default function SectionCard({ section, onDelete }: SectionCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();

  const handleCopySection = async () => {
    try {
      await navigator.clipboard.writeText(section.html);
      setCopied(true);
      toast.success('Seção copiada! Cole no Elementor usando "Colar de outro site"');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar seção');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta seção?')) {
      return;
    }

    setDeleting(true);
    try {
      await sectionsAPI.delete(section.id);
      toast.success('Seção excluída com sucesso!');
      if (onDelete) {
        onDelete(section.id);
      }
    } catch (error) {
      toast.error('Erro ao excluir seção');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryColor = (categoria: string) => {
    const colors = {
      'hero': 'bg-purple-100 text-purple-800',
      'uma-coluna': 'bg-blue-100 text-blue-800',
      'duas-colunas': 'bg-green-100 text-green-800',
      'depoimentos': 'bg-orange-100 text-orange-800',
      'pagina-completa': 'bg-indigo-100 text-indigo-800',
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        <img
          src={section.thumb_url}
          alt={section.nome}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110">
            <Eye className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{section.nome}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(section.categoria)}`}>
            {section.categoria}
          </span>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleCopySection}
            disabled={copied}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              copied
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {user && (
            <div className="flex space-x-2">
              <Link
                to={`/edit/${section.id}`}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-700 border-t-transparent"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>{deleting ? 'Excluindo...' : 'Excluir'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}