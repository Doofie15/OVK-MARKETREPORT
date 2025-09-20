// Google Gemini AI Service for Market Insights Generation
// This service integrates with Google's Gemini AI API to provide intelligent market commentary

export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MarketData {
  auctionDate: string;
  totalLots: number;
  totalVolume: number;
  averagePrice: number;
  totalValue: number;
  clearanceRate: number;
  topBuyers: Array<{ name: string; bales: number; percentage: number }>;
  micronPrices: Array<{ micron: number; price: number; change: number }>;
  previousWeekData?: {
    averagePrice: number;
    totalValue: number;
    clearanceRate: number;
  };
}

export interface AIInsightRequest {
  marketData: MarketData;
  template?: 'market-overview' | 'price-analysis' | 'buyer-insights' | 'supply-demand';
  tone?: 'professional' | 'analytical' | 'informative';
  length?: 'brief' | 'medium' | 'comprehensive';
  focus?: string[];
}

export interface AIInsightResponse {
  content: string;
  suggestions: string[];
  confidence: number;
  wordCount: number;
  readingTime: number;
}

class GeminiAIService {
  private config: GeminiConfig;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(config: GeminiConfig) {
    this.config = {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    };
  }

  // Generate market insights using Gemini AI
  async generateMarketInsights(request: AIInsightRequest): Promise<AIInsightResponse> {
    const prompt = this.buildPrompt(request);
    
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        content: content.trim(),
        suggestions: [], // Suggestions would be generated separately if needed
        confidence: 0.85, // This would be calculated based on AI response quality
        wordCount: content.split(' ').length,
        readingTime: Math.ceil(content.split(' ').length / 200) // Average reading speed
      };
    } catch (error) {
      console.error('Error calling Gemini AI:', error);
      throw new Error('Failed to generate market insights. Please try again.');
    }
  }

  // Enhance existing market insights with AI analysis
  async enhanceMarketInsights(existingContent: string, currentWeekData: MarketData, capeWoolsCommentary: string): Promise<string> {
    const prompt = `You are a wool market analyst. I have existing market commentary that needs to be enhanced with professional analysis.

EXISTING CONTENT:
"${existingContent}"

CURRENT WEEK DATA:
- Auction Date: ${currentWeekData.auctionDate}
- Total Bales: ${currentWeekData.totalLots.toLocaleString()}
- Total Volume: ${currentWeekData.totalVolume.toLocaleString()} MT
- Average Price: R${currentWeekData.averagePrice.toFixed(2)}/kg
- Total Value: R${(currentWeekData.totalValue / 1000000).toFixed(1)}M
- Clearance Rate: ${currentWeekData.clearanceRate}%

Top Buyers:
${currentWeekData.topBuyers.map(buyer => `- ${buyer.name}: ${buyer.bales.toLocaleString()} bales (${buyer.percentage}%)`).join('\n')}

Price Performance by Micron:
${currentWeekData.micronPrices.map(mp => `- ${mp.micron}µm: R${mp.price.toFixed(2)}/kg (${mp.change > 0 ? '+' : ''}${mp.change.toFixed(1)}%)`).join('\n')}

CAPE WOOLS COMMENTARY:
"${capeWoolsCommentary}"

    TASK: Enhance the existing content by:
    1. Preserving the original structure and key points
    2. Adding professional market analysis and insights
    3. Incorporating specific data points and percentages
    4. Including week-over-week comparisons where relevant
    5. Integrating insights from the Cape Wools commentary
    6. Adding forward-looking market outlook
    7. Maintaining professional, objective tone
    8. Using bullet points for key highlights
    9. CRITICAL: Keep the response under 80 words for card display
    10. Focus on the most important insights and key data points
    11. Use concise, impactful language
    12. Prioritize market performance, price movements, and buyer activity
    13. ALWAYS highlight OVK's positive market position and contributions
    15. Mention OVK's commitment to market stability and producer success
    16. Position OVK as a key player in the wool market ecosystem
    
    Return the enhanced content that flows naturally and provides comprehensive yet concise market analysis suitable for a small display card, while always promoting OVK's positive market influence.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || existingContent;
    } catch (error) {
      console.error('Error enhancing market insights:', error);
      throw new Error('Failed to enhance market insights. Please try again.');
    }
  }

  // Generate writing suggestions based on content
  async generateSuggestions(content: string, marketData: MarketData): Promise<string[]> {
    const prompt = `Analyze this market commentary and provide 3 specific suggestions for improvement:

Content: "${content}"

Market Data:
- Total Lots: ${marketData.totalLots}
- Average Price: ${marketData.averagePrice}
- Clearance Rate: ${marketData.clearanceRate}%
- Top Buyers: ${marketData.topBuyers.map(b => `${b.name} (${b.percentage}%)`).join(', ')}

Provide specific, actionable suggestions for:
1. Adding missing market context
2. Improving clarity or structure
3. Enhancing insights or analysis

Format as a simple list of suggestions.`;

    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 500,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const suggestionsText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse suggestions into array
      return suggestionsText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, 3);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [
        'Consider adding more specific data points and percentages',
        'Include insights about buyer behavior and market drivers',
        'Provide forward-looking analysis and market outlook'
      ];
    }
  }

  // Build comprehensive prompt for market insights generation
  private buildPrompt(request: AIInsightRequest): string {
    const { marketData, template, tone, length, focus } = request;
    
    let templateInstructions = '';
    switch (template) {
      case 'market-overview':
        templateInstructions = `Structure your response with:
1. Market Performance Summary
2. Price Movements by Micron
3. Buyer Activity & Demand
4. Supply & Clearance Rates
5. Market Outlook & Forecast`;
        break;
      case 'price-analysis':
        templateInstructions = `Focus on:
1. Current Week Performance
2. Year-over-Year Comparison
3. Micron Group Analysis
4. International Market Context
5. Price Drivers & Factors`;
        break;
      case 'buyer-insights':
        templateInstructions = `Analyze:
1. Top Buyer Performance
2. Market Share Analysis
3. Buying Patterns & Preferences
4. International vs Local Demand
5. Strategic Insights`;
        break;
      case 'supply-demand':
        templateInstructions = `Cover:
1. Current Supply Levels
2. Demand Indicators
3. Seasonal Factors
4. Inventory Analysis
5. Future Supply Outlook`;
        break;
    }

    const toneInstruction = tone === 'professional' ? 'Use professional, objective language suitable for industry reports' :
                           tone === 'analytical' ? 'Use analytical language with data-driven insights' :
                           'Use clear, informative language accessible to all readers';

    const lengthInstruction = length === 'brief' ? 'Keep the response concise (100-200 words)' :
                             length === 'medium' ? 'Provide moderate detail (200-400 words)' :
                             'Provide comprehensive analysis (400-600 words)';

    return `You are a wool market analyst writing a weekly market report for South African wool producers and traders. 

Generate market insights based on this auction data:
- Auction Date: ${marketData.auctionDate}
- Total Lots: ${marketData.totalLots.toLocaleString()} bales
- Total Volume: ${marketData.totalVolume.toLocaleString()} MT
- Average Price: R${marketData.averagePrice.toFixed(2)}/kg
- Total Value: R${(marketData.totalValue / 1000000).toFixed(1)}M
- Clearance Rate: ${marketData.clearanceRate}%

Top Buyers:
${marketData.topBuyers.map(buyer => `- ${buyer.name}: ${buyer.bales.toLocaleString()} bales (${buyer.percentage}%)`).join('\n')}

Price Performance by Micron:
${marketData.micronPrices.map(mp => `- ${mp.micron}µm: R${mp.price.toFixed(2)}/kg (${mp.change > 0 ? '+' : ''}${mp.change.toFixed(1)}%)`).join('\n')}

${marketData.previousWeekData ? `
Previous Week Comparison:
- Average Price: R${marketData.previousWeekData.averagePrice.toFixed(2)}/kg
- Total Value: R${(marketData.previousWeekData.totalValue / 1000000).toFixed(1)}M
- Clearance Rate: ${marketData.previousWeekData.clearanceRate}%
` : ''}

Requirements:
- ${toneInstruction}
- ${lengthInstruction}
- ${templateInstructions}
- Include specific data points and percentages
- Mention key market drivers and trends
- Provide forward-looking insights
- Use bullet points for key highlights
- Maintain professional tone throughout

${focus ? `Special focus areas: ${focus.join(', ')}` : ''}

Generate comprehensive market insights now:`;
  }

}

// Singleton instance
let geminiService: GeminiAIService | null = null;

export const initializeGeminiAI = (apiKey: string): GeminiAIService => {
  geminiService = new GeminiAIService({ apiKey });
  return geminiService;
};

export const getGeminiAI = (): GeminiAIService => {
  if (!geminiService) {
    throw new Error('Gemini AI service not initialized. Call initializeGeminiAI() first.');
  }
  return geminiService;
};

export default GeminiAIService;
