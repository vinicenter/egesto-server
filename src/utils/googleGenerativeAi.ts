import { GoogleGenerativeAI, ModelParams } from '@google/generative-ai';

export const getModel = (params: ModelParams) => {
  const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!API_KEY) {
    throw new Error('Google Generative AI API Key not found');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  return genAI.getGenerativeModel(params);
};
