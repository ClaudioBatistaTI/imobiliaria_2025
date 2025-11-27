import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Sparkles, X, Image as ImageIcon } from 'lucide-react';
import { Property, PropertyType } from '../types';
import { getProperties, saveProperty, deleteProperty } from '../services/storageService';
import { useAuth } from '../App';
import { generatePropertyDescription } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Property>>({
    type: PropertyType.HOUSE,
    city: '',
    district: '',
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    title: '',
    description: '',
    imageUrl: ''
  });

  const loadMyProperties = () => {
    if (!user) return;
    const all = getProperties();
    setMyProperties(all.filter(p => p.ownerId === user.id));
  };

  useEffect(() => {
    loadMyProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'area' || name === 'bedrooms' || name === 'bathrooms' || name === 'parkingSpaces' 
        ? Number(value) 
        : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to Base64 (simple implementation for mock DB)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.city || !formData.type || !formData.price) {
      alert("Preencha cidade, bairro, tipo, preço e área primeiro para gerar uma descrição melhor.");
      return;
    }

    setLoadingAi(true);
    const desc = await generatePropertyDescription({
      type: formData.type as PropertyType,
      city: formData.city,
      district: formData.district || '',
      area: formData.area || 0,
      bedrooms: formData.bedrooms || 0,
      price: formData.price || 0,
      features: "Ótima localização, oportunidade única" // Basic context
    });
    
    setFormData(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      saveProperty({
        ...formData as any,
        ownerId: user.id
      }, formData.id); // If formData has ID, it's an update
      
      setFormVisible(false);
      resetForm();
      loadMyProperties();
    } catch (error) {
      alert("Erro ao salvar imóvel");
    }
  };

  const handleEdit = (property: Property) => {
    setFormData(property);
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este anúncio?")) {
      deleteProperty(id);
      loadMyProperties();
    }
  };

  const resetForm = () => {
    setFormData({
      type: PropertyType.HOUSE,
      city: '',
      district: '',
      price: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      title: '',
      description: '',
      imageUrl: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meus Anúncios</h1>
          <p className="text-gray-500">Gerencie suas propriedades à venda</p>
        </div>
        <button 
          onClick={() => { resetForm(); setFormVisible(true); }}
          className="bg-secondary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Novo Anúncio</span>
        </button>
      </div>

      {/* Form Modal/Section */}
      {formVisible && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}</h2>
              <button onClick={() => setFormVisible(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Anúncio</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded-lg" placeholder="Ex: Casa linda no centro" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                   <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border p-2 rounded-lg bg-white">
                     {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                   <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                   <input required type="number" name="area" value={formData.area} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                   <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                   <input required name="district" value={formData.district} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                </div>

                {formData.type !== PropertyType.LAND && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                      <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                      <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vagas</label>
                      <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleInputChange} className="w-full border p-2 rounded-lg" />
                    </div>
                  </>
                )}

                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto Principal</label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-600 transition-colors">
                        <ImageIcon size={18} />
                        <span>Escolher Imagem</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {formData.imageUrl && <span className="text-xs text-green-600 font-medium">Imagem selecionada</span>}
                    </div>
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
                    )}
                 </div>

                 <div className="col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-gray-700">Descrição</label>
                      <button 
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={loadingAi}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md flex items-center hover:bg-purple-200 transition-colors"
                      >
                        <Sparkles size={12} className="mr-1" />
                        {loadingAi ? 'Gerando...' : 'Gerar com IA'}
                      </button>
                    </div>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={4} 
                      className="w-full border p-2 rounded-lg"
                      placeholder="Descreva o imóvel..."
                    ></textarea>
                 </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setFormVisible(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600 shadow-md">
                  {isEditing ? 'Salvar Alterações' : 'Criar Anúncio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {myProperties.length > 0 ? (
           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Imóvel</th>
                  <th className="p-4 font-semibold text-gray-600">Preço</th>
                  <th className="p-4 font-semibold text-gray-600">Cidade</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProperties.map(prop => (
                  <tr key={prop.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{prop.title}</div>
                      <div className="text-xs text-gray-500">{prop.type}</div>
                    </td>
                    <td className="p-4 text-gray-600">R$ {prop.price.toLocaleString('pt-BR')}</td>
                    <td className="p-4 text-gray-600">{prop.city}</td>
                    <td className="p-4 flex justify-end space-x-2">
                      <button onClick={() => handleEdit(prop)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(prop.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-gray-500">
            Você ainda não cadastrou nenhum imóvel.
          </div>
        )}
      </div>
    </div>
  );
};