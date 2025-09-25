/**
 * OVK-specific analytics helper functions
 * Use these throughout the app to track business events
 */

import analytics, { useAnalytics } from './analytics';

// Section visibility tracking for key areas
export const trackSectionVisibility = (sectionId: string, element: Element) => {
  return analytics.trackSectionVisibility(sectionId, element);
};

// Auction-specific tracking with detailed engagement
export const trackReportView = (auctionId: string, seasonLabel?: string, catalogueName?: string) => {
  analytics.trackReportView(auctionId, auctionId);
  analytics.track('custom', {
    event_name: 'auction_report_view',
    auction_id: auctionId,
    season_label: seasonLabel,
    catalogue_name: catalogueName,
    page_type: 'auction_report',
    timestamp: Date.now()
  });
};

// Enhanced auction engagement tracking
export const trackAuctionSectionView = (auctionId: string, sectionName: string, timeVisible: number) => {
  analytics.track('section_view', {
    auction_id: auctionId,
    section_name: sectionName,
    time_visible_ms: timeVisible,
    event_name: 'auction_section_engagement',
    timestamp: Date.now()
  });
};

export const trackAuctionChartInteraction = (auctionId: string, chartType: string, interactionType: string) => {
  analytics.track('custom', {
    event_name: 'auction_chart_interaction',
    auction_id: auctionId,
    chart_type: chartType,
    interaction_type: interactionType,
    timestamp: Date.now()
  });
};

export const trackAuctionDataClick = (auctionId: string, dataType: string, itemName: string) => {
  analytics.track('custom', {
    event_name: 'auction_data_click',
    auction_id: auctionId,
    data_type: dataType, // 'producer', 'broker', 'buyer', 'micron_price'
    item_name: itemName,
    timestamp: Date.now()
  });
};

export const trackAuctionTabChange = (auctionId: string, fromTab: string, toTab: string) => {
  analytics.track('custom', {
    event_name: 'auction_tab_change',
    auction_id: auctionId,
    from_tab: fromTab,
    to_tab: toTab,
    timestamp: Date.now()
  });
};

export const trackAuctionExport = (auctionId: string, exportType: string, sectionExported: string) => {
  analytics.track('custom', {
    event_name: 'auction_export',
    auction_id: auctionId,
    export_type: exportType, // 'pdf', 'csv', 'excel'
    section_exported: sectionExported,
    timestamp: Date.now()
  });
};

export const trackReportDownload = (auctionId: string, format: string = 'pdf') => {
  analytics.trackReportDownload(auctionId, format);
  analytics.track('custom', {
    event_name: 'auction_report_download',
    auction_id: auctionId,
    format,
    timestamp: Date.now()
  });
};

// Producer/performance tracking
export const trackProducerClick = (producerName: string, auctionId?: string) => {
  analytics.trackBidClick(producerName, auctionId);
  analytics.track('custom', {
    event_name: 'producer_click',
    producer_name: producerName,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

export const trackBrokerClick = (brokerName: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'broker_click',
    broker_name: brokerName,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

export const trackBuyerClick = (buyerName: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'buyer_click',
    buyer_name: buyerName,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

// Market data interactions
export const trackChartInteraction = (chartType: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'chart_interaction',
    chart_type: chartType,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

export const trackFilterChange = (filterType: string, filterValue: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'filter_change',
    filter_type: filterType,
    filter_value: filterValue,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

// Navigation tracking
export const trackSeasonChange = (fromSeason: string, toSeason: string) => {
  analytics.track('custom', {
    event_name: 'season_change',
    from_season: fromSeason,
    to_season: toSeason,
    timestamp: Date.now()
  });
};

export const trackAuctionChange = (fromAuction: string, toAuction: string) => {
  analytics.track('custom', {
    event_name: 'auction_change',
    from_auction: fromAuction,
    to_auction: toAuction,
    timestamp: Date.now()
  });
};

// Search and discovery
export const trackSearchQuery = (query: string, resultsCount: number) => {
  analytics.track('custom', {
    event_name: 'search_query',
    query: query.substring(0, 100), // Limit query length for privacy
    results_count: resultsCount,
    timestamp: Date.now()
  });
};

export const trackProvinceClick = (provinceName: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'province_click',
    province_name: provinceName,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

// Performance insights
export const trackPerformanceIssue = (issueType: string, details: any) => {
  analytics.track('custom', {
    event_name: 'performance_issue',
    issue_type: issueType,
    details: JSON.stringify(details).substring(0, 500),
    timestamp: Date.now()
  });
};

// Mobile-specific events
export const trackMobileMenuOpen = () => {
  analytics.track('custom', {
    event_name: 'mobile_menu_open',
    timestamp: Date.now()
  });
};

export const trackMobileMenuClose = () => {
  analytics.track('custom', {
    event_name: 'mobile_menu_close',
    timestamp: Date.now()
  });
};

// Data export events
export const trackDataExport = (exportType: string, format: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'data_export',
    export_type: exportType,
    format,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

// User engagement with content
export const trackContentEngagement = (contentType: string, action: string, auctionId?: string) => {
  analytics.track('custom', {
    event_name: 'content_engagement',
    content_type: contentType,
    action,
    auction_id: auctionId,
    timestamp: Date.now()
  });
};

// Error tracking
export const trackUserError = (errorType: string, errorMessage: string, context?: any) => {
  analytics.track('js_error', {
    error_type: errorType,
    message: errorMessage.substring(0, 500),
    context: context ? JSON.stringify(context).substring(0, 500) : null,
    timestamp: Date.now()
  });
};

// React hook for easy component usage
export const useOVKAnalytics = () => {
  const baseAnalytics = useAnalytics();
  
  return {
    ...baseAnalytics,
    // OVK-specific tracking
    trackReportView,
    trackReportDownload,
    trackProducerClick,
    trackBrokerClick,
    trackBuyerClick,
    trackChartInteraction,
    trackFilterChange,
    trackSeasonChange,
    trackAuctionChange,
    trackSearchQuery,
    trackProvinceClick,
    trackPerformanceIssue,
    trackMobileMenuOpen,
    trackMobileMenuClose,
    trackDataExport,
    trackContentEngagement,
    trackUserError,
    trackSectionVisibility
  };
};

export default {
  trackReportView,
  trackReportDownload,
  trackProducerClick,
  trackBrokerClick,
  trackBuyerClick,
  trackChartInteraction,
  trackFilterChange,
  trackSeasonChange,
  trackAuctionChange,
  trackSearchQuery,
  trackProvinceClick,
  trackPerformanceIssue,
  trackMobileMenuOpen,
  trackMobileMenuClose,
  trackDataExport,
  trackContentEngagement,
  trackUserError,
  trackSectionVisibility
};
