# OVK Wool Market Report - Data Points Documentation

## Overview

This document provides comprehensive documentation of all data points, calculations, and data structures used in the OVK Wool Market Report Platform. The system handles complex market data with season-to-date calculations, provincial analytics, and real-time data synchronization.

## Market Overview Data Points

### Total Lots
- **Current Auction**: `supply_statistics_bales_offered`
- **Season-to-Date**: Sum of `supply_statistics_bales_offered` across all published auctions in the current season
- **Unit**: Bales
- **Display Format**: `9,196 bales` (current) with `YTD: 50,123 bales` (season total)

### Total Volume
- **Current Auction**: `greasy_statistics_mass / 1000` (converted to MT)
- **Season-to-Date**: Sum of `greasy_statistics_mass / 1000` across all published auctions in the current season
- **Unit**: Metric Tons (MT)
- **Display Format**: `1,311.248 MT` (current) with `YTD: 7,580.4 MT` (season total)

### Total Value
- **Current Auction**: `greasy_statistics_turnover / 1000000` (converted to ZAR M)
- **Season-to-Date**: Sum of `greasy_statistics_turnover / 1000000` across all published auctions in the current season
- **Unit**: ZAR Million
- **Display Format**: `136.1 ZAR M` (current) with `YTD: 1,250.8 ZAR M` (season total)

### Average Price
- **Current Auction**: `all_merino_sa_c_kg_clean / 100` (converted from cents to Rands)
- **Unit**: ZAR/kg
- **Display Format**: `175.04 ZAR/kg`

## Market Benchmarks

### Certified Wool Price
- **Source**: `certified_sa_c_kg_clean / 100`
- **Unit**: ZAR/kg clean
- **Display Format**: `180.00 ZAR/kg`

### All-Merino Wool Price
- **Source**: `all_merino_sa_c_kg_clean / 100`
- **Unit**: ZAR/kg clean
- **Display Format**: `175.04 ZAR/kg`

### AWEX (Australian Wool Exchange)
- **Source**: `exchange_rates_sa_c_kg_clean_awex_emi / 100`
- **Unit**: USD/kg clean
- **Display Format**: `12.47 USD/kg`

## Currency Exchange Rates

### ZAR/USD
- **Source**: `exchange_rates_zar_usd`
- **Display Format**: `R17.67`

### ZAR/EUR
- **Source**: `exchange_rates_zar_eur`
- **Display Format**: `R20.54`

### ZAR/JPY
- **Source**: `exchange_rates_zar_jpy`
- **Display Format**: `R8.38`

### ZAR/GBP
- **Source**: `exchange_rates_zar_gbp`
- **Display Format**: `R23.79`

### USD/AUD
- **Source**: `exchange_rates_usd_aud`
- **Display Format**: `$1.45`

## Buyer Performance Data

### Market Share
- **Source**: `buyer_performance.share_pct`
- **Unit**: Percentage
- **Display Format**: `15.2%`

### Bales This Auction
- **Source**: `buyer_performance.cat`
- **Unit**: Bales
- **Display Format**: `1,250 bales`

### Total Bales for Season
- **Calculation**: Sum of `buyer_performance.cat` across all published auctions for the buyer in the current season
- **Unit**: Bales
- **Display Format**: `15,750 bales`

## Broker Performance Data

### Catalogue Offering
- **Source**: `broker_performance.catalogue_offering`
- **Unit**: Bales
- **Display Format**: `2,500 bales`
- **Sorting**: Always sorted from high to low

### Sales Performance
- **Source**: `broker_performance.sold`
- **Unit**: Bales
- **Display Format**: `2,200 bales`

### Sales Percentage
- **Calculation**: `(sold / catalogue_offering) * 100`
- **Unit**: Percentage
- **Display Format**: `88.0%`

## Provincial Producer Data

### Top Producers by Province
- **Data Source**: `top_performers` table with provincial relationships
- **Sorting**: Alphabetical by province name, with Lesotho positioned at the bottom
- **Display Format**: Separate table for each province

### Producer Metrics
- **Position**: `top_performers.rank`
- **Producer Name**: `top_performers.producer_name`
- **District**: `top_performers.district`
- **Producer Number**: `top_performers.producer_number`
- **Bales**: `top_performers.no_bales`
- **Price**: `top_performers.price / 100` (converted from cents to Rands)
- **Micron**: `top_performers.micron`
- **Certification**: `certifications.code` (RWS for certified)
- **Buyer**: `buyers.buyer_name`

### Provincial Price Averages (Map Data)
- **Certified Average**: Average price of RWS-certified producers in top 10 by province
- **Merino Average**: Average price of all Merino producers in top 10 by province
- **Calculation**: Sum of prices divided by count of producers
- **Display Format**: `Certified: R180/kg` and `Merino: R175/kg`

