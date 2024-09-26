// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = 'AIzaSyC5QGeGG2IYPTkTYSA8IXXFfItvutWb-II';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeCode(code) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze the following code and provide suggestions for improvements, error detection, and code completion:

${code}

Please provide your analysis in the following format:
1. Error Detection:
2. Code Suggestions:
3. Potential Improvements:`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing code:', error);
    return 'An error occurred while analyzing the code.';
  }
}

export async function askQuestion(code, question) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Given the following code:

${code}

Answer this question about the code:
${question}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error answering question:', error);
    return 'An error occurred while answering the question.';
  }
}