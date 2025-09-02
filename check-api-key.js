// Simple script to check if API key is configured correctly
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking API Key Configuration...\n');

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  console.log('❌ No API key found in .env.local');
  console.log('📝 Please add your OpenAI API key to .env.local:');
  console.log('   NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-key-here\n');
  process.exit(1);
}

if (apiKey === 'your_openai_api_key_here') {
  console.log('⚠️  API key is still set to placeholder value');
  console.log('📝 Please replace with your actual OpenAI API key in .env.local\n');
  process.exit(1);
}

if (!apiKey.startsWith('sk-')) {
  console.log('⚠️  API key format looks incorrect');
  console.log('📝 OpenAI API keys should start with "sk-"\n');
  process.exit(1);
}

console.log('✅ API key found and format looks correct');
console.log(`🔑 Key starts with: ${apiKey.substring(0, 10)}...`);
console.log(`📏 Key length: ${apiKey.length} characters`);

// Test if we can make a simple API call
console.log('\n🧪 Testing API connection...');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey });

openai.models.list()
  .then(() => {
    console.log('✅ API connection successful!');
    console.log('🎉 Your OpenAI integration is ready to use.\n');
  })
  .catch((error) => {
    console.log('❌ API connection failed:');
    console.log(`   ${error.message}\n`);
    
    if (error.message.includes('401')) {
      console.log('💡 This usually means your API key is invalid or expired.');
      console.log('   Please check your API key at: https://platform.openai.com/api-keys\n');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded. This is normal for testing.\n');
    } else {
      console.log('💡 Please check your internet connection and try again.\n');
    }
  });
