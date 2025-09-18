# Cape Wools Market Report Scraper Documentation

## Overview
This document provides a comprehensive analysis of the Cape Wools market report page structure and data extraction requirements for building an automated scraper to populate the auction data capture form.

## Source URL
**Primary Source**: https://www.capewools.co.za/cwmr/defaultnew.aspx

## Complete Page Structure Analysis

### 1. Header Information
The page contains key auction metadata in the header section:

```html
Season: 2025/26
Catalogue: 05
Date: 17/09/2025
Port Elizabeth
```

**Mapping to Form Fields:**
- `season_label`: "2025/26"
- `catalogue_name`: "05" (or "CG05" with prefix)
- `auction_date`: "2025-09-17" (convert from DD/MM/YYYY to YYYY-MM-DD)
- `auction_center`: "Port Elizabeth"

### 2. Filter/Select Catalogs Section
Interactive dropdowns for data selection:

**Season Dropdown:**
- 2025/26 (current)
- 2024/25
- 2023/24
- 2022/23
- 2021/22

**Catalogue Dropdown:**
- 202505 (17/09/2025) - current
- 202504 (10/09/2025)
- 202503 (27/08/2025)
- 202502 (26/08/2025)
- 202501 (20/08/2025)

**Download Options:**
- Download as PDF button

### 3. Market Summary Text
The page contains a descriptive paragraph with key metrics:

**Complete Sample Text:**
> "The 2025/2026 wool selling season continued today with 6 507 bales on offer on the 5th sale of the season. The offering mainly consisted of fine micron wools, with 65% testing 20 micron and finer. Sustainably certified wools comprised 67,8% of the merino wools on offer. The market continued it's upward trend of this season and delivered strong results, despite the SA Rand trading 1% stronger against the US$. The strong competition for the better quality merino and certified wools, drove the overall sales clearance up to 93,5%. The all-merino indicator closed up by 4,4% on R197,55 p/kg and the certified indicator increased by 3,7% to close on R202,61 p/kg. A highest price of R265,63 p/kg (clean) was paid for single bale lot of 15,5 micron merino wool. The Australian market continued to deliver strong results this week and increased by 1,9% (AU$) from their previous sale held on Wednesday, 10 September. The major buyers on today's sale were BKB Pinnacle Fibres (1 765), Standard Wool SA (1 100), Tianyu SA (1 038) and Stucken & Co (796). The next sale will be held on 1 October 2025 when approximately 7 076 bales will be on offer."

**Extractable Data from Summary Text:**
- `total_bales_offered`: 6507
- `fine_micron_percentage`: 65% (testing 20 micron and finer)
- `certified_merino_percentage`: 67.8% (of merino wools on offer)
- `clearance_rate_pct`: 93.5
- `all_merino_indicator_zar`: 197.55 (R/kg)
- `all_merino_indicator_change_pct`: 4.4%
- `certified_indicator_zar`: 202.61 (R/kg)
- `certified_indicator_change_pct`: 3.7%
- `highest_price_zar_per_kg_clean`: 265.63
- `highest_price_micron`: 15.5
- `highest_price_bales`: 1 (single bale lot)
- `australian_market_change_pct`: 1.9% (AU$)
- `australian_previous_sale_date`: "Wednesday, 10 September"
- `next_sale_date`: "1 October 2025"
- `next_sale_bales_offered`: 7076

**Major Buyers Data:**
- `buyers[]`: Array of buyer objects
  - BKB Pinnacle Fibres: 1765 bales
  - Standard Wool SA: 1100 bales
  - Tianyu SA: 1038 bales
  - Stucken & Co: 796 bales

### 4. Key Indicators & Exchange Rates Table
The main data table contains market indicators and exchange rates in a combined structure:

