import { GoogleGenAI } from "@google/genai";
import { PropertyType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateProps {
  type: PropertyType;
  city: string;
  district: string;
  area: number;
  bedrooms: number;
  price: number;
  features: string;
}

export const generatePropertyDescription = async (data: GenerateProps): Promise<string> => {
  try {
    const prompt = `
      Atue como um corretor de imóveis experiente. Escreva uma descrição curta, atraente e vendedora (máximo 300 caracteres) para um imóvel com as seguintes características:
      Tipo: ${data.type}
      Localização: ${data.district}, ${data.city}
      Área: ${data.area}m²
      Quartos: ${data.bedrooms}
      Preço: R$ ${data.price}
      Destaques extras: ${data.features}

      Use formatação Markdown simples se necessário. Foque nos benefícios. Em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao gerar descrição com Gemini:", error);
    return "Descrição indisponível no momento. Por favor, escreva manualmente.";
  }
};