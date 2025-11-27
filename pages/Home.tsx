import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Property, PropertyType } from '../types';
import { getProperties } from '../services/storageService';
import { PropertyCard } from '../components/PropertyCard';

interface HomeProps {
  onPropertyClick: (id: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onPropertyClick }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    // Load properties
    const data = getProperties();
    setProperties(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let result = properties;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.description.toLowerCase().includes(lower)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(p => p.type === typeFilter);
    }

    if (cityFilter) {
      result = result.filter(p => p.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    setFiltered(result);
  }, [searchTerm, typeFilter, cityFilter, maxPrice, properties]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Search Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Encontre o imóvel ideal para você</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por termo..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cidade" 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>

          <div className="relative">
             <select
              className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todos os tipos</option>
              {Object.values(PropertyType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <input 
              type="number" 
              placeholder="Preço Máximo" 
              className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          {filtered.length} {filtered.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
        </h2>
        <div className="flex items-center text-sm text-gray-500">
          <SlidersHorizontal size={16} className="mr-1" />
          <span>Filtros ativos</span>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onClick={onPropertyClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">Nenhum imóvel encontrado com estes filtros.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setCityFilter('');
              setTypeFilter('all');
              setMaxPrice('');
            }}
            className="mt-4 text-secondary hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};