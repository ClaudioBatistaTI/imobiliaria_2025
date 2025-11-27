import React from 'react';
import { MapPin, Bed, Bath, Ruler, Car } from 'lucide-react';
import { Property, PropertyType } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
      onClick={() => onClick(property.id)}
    >
      <div className="relative h-56 overflow-hidden">
        <img 
          src={property.imageUrl || 'https://picsum.photos/800/600'} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {property.type}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
           <p className="text-white font-bold text-lg">{formatPrice(property.price)}</p>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{property.title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{property.district}, {property.city}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 py-3 border-t border-gray-100 text-gray-600 text-xs sm:text-sm">
          {property.type !== PropertyType.LAND && (
            <>
              <div className="flex flex-col items-center">
                <Bed size={18} className="mb-1 text-secondary" />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center">
                <Bath size={18} className="mb-1 text-secondary" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex flex-col items-center">
                <Car size={18} className="mb-1 text-secondary" />
                <span>{property.parkingSpaces}</span>
              </div>
            </>
          )}
           <div className="flex flex-col items-center col-span-1">
            <Ruler size={18} className="mb-1 text-secondary" />
            <span>{property.area}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};