## Micron Price Analysis

### Micron Categories
- **Fine**: ≤ 18.5 microns
- **Medium**: 18.6 - 22.0 microns
- **Strong**: > 22.0 microns

### Price Data
- **Certified Price**: `micron_prices.certified_price_clean_zar_per_kg`
- **Non-Certified Price**: `micron_prices.price_clean_zar_per_kg`
- **Percentage Difference**: `((certified - non_certified) / non_certified) * 100`

### Chart Display
- **Two Lines**: Certified and Non-Certified prices
- **X-Axis**: Micron values
- **Y-Axis**: Price in ZAR/kg
- **Tooltip**: Shows exact values without rounding

## Market Trends Data

### Trend Points
- **Period**: Auction catalogue name (e.g., "CG01")
- **Value**: Current auction price
- **Currency**: ZAR
- **Display Format**: Single data point for current auction, multiple points for historical data

### Chart Configuration
- **X-Axis**: Auction names instead of dates
- **Y-Axis**: Price values
- **Legend**: Shows auction names
- **Tooltip**: `Auction: Value ZAR` (no duplication)

## Year-to-Date (YTD) Calculations

### All Merino Wool Average Price (YTD)
- **Calculation**: Average of `all_merino_sa_c_kg_clean` across all published auctions in the current season
- **Unit**: ZAR/kg
- **Display Format**: `175.20 ZAR/kg`

### Certified Wool Average Price (YTD)
- **Calculation**: Average of `certified_sa_c_kg_clean` across all published auctions in the current season
- **Unit**: ZAR/kg
- **Display Format**: `188.50 ZAR/kg`

## Data Transformation Pipeline

### Database to UI Conversion
1. **Currency Conversion**: Divide by 100 to convert cents to Rands
2. **Volume Conversion**: Divide by 1000 to convert kg to MT
3. **Value Conversion**: Divide by 1000000 to convert to ZAR Million
4. **Season Totals**: Aggregate across all published auctions in season
5. **Provincial Grouping**: Group producers by province with proper sorting

### Data Validation
- **Null Checks**: Handle missing or null values gracefully
- **Type Conversion**: Ensure proper data types (string to number)
- **Range Validation**: Validate micron ranges and price ranges
- **Relationship Validation**: Ensure foreign key relationships are valid

## Error Handling

### Data Loading Errors
- **Fallback Data**: Use mock data when database is unavailable
- **Error Messages**: Display user-friendly error messages
- **Retry Logic**: Automatic retry for failed data loads
- **Loading States**: Show loading indicators during data fetch

### Data Validation Errors
- **Field Validation**: Validate required fields and data formats
- **Business Logic Validation**: Validate business rules (e.g., positive prices)
- **Relationship Validation**: Ensure data relationships are consistent

## Performance Considerations

### Data Caching
- **Client-Side Caching**: Cache frequently accessed data
- **Database Indexing**: Proper indexing for fast queries
- **Query Optimization**: Optimized queries for large datasets

### Real-time Updates
- **Supabase Real-time**: Live data synchronization
- **Selective Updates**: Update only changed data
- **Debounced Updates**: Prevent excessive API calls

## Data Security

### Access Control
- **Row Level Security**: Database-level security policies
- **User Roles**: Role-based data access
- **Data Encryption**: Encrypted data transmission

### Data Integrity
- **Foreign Key Constraints**: Maintain data relationships
- **Audit Trail**: Track data changes
- **Backup and Recovery**: Regular data backups

## API Integration

### Supabase Services
- **getCompleteAuctionReport**: Load complete auction data with season totals
- **getSeasonIndicatorTotals**: Calculate season-to-date totals
- **getBuyerSeasonTotals**: Calculate buyer season totals
- **getPublishedReports**: Load published reports for public display

### Data Synchronization
- **Real-time Updates**: Live data synchronization across clients
- **Conflict Resolution**: Handle concurrent data updates
- **Offline Support**: Graceful handling of network issues

## Mobile Optimization

### Responsive Data Display
- **Mobile Charts**: Touch-optimized chart components
- **Responsive Tables**: Mobile-friendly table layouts
- **Touch Interactions**: Gesture support for mobile devices

### Performance Optimization
- **Lazy Loading**: Load data as needed
- **Image Optimization**: Optimized images for mobile
- **Reduced Data Transfer**: Minimize data usage on mobile

## Future Enhancements

### Planned Data Points
- **Historical Comparisons**: Year-over-year comparisons
- **Predictive Analytics**: Machine learning insights
- **Advanced Filtering**: More granular data filtering
- **Export Capabilities**: Data export in various formats

### Performance Improvements
- **Data Compression**: Compress large datasets
- **Progressive Loading**: Load data progressively
- **Advanced Caching**: More sophisticated caching strategies

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Maintained by**: OVK Development Team
