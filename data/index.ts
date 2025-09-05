// Data layer exports
// This provides a clean interface for the application to interact with data

export * from './models';
export * from './storage';
export * from './transformers';
export * from './service';

// Re-export the main service as default
export { default as AuctionDataService } from './service';

// Export commonly used types
export type {
  Sale,
  Indicator,
  ExchangeRate,
  BuyerPurchase,
  OfferingAnalysis,
  AveragePricesClean,
  CompleteAuctionData,
  DatabaseStorage
} from './models';
