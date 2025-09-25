import type { AuctionReport } from './types';

// Static lookup data - these will be loaded from Supabase in the future
export const BUYERS: string[] = [
  'BKB PINNACLE FIBRES',
  'MODIANO SA',
  'STUCKEN & CO',
  'STANDARD WOOL',
  'TIANYU SA',
  'LEMPRIERE SA',
  'SEGARD MASUREL SA',
  'VBC WOOL SA',
  'FiberCorp SA'
];

export const BROKERS: string[] = [
  'BKB',
  'OVK',
  'JLW',
  'CMW',
  'MAS',
  'QWB',
  'VLB'
];

const generateTrendData = (baseZar: number, baseUsd: number) => {
  const data = [];
  for (let i = 1; i <= 35; i += 2) {
    const period = `C${String(Math.ceil(i/2)).padStart(3, '0')}`;
    data.push({
      period,
      '2025_zar': baseZar + (Math.random() - 0.4) * 15 + i * 0.5,
      '2024_zar': baseZar - 10 + (Math.random() - 0.5) * 10 + i * 0.4,
      '2025_usd': baseUsd + (Math.random() - 0.4) * 1 + i * 0.05,
      '2024_usd': baseUsd - 1 + (Math.random() - 0.5) * 1 + i * 0.04,
    });
  }
  return data;
}

export const BLANK_REPORT: Omit<AuctionReport, 'top_sales'> = {
  auction: {
    commodity: 'wool',
    season_label: '2025/26',
    week_id: `week_${new Date().getFullYear()}_01`,
    week_start: new Date().toISOString().split('T')[0],
    week_end: new Date().toISOString().split('T')[0],
    auction_date: new Date().toISOString().split('T')[0],
    catalogue_name: ''
  },
  indicators: [],
  benchmarks: [],
  micron_prices: [
    { bucket_micron: '15', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '16', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '17', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '17.5', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '18', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '18.5', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '19', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '19.5', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '20', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '20.5', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '21', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '21.5', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '22', category: 'Medium', price_clean_zar_per_kg: 0 },
  ],
  buyers: [],
  brokers: [],
  currencies: [
      { code: "USD", value: 0, change: 0 },
      { code: "AUD", value: 0, change: 0 },
      { code: "EUR", value: 0, change: 0 }
  ],
  insights: '',
  trends: { rws: [], non_rws: [], awex: [] },
  yearly_average_prices: [],
  provincial_producers: [],
  province_avg_prices: [],
};

