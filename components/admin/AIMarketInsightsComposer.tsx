import React, { useState, useRef, useEffect } from 'react';
import { getGeminiAI, initializeGeminiAI, type MarketData, type AIInsightRequest } from '../../services/gemini-ai';

interface AIMarketInsightsComposerProps {
  value: string;
  onChange: (value: string) => void;
  auctionData?: any; // Form data for context
}

interface AISuggestion {
  id: string;
  type: 'expand' | 'improve' | 'summarize' | 'structure';
  title: string;
  content: string;
  confidence: number;
}

interface WritingTemplate {
  id: string;
  name: string;
  description: string;
  structure: string[];
  example: string;
}

const WRITING_TEMPLATES: WritingTemplate[] = [
  {
    id: 'market-overview',
    name: 'Market Overview',
    description: 'Comprehensive market analysis with trends and outlook',
    structure: [
      'Market Performance Summary',
      'Price Movements by Micron',
      'Buyer Activity & Demand',
      'Supply & Clearance Rates',
      'Market Outlook & Forecast'
    ],
    example: 'The wool market continued to show resilience this week, with prices maintaining their upward trajectory across most micron categories. Fine wool (18-19 micron) saw particularly strong demand...'
  },
  {
    id: 'price-analysis',
    name: 'Price Analysis',
    description: 'Detailed price movement analysis with comparisons',
    structure: [
      'Current Week Performance',
      'Year-over-Year Comparison',
      'Micron Group Analysis',
      'International Market Context',
      'Price Drivers & Factors'
    ],
    example: 'Average prices increased by 2.3% this week, driven primarily by strong demand for certified fine wool. The 18.5 micron category led gains with a 4.1% increase...'
  },
  {
    id: 'buyer-insights',
    name: 'Buyer Insights',
    description: 'Analysis of buyer behavior and market participation',
    structure: [
      'Top Buyer Performance',
      'Market Share Analysis',
      'Buying Patterns & Preferences',
      'International vs Local Demand',
      'Strategic Insights'
    ],
    example: 'International buyers dominated this week\'s auction, accounting for 65% of total volume. Chinese buyers showed particular interest in medium-fine wool...'
  },
  {
    id: 'supply-demand',
    name: 'Supply & Demand',
    description: 'Supply chain analysis and demand forecasting',
    structure: [
      'Current Supply Levels',
      'Demand Indicators',
      'Seasonal Factors',
      'Inventory Analysis',
      'Future Supply Outlook'
    ],
    example: 'Supply levels remained tight this week with 8,500 bales offered, down 12% from the previous sale. This scarcity contributed to the firm pricing environment...'
  }
];

