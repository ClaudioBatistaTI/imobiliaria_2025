import React, { useEffect, useState } from 'react';
import { Property, PropertyType } from '../types';
import { getProperties } from '../services/storageService';
import { MapPin, Bed, Bath, Ruler, Car, Share2, Phone, ArrowLeft, Building2 } from 'lucide-react';

interface DetailsProps {
  id: string;
  onBack: () => void;
}

export const Details: React.FC<DetailsProps> = ({ id, onBack }) => {
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const props = getProperties();
    const found = props.find(p => p.id === id);
    setProperty(found || null);
  }, [id]);

  if (!property) return <div className="p-8 text-center">Carregando ou não encontrado...</div>;

  const handleShare = () => {
    const text = `Confira este imóvel: ${property.title} em ${property.city} por R$ ${property.price}`;
    const url = window.location.href; // In a real app, this would be a specific URL
    
    if (navigator.share) {
      navigator.share({ title: property.title, text, url }).catch(console.error);
    } else {
      alert("Link copiado para a área de transferência!");
      // Fallback copy
    }
  };

  const contactMessage = `Olá, vi seu anúncio "${property.title}" no ImobVenda e gostaria de mais informações.`;
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(contactMessage)}`;

  return (
    <div className="container mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-secondary mb-6 transition-colors">
        <ArrowLeft size={20} className="mr-1" />
        Voltar para lista
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Images & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
             <img 
               src={property.imageUrl || 'https://picsum.photos/800/600'} 
               alt={property.title} 
               className="w-full h-96 object-cover"
             />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-500">
                  <MapPin size={18} className="mr-1 text-secondary" />
                  <span>{property.district}, {property.city}</span>
                </div>
              </div>
              <button onClick={handleShare} className="p-2 text-gray-400 hover:text-secondary bg-gray-50 rounded-full transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 py-6 border-t border-b border-gray-100 mb-6">
              <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">
                <Ruler className="text-secondary" />
                <span className="font-semibold">{property.area} m²</span>
              </div>
              {property.type !== PropertyType.LAND && (
                <>
                  <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">
                    <Bed className="text-secondary" />
                    <span className="font-semibold">{property.bedrooms} quartos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">
                    <Bath className="text-secondary" />
                    <span className="font-semibold">{property.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">
                    <Car className="text-secondary" />
                    <span className="font-semibold">{property.parkingSpaces} vagas</span>
                  </div>
                </>
              )}
               <div className="flex items-center space-x-2 text-gray-700 px-4 py-2 bg-gray-50 rounded-lg">
                <Building2 className="text-secondary" />
                <span className="font-semibold">{property.type}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Sobre o imóvel</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>
          
          {/* Simple Map Placeholder */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <h2 className="text-xl font-bold text-gray-800 mb-4">Localização</h2>
             <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400 flex-col">
                <MapPin size={48} className="mb-2" />
                <p>Mapa indisponível (Simulação)</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.district + ' ' + property.city)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-secondary underline mt-2 text-sm"
                >
                  Ver no Google Maps
                </a>
             </div>
          </div>
        </div>

        {/* Right Column: Price & Contact */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Valor de Venda</p>
              <p className="text-3xl font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.price)}
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href={whatsappLink} 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-md"
              >
                <Phone size={20} className="mr-2" />
                Contatar Vendedor
              </a>
              <button className="w-full bg-white border-2 border-primary text-primary hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-colors">
                Agendar Visita
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
               Cód. do imóvel: {property.id} <br/>
               Anunciado em: {new Date(property.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};