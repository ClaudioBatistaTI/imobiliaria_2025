export enum PropertyType {
  HOUSE = 'Casa',
  APARTMENT = 'Apartamento',
  LAND = 'Terreno'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  area: number; // m²
  city: string;
  district: string; // Bairro
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  imageUrl: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}