#### Complete Table Structure:
| Key Indicators | | | | Exchange Rates | | | |
|----------------|--|--|--|----------------|--|--|--|
| Indicator Unit | This Sale | Prior Sale | % Change | Currency | This Sale | Prior Sale | % Change |
| SA c/kg Clean All Merino | 19755 | 18917 | 4,4 % | ZAR/US$ | 17,35 | 17,53 | 1,03 % |
| US c/kg Clean All Merino | 1139 | 1079 | 5,56 % | ZAR/Euro | 20,52 | 20,48 | 0,20 % |
| Euro c/kg Clean All Merino | 963 | 924 | 4,22 % | ZAR/JPY¥ | 8,45 | 8,42 | 0,36 % |
| SA c/kg Clean Certified | 20261 | 19534 | 3,7 % | ZAR/UK Pound | 23,65 | 23,66 | 0,04 % |
| US c/kg Clean Certified | 1168 | 1114 | 4,85 % | USD/AUD | 0,6654 | 0,6585 | 1,05 % |
| Euro c/kg Clean Certified | 987 | 954 | 3,46 % | AWEX EMI c/kg Clean | 1344 | 1319 | 1,90 % |
| Percentage Difference (Weighted): Non‑Certified and Certified Merino Fleece Wools Sold | 9,47 % | | | | | | |

**Market Indicators Data:**
- `market_indices.merino_indicator_sa_cents_clean`: 19755
- `market_indices.merino_indicator_us_cents_clean`: 1139
- `market_indices.merino_indicator_euro_cents_clean`: 963
- `market_indices.certified_indicator_sa_cents_clean`: 20261
- `market_indices.certified_indicator_us_cents_clean`: 1168
- `market_indices.certified_indicator_euro_cents_clean`: 987
- `market_indices.percentage_difference_weighted`: 9.47%

**Exchange Rates Data:**
- `currency_fx.ZAR_USD`: 17.35
- `currency_fx.ZAR_EUR`: 20.52
- `currency_fx.ZAR_JPY`: 8.45
- `currency_fx.ZAR_GBP`: 23.65
- `currency_fx.USD_AUD`: 0.6654
- `market_indices.awex_emi_sa_cents_clean`: 1344

**Table Notes:**
- Exchange rate values quoted above is based on an average of rate points recorded for the duration of the sale
- Certified Sustainable Wool: Includes Responsible Wool Standard & Sustainable Cape Wool Standard
- Percentage Difference Selection: Merino Fleece | MF4 & MF5 | VM < 1,6 | NKT > 28 | >67mm | Minimum of 3 Lots Sold

### 5. Micron Price Tables
The page contains detailed micron price tables for different wool styles and lengths.

#### Table Structure Overview:
- **Styles**: MF4 (Merino Fleece, AWEX Style 4), MF5 (Merino Fleece, AWEX Style 5), MF6 (Merino Fleece, AWEX Style 6)
- **Lengths**: 40mm, 50mm, 60mm, 70mm, 80mm
- **Micron Categories**: 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0
- **Categories**: Certified vs Non-Certified
- **Data Format**: Price values in R/kg clean (decimal format with comma separator)

#### Sample Data Structure (MF4 - 50mm):
| Length | Category | 15.0 | 15.5 | 16.0 | 16.5 | 17.0 | 17.5 | 18.0 | 18.5 | 19.0 | 19.5 | 20.0 | 20.5 | 21.0 | 21.5 | 22.0 | 22.5 | 23.0 | 23.5 | 24.0 | 24.5 | 25.0 |
|--------|----------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|------|
| 50 mm | Non-Certified | 0,00 | 0,00 | 0,00 | 185,43 | 180,08 | 165,51 | 0,00 | 0,00 | 0,00 | 0,00 | 159,35 | | | | | | | | | | |
| 50 mm | Certified | 211,24 | 209,26 | 203,26 | 199,22 | 194,91 | 198,82 | 190,79 | 184,99 | 0,00 | 0,00 | 0,00 | | | | | | | | | | |

#### Complete Table Coverage:
1. **Merino Fleece, AWEX Style 4 - MF4**
   - All length categories (40mm, 50mm, 60mm, 70mm, 80mm)
   - All micron categories (15.0 to 25.0)
   - Certified and Non-Certified prices

2. **Merino Fleece, AWEX Style 5 - MF5**
   - All length categories (40mm, 50mm, 60mm, 70mm, 80mm)
   - All micron categories (15.0 to 25.0)
   - Certified and Non-Certified prices

3. **Merino Fleece, AWEX Style 6 - MF6**
   - All length categories (40mm, 50mm, 60mm, 70mm, 80mm)
   - All micron categories (15.0 to 25.0)
   - Certified and Non-Certified prices

