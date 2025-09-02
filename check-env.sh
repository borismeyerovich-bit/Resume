#!/bin/bash

echo "🔍 Checking Environment Configuration..."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'ENVEOF'
# OpenAI API Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# Alternative AI Providers (uncomment to use)
# NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
# NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME=ResumeTransformer
NEXT_PUBLIC_APP_VERSION=1.0.0

# Debug Mode (set to true for development)
NEXT_PUBLIC_DEBUG_AI=false
ENVEOF
    echo "✅ Created .env.local file"
    echo ""
fi

# Check if API key is set
if grep -q "NEXT_PUBLIC_OPENAI_API_KEY=" .env.local; then
    API_KEY=$(grep "NEXT_PUBLIC_OPENAI_API_KEY=" .env.local | cut -d'=' -f2)
    
    if [ "$API_KEY" = "your_openai_api_key_here" ]; then
        echo "⚠️  API key is still set to placeholder value"
        echo "📝 Please edit .env.local and replace 'your_openai_api_key_here' with your actual API key"
    elif [ -z "$API_KEY" ]; then
        echo "❌ API key is empty"
        echo "📝 Please add your API key to .env.local"
    else
        echo "✅ API key is configured"
        echo "🔑 Key starts with: ${API_KEY:0:10}..."
        echo "📏 Key length: ${#API_KEY} characters"
        
        if [[ $API_KEY == sk-* ]]; then
            echo "✅ Key format looks correct (starts with 'sk-')"
        else
            echo "⚠️  Key format might be incorrect (should start with 'sk-')"
        fi
    fi
else
    echo "❌ NEXT_PUBLIC_OPENAI_API_KEY not found in .env.local"
fi

echo ""
echo "📋 Current .env.local contents:"
echo "----------------------------------------"
cat .env.local
echo "----------------------------------------"