export const MOCK_REPORTS: AuctionReport[] = [
  {
    "auction": {
      "commodity": "wool",
      "season_label": "2025/26",
      "week_id": "week_2025_01",
      "week_start": "2025-01-06",
      "week_end": "2025-01-12",
      "auction_date": "2025-01-08",
      "catalogue_name": "CAT01"
    },
    "indicators": [
      {"type":"total_lots","unit":"bales","value":10250,"value_ytd": 50123,"pct_change":5.2},
      {"type":"total_volume","unit":"MT","value":1550.8,"value_ytd": 7580.4,"pct_change":3.1},
      {"type":"avg_price","unit":"R/kg","value":181.45,"pct_change":-2.3},
      {"type":"total_value","unit":"R M","value":281.4,"value_ytd": 1250.8,"pct_change":0.7}
    ],
    "benchmarks": [
      {"label":"Certified","price":184.35,"currency":"R/kg clean","day_change_pct":1.4},
      {"label":"All-Merino","price":179.53,"currency":"R/kg clean","day_change_pct":1.0},
      {"label":"AWEX","price":12.61,"currency":"USD/kg clean","day_change_pct":0.6}
    ],
    "yearly_average_prices": [
      {"label": "Certified Wool Avg Price (YTD)", "value": 188.50, "unit": "R/kg"},
      {"label": "All - Merino Wool Avg Price (YTD)", "value": 175.20, "unit": "R/kg"}
    ],
    "micron_prices": [
      {"bucket_micron":"17","category":"Fine","price_clean_zar_per_kg":225.50,"certified_price_clean_zar_per_kg":228.20,"all_merino_price_clean_zar_per_kg":222.80},
      {"bucket_micron":"18","category":"Fine","price_clean_zar_per_kg":210.00,"certified_price_clean_zar_per_kg":212.50,"all_merino_price_clean_zar_per_kg":207.50},
      {"bucket_micron":"19","category":"Fine","price_clean_zar_per_kg":195.70,"certified_price_clean_zar_per_kg":198.20,"all_merino_price_clean_zar_per_kg":193.20},
      {"bucket_micron":"20","category":"Medium","price_clean_zar_per_kg":182.40,"certified_price_clean_zar_per_kg":184.80,"all_merino_price_clean_zar_per_kg":180.00},
      {"bucket_micron":"21","category":"Medium","price_clean_zar_per_kg":175.00,"certified_price_clean_zar_per_kg":177.30,"all_merino_price_clean_zar_per_kg":172.70},
      {"bucket_micron":"22","category":"Strong","price_clean_zar_per_kg":168.20,"certified_price_clean_zar_per_kg":170.40,"all_merino_price_clean_zar_per_kg":166.00},
      {"bucket_micron":"23","category":"Strong","price_clean_zar_per_kg":160.10,"certified_price_clean_zar_per_kg":162.20,"all_merino_price_clean_zar_per_kg":158.00}
    ],
    "buyers": [
      {"buyer":"BKB PINNACLE FIBRES","share_pct":24.89, "cat": 1556, "bales_ytd": 4419},
      {"buyer":"MODIANO SA","share_pct":22.55, "cat": 1410, "bales_ytd": 3441},
      {"buyer":"STUCKEN & CO","share_pct":14.28, "cat": 893, "bales_ytd": 2650},
      {"buyer":"STANDARD WOOL","share_pct":13.63, "cat": 852, "bales_ytd": 2514},
      {"buyer":"TIANYU SA","share_pct":11.55, "cat": 722, "bales_ytd": 3244},
      {"buyer":"LEMPRIERE SA", "share_pct": 5.63, "cat": 352, "bales_ytd": 719},
      {"buyer":"SEGARD MASUREL SA", "share_pct": 4.77, "cat": 298, "bales_ytd": 689},
      {"buyer":"VBC WOOL SA", "share_pct": 2.70, "cat": 169, "bales_ytd": 590}
    ],
    "top_sales": [],
    "brokers": [
      {"name": "BKB", "catalogue_offering": 3339, "sold_ytd": 9499},
      {"name": "OVK", "catalogue_offering": 1391, "sold_ytd": 4831},
      {"name": "JLW", "catalogue_offering": 525, "sold_ytd": 656},
      {"name": "MAS", "catalogue_offering": 488, "sold_ytd": 1595},
      {"name": "QWB", "catalogue_offering": 834, "sold_ytd": 1660},
      {"name": "VLB", "catalogue_offering": 0, "sold_ytd": 0}
    ],
    "currencies": [
        {"code": "USD", "value": 17.76, "change": -0.7},
        {"code": "AUD", "value": 11.48, "change": -0.3},
        {"code": "EUR", "value": 20.57, "change": 0.5}
    ],
    "insights": "The market continued to deliver steady results this week, ending dearer on all micron groups. Strong demand from key markets contributed to positive price movements, particularly for certified fine wool. The next auction is scheduled for 10 September 2025.",
    "trends": {
      "rws": generateTrendData(180, 10),
      "non_rws": generateTrendData(170, 9.5),
      "awex": generateTrendData(0, 12.5), // AWEX is typically in USD
      "exchange_rates": generateTrendData(17.5, 17.5) // ZAR/USD exchange rate
    },
    "provincial_producers": [
        { province: 'Eastern Cape', producers: [
            { position: 1, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 188.00, description: 'BFY', micron: 16.4, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 2, name: 'RM WARDLE', district: 'CATHCART', price: 185.00, description: 'BH', micron: 16.7, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'SB DE KLERK BOERDERY', district: 'GRAHAMSTOWN', price: 180.80, description: 'BFFH', micron: 16.2, certified: '', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'RM WARDLE', district: 'CATHCART', price: 176.60, description: 'BBH', micron: 17.7, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 5, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 174.50, description: 'BFFY', micron: 16.0, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 6, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 172.50, description: 'BF', micron: 18.4, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 166.50, description: 'BFY', micron: 19.0, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 166.20, description: 'BH', micron: 17.1, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 165.00, description: 'HBKS', micron: 17.0, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 163.00, description: 'CFY2', micron: 17.3, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Free State', producers: [
            { position: 1, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 166.50, description: 'AH', micron: 18.0, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 2, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 165.50, description: 'BH', micron: 17.7, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 3, name: 'HT GERTENBACH', district: 'SMITHFIELD', price: 165.10, description: 'BH', micron: 18.2, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 4, name: 'GBP BOERDERY BK', district: 'PHILIPPOLIS', price: 155.10, description: 'CL', micron: 16.6, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 5, name: 'MIGNONETTE BOERDERY', district: 'SENEKAL', price: 151.90, description: 'CL', micron: 17.2, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 6, name: 'GBP BOERDERY BK', district: 'PHILIPPOLIS', price: 149.00, description: 'CMY', micron: 18.2, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 7, name: 'FJC CRONJE', district: 'ZASTRON', price: 147.60, description: 'CCM', micron: 21.0, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 8, name: 'HT GERTENBACH', district: 'SMITHFIELD', price: 147.00, description: 'CH', micron: 17.9, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 9, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 146.60, description: 'CM', micron: 18.9, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 10, name: 'GBP BOERDERY BK', district: 'PHILIPPOLIS', price: 146.00, description: 'BBH', micron: 17.8, certified: 'RWS', buyer_name: 'Standard Wool'},
        ]},
        { province: 'Western Cape', producers: [
            { position: 1, name: 'KLEIN KAROO KOÖP', district: 'OUDTSHOORN', price: 185.30, description: 'AF', micron: 16.8, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 2, name: 'SWELLENDAM KOÖP', district: 'SWELLENDAM', price: 182.40, description: 'BF', micron: 17.2, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 3, name: 'CERES KOÖP', district: 'CERES', price: 179.90, description: 'AFFY', micron: 16.5, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'ROBERTSON KOÖP', district: 'ROBERTSON', price: 178.20, description: 'BFY', micron: 17.8, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'MALMESBURY KOÖP', district: 'MALMESBURY', price: 176.80, description: 'BBH', micron: 18.1, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'STELLENBOSCH VINEYARDS', district: 'STELLENBOSCH', price: 175.40, description: 'AH', micron: 17.5, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'KAROO HIGHLANDS FARM', district: 'LAINGSBURG', price: 174.10, description: 'BH', micron: 18.0, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'WORCESTER FARMS', district: 'WORCESTER', price: 172.60, description: 'AFY', micron: 17.3, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'BREEDE VALLEY ESTATE', district: 'WORCESTER', price: 171.20, description: 'BFY', micron: 17.9, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'CAPE POINT FARMS', district: 'HERMANUS', price: 170.00, description: 'BFFY', micron: 18.2, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Northern Cape', producers: [
            { position: 1, name: 'GWF VAN HEERDEN', district: 'VICTORIA-WES', price: 178.20, description: 'BMY', micron: 16.5, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 2, name: 'TOVERVELD TRUST', district: 'COLESBERG', price: 176.40, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 3, name: 'KAROO WIND FARM', district: 'DE AAR', price: 174.00, description: 'AMY', micron: 17.3, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 4, name: 'JJ LINGENFELDER', district: 'COLESBERG', price: 172.60, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 5, name: 'DIAMOND FIELDS RANCH', district: 'KIMBERLEY', price: 171.10, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 6, name: 'LEMOENKLOOF TRUST', district: 'BRITSTOWN', price: 170.00, description: 'BBH', micron: 17.0, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 7, name: 'RAMMEKRAAL (PTY) LTD', district: 'COLESBERG', price: 168.30, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 8, name: 'KALAHARI PLAINS', district: 'UPINGTON', price: 167.90, description: 'BBH', micron: 18.5, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 9, name: 'JHF KLEYN', district: 'COLESBERG', price: 166.50, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 10, name: 'ORANGE RIVER ESTATES', district: 'HOPETOWN', price: 165.00, description: 'AH', micron: 19.0, certified: 'RWS', buyer_name: 'Standard Wool'},
        ]},
        { province: 'KwaZulu-Natal', producers: [
            { position: 1, name: 'ZULU HIGHLANDS FARM', district: 'BERGVILLE', price: 175.80, description: 'AF', micron: 17.2, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'DRAKENSBERG ESTATES', district: 'UNDERBERG', price: 174.20, description: 'BF', micron: 17.8, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'MIDLANDS MERINO FARM', district: 'HOWICK', price: 172.90, description: 'AH', micron: 18.1, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'NATAL DOWNS', district: 'ESTCOURT', price: 171.40, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'TUKELA VALLEY FARM', district: 'LADYSMITH', price: 170.20, description: 'AFY', micron: 17.5, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'CHAMPAGNE VALLEY', district: 'WINTERTON', price: 168.90, description: 'BFY', micron: 18.0, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'ROYAL NATAL FARM', district: 'BERGVILLE', price: 167.50, description: 'BH', micron: 18.3, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'MOOI RIVER ESTATES', district: 'MOOI RIVER', price: 166.10, description: 'AH', micron: 17.9, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: "GIANT'S CASTLE FARM", district: 'ESTCOURT', price: 164.80, description: 'BBH', micron: 18.7, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SPIOENKOP ESTATE', district: 'LADYSMITH', price: 163.50, description: 'BFY', micron: 18.9, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Gauteng', producers: [
            { position: 1, name: 'HIGHVELD MERINO STUD', district: 'BENONI', price: 168.40, description: 'AF', micron: 17.1, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'RAND WOOL FARMS', district: 'KRUGERSDORP', price: 166.80, description: 'BF', micron: 17.6, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'GOLDEN FLEECE ESTATE', district: 'HEIDELBERG', price: 165.30, description: 'AH', micron: 18.0, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'WITWATERSRAND RANCH', district: 'MAGALIESBURG', price: 163.90, description: 'BH', micron: 18.4, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'CRADLE OF HUMANKIND FARM', district: 'MULDERSDRIFT', price: 162.50, description: 'AFY', micron: 17.8, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'GOLD REEF WOOL CO', district: 'ROODEPOORT', price: 161.20, description: 'BFY', micron: 18.2, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'VAAL TRIANGLE FARMS', district: 'VANDERBIJLPARK', price: 159.80, description: 'BH', micron: 18.6, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'METRO WOOL PRODUCERS', district: 'PRETORIA', price: 158.40, description: 'AH', micron: 19.0, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'EAST RAND ESTATES', district: 'SPRINGS', price: 157.10, description: 'BBH', micron: 18.8, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SUIKERBOSRAND FARM', district: 'HEIDELBERG', price: 155.70, description: 'BFY', micron: 19.2, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Mpumalanga', producers: [
            { position: 1, name: 'ESCARPMENT WOOL FARM', district: 'DULLSTROOM', price: 164.90, description: 'AF', micron: 17.0, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'HIGHVELD HIGHLANDS', district: 'LYDENBURG', price: 163.20, description: 'BF', micron: 17.5, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'PANORAMA ROUTE FARMS', district: 'SABIE', price: 161.80, description: 'AH', micron: 17.9, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'LOWVELD MERINO STUD', district: 'BARBERTON', price: 160.40, description: 'BH', micron: 18.3, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'KRUGER PARK ESTATE', district: 'NELSPRUIT', price: 159.10, description: 'AFY', micron: 17.7, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'BLYDE RIVER RANCH', district: 'HOEDSPRUIT', price: 157.80, description: 'BFY', micron: 18.1, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'SUDWALA CAVES FARM', district: 'MACHADADORP', price: 156.50, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'LONG TOM PASS ESTATE', district: 'LYDENBURG', price: 155.20, description: 'AH', micron: 18.8, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'MPUMALANGA MERINO CO', district: 'ERMELO', price: 153.90, description: 'BBH', micron: 19.1, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'COAL COUNTRY FARMS', district: 'WITBANK', price: 152.60, description: 'BFY', micron: 19.4, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Limpopo', producers: [
            { position: 1, name: 'BAOBAB TREE FARM', district: 'POLOKWANE', price: 162.30, description: 'AF', micron: 17.3, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'WATERBERG PLATEAU', district: 'VAALWATER', price: 160.80, description: 'BF', micron: 17.8, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'MAKGABENG ESTATES', district: 'BELA-BELA', price: 159.40, description: 'AH', micron: 18.2, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'LEPHALALE WOOL CO', district: 'LEPHALALE', price: 158.10, description: 'BH', micron: 18.6, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'MAKHADO HIGHLANDS', district: 'LOUIS TRICHARDT', price: 156.80, description: 'AFY', micron: 18.0, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'MOGALAKWENA RANCH', district: 'MOKOPANE', price: 155.50, description: 'BFY', micron: 18.4, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'TZANEEN HEIGHTS', district: 'TZANEEN', price: 154.20, description: 'BH', micron: 18.8, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'BUSHVELD MERINO FARM', district: 'THABAZIMBI', price: 152.90, description: 'AH', micron: 19.2, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'CAPRICORN WOOL ESTATE', district: 'POLOKWANE', price: 151.60, description: 'BBH', micron: 19.5, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SOUTPANSBERG FARMS', district: 'THOHOYANDOU', price: 150.30, description: 'BFY', micron: 19.8, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'North West', producers: [
            { position: 1, name: 'MAFIKENG MERINO STUD', district: 'MAFIKENG', price: 170.40, description: 'AF', micron: 17.4, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'RUSTENBURG PLATEAU', district: 'RUSTENBURG', price: 168.90, description: 'BF', micron: 17.9, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'PILANESBERG ESTATES', district: 'SUN CITY', price: 167.50, description: 'AH', micron: 18.3, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'KLERKSDORP WOOL CO', district: 'KLERKSDORP', price: 166.10, description: 'BH', micron: 18.7, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'POTCHEFSTROOM FARMS', district: 'POTCHEFSTROOM', price: 164.80, description: 'AFY', micron: 18.1, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'VRYBURG MERINO RANCH', district: 'VRYBURG', price: 163.50, description: 'BFY', micron: 18.5, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'LICHTENBURG ESTATES', district: 'LICHTENBURG', price: 162.20, description: 'BH', micron: 18.9, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'MOLOPO RIVER FARM', district: 'ZEERUST', price: 160.90, description: 'AH', micron: 19.3, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'BUSHVELD HIGHLANDS', district: 'BRITS', price: 159.60, description: 'BBH', micron: 19.6, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'MADIKWE RESERVE FARM', district: 'GROOT MARICO', price: 158.30, description: 'BFY', micron: 19.9, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
    ],
    "province_avg_prices": [
        { id: 'ZA-EC', name: 'Eastern Cape', avg_price: 182.50 },
        { id: 'ZA-FS', name: 'Free State', avg_price: 165.80 },
        { id: 'ZA-GP', name: 'Gauteng', avg_price: 160.00 },
        { id: 'ZA-KZN', name: 'KwaZulu-Natal', avg_price: 168.30 },
        { id: 'ZA-LP', name: 'Limpopo', avg_price: 155.00 },
        { id: 'ZA-MP', name: 'Mpumalanga', avg_price: 158.70 },
        { id: 'ZA-NC', name: 'Northern Cape', avg_price: 175.40 },
        { id: 'ZA-NW', name: 'North West', avg_price: 162.10 },
        { id: 'ZA-WC', name: 'Western Cape', avg_price: 178.90 },
    ]
  },
  {
    "auction": {
      "commodity": "wool",
      "season_label": "2025/26",
      "week_id": "week_2024_52",
      "week_start": "2024-12-30",
      "week_end": "2025-01-05",
      "auction_date": "2025-01-01",
      "catalogue_name": "CAT52"
    },
    "indicators": [
      {"type":"total_lots","unit":"bales","value":9830,"value_ytd": 40000,"pct_change":-1.5},
      {"type":"total_volume","unit":"MT","value":1504.1,"value_ytd": 6000.0,"pct_change":-0.8},
      {"type":"avg_price","unit":"R/kg","value":185.72,"pct_change":1.1},
      {"type":"total_value","unit":"R M","value":279.3,"value_ytd": 1180.5,"pct_change":0.3}
    ],
    "benchmarks": [
      {"label":"Certified","price":181.80,"currency":"R/kg clean","day_change_pct":-0.5},
      {"label":"All-Merino","price":177.75,"currency":"R/kg clean","day_change_pct":-0.2},
      {"label":"AWEX","price":12.54,"currency":"USD/kg clean","day_change_pct":-0.1}
    ],
    "yearly_average_prices": [
        {"label": "Certified Wool Avg Price (YTD)", "value": 185.90, "unit": "R/kg"},
        {"label": "All - Merino Wool Avg Price (YTD)", "value": 172.10, "unit": "R/kg"}
    ],
    "micron_prices": [
      {"bucket_micron":"17","category":"Fine","price_clean_zar_per_kg":220.10,"certified_price_clean_zar_per_kg":222.80,"all_merino_price_clean_zar_per_kg":217.40},
      {"bucket_micron":"18","category":"Fine","price_clean_zar_per_kg":205.80,"certified_price_clean_zar_per_kg":208.30,"all_merino_price_clean_zar_per_kg":203.30},
      {"bucket_micron":"19","category":"Fine","price_clean_zar_per_kg":191.50,"certified_price_clean_zar_per_kg":194.00,"all_merino_price_clean_zar_per_kg":189.00},
      {"bucket_micron":"20","category":"Medium","price_clean_zar_per_kg":179.90,"certified_price_clean_zar_per_kg":182.30,"all_merino_price_clean_zar_per_kg":177.50},
      {"bucket_micron":"21","category":"Medium","price_clean_zar_per_kg":172.30,"certified_price_clean_zar_per_kg":174.60,"all_merino_price_clean_zar_per_kg":170.00},
      {"bucket_micron":"22","category":"Strong","price_clean_zar_per_kg":165.40,"certified_price_clean_zar_per_kg":167.60,"all_merino_price_clean_zar_per_kg":163.20},
      {"bucket_micron":"23","category":"Strong","price_clean_zar_per_kg":158.00,"certified_price_clean_zar_per_kg":160.10,"all_merino_price_clean_zar_per_kg":155.90}
    ],
    "buyers": [
      {"buyer":"BKB PINNACLE FIBRES","share_pct":23.5, "cat": 1490, "bales_ytd": 4210},
      {"buyer":"MODIANO SA","share_pct":21.9, "cat": 1380, "bales_ytd": 3290},
      {"buyer":"STUCKEN & CO","share_pct":15.1, "cat": 950, "bales_ytd": 2550},
      {"buyer":"STANDARD WOOL","share_pct":12.8, "cat": 810, "bales_ytd": 2400},
      {"buyer":"TIANYU SA","share_pct":12.2, "cat": 770, "bales_ytd": 3100},
      {"buyer":"LEMPRIERE SA", "share_pct": 6.5, "cat": 410, "bales_ytd": 680},
    ],
    "top_sales": [],
    "brokers": [
      {"name": "BKB", "catalogue_offering": 3139, "sold_ytd": 9299},
      {"name": "OVK", "catalogue_offering": 1291, "sold_ytd": 4631},
      {"name": "JLW", "catalogue_offering": 425, "sold_ytd": 556},
      {"name": "MAS", "catalogue_offering": 388, "sold_ytd": 1395},
      {"name": "QWB", "catalogue_offering": 734, "sold_ytd": 1460},
      {"name": "VLB", "catalogue_offering": 0, "sold_ytd": 0}
    ],
    "currencies": [
      {"code": "USD", "value": 17.89, "change": 0.2},
      {"code": "AUD", "value": 11.52, "change": 0.1},
      {"code": "EUR", "value": 20.47, "change": -0.3}
    ],
    "insights": "A slightly softer market this week with minor pullbacks in key benchmarks. Overall volume was lower, consistent with the holiday period. Demand is expected to pick up in the new year.",
    "trends": {
      "rws": generateTrendData(178, 9.8),
      "non_rws": generateTrendData(168, 9.3),
      "awex": generateTrendData(0, 12.2), // AWEX is typically in USD
      "exchange_rates": generateTrendData(17.2, 17.2) // ZAR/USD exchange rate
    },
     "provincial_producers": [
        { province: 'Eastern Cape', producers: [
            { position: 1, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 185.50, description: 'BFY', micron: 16.6, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 2, name: 'RM WARDLE', district: 'CATHCART', price: 182.20, description: 'BH', micron: 16.9, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'SB DE KLERK BOERDERY', district: 'GRAHAMSTOWN', price: 178.40, description: 'BFFH', micron: 16.4, certified: '', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'RM WARDLE', district: 'CATHCART', price: 174.30, description: 'BBH', micron: 17.9, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 5, name: 'AC LOMBARD EN SEUN (PTY) LTD', district: 'ADELAIDE', price: 172.10, description: 'BFFY', micron: 16.2, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 6, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 170.20, description: 'BF', micron: 18.6, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 164.20, description: 'BFY', micron: 19.2, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'PAINTER RW t/a YELLOWWOODS', district: 'ADELAIDE', price: 163.90, description: 'BH', micron: 17.3, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'KLEIN RIVIER ESTATES', district: 'STEYTLERVILLE', price: 162.70, description: 'HBKS', micron: 17.2, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SUURBERG MOUNTAINS', district: 'KIRKWOOD', price: 160.80, description: 'CFY2', micron: 17.5, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Free State', producers: [
            { position: 1, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 164.20, description: 'AH', micron: 18.2, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 2, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 163.10, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 3, name: 'HT GERTENBACH', district: 'SMITHFIELD', price: 162.80, description: 'BH', micron: 18.4, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 4, name: 'GBP BOERDERY BK', district: 'PHILIPPOLIS', price: 152.80, description: 'CL', micron: 16.8, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 5, name: 'MIGNONETTE BOERDERY', district: 'SENEKAL', price: 149.60, description: 'CL', micron: 17.4, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 6, name: 'GBP BOERDERY BK', district: 'PHILIPPOLIS', price: 146.70, description: 'CMY', micron: 18.4, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 7, name: 'FJC CRONJE', district: 'ZASTRON', price: 145.30, description: 'CCM', micron: 21.2, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 8, name: 'HT GERTENBACH', district: 'SMITHFIELD', price: 144.70, description: 'CH', micron: 18.1, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 9, name: 'ZENTNER BOERDERY BK', district: 'MEMEL', price: 144.30, description: 'CM', micron: 19.1, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 10, name: 'ORANJE BOERDERY', district: 'FICKSBURG', price: 143.80, description: 'BBH', micron: 18.0, certified: 'RWS', buyer_name: 'Standard Wool'},
        ]},
        { province: 'Western Cape', producers: [
            { position: 1, name: 'KLEIN KAROO KOÖP', district: 'OUDTSHOORN', price: 182.90, description: 'AF', micron: 17.0, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 2, name: 'SWELLENDAM KOÖP', district: 'SWELLENDAM', price: 180.10, description: 'BF', micron: 17.4, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 3, name: 'CERES KOÖP', district: 'CERES', price: 177.50, description: 'AFFY', micron: 16.7, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'ROBERTSON KOÖP', district: 'ROBERTSON', price: 175.80, description: 'BFY', micron: 18.0, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'MALMESBURY KOÖP', district: 'MALMESBURY', price: 174.40, description: 'BBH', micron: 18.3, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'STELLENBOSCH VINEYARDS', district: 'STELLENBOSCH', price: 173.00, description: 'AH', micron: 17.7, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'KAROO HIGHLANDS FARM', district: 'LAINGSBURG', price: 171.70, description: 'BH', micron: 18.2, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'WORCESTER FARMS', district: 'WORCESTER', price: 170.20, description: 'AFY', micron: 17.5, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'BREEDE VALLEY ESTATE', district: 'WORCESTER', price: 168.80, description: 'BFY', micron: 18.1, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'CAPE POINT FARMS', district: 'HERMANUS', price: 167.60, description: 'BFFY', micron: 18.4, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Northern Cape', producers: [
            { position: 1, name: 'GWF VAN HEERDEN', district: 'VICTORIA-WES', price: 167.80, description: 'BMY', micron: 16.5, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 2, name: 'TOVERVELD TRUST', district: 'COLESBERG', price: 159.40, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 3, name: 'KAROO WIND FARM', district: 'DE AAR', price: 157.00, description: 'AMY', micron: 17.3, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 4, name: 'JJ LINGENFELDER', district: 'COLESBERG', price: 155.60, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 5, name: 'DIAMOND FIELDS RANCH', district: 'KIMBERLEY', price: 154.10, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 6, name: 'LEMOENKLOOF TRUST', district: 'BRITSTOWN', price: 153.00, description: 'BBH', micron: 17.0, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 7, name: 'RAMMEKRAAL (PTY) LTD', district: 'COLESBERG', price: 150.30, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 8, name: 'KALAHARI PLAINS', district: 'UPINGTON', price: 149.90, description: 'BBH', micron: 18.5, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 9, name: 'JHF KLEYN', district: 'COLESBERG', price: 148.50, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 10, name: 'ORANGE RIVER ESTATES', district: 'HOPETOWN', price: 148.00, description: 'AH', micron: 19.0, certified: 'RWS', buyer_name: 'Standard Wool'},
        ]},
        { province: 'KwaZulu-Natal', producers: [
            { position: 1, name: 'ZULU HIGHLANDS FARM', district: 'BERGVILLE', price: 173.40, description: 'AF', micron: 17.4, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'DRAKENSBERG ESTATES', district: 'UNDERBERG', price: 171.80, description: 'BF', micron: 18.0, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'MIDLANDS MERINO FARM', district: 'HOWICK', price: 170.50, description: 'AH', micron: 18.3, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'NATAL DOWNS', district: 'ESTCOURT', price: 169.00, description: 'BH', micron: 18.7, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'TUKELA VALLEY FARM', district: 'LADYSMITH', price: 167.80, description: 'AFY', micron: 17.7, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'CHAMPAGNE VALLEY', district: 'WINTERTON', price: 166.50, description: 'BFY', micron: 18.2, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'ROYAL NATAL FARM', district: 'BERGVILLE', price: 165.10, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'MOOI RIVER ESTATES', district: 'MOOI RIVER', price: 163.70, description: 'AH', micron: 18.1, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: "GIANT'S CASTLE FARM", district: 'ESTCOURT', price: 162.40, description: 'BBH', micron: 18.9, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SPIOENKOP ESTATE', district: 'LADYSMITH', price: 161.10, description: 'BFY', micron: 19.1, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Gauteng', producers: [
            { position: 1, name: 'HIGHVELD MERINO STUD', district: 'BENONI', price: 166.00, description: 'AF', micron: 17.3, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'RAND WOOL FARMS', district: 'KRUGERSDORP', price: 164.40, description: 'BF', micron: 17.8, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'GOLDEN FLEECE ESTATE', district: 'HEIDELBERG', price: 162.90, description: 'AH', micron: 18.2, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'WITWATERSRAND RANCH', district: 'MAGALIESBURG', price: 161.50, description: 'BH', micron: 18.6, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'CRADLE OF HUMANKIND FARM', district: 'MULDERSDRIFT', price: 160.10, description: 'AFY', micron: 18.0, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'GOLD REEF WOOL CO', district: 'ROODEPOORT', price: 158.80, description: 'BFY', micron: 18.4, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'VAAL TRIANGLE FARMS', district: 'VANDERBIJLPARK', price: 157.40, description: 'BH', micron: 18.8, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'METRO WOOL PRODUCERS', district: 'PRETORIA', price: 156.00, description: 'AH', micron: 19.2, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'EAST RAND ESTATES', district: 'SPRINGS', price: 154.70, description: 'BBH', micron: 19.0, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SUIKERBOSRAND FARM', district: 'HEIDELBERG', price: 153.30, description: 'BFY', micron: 19.4, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Mpumalanga', producers: [
            { position: 1, name: 'ESCARPMENT WOOL FARM', district: 'DULLSTROOM', price: 162.50, description: 'AF', micron: 17.2, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'HIGHVELD HIGHLANDS', district: 'LYDENBURG', price: 160.80, description: 'BF', micron: 17.7, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'PANORAMA ROUTE FARMS', district: 'SABIE', price: 159.40, description: 'AH', micron: 18.1, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'LOWVELD MERINO STUD', district: 'BARBERTON', price: 158.00, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'KRUGER PARK ESTATE', district: 'NELSPRUIT', price: 156.70, description: 'AFY', micron: 17.9, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'BLYDE RIVER RANCH', district: 'HOEDSPRUIT', price: 155.40, description: 'BFY', micron: 18.3, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'SUDWALA CAVES FARM', district: 'MACHADADORP', price: 154.10, description: 'BH', micron: 18.7, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'LONG TOM PASS ESTATE', district: 'LYDENBURG', price: 152.80, description: 'AH', micron: 19.0, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'MPUMALANGA MERINO CO', district: 'ERMELO', price: 151.50, description: 'BBH', micron: 19.3, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'COAL COUNTRY FARMS', district: 'WITBANK', price: 150.20, description: 'BFY', micron: 19.6, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'Limpopo', producers: [
            { position: 1, name: 'BAOBAB TREE FARM', district: 'POLOKWANE', price: 159.90, description: 'AF', micron: 17.5, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'WATERBERG PLATEAU', district: 'VAALWATER', price: 158.40, description: 'BF', micron: 18.0, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'MAKGABENG ESTATES', district: 'BELA-BELA', price: 157.00, description: 'AH', micron: 18.4, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'LEPHALALE WOOL CO', district: 'LEPHALALE', price: 155.70, description: 'BH', micron: 18.8, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'MAKHADO HIGHLANDS', district: 'LOUIS TRICHARDT', price: 154.40, description: 'AFY', micron: 18.2, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'MOGALAKWENA RANCH', district: 'MOKOPANE', price: 153.10, description: 'BFY', micron: 18.6, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'TZANEEN HEIGHTS', district: 'TZANEEN', price: 151.80, description: 'BH', micron: 19.0, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'BUSHVELD MERINO FARM', district: 'THABAZIMBI', price: 150.50, description: 'AH', micron: 19.4, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'CAPRICORN WOOL ESTATE', district: 'POLOKWANE', price: 149.20, description: 'BBH', micron: 19.7, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'SOUTPANSBERG FARMS', district: 'THOHOYANDOU', price: 147.90, description: 'BFY', micron: 20.0, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
        { province: 'North West', producers: [
            { position: 1, name: 'MAFIKENG MERINO STUD', district: 'MAFIKENG', price: 168.00, description: 'AF', micron: 17.6, certified: 'RWS', buyer_name: 'BKB Pinnacle Fibres'},
            { position: 2, name: 'RUSTENBURG PLATEAU', district: 'RUSTENBURG', price: 166.50, description: 'BF', micron: 18.1, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 3, name: 'PILANESBERG ESTATES', district: 'SUN CITY', price: 165.10, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 4, name: 'KLERKSDORP WOOL CO', district: 'KLERKSDORP', price: 163.70, description: 'BH', micron: 18.9, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 5, name: 'POTCHEFSTROOM FARMS', district: 'POTCHEFSTROOM', price: 162.40, description: 'AFY', micron: 18.3, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 6, name: 'VRYBURG MERINO RANCH', district: 'VRYBURG', price: 161.10, description: 'BFY', micron: 18.7, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 7, name: 'LICHTENBURG ESTATES', district: 'LICHTENBURG', price: 159.80, description: 'BH', micron: 19.1, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 8, name: 'MOLOPO RIVER FARM', district: 'ZEERUST', price: 158.50, description: 'AH', micron: 19.5, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 9, name: 'BUSHVELD HIGHLANDS', district: 'BRITS', price: 157.20, description: 'BBH', micron: 19.8, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 10, name: 'MADIKWE RESERVE FARM', district: 'GROOT MARICO', price: 155.90, description: 'BFY', micron: 20.1, certified: 'RWS', buyer_name: 'Modiano SA'},
        ]},
    ],
    "province_avg_prices": [
        { id: 'ZA-EC', name: 'Eastern Cape', avg_price: 180.50 },
        { id: 'ZA-FS', name: 'Free State', avg_price: 163.20 },
        { id: 'ZA-GP', name: 'Gauteng', avg_price: 158.00 },
        { id: 'ZA-KZN', name: 'KwaZulu-Natal', avg_price: 165.90 },
        { id: 'ZA-LP', name: 'Limpopo', avg_price: 152.40 },
        { id: 'ZA-MP', name: 'Mpumalanga', avg_price: 156.10 },
        { id: 'ZA-NC', name: 'Northern Cape', avg_price: 172.80 },
        { id: 'ZA-NW', name: 'North West', avg_price: 160.30 },
        { id: 'ZA-WC', name: 'Western Cape', avg_price: 176.20 },
    ]
  }
];