import React from 'react';
import type { SectionCategory } from '../types';

interface CategoryFilterProps {
  activeCategory: SectionCategory;
  onCategoryChange: (category: SectionCategory) => void;
  categoryCounts: Record<string, number>;
}

const categories = [
  { key: 'todas' as SectionCategory, label: 'Todas' },
  { key: 'hero' as SectionCategory, label: 'Hero' },
  { key: 'uma-coluna' as SectionCategory, label: 'Uma Coluna' },
  { key: 'duas-colunas' as SectionCategory, label: 'Duas Colunas' },
  { key: 'depoimentos' as SectionCategory, label: 'Depoimentos' },
  { key: 'pagina-completa' as SectionCategory, label: 'Página Completa' },
];

export default function CategoryFilter({ activeCategory, onCategoryChange, categoryCounts }: CategoryFilterProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoria</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const count = category.key === 'todas' 
            ? Object.values(categoryCounts).reduce((a, b) => a + b, 0)
            : categoryCounts[category.key] || 0;
          
          return (
            <button
              key={category.key}
              onClick={() => onCategoryChange(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeCategory === category.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeCategory === category.key
                  ? 'bg-blue-400 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}