**Data Extraction Requirements:**
- Parse decimal numbers with comma separators (e.g., "185,43" → 185.43)
- Handle "0,00" values (representing no data/not available)
- Extract both certified and non-certified prices for each combination
- Maintain relationship between style, length, micron, and certification status

**Mapping to Form Fields:**
- `micron_prices[]`: Array of objects with:
  - `style`: "MF4", "MF5", "MF6"
  - `length_mm`: 40, 50, 60, 70, 80
  - `micron`: 15.0, 15.5, 16.0, etc.
  - `certified_price_zar_per_kg`: price value or null
  - `non_certified_price_zar_per_kg`: price value or null

### 6. Additional Data Tables
The page contains several additional data tables that may be present:

#### Market Indicators Tables:
- **Market Indicators** (standalone table)
- **Market Indicators - South Africa and Australia** (comparison table)
- **Micron Category Comparisons - South Africa VS Australia** (comparison table)

**Note**: These tables appear to be empty or placeholder tables in the current report, but should be monitored for future data.

### 7. Contact Information
The page includes contact details for Cape Wools:

**Contact Details:**
- **Organization**: Wool Exchange of South Africa
- **Address**: 16 Grahamstown Road, North End, Port Elizabeth, Eastern Cape, 6056, South Africa
- **Phone**: 041-484-4301
- **Fax**: 086 414 7107
- **Email**: capewool@capewools.co.za

### 8. Buyer Information
The summary text mentions major buyers:
> "The major buyers on today's sale were BKB Pinnacle Fibres (1 765), Standard Wool SA (1 100), Tianyu SA (1 038) and Stucken & Co (796)."

**Mapping to Form Fields:**
- `buyers[]`: Array of buyer objects with:
  - `buyer_name`: "BKB Pinnacle Fibres", "Standard Wool SA", etc.
  - `bales_purchased`: 1765, 1100, 1038, 796
  - `share_percentage`: calculated from total bales

## Complete Data Extraction Guide

### 1. HTML Structure Analysis

#### Page Layout:
- **Header Section**: Contains season, catalogue, date, and location
- **Filter Section**: Dropdown menus for season and catalogue selection
- **Main Content**: Market summary text and data tables
- **Footer**: Contact information and company details

#### Key HTML Elements:
```html
<!-- Header Information -->
<div class="header">
  <span>Season: 2025/26</span>
  <span>Catalogue: 05</span>
  <span>Date: 17/09/2025</span>
  <span>Port Elizabeth</span>
</div>

<!-- Filter/Select Section -->
<div class="filters">
  <select name="season">...</select>
  <select name="catalogue">...</select>
  <button>Download as PDF</button>
</div>

<!-- Main Data Table -->
<table class="key-indicators-table">
  <thead>...</thead>
  <tbody>...</tbody>
</table>

<!-- Micron Price Tables -->
<table class="micron-prices">
  <thead>...</thead>
  <tbody>...</tbody>
</table>
```

### 2. Data Extraction Strategy

#### Header Information Extraction:
```javascript
// Extract header data
const headerText = document.querySelector('.header').textContent;
const season = headerText.match(/Season: (\d{4}\/\d{2})/)[1];
const catalogue = headerText.match(/Catalogue: (\d+)/)[1];
const date = headerText.match(/Date: (\d{2}\/\d{2}\/\d{4})/)[1];
const location = headerText.match(/Date: \d{2}\/\d{2}\/\d{4}\s+(.+)/)[1];
```

#### Market Summary Text Extraction:
```javascript
// Extract summary paragraph
const summaryText = document.querySelector('.market-summary').textContent;

// Extract key metrics using regex
const balesOffered = summaryText.match(/(\d+)\s+bales on offer/)[1];
const clearanceRate = summaryText.match(/clearance up to ([\d,]+)%/)[1];
const highestPrice = summaryText.match(/R([\d,]+),(\d+)\s+p\/kg/);
const highestMicron = summaryText.match(/(\d+,\d+)\s+micron/)[1];

// Extract buyer information
const buyerMatches = summaryText.match(/([A-Za-z\s&]+)\s+\((\d+)\)/g);
const buyers = buyerMatches.map(match => {
  const [, name, bales] = match.match(/([A-Za-z\s&]+)\s+\((\d+)\)/);
  return { name: name.trim(), bales: parseInt(bales) };
});
```