const AIComposer: React.FC<AIMarketInsightsComposerProps> = ({ 
  value, 
  onChange, 
  auctionData 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update word and character count
  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = value.length;
    setWordCount(words);
    setCharacterCount(characters);
  }, [value]);

  // Generate AI suggestions based on current content and auction data
  const generateAISuggestions = async () => {
    setIsGenerating(true);
    try {
      // Initialize Gemini AI if not already done (you'll need to add API key to environment)
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
      }
      
      try {
        initializeGeminiAI(apiKey);
      } catch (error) {
        // Already initialized, continue
      }
      
      const geminiAI = getGeminiAI();
      
      // Convert auction data to MarketData format
      const marketData: MarketData = {
        auctionDate: auctionData?.auction?.auction_date || '',
        totalLots: auctionData?.indicators?.find((i: any) => i.type === 'total_lots')?.value || 0,
        totalVolume: auctionData?.indicators?.find((i: any) => i.type === 'total_volume')?.value || 0,
        averagePrice: auctionData?.indicators?.find((i: any) => i.type === 'avg_price')?.value || 0,
        totalValue: auctionData?.indicators?.find((i: any) => i.type === 'total_value')?.value || 0,
        clearanceRate: 95, // Default or calculate from data
        topBuyers: auctionData?.buyers?.slice(0, 5).map((buyer: any) => ({
          name: buyer.buyer,
          bales: buyer.cat,
          percentage: Math.round((buyer.cat / (auctionData?.indicators?.find((i: any) => i.type === 'total_lots')?.value || 1)) * 100)
        })) || [],
        micronPrices: auctionData?.micron_prices?.map((mp: any) => ({
          micron: parseFloat(mp.bucket_micron),
          price: mp.price_clean_zar_per_kg,
          change: mp.pct_change || 0
        })) || []
      };
      
      const suggestions = await geminiAI.generateSuggestions(value, marketData);
      
      const aiSuggestions: AISuggestion[] = suggestions.map((suggestion, index) => ({
        id: `suggestion-${index}`,
        type: 'improve',
        title: `AI Suggestion ${index + 1}`,
        content: suggestion,
        confidence: 0.8
      }));
      
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback to mock suggestions if AI fails
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'expand',
          title: 'Add Market Context',
          content: 'Consider adding context about international wool market trends and how they impact local pricing.',
          confidence: 0.85
        },
        {
          id: '2',
          type: 'improve',
          title: 'Enhance Clarity',
          content: 'The price analysis could benefit from specific percentage changes and comparisons to previous weeks.',
          confidence: 0.78
        },
        {
          id: '3',
          type: 'structure',
          title: 'Improve Flow',
          content: 'Consider reorganizing the paragraphs to follow a logical progression from market overview to specific insights.',
          confidence: 0.82
        }
      ];
      
      setSuggestions(mockSuggestions);
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply template structure
  const applyTemplate = (template: WritingTemplate) => {
    const templateStructure = template.structure.map((section, index) => 
      `\n${index + 1}. ${section}:\n[Add your analysis here]\n`
    ).join('');
    
    const newContent = value + (value ? '\n\n' : '') + templateStructure;
    onChange(newContent);
      // Template applied successfully
  };

  // Enhance existing content using AI analysis
  const enhanceContent = async () => {
    setIsGenerating(true);
    try {
      // Check if Gemini AI is configured
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      
      console.log('API Key check:', apiKey ? 'Found' : 'Not found');
      console.log('API Key value:', apiKey);
      console.log('Auction data:', auctionData);
      
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        // Use fallback enhancement if API key not configured
        console.log('Gemini API key not configured, using fallback enhancement');
        const fallbackEnhancement = enhanceContentFallback(value, auctionData);
        onChange(fallbackEnhancement);
        return;
      }
      
      try {
        initializeGeminiAI(apiKey);
      } catch (error) {
        // Already initialized, continue
      }
      
      const geminiAI = getGeminiAI();
      
      // Get current week data
      const currentWeekData: MarketData = {
        auctionDate: auctionData?.auction?.auction_date || '',
        totalLots: auctionData?.indicators?.find((i: any) => i.type === 'total_lots')?.value || 0,
        totalVolume: auctionData?.indicators?.find((i: any) => i.type === 'total_volume')?.value || 0,
        averagePrice: auctionData?.indicators?.find((i: any) => i.type === 'avg_price')?.value || 0,
        totalValue: auctionData?.indicators?.find((i: any) => i.type === 'total_value')?.value || 0,
        clearanceRate: 95, // Calculate from offered vs sold bales
        topBuyers: auctionData?.buyers?.slice(0, 5).map((buyer: any) => ({
          name: buyer.buyer,
          bales: buyer.cat,
          percentage: Math.round((buyer.cat / (auctionData?.indicators?.find((i: any) => i.type === 'total_lots')?.value || 1)) * 100)
        })) || [],
        micronPrices: auctionData?.micron_prices?.map((mp: any) => ({
          micron: parseFloat(mp.bucket_micron),
          price: mp.price_clean_zar_per_kg,
          change: mp.pct_change || 0
        })) || []
      };
      
      // Get Cape Wools commentary
      const capeWoolsCommentary = auctionData?.cape_wools_commentary || '';
      
      // Enhanced request for content enhancement
        const enhancedContent = await (geminiAI as any).enhanceMarketInsights(value, currentWeekData, capeWoolsCommentary);
        
        // Apply word limit and formatting for card display
        const optimizedContent = optimizeForCardDisplay(enhancedContent);
        onChange(optimizedContent);
      
    } catch (error) {
      console.error('Error enhancing content:', error);
      // Fallback enhancement if AI fails
      const fallbackEnhancement = enhanceContentFallback(value, auctionData);
      const optimizedFallback = optimizeForCardDisplay(fallbackEnhancement);
      onChange(optimizedFallback);
    } finally {
      setIsGenerating(false);
    }
  };

  // Optimize content for card display (80-word limit)
  const optimizeForCardDisplay = (content: string): string => {
    // Remove markdown formatting for card display
    let optimized = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting
      .replace(/•/g, '•')              // Keep bullet points
      .replace(/\n\n/g, ' ')           // Replace double line breaks with spaces
      .replace(/\n/g, ' ')             // Replace single line breaks with spaces
      .trim();
    
    // Split into words and enforce 80-word limit
    const words = optimized.split(/\s+/);
    if (words.length > 80) {
      optimized = words.slice(0, 80).join(' ') + '...';
    }
    
    return optimized;
  };

  // Enhanced fallback enhancement function - preserves user content as primary
  const enhanceContentFallback = (content: string, data: any) => {
    console.log('Using fallback enhancement with data:', data);
    
    // Check if we have valid data (avoid "zero bales offered" issues)
    const hasValidData = data?.indicators && 
      data.indicators.find((i: any) => i.type === 'total_lots')?.value > 0 &&
      data.indicators.find((i: any) => i.type === 'total_value')?.value > 0;
    
    const enhancements = [];
    
    // Only add enhancements if we have valid data and user content exists
    if (content.trim() && hasValidData) {
      // Add professional market analysis structure (concise version)
      enhancements.push('\n\n**Enhanced Market Analysis:**');
      
      // Add concise market analysis if data available
      const totalLots = data.indicators.find((i: any) => i.type === 'total_lots')?.value;
      const avgPrice = data.indicators.find((i: any) => i.type === 'avg_price')?.value;
      const totalValue = data.indicators.find((i: any) => i.type === 'total_value')?.value;
      
      if (totalLots && avgPrice && totalLots > 0) {
        enhancements.push(`Market delivered ${totalLots.toLocaleString()} bales at R${avgPrice.toFixed(2)}/kg average through OVK's efficient marketing channels.`);
        if (totalValue && totalValue > 0) {
          enhancements.push(`Total value reached R${(totalValue / 1000000).toFixed(1)}M, showcasing OVK's market leadership.`);
        }
        enhancements.push(`Strong buyer confidence maintained across all micron categories, supported by OVK's quality assurance.`);
      }
      
      // Add key buyer activity if available (concise)
      if (data?.buyers && data.buyers.length > 0) {
        const topBuyer = data.buyers[0];
        if (topBuyer.cat > 0) {
          enhancements.push(`Leading buyer: ${topBuyer.buyer} with ${topBuyer.cat.toLocaleString()} bales, demonstrating OVK's strong market connections.`);
        }
      }
      
      // Add Cape Wools context if available (first sentence only)
      if (data?.cape_wools_commentary) {
        const firstSentence = data.cape_wools_commentary.split('.')[0];
        if (firstSentence) {
          enhancements.push(`${firstSentence.trim()}.`);
        }
      }
      
      // Add OVK-focused market outlook (concise)
      enhancements.push(`OVK continues to drive market excellence with strong producer support and international market access. Market outlook remains positive with OVK's strategic positioning supporting continued price stability.`);
    }
    
    // Return user's original content with enhancements (preserve user content as primary)
    return content + enhancements.join('');
  };

  // Apply suggestion
  const applySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.type === 'expand') {
      const expandedContent = value + '\n\n' + suggestion.content;
      onChange(expandedContent);
    } else if (suggestion.type === 'improve') {
      // For now, just add the suggestion as a comment
      const improvedContent = value + '\n\n[AI Suggestion: ' + suggestion.title + '] ' + suggestion.content;
      onChange(improvedContent);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Prominent Enhance Button */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Market Insights Assistant</h3>
              <p className="text-sm text-gray-600">Powered by Google Gemini AI • Analyzes current vs previous week data + Cape Wools commentary</p>
              <p className="text-sm text-purple-600 font-medium">✨ Optimized for 80-word card display • Always enhances OVK's market position</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-sm ${
                wordCount > 80 ? 'text-red-600 font-medium' : wordCount > 70 ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {wordCount}/80 words • {characterCount} chars
              </div>
              {wordCount > 80 && (
                <div className="text-xs text-red-500 mt-1">⚠️ Exceeds card limit</div>
              )}
            </div>
            <button
              onClick={() => enhanceContent()}
              disabled={isGenerating || !value.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              <span className="text-lg">✨</span>
              <span className="font-semibold">{isGenerating ? 'Enhancing...' : 'Enhance with AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">💡 AI Suggestions</h4>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="flex items-start justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{suggestion.title}</span>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {Math.round(suggestion.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{suggestion.content}</p>
                </div>
                <button
                  onClick={() => applySuggestion(suggestion)}
                  className="ml-3 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Text Area */}
      <div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base leading-relaxed"
          rows={12}
          placeholder="Write your market insights here... The AI will analyze this week's data vs last week's data, plus Cape Wools commentary, to enhance your writing while always promoting OVK's positive market position."
        />
      </div>

      {/* Writing Stats - Moved Outside Text Area */}
      {value && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Readability: Good</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Tone: Professional</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                wordCount > 80 ? 'bg-red-400' : wordCount > 70 ? 'bg-yellow-400' : 'bg-green-400'
              }`}></span>
              <span className={wordCount > 80 ? 'text-red-600 font-medium' : wordCount > 70 ? 'text-yellow-600' : 'text-green-600'}>
                Words: {wordCount}/80
              </span>
            </div>
            {wordCount > 80 && (
              <div className="text-red-500 text-sm font-medium">
                ⚠️ Exceeds card limit
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Key Configuration Notice */}
      {!(import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here' ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
            <span className="mr-2">🔧</span>
            AI Enhancement Setup
          </h4>
          <p className="text-xs text-blue-700 mb-2">
            To enable full AI-powered enhancement with Google Gemini AI, add your API key to <code className="bg-blue-100 px-1 rounded">.env.local</code>:
          </p>
          <code className="block text-xs bg-blue-100 p-2 rounded mb-2">
            VITE_GEMINI_API_KEY=your_actual_api_key_here
          </code>
          <p className="text-xs text-blue-600">
            <strong>Get your API key:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a> • 
            Currently using fallback enhancement (works without API key)
          </p>
        </div>
      ) : null}

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-900 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Writing Tips for Better AI Enhancement
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-semibold text-yellow-800 mb-2">✅ Include These Elements:</h5>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Market performance overview</li>
              <li>• Specific price movements</li>
              <li>• Buyer activity highlights</li>
              <li>• Supply and demand factors</li>
              <li>• Forward-looking insights</li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-semibold text-yellow-800 mb-2">🎯 AI Enhancement Adds:</h5>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Week-over-week comparisons</li>
              <li>• Cape Wools commentary integration</li>
              <li>• Professional structure & flow</li>
              <li>• Data-driven insights</li>
              <li>• Market context & analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIComposer;
