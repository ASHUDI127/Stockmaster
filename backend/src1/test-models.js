// ============================================
// Test script to list available Gemini models
// Run: node src/test-models.js
// ============================================
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Test different model names (current, supported variants only)
const modelsToTest = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing: ${modelName}`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "Hello"');
    const response = await result.response;
    console.log(`✅ SUCCESS: ${modelName} works!`);
    console.log(`   Response: ${response.text()}`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${modelName}`);
    console.log(`   Error: ${error.message.split('\n')[0]}`);
    return false;
  }
}

async function findWorkingModel() {
  console.log('🔍 Testing available Gemini models...\n');
  
  for (const modelName of modelsToTest) {
    const works = await testModel(modelName);
    if (works) {
      console.log(`\n✅ Found working model: ${modelName}`);
      console.log(`\nAdd this to your .env file:`);
      console.log(`GEMINI_MODEL=${modelName}`);
      return modelName;
    }
  }
  
  console.log('\n❌ No working models found. Check your API key and internet connection.');
}

findWorkingModel().catch(console.error);