#### Key Indicators Table Extraction:
```javascript
// Extract main indicators table
const indicatorsTable = document.querySelector('table.key-indicators');
const rows = indicatorsTable.querySelectorAll('tbody tr');

const indicators = {};
rows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length >= 3) {
    const indicator = cells[0].textContent.trim();
    const thisSale = cells[1].textContent.trim();
    const priorSale = cells[2].textContent.trim();
    const change = cells[3]?.textContent.trim();
    
    indicators[indicator] = {
      thisSale: parseFloat(thisSale.replace(',', '.')),
      priorSale: parseFloat(priorSale.replace(',', '.')),
      change: change ? parseFloat(change.replace(/[%,]/g, '')) : null
    };
  }
});
```

#### Exchange Rates Table Extraction:
```javascript
// Extract exchange rates from the same table
const exchangeRows = indicatorsTable.querySelectorAll('tbody tr');
const exchangeRates = {};

exchangeRows.forEach(row => {
  const cells = row.querySelectorAll('td');
  if (cells.length >= 7) { // Exchange rates are in columns 4-7
    const currency = cells[4]?.textContent.trim();
    const thisSale = cells[5]?.textContent.trim();
    const priorSale = cells[6]?.textContent.trim();
    const change = cells[7]?.textContent.trim();
    
    if (currency && thisSale) {
      exchangeRates[currency] = {
        thisSale: parseFloat(thisSale.replace(',', '.')),
        priorSale: priorSale ? parseFloat(priorSale.replace(',', '.')) : null,
        change: change ? parseFloat(change.replace(/[%,]/g, '')) : null
      };
    }
  }
});
```

#### Micron Price Tables Extraction:
```javascript
// Extract micron price tables
const micronTables = document.querySelectorAll('table.micron-prices');
const micronPrices = [];

micronTables.forEach(table => {
  const style = table.querySelector('caption')?.textContent || 'Unknown';
  const rows = table.querySelectorAll('tbody tr');
  
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length > 2) {
      const length = cells[0].textContent.trim();
      const category = cells[1].textContent.trim();
      
      // Extract prices for each micron column
      for (let i = 2; i < cells.length; i++) {
        const price = cells[i].textContent.trim();
        if (price && price !== '0,00') {
          micronPrices.push({
            style: style,
            length: length,
            category: category,
            micron: getMicronFromColumnIndex(i - 2),
            price: parseFloat(price.replace(',', '.'))
          });
        }
      }
    }
  });
});
```

### 3. Data Transformation Requirements

#### Date Format Conversion:
```javascript
function convertDate(dateString) {
  // Convert "17/09/2025" to "2025-09-17"
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
```

#### Price Format Conversion:
```javascript
function parsePrice(priceString) {
  // Convert "197,55" to 197.55 (Cape Wools uses comma as decimal separator)
  return parseFloat(priceString.replace(',', '.'));
}

function parsePriceWithCurrency(priceString) {
  // Convert "R197,55" to 197.55
  return parseFloat(priceString.replace(/[R,\s]/g, '').replace(',', '.'));
}
```

#### Percentage Conversion:
```javascript
function parsePercentage(percentageString) {
  // Convert "4,4 %" to 4.4
  return parseFloat(percentageString.replace(/[%\s]/g, '').replace(',', '.'));
}
```

#### Number Format Conversion:
```javascript
function parseNumber(numberString) {
  // Convert "1 765" to 1765 (handle space separators)
  return parseInt(numberString.replace(/\s/g, ''));
}

function parseDecimalNumber(decimalString) {
  // Convert "1,9" to 1.9 (handle comma decimal separator)
  return parseFloat(decimalString.replace(',', '.'));
}
```

#### Micron Column Mapping:
```javascript
function getMicronFromColumnIndex(index) {
  const microns = [15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0];
  return microns[index] || null;
}
```

### 4. Complete Form Field Mapping

