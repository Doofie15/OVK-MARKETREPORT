# AI Market Insights Composer Setup Guide

## Overview

The OVK Wool Market Report Platform includes an advanced AI-powered market insights composer that leverages Google Gemini AI to generate professional market commentary. This guide will help you set up and configure the AI composer for optimal performance.

## Features

### 🤖 AI-Powered Enhancement
- **Intelligent Analysis**: AI analyzes current week's auction data against historical trends
- **Cape Wools Integration**: Incorporates official Cape Wools market commentary into analysis
- **Professional Content**: Generates industry-appropriate market insights and commentary
- **80-Word Optimization**: Content automatically optimized for small card display format
- **Real-time Enhancement**: One-click content enhancement with immediate results
- **OVK Brand Enhancement**: Always highlights OVK's positive market position and contributions
- **Content Preservation**: AI preserves user's original content as foundation while enhancing it professionally
- **Data Validation**: Built-in validation to prevent "zero bales offered" and invalid data references
- **Database Integration**: Market insights are properly saved to database with full CRUD operations

### 🛡️ Fallback System
- **Robust Local Enhancement**: Works without API key using local enhancement algorithms
- **Data-Driven Insights**: Uses auction data to create meaningful market analysis
- **Professional Output**: Maintains quality even when AI API is unavailable

## Setup Instructions

### 1. Get a Google Gemini API Key

1. **Visit Google AI Studio**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select your project or create a new one
   - Copy the generated API key

3. **Secure Storage**
   - Never commit API keys to version control
   - Use environment variables for storage

### 2. Configure Environment Variables

#### Development Setup
Create a `.env.local` file in your project root:

```env
# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=AIzaSyDPSxtTYG2_Cf2sdpsMkZuVvVhfg4nOsx8

# Application Configuration
VITE_APP_NAME=OVK Wool Market Report
VITE_APP_VERSION=1.0.0

# API Configuration (for backend integration)
VITE_API_URL=http://localhost:3001
```

#### Production Setup
For production deployments, set the environment variable in your hosting platform:

**Vercel:**
```bash
vercel env add VITE_GEMINI_API_KEY
```

**Netlify:**
```bash
netlify env:set VITE_GEMINI_API_KEY your_api_key_here
```

**Traditional Hosting:**
```env
VITE_GEMINI_API_KEY=your_production_api_key_here
```

### 3. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Usage Guide

### Accessing the AI Composer

1. **Navigate to Admin Panel**
   - Click "Admin Panel" in the header
   - Enter your credentials

2. **Open Market Insights**
   - Go to "Edit Auction Report"
   - Click on "Market Insights" tab

3. **Use the AI Composer**
   - Fill in auction data (lots, prices, buyers, etc.)
   - Paste Cape Wools commentary in the dedicated field
   - Write your initial insights in the main text area
   - Click "Enhance with AI" button

### Word Count Management

The AI composer enforces an 80-word limit for optimal card display:

- **Green (0-70 words)**: Optimal length
- **Yellow (71-80 words)**: Warning zone
- **Red (81+ words)**: Exceeds limit

### Content Optimization

The AI composer automatically:
- Removes markdown formatting for card display
- Enforces 80-word limit with ellipsis if exceeded
- Maintains professional tone and structure
- Incorporates key market data points

### AI Enhancement Approach

The AI composer follows a specific enhancement methodology:

1. **Foundation First**: User's original content serves as the primary foundation
2. **Professional Enhancement**: AI improves wording, structure, grammar, and flow
3. **Market Context**: Adds professional market insights and industry terminology
4. **Data Integration**: Incorporates valid auction data only when meaningful (> 0 values)
5. **Brand Positioning**: Subtly integrates OVK's positive market position
6. **Content Transformation**: Transforms user ideas into professional market commentary

**Example Enhancement Process**:
- **User Input**: "Market was good this week, prices went up"
- **AI Enhancement**: "Market delivered strong performance this week with prices showing upward momentum. The positive trend reflects continued buyer confidence and OVK's effective market positioning."

## Troubleshooting

### API Key Issues

**Problem**: "Gemini API key not configured" error
**Solution**: 
1. Verify your API key is correctly set in `.env.local`
2. Restart the development server
3. Check that the key starts with `AIzaSy`

**Problem**: API calls failing
**Solution**:
1. Check your internet connection
2. Verify API key permissions
3. Check Google AI Studio for quota limits

### Fallback Mode

If the AI API is unavailable, the composer automatically switches to fallback mode:
- Uses local enhancement algorithms
- Incorporates auction data and Cape Wools commentary
- Maintains professional output quality
- Shows fallback indicator in the UI

### Content Quality

**Problem**: Content too generic
**Solution**:
1. Ensure auction data is complete
2. Include Cape Wools commentary
3. Provide detailed initial insights
4. Use specific market terminology

### OVK Brand Enhancement

The AI composer is specifically configured to always enhance OVK's market position:
- **Market Leadership**: Highlights OVK's role as a market leader
- **Producer Support**: Emphasizes OVK's commitment to South African wool producers
- **Quality Assurance**: Mentions OVK's quality standards and market connections
- **Strategic Positioning**: Positions OVK as a key player in the wool market ecosystem

**Example Output**: "Market delivered 6,507 bales at R197.55/kg average through OVK's efficient marketing channels. Total value reached R125.4M, showcasing OVK's market leadership. Strong buyer confidence maintained across all micron categories, supported by OVK's quality assurance."

## Best Practices

### Data Preparation
- **Complete Auction Data**: Fill in all available auction metrics
- **Cape Wools Commentary**: Include official market commentary
- **Initial Insights**: Provide detailed starting content for better AI enhancement

### Content Optimization
- **Review AI Output**: Always review and refine AI-generated content
- **Maintain Brand Voice**: Ensure content aligns with company messaging
- **Verify Facts**: Double-check all data points and statistics

### Security
- **API Key Protection**: Never expose API keys in client-side code
- **Environment Variables**: Use proper environment variable management
- **Access Control**: Restrict admin panel access appropriately

## Advanced Configuration

### Custom Prompts
The AI service can be customized by modifying the prompt in `services/gemini-ai.ts`:

```typescript
const prompt = `You are a wool market analyst. I have existing market commentary that needs to be enhanced with professional analysis.

// Customize this prompt for your specific needs
`;
```

### Word Limit Adjustment
To change the 80-word limit, modify the `optimizeForCardDisplay` function in `components/admin/AIMarketInsightsComposer.tsx`:

```typescript
// Change 80 to your desired limit
if (words.length > 80) {
  optimized = words.slice(0, 80).join(' ') + '...';
}
```

## Support

For technical support or questions about the AI composer:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Contact the development team
4. Refer to the main project documentation

---

**Note**: The AI composer works in both full AI mode (with API key) and fallback mode (without API key), ensuring continuous functionality regardless of configuration.