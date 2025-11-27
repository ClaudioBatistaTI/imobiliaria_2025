import { Property, User, PropertyType } from "../types";

const KEYS = {
  USERS: 'imob_users',
  PROPERTIES: 'imob_properties',
  CURRENT_USER: 'imob_current_user'
};

// Seed Data
const seedProperties: Property[] = [
  {
    id: '1',
    ownerId: 'seed_admin',
    title: 'Casa Moderna no Jardim América',
    description: 'Linda casa com piscina, acabamento de alto padrão e área gourmet completa. Pronta para morar.',
    type: PropertyType.HOUSE,
    price: 850000,
    area: 200,
    city: 'São Paulo',
    district: 'Jardim América',
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    imageUrl: 'https://picsum.photos/id/1/800/600',
    createdAt: Date.now()
  },
  {
    id: '2',
    ownerId: 'seed_admin',
    title: 'Apartamento Compacto Centro',
    description: 'Ideal para investimento. Localização privilegiada perto do metrô e comércios.',
    type: PropertyType.APARTMENT,
    price: 320000,
    area: 45,
    city: 'Curitiba',
    district: 'Centro',
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    imageUrl: 'https://picsum.photos/id/10/800/600',
    createdAt: Date.now()
  },
  {
    id: '3',
    ownerId: 'seed_admin',
    title: 'Terreno em Condomínio Fechado',
    description: 'Terreno plano, pronto para construir. Condomínio com segurança 24h e lazer.',
    type: PropertyType.LAND,
    price: 150000,
    area: 360,
    city: 'Campinas',
    district: 'Swiss Park',
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    imageUrl: 'https://picsum.photos/id/28/800/600',
    createdAt: Date.now()
  }
];

// Initialize Storage
const initStorage = () => {
  const props = localStorage.getItem(KEYS.PROPERTIES);
  if (!props) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(seedProperties));
  }
};

initStorage();

// User Methods
export const getSession = (): User | null => {
  const userStr = localStorage.getItem(KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const loginUser = async (email: string): Promise<User> => {
  // Mock login: creates a user if not exists based on email simply for demo
  const usersStr = localStorage.getItem(KEYS.USERS) || '[]';
  const users: User[] = JSON.parse(usersStr);
  
  let user = users.find(u => u.email === email);
  if (!user) {
    user = { id: Date.now().toString(), email, name: email.split('@')[0], phone: '1199999999' };
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
  
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

// Property Methods
export const getProperties = (): Property[] => {
  const str = localStorage.getItem(KEYS.PROPERTIES);
  return str ? JSON.parse(str) : [];
};

export const saveProperty = (property: Omit<Property, 'id' | 'createdAt'>, id?: string): Property => {
  const properties = getProperties();
  
  if (id) {
    // Update
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Imóvel não encontrado');
    const updated = { ...properties[index], ...property };
    properties[index] = updated;
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    return updated;
  } else {
    // Create
    const newProp: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    properties.unshift(newProp); // Add to top
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
    return newProp;
  }
};

export const deleteProperty = (id: string) => {
  const properties = getProperties();
  const filtered = properties.filter(p => p.id !== id);
  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(filtered));
};