#### Complete Field Mapping:
```javascript
const formData = {
  auction: {
    season_label: extractedSeason, // "2025/26"
    catalogue_name: extractedCatalogue, // "05"
    auction_date: convertDate(extractedDate), // "2025-09-17"
    auction_center: extractedLocation, // "Port Elizabeth"
    commodity: 'wool'
  },
  market_indices: {
    // SA indicators (convert from R/kg to cents)
    merino_indicator_sa_cents_clean: extractedMerinoSA * 100, // 19755
    certified_indicator_sa_cents_clean: extractedCertifiedSA * 100, // 20261
    
    // US indicators (already in cents)
    merino_indicator_us_cents_clean: extractedMerinoUS, // 1139
    certified_indicator_us_cents_clean: extractedCertifiedUS, // 1168
    
    // Euro indicators (already in cents)
    merino_indicator_euro_cents_clean: extractedMerinoEuro, // 963
    certified_indicator_euro_cents_clean: extractedCertifiedEuro, // 987
    
    // AWEX EMI
    awex_emi_sa_cents_clean: extractedAwexEmi, // 1344
    
    // Percentage difference
    percentage_difference_weighted: extractedPercentageDiff // 9.47
  },
  currency_fx: {
    ZAR_USD: extractedZarUsd, // 17.35
    ZAR_EUR: extractedZarEur, // 20.52
    ZAR_JPY: extractedZarJpy, // 8.45
    ZAR_GBP: extractedZarGbp, // 23.65
    USD_AUD: extractedUsdAud // 0.6654
  },
  supply_stats: {
    offered_bales: extractedOfferedBales, // 6507
    sold_bales: Math.round(extractedOfferedBales * (extractedClearanceRate / 100)), // 6084
    clearance_rate_pct: extractedClearanceRate // 93.5
  },
  highest_price: {
    price_cents_clean: extractedHighestPrice * 100, // 26563 (convert R/kg to cents)
    micron: extractedHighestMicron, // 15.5
    bales: 1 // Single bale lot
  },
  micron_prices: extractedMicronPrices, // Array of micron price objects
  buyers: extractedBuyers, // Array of buyer objects
  certified_share: {
    merino_pct_offered: extractedCertifiedMerinoPct, // 67.8
    merino_pct_sold: calculatedCertifiedSoldPct // Calculated from data
  },
  greasy_stats: {
    turnover_rand: extractedTurnover, // If available
    bales: extractedOfferedBales, // Same as supply stats
    mass_kg: extractedMass // If available
  }
};
```

#### Additional Data Points:
```javascript
const additionalData = {
  fine_micron_percentage: extractedFineMicronPct, // 65% (20 micron and finer)
  australian_market_change: extractedAustralianChange, // 1.9% (AU$)
  australian_previous_sale_date: extractedAustralianDate, // "Wednesday, 10 September"
  next_sale_date: extractedNextSaleDate, // "1 October 2025"
  next_sale_bales_offered: extractedNextSaleBales // 7076
};
```

### 5. Error Handling & Validation

#### Common Issues:
1. **Missing Data**: Some cells may be empty (0,00 values)
2. **Format Variations**: Different number formats (commas vs periods)
3. **Table Structure Changes**: Cape Wools may update their HTML structure
4. **Network Issues**: Page loading failures
5. **Dynamic Content**: Tables may load asynchronously
6. **Data Inconsistencies**: Values may not match between summary text and tables

