import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Chart from 'react-apexcharts';

interface AuctionEngagement {
  auction_id: string;
  catalogue_name: string;
  season_label: string;
  unique_visitors: number;
  views: number;
  downloads: number;
  section_interactions: number;
  avg_time_on_page: number;
  engagement_score: number;
}

interface SectionEngagement {
  auction_id: string;
  section_name: string;
  interactions: number;
  avg_time_visible_seconds: number;
  unique_visitors: number;
}

interface DataInteraction {
  auction_id: string;
  data_type: string;
  item_name: string;
  clicks: number;
  unique_visitors: number;
}

interface ChartInteraction {
  auction_id: string;
  chart_type: string;
  interaction_type: string;
  interactions: number;
  unique_users: number;
}

const AuctionEngagementDashboard: React.FC = () => {
  const [topAuctions, setTopAuctions] = useState<AuctionEngagement[]>([]);
  const [sectionEngagement, setSectionEngagement] = useState<SectionEngagement[]>([]);
  const [dataInteractions, setDataInteractions] = useState<DataInteraction[]>([]);
  const [chartInteractions, setChartInteractions] = useState<ChartInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuction, setSelectedAuction] = useState<string>('');

  const fetchEngagementData = async () => {
    try {
      setLoading(true);

      const [auctionsRes, sectionsRes, dataRes, chartsRes] = await Promise.all([
        supabase.from('v_top_performing_auctions').select('*').limit(10),
        supabase.from('v_auction_section_engagement').select('*').limit(20),
        supabase.from('v_auction_data_interactions').select('*').limit(15),
        supabase.from('v_auction_chart_engagement').select('*').limit(15)
      ]);

      if (auctionsRes.data) setTopAuctions(auctionsRes.data);
      if (sectionsRes.data) setSectionEngagement(sectionsRes.data);
      if (dataRes.data) setDataInteractions(dataRes.data);
      if (chartsRes.data) setChartInteractions(chartsRes.data);

    } catch (error) {
      console.error('Error fetching engagement data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagementData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading auction engagement data...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data for section engagement
  const sectionChartOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    dataLabels: { enabled: false },
    colors: ['#3B82F6'],
    xaxis: {
      categories: sectionEngagement.slice(0, 10).map(s => s.section_name)
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} interactions`
      }
    }
  };

  const sectionChartSeries = [{
    name: 'Interactions',
    data: sectionEngagement.slice(0, 10).map(s => s.interactions)
  }];

  // Prepare chart data for auction performance
  const auctionChartOptions = {
    chart: { type: 'scatter', toolbar: { show: false } },
    colors: ['#10B981'],
    xaxis: {
      title: { text: 'Unique Visitors' },
      type: 'numeric'
    },
    yaxis: {
      title: { text: 'Engagement Score' }
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex }: any) => {
        const auction = topAuctions[dataPointIndex];
        return `
          <div class="p-3 bg-white shadow-lg rounded">
            <div class="font-semibold">${auction?.catalogue_name || 'Unknown'}</div>
            <div class="text-sm text-gray-600">${auction?.season_label || ''}</div>
            <div class="text-sm">Visitors: ${auction?.unique_visitors || 0}</div>
            <div class="text-sm">Score: ${auction?.engagement_score?.toFixed(1) || 0}</div>
          </div>
        `;
      }
    }
  };

  const auctionChartSeries = [{
    name: 'Auctions',
    data: topAuctions.map(a => ({
      x: a.unique_visitors,
      y: a.engagement_score
    }))
  }];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Auction Engagement Analytics</h2>
            <p className="text-green-100">
              Deep insights into how users interact with your auction reports and which content drives the most engagement.
            </p>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Performing Auctions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auction Engagement Scatter Plot */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Auction Performance Overview</h3>
          <p className="text-sm text-gray-600 mb-6">Each dot represents an auction. Position shows visitor count vs engagement score.</p>
          {topAuctions.length > 0 ? (
            <Chart
              options={auctionChartOptions}
              series={auctionChartSeries}
              type="scatter"
              height={300}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>No auction data available yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Auction Rankings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Auctions</h3>
          <div className="space-y-4">
            {topAuctions.slice(0, 8).map((auction, index) => (
              <div 
                key={auction.auction_id} 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAuction === auction.auction_id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAuction(auction.auction_id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-yellow-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{auction.catalogue_name}</div>
                    <div className="text-sm text-gray-500">{auction.season_label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{auction.engagement_score.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">{auction.unique_visitors} visitors</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Engagement Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Engagement Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Engaging Sections</h3>
          <p className="text-sm text-gray-600 mb-6">Which parts of auction reports get the most attention?</p>
          {sectionEngagement.length > 0 ? (
            <Chart
              options={sectionChartOptions}
              series={sectionChartSeries}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              <p>No section engagement data available</p>
            </div>
          )}
        </div>

        {/* Data Interaction Heatmap */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Data Points</h3>
          <p className="text-sm text-gray-600 mb-6">Which producers, brokers, and buyers get clicked most?</p>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {dataInteractions.slice(0, 10).map((interaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{interaction.item_name}</div>
                  <div className="text-sm text-gray-500 capitalize">{interaction.data_type.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{interaction.clicks}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (interaction.clicks / Math.max(...dataInteractions.map(d => d.clicks))) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Interactions & User Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Interactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Interactions</h3>
          <div className="space-y-3">
            {chartInteractions.slice(0, 6).map((chart, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-sm">{chart.chart_type}</div>
                  <div className="text-xs text-gray-500">{chart.interaction_type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{chart.interactions}</div>
                  <div className="text-xs text-gray-500">{chart.unique_users} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Auctions Tracked</span>
              <span className="font-semibold text-gray-900">{topAuctions.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Avg. Engagement Score</span>
              <span className="font-semibold text-green-600">
                {topAuctions.length > 0 ? (topAuctions.reduce((sum, a) => sum + a.engagement_score, 0) / topAuctions.length).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Section Views</span>
              <span className="font-semibold text-blue-600">
                {sectionEngagement.reduce((sum, s) => sum + s.interactions, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Data Point Clicks</span>
              <span className="font-semibold text-purple-600">
                {dataInteractions.reduce((sum, d) => sum + d.clicks, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-3 text-sm">
            {topAuctions.length > 0 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Top Performer</div>
                <div className="text-green-700">{topAuctions[0]?.catalogue_name} leads with {topAuctions[0]?.unique_visitors} visitors</div>
              </div>
            )}
            {sectionEngagement.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Most Engaging</div>
                <div className="text-blue-700">"{sectionEngagement[0]?.section_name}" section gets most attention</div>
              </div>
            )}
            {dataInteractions.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">Popular Data</div>
                <div className="text-purple-700">"{dataInteractions[0]?.item_name}" gets most clicks</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionEngagementDashboard;
