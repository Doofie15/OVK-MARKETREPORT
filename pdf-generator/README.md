# PDF Generator for OVK Wool Market Report

This folder contains a standalone HTML/CSS/JavaScript version of the OVK Wool Market Report that can be used for PDF generation.

## Files Structure

- `index.html` - Main HTML template with inline CSS
- `data.js` - JavaScript file containing data structure and population functions
- `README.md` - This documentation file

## Features

### ✅ Complete Layout Replication
- **Header**: OVK logo and title with current month/year
- **Auction Title Section**: Catalogue name, date, and season information
- **Indicators Grid**: Total lots, volume, average price, and total value with trend indicators
- **Market Overview**: Currency rates, RWS premium, and AWEX pricing
- **Market Insights**: Text-based market analysis
- **Micron Price Chart**: Placeholder for chart integration
- **Top Sales Table**: Performance data for top producers
- **Buyer Analysis**: Market share and purchase data
- **Broker Performance**: Clearance rates and sales data

### ✅ Responsive Design
- Mobile-optimized layout
- Print-friendly CSS styles
- Grid-based responsive system

### ✅ Data Integration
- Sample data structure matching the React app
- Dynamic data population functions
- Utility functions for formatting numbers, percentages, and dates

## Usage

### Basic Usage
1. Open `index.html` in a web browser
2. The page will automatically populate with sample data
3. Use browser's print function or PDF generation tools

### Custom Data Integration
```javascript
// Load your own data
const customData = {
    auction: { /* your auction data */ },
    indicators: [ /* your indicators */ ],
    // ... other data
};

// Populate the template
PDFGenerator.populateAuctionData(customData);
```

### PDF Generation Options

#### Option 1: Browser Print to PDF
1. Open `index.html` in Chrome/Edge
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Select "Save as PDF"
4. Choose "More settings" → "Options" → "Background graphics"

#### Option 2: Puppeteer/Headless Chrome
```javascript
const puppeteer = require('puppeteer');

async function generatePDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file:///path/to/pdf-generator/index.html');
    await page.pdf({
        path: 'market-report.pdf',
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' }
    });
    await browser.close();
}
```

#### Option 3: wkhtmltopdf
```bash
wkhtmltopdf --page-size A4 --print-media-type --margin-top 20mm --margin-bottom 20mm index.html market-report.pdf
```

## Customization

### Styling
The CSS is embedded in the HTML file for easy customization. Key areas to modify:

- **Colors**: Update CSS variables in `:root` section
- **Layout**: Modify grid classes and spacing
- **Typography**: Adjust font sizes and weights
- **Print Styles**: Customize `@media print` section

### Data Structure
Modify `data.js` to match your data format:

```javascript
// Update the SAMPLE_AUCTION_DATA object
const SAMPLE_AUCTION_DATA = {
    auction: { /* your auction structure */ },
    indicators: [ /* your indicators array */ ],
    // ... other sections
};
```

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add corresponding CSS styles
3. Update data population functions in `data.js`

## Integration with Main App

### Data Export from React App
```javascript
// In your React component
const exportDataForPDF = (reportData) => {
    const pdfData = {
        auction: reportData.auction,
        indicators: reportData.indicators,
        // ... map other fields
    };
    
    // Save to localStorage or send to PDF generator
    localStorage.setItem('pdfData', JSON.stringify(pdfData));
    
    // Open PDF generator with data
    window.open('/pdf-generator/index.html', '_blank');
};
```

### Dynamic Data Loading
```javascript
// In pdf-generator/index.html
document.addEventListener('DOMContentLoaded', function() {
    // Try to load data from localStorage
    const savedData = localStorage.getItem('pdfData');
    if (savedData) {
        const data = JSON.parse(savedData);
        PDFGenerator.populateAuctionData(data);
        localStorage.removeItem('pdfData'); // Clean up
    } else {
        // Use sample data
        PDFGenerator.populateAuctionData(PDFGenerator.SAMPLE_AUCTION_DATA);
    }
});
```

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Print/PDF Optimization

The template includes specific print optimizations:

- **Page Breaks**: `break-inside: avoid` on major sections
- **Background Colors**: Preserved in print mode
- **Font Sizes**: Optimized for PDF readability
- **Margins**: Proper spacing for professional appearance

## Future Enhancements

- [ ] Chart.js integration for micron price charts
- [ ] Multiple report templates
- [ ] Batch PDF generation
- [ ] Email integration
- [ ] Automated scheduling

## Support

For questions or issues with the PDF generator, please refer to the main project documentation or create an issue in the repository.