#### Error Handling Strategy:
```javascript
function safeExtract(selector, defaultValue = null) {
  try {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : defaultValue;
  } catch (error) {
    console.warn(`Failed to extract data from ${selector}:`, error);
    return defaultValue;
  }
}

function safeParseNumber(value, defaultValue = 0) {
  try {
    if (!value || value === '0,00' || value === '0.00') return defaultValue;
    return parseFloat(value.replace(',', '.'));
  } catch (error) {
    console.warn(`Failed to parse number: ${value}`, error);
    return defaultValue;
  }
}

function validateExtractedData(data) {
  const errors = [];
  
  // Required fields validation
  if (!data.auction?.season_label) errors.push('Missing season');
  if (!data.auction?.auction_date) errors.push('Missing auction date');
  if (!data.market_indices?.merino_indicator_sa_cents_clean) errors.push('Missing SA Merino indicator');
  if (!data.currency_fx?.ZAR_USD) errors.push('Missing ZAR/USD rate');
  if (!data.supply_stats?.offered_bales) errors.push('Missing bales offered');
  
  // Data consistency validation
  if (data.supply_stats?.offered_bales && data.supply_stats?.clearance_rate_pct) {
    const expectedSold = Math.round(data.supply_stats.offered_bales * (data.supply_stats.clearance_rate_pct / 100));
    if (data.supply_stats.sold_bales && Math.abs(data.supply_stats.sold_bales - expectedSold) > 10) {
      errors.push(`Sold bales (${data.supply_stats.sold_bales}) doesn't match calculation (${expectedSold})`);
    }
  }
  
  return errors;
}
```

#### Data Validation Rules:
```javascript
const validationRules = {
  // Price ranges (reasonable bounds)
  merino_indicator_sa: { min: 10000, max: 50000 }, // 100-500 R/kg
  certified_indicator_sa: { min: 10000, max: 50000 }, // 100-500 R/kg
  awex_emi: { min: 500, max: 3000 }, // 5-30 R/kg
  
  // Exchange rate ranges
  zar_usd: { min: 10, max: 30 },
  zar_eur: { min: 15, max: 35 },
  zar_jpy: { min: 5, max: 15 },
  zar_gbp: { min: 20, max: 40 },
  usd_aud: { min: 0.5, max: 1.5 },
  
  // Supply statistics
  offered_bales: { min: 1000, max: 20000 },
  clearance_rate: { min: 50, max: 100 },
  
  // Highest price
  highest_price: { min: 10000, max: 100000 }, // 100-1000 R/kg
  highest_micron: { min: 10, max: 30 }
};
```

### 6. Implementation Recommendations

#### Scraper Architecture Options:
1. **Browser Extension**: Chrome/Firefox extension for easy access
   - Pros: User-friendly, can run on any page
   - Cons: Requires browser installation, limited to browser environment
   
2. **Bookmarklet**: JavaScript bookmark for quick data extraction
   - Pros: No installation required, works on any browser
   - Cons: Limited functionality, requires manual activation
   
3. **Standalone Tool**: Node.js script with Puppeteer/Playwright
   - Pros: Full control, can be automated, handles complex scenarios
   - Cons: Requires server setup, more complex deployment
   
4. **API Integration**: Direct integration with the form's data service
   - Pros: Seamless integration, real-time updates
   - Cons: Requires backend development, API maintenance

#### Recommended Libraries:
- **Puppeteer**: For headless browser automation
- **Playwright**: Alternative to Puppeteer with better cross-browser support
- **Cheerio**: For server-side HTML parsing
- **jsdom**: For DOM manipulation in Node.js
- **axios**: For HTTP requests

#### Security Considerations:
1. **Rate Limiting**: Avoid overwhelming Cape Wools servers (max 1 request per minute)
2. **User Agent**: Use appropriate user agent strings to identify your scraper
3. **Respect robots.txt**: Check Cape Wools' robots.txt file for restrictions
4. **Terms of Service**: Ensure compliance with Cape Wools' terms
5. **Data Privacy**: Handle extracted data responsibly
6. **Error Handling**: Implement proper error handling to avoid crashes

#### Performance Optimization:
1. **Caching**: Cache extracted data to avoid repeated requests
2. **Parallel Processing**: Extract multiple data points simultaneously
3. **Selective Extraction**: Only extract data that has changed
4. **Memory Management**: Clean up DOM references to prevent memory leaks

### 7. Testing Strategy

#### Test Cases:
1. **Valid Data Extraction**: Test with current market report (202505 - 17/09/2025)
2. **Missing Data Handling**: Test with incomplete tables or empty cells
3. **Format Variations**: Test with different number formats and separators
4. **Error Scenarios**: Test network failures, parsing errors, and malformed data
5. **Edge Cases**: Test with extreme values, special characters, and boundary conditions
6. **Cross-Browser Testing**: Test on different browsers and devices

#### Sample Test Data:
```javascript
const testData = {
  // Header data
  season: "2025/26",
  catalogue: "05",
  date: "17/09/2025",
  location: "Port Elizabeth",
  
  // Market indicators
  merinoIndicatorSA: 19755,
  merinoIndicatorUS: 1139,
  merinoIndicatorEuro: 963,
  certifiedIndicatorSA: 20261,
  certifiedIndicatorUS: 1168,
  certifiedIndicatorEuro: 987,
  awexEmi: 1344,
  
  // Exchange rates
  zarUsd: 17.35,
  zarEur: 20.52,
  zarJpy: 8.45,
  zarGbp: 23.65,
  usdAud: 0.6654,
  
  // Supply statistics
  offeredBales: 6507,
  clearanceRate: 93.5,
  soldBales: 6084,
  
  // Highest price
  highestPrice: 26563,
  highestMicron: 15.5,
  highestBales: 1,
  
  // Buyers
  buyers: [
    { name: "BKB Pinnacle Fibres", bales: 1765 },
    { name: "Standard Wool SA", bales: 1100 },
    { name: "Tianyu SA", bales: 1038 },
    { name: "Stucken & Co", bales: 796 }
  ]
};
```

#### Automated Testing:
```javascript
// Unit tests for data extraction functions
describe('Cape Wools Scraper', () => {
  test('should extract header information correctly', () => {
    const headerData = extractHeaderData(mockHTML);
    expect(headerData.season).toBe('2025/26');
    expect(headerData.catalogue).toBe('05');
  });
  
  test('should parse price formats correctly', () => {
    expect(parsePrice('197,55')).toBe(197.55);
    expect(parsePrice('0,00')).toBe(0);
    expect(parsePrice('1 765')).toBe(1765);
  });
  
  test('should validate data ranges', () => {
    const data = { merinoIndicatorSA: 19755 };
    const errors = validateData(data);
    expect(errors).toHaveLength(0);
  });
});
```

### 8. Maintenance Considerations

#### Regular Updates:
1. **HTML Structure Changes**: Monitor for Cape Wools website updates
2. **Data Format Changes**: Watch for new data fields or formats
3. **Validation Updates**: Update validation rules as needed
4. **Error Handling**: Improve error handling based on real-world usage
5. **Performance Optimization**: Monitor and improve extraction speed

#### Monitoring:
1. **Success Rate**: Track successful data extractions (target: >95%)
2. **Error Logs**: Monitor and analyze extraction failures
3. **Performance**: Track extraction speed and reliability
4. **User Feedback**: Collect feedback on data accuracy
5. **Data Quality**: Monitor for data inconsistencies or anomalies

#### Version Control:
1. **Data Schema Versioning**: Track changes to data structure
2. **Extraction Logic Versioning**: Version control for parsing logic
3. **Rollback Capability**: Ability to revert to previous versions
4. **Change Documentation**: Document all changes and their impact

## Complete Data Points Summary

### Extracted Data Points (Total: 50+ fields):

#### Header Information (4 fields):
- Season, Catalogue, Date, Location

#### Market Summary Text (15+ fields):
- Bales offered, Fine micron percentage, Certified merino percentage
- Clearance rate, All merino indicator, Certified indicator
- Highest price, Highest micron, Highest bales
- Australian market change, Previous sale date
- Next sale date, Next sale bales
- Major buyers (4 companies with bales purchased)

#### Key Indicators Table (13 fields):
- SA/US/Euro Merino indicators (3 fields)
- SA/US/Euro Certified indicators (3 fields)
- AWEX EMI, Percentage difference weighted
- ZAR/USD, ZAR/EUR, ZAR/JPY, ZAR/GBP, USD/AUD exchange rates (5 fields)

#### Micron Price Tables (300+ fields):
- MF4, MF5, MF6 styles × 5 lengths × 21 microns × 2 categories = 630 potential price points
- Certified and Non-Certified prices for each combination

#### Additional Data:
- Contact information, Company details
- Market indicators tables (when populated)
- Comparison tables (when available)

## Conclusion

This comprehensive scraper documentation provides everything needed to build a robust, automated data extraction system for the Cape Wools market report. The system can extract 50+ data points across multiple tables and text sections, with proper validation, error handling, and maintenance considerations.

**Key Benefits:**
- **Automated Data Entry**: Eliminates manual form filling
- **Improved Accuracy**: Reduces human error in data transcription
- **Time Savings**: Extracts data in seconds vs. minutes of manual entry
- **Consistency**: Ensures uniform data format and structure
- **Scalability**: Can handle multiple reports and historical data

**Implementation Priority:**
1. Start with core data extraction (header + key indicators)
2. Add market summary text parsing
3. Implement micron price table extraction
4. Add validation and error handling
5. Deploy and monitor performance

The scraper will significantly enhance the efficiency and accuracy of the auction data capture process.
