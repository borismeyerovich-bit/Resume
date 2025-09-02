# AI Integration Setup Guide

This guide shows you how to integrate GPT models and other AI providers into your ResumeTransformer app.

## Option 1: OpenAI GPT Models (Recommended)

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 2. Install Dependencies
```bash
npm install openai
```

### 3. Configure Environment
Add your API key to `.env.local`:
```
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 4. Enable Real AI Processing
In `src/services/aiService.ts`, uncomment the real GPT implementation sections and comment out the mock implementations.

## Option 2: Anthropic Claude

### 1. Get Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Create an API key
4. Copy the key

### 2. Install Dependencies
```bash
npm install @anthropic-ai/sdk
```

### 3. Configure Environment
```
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

## Option 3: Google AI (Gemini)

### 1. Get Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Create an API key
4. Copy the key

### 2. Install Dependencies
```bash
npm install @google/generative-ai
```

### 3. Configure Environment
```
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your-google-ai-api-key-here
```

## Option 4: Local AI Models (Free)

### Using Ollama (Local)
1. Install Ollama: https://ollama.ai/
2. Run a model: `ollama run llama2`
3. Use the local API endpoint

### Using Hugging Face
1. Get HF API key from https://huggingface.co/settings/tokens
2. Install: `npm install @huggingface/inference`
3. Configure with your API key

## Text Extraction Libraries

For processing different file types, install these libraries:

```bash
# For PDF files
npm install pdf-parse

# For Word documents
npm install mammoth

# For images (OCR)
npm install tesseract.js
```

## Cost Considerations

### OpenAI Pricing (as of 2024):
- GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- GPT-3.5-turbo: ~$0.001 per 1K input tokens, ~$0.002 per 1K output tokens

### Estimated Costs per Resume:
- **GPT-4**: $0.10 - $0.30 per resume
- **GPT-3.5-turbo**: $0.01 - $0.05 per resume

## Implementation Steps

1. **Choose your AI provider** (OpenAI recommended for best results)
2. **Install the required package**
3. **Add API key to environment variables**
4. **Uncomment the real implementation** in `aiService.ts`
5. **Test with a sample resume**

## Example Usage

```typescript
import { aiService } from './services/aiService';

// Process a resume file
const file = // ... your file
const americanizedResume = await aiService.processResumeFile(file);
```

## Error Handling

The AI service includes proper error handling for:
- API rate limits
- Invalid API keys
- Network timeouts
- Malformed responses

## Security Notes

- Never commit API keys to version control
- Use environment variables for all API keys
- Consider implementing rate limiting for production
- Add input validation and sanitization

## Testing

Test your AI integration with:
1. A simple text resume
2. A PDF resume
3. A Word document resume
4. Various resume formats and languages

## Troubleshooting

### Common Issues:
1. **"API key not found"**: Check your `.env.local` file
2. **"Rate limit exceeded"**: Implement retry logic or upgrade plan
3. **"Invalid response format"**: Add JSON parsing error handling
4. **"File type not supported"**: Install the required text extraction library

### Debug Mode:
Enable debug logging by setting:
```
NEXT_PUBLIC_DEBUG_AI=true
```

This will log all AI API calls and responses to the console.
