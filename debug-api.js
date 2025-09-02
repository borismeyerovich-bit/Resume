// Debug script to test the API endpoints
require('dotenv').config({ path: '.env.local' });

async function testTextExtraction() {
  console.log('🧪 Testing text extraction API...');
  
  // Create a mock file
  const mockFile = new File(['Test resume content'], 'test.pdf', { type: 'application/pdf' });
  
  const formData = new FormData();
  formData.append('file', mockFile);
  
  try {
    const response = await fetch('http://localhost:3010/api/ai/extract-text', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    console.log('📄 Text extraction result:', result);
    return result.text;
  } catch (error) {
    console.error('❌ Text extraction failed:', error);
    return null;
  }
}

async function testAIExtraction(text) {
  console.log('🤖 Testing AI extraction API...');
  
  try {
    const response = await fetch('http://localhost:3010/api/ai/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText: text }),
    });
    
    const result = await response.json();
    console.log('🧠 AI extraction result:', result);
    return result;
  } catch (error) {
    console.error('❌ AI extraction failed:', error);
    return null;
  }
}

async function testAITransform(resume) {
  console.log('🇺🇸 Testing AI transformation API...');
  
  try {
    const response = await fetch('http://localhost:3010/api/ai/transform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resume }),
    });
    
    const result = await response.json();
    console.log('✨ AI transformation result:', result);
    return result;
  } catch (error) {
    console.error('❌ AI transformation failed:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  // Test 1: Text extraction
  const extractedText = await testTextExtraction();
  if (!extractedText) {
    console.log('❌ Text extraction failed, stopping tests');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: AI extraction
  const extractedResume = await testAIExtraction(extractedText);
  if (!extractedResume) {
    console.log('❌ AI extraction failed, stopping tests');
    return;
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: AI transformation
  const transformedResume = await testAITransform(extractedResume);
  if (!transformedResume) {
    console.log('❌ AI transformation failed');
    return;
  }
  
  console.log('\n🎉 All tests completed successfully!');
}

runTests();
