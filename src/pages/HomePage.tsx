import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SectionCard from '../components/SectionCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { sectionsAPI } from '../utils/supabase';
import type { Section, SectionCategory } from '../types';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [filteredSections, setFilteredSections] = useState<Section[]>([]);
  const [activeCategory, setActiveCategory] = useState<SectionCategory>('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    filterSections();
  }, [sections, activeCategory, searchTerm]);

  const loadSections = async () => {
    try {
      const data = await sectionsAPI.getAll();
      setSections(data);
    } catch (error) {
      toast.error('Erro ao carregar seções');
    } finally {
      setLoading(false);
    }
  };

  const filterSections = () => {
    let filtered = sections;

    if (activeCategory !== 'todas') {
      filtered = filtered.filter(section => section.categoria === activeCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(section =>
        section.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSections(filtered);
  };

  const handleSectionDelete = (deletedId: string) => {
    setSections(sections.filter(section => section.id !== deletedId));
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = {};
    sections.forEach(section => {
      counts[section.categoria] = (counts[section.categoria] || 0) + 1;
    });
    return counts;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Biblioteca de Seções</h1>
          <p className="text-gray-600">Encontre e copie seções prontas para o Elementor</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={getCategoryCounts()}
            />
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar seções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {filteredSections.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="w-16 h-16 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma seção encontrada</h3>
                <p className="text-gray-600">
                  {sections.length === 0
                    ? 'Adicione suas primeiras seções usando o botão Upload'
                    : 'Tente ajustar os filtros ou buscar por outros termos'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSections.map((section) => (
                  <SectionCard 
                    key={section.id} 
                    section={section} 
                    onDelete={handleSectionDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}