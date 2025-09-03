import type { AuctionReport } from './types';

export const BUYERS = [
    "BKB PINNACLE FIBRES", "MODIANO SA", "STUCKEN & CO", 
    "STANDARD WOOL", "TIANYU SA", "LEMPRIERE SA", 
    "SEGARD MASUREL SA", "VBC WOOL SA", "FiberCorp SA",
    "Textile Industries Ltd", "Global Wool Traders", "Cape Mohair & Wool"
];

export const BROKERS = ["BKB", "OVK", "JLW", "MAS", "QWB", "VLB"];

const generateTrendData = (baseZar: number, baseUsd: number) => {
  const data = [];
  for (let i = 1; i <= 35; i += 2) {
    const period = `P${String(i).padStart(2, '0')}`;
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
    { bucket_micron: '18', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '19', category: 'Fine', price_clean_zar_per_kg: 0 },
    { bucket_micron: '20', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '21', category: 'Medium', price_clean_zar_per_kg: 0 },
    { bucket_micron: '22', category: 'Strong', price_clean_zar_per_kg: 0 },
  ],
  buyers: [],
  brokers: [],
  currencies: [
      { code: "USD", value: 0, change: 0 },
      { code: "AUD", value: 0, change: 0 },
      { code: "EUR", value: 0, change: 0 }
  ],
  insights: '',
  trends: { rws: [], non_rws: [] },
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
      {"type":"avg_price","unit":"ZAR/kg","value":181.45,"pct_change":-2.3},
      {"type":"total_value","unit":"ZAR M","value":281.4,"pct_change":0.7}
    ],
    "benchmarks": [
      {"label":"Certified","price":184.35,"currency":"ZAR/kg clean","day_change_pct":1.4},
      {"label":"All-Merino","price":179.53,"currency":"ZAR/kg clean","day_change_pct":1.0},
      {"label":"AWEX","price":12.61,"currency":"USD/kg clean","day_change_pct":0.6}
    ],
    "yearly_average_prices": [
      {"label": "RWS Avg Price (YTD)", "value": 188.50, "unit": "ZAR/kg"},
      {"label": "Non-RWS Avg Price (YTD)", "value": 175.20, "unit": "ZAR/kg"}
    ],
    "micron_prices": [
      {"bucket_micron":"17","category":"Fine","price_clean_zar_per_kg":225.50},
      {"bucket_micron":"18","category":"Fine","price_clean_zar_per_kg":210.00},
      {"bucket_micron":"19","category":"Fine","price_clean_zar_per_kg":195.70},
      {"bucket_micron":"20","category":"Medium","price_clean_zar_per_kg":182.40},
      {"bucket_micron":"21","category":"Medium","price_clean_zar_per_kg":175.00},
      {"bucket_micron":"22","category":"Strong","price_clean_zar_per_kg":168.20},
      {"bucket_micron":"23","category":"Strong","price_clean_zar_per_kg":160.10}
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
      "non_rws": generateTrendData(170, 9.5)
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
      {"type":"avg_price","unit":"ZAR/kg","value":185.72,"pct_change":1.1},
      {"type":"total_value","unit":"ZAR M","value":279.3,"pct_change":0.3}
    ],
    "benchmarks": [
      {"label":"Certified","price":181.80,"currency":"ZAR/kg clean","day_change_pct":-0.5},
      {"label":"All-Merino","price":177.75,"currency":"ZAR/kg clean","day_change_pct":-0.2},
      {"label":"AWEX","price":12.54,"currency":"USD/kg clean","day_change_pct":-0.1}
    ],
    "yearly_average_prices": [
        {"label": "RWS Avg Price (YTD)", "value": 185.90, "unit": "ZAR/kg"},
        {"label": "Non-RWS Avg Price (YTD)", "value": 172.10, "unit": "ZAR/kg"}
    ],
    "micron_prices": [
      {"bucket_micron":"17","category":"Fine","price_clean_zar_per_kg":220.10},
      {"bucket_micron":"18","category":"Fine","price_clean_zar_per_kg":205.80},
      {"bucket_micron":"19","category":"Fine","price_clean_zar_per_kg":191.50},
      {"bucket_micron":"20","category":"Medium","price_clean_zar_per_kg":179.90},
      {"bucket_micron":"21","category":"Medium","price_clean_zar_per_kg":172.30},
      {"bucket_micron":"22","category":"Strong","price_clean_zar_per_kg":165.40},
      {"bucket_micron":"23","category":"Strong","price_clean_zar_per_kg":158.00}
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
      "non_rws": generateTrendData(168, 9.3)
    },
     "provincial_producers": [
        { province: 'Northern Cape', producers: [
            { position: 1, name: 'GWF VAN HEERDEN', district: 'VICTORIA-WES', price: 167.80, description: 'BMY', micron: 16.5, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 2, name: 'TOVERVELD TRUST', district: 'COLESBERG', price: 159.40, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Standard Wool'},
            { position: 3, name: 'GWF VAN HEERDEN', district: 'VICTORIA-WES', price: 157.00, description: 'AMY', micron: 17.3, certified: 'RWS', buyer_name: 'Tianyu SA'},
            { position: 4, name: 'JJ LINGENFELDER', district: 'COLESBERG', price: 155.60, description: 'BH', micron: 18.5, certified: 'RWS', buyer_name: 'Lempriere SA'},
            { position: 5, name: 'JJ LINGENFELDER', district: 'COLESBERG', price: 154.10, description: 'AH', micron: 18.5, certified: 'RWS', buyer_name: 'Segard Masurel SA'},
            { position: 6, name: 'LEMOENKLOOF TRUST', district: 'BRITSTOWN', price: 153.00, description: 'BBH', micron: 17.0, certified: 'RWS', buyer_name: 'VBC Wool SA'},
            { position: 7, name: 'RAMMEKRAAL (PTY) LTD', district: 'COLESBERG', price: 150.30, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'FiberCorp SA'},
            { position: 8, name: 'RAMMEKRAAL (PTY) LTD', district: 'COLESBERG', price: 149.90, description: 'BBH', micron: 18.5, certified: 'RWS', buyer_name: 'Modiano SA'},
            { position: 9, name: 'JHF KLEYN', district: 'COLESBERG', price: 148.50, description: 'BH', micron: 17.9, certified: 'RWS', buyer_name: 'Stucken & Co'},
            { position: 10, name: 'JHF KLEYN', district: 'COLESBERG', price: 148.00, description: 'AH', micron: 19.0, certified: 'RWS', buyer_name: 'Standard Wool'},
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