// INTEGRUOTAS SISTEMOS PAVYZDYS
// Demonstruoja kaip veikia produktų korteles sistema

// DEMO ŽALIAVŲ DUOMENYS 
const DEMO_MATERIALS = [
  { id: 'WOOD_BOARD_18MM', name: 'Medienos plokštė 18mm', currentPrice: 45.50, unit: 'm2' },
  { id: 'WOOD_SCREWS_5X60', name: 'Varžtai medžiui 5x60', currentPrice: 0.12, unit: 'vnt' },
  { id: 'PAINT_EXTERIOR', name: 'Lauko dažai', currentPrice: 25.80, unit: 'l' },
  { id: 'INSULATION_50MM', name: 'Mineralinė vata 50mm', currentPrice: 8.90, unit: 'm2' },
  { id: 'VAPOR_BARRIER', name: 'Garų izoliacija', currentPrice: 2.40, unit: 'm2' },
  { id: 'THERMO_BOARDS', name: 'Termo dailylentės', currentPrice: 95.00, unit: 'm2' },
  { id: 'TUB_ST_ROUND_1800', name: 'ST vonios korpusas 1800mm', currentPrice: 850.00, unit: 'vnt' },
  { id: 'METAL_STRAP_40MM', name: 'Metalinės juostos 40mm', currentPrice: 12.50, unit: 'm' },
  { id: 'STRAP_BUCKLES', name: 'Juostų sagtys', currentPrice: 8.90, unit: 'vnt' },
  { id: 'LEATHER_COVER', name: 'Odos dangčio medžiaga', currentPrice: 180.00, unit: 'm2' },
  { id: 'STOVE_INTEGRATED_30KW_316', name: 'Integruota krosnelė 30kW', currentPrice: 420.00, unit: 'vnt' },
  { id: 'RCD_16A', name: 'RCD 16A', currentPrice: 45.00, unit: 'vnt' },
  { id: 'ELECTRIC_CABLE', name: 'Elektros kabelis', currentPrice: 3.20, unit: 'm' },
  { id: 'CARDBOARD_BOX', name: 'Kartono dėžė', currentPrice: 25.00, unit: 'vnt' }
];

// SISTEMOS DEMO KLASĖ
class WildERPSystemDemo {
  constructor() {
    this.materialsDb = DEMO_MATERIALS;
    console.log('🚀 Wild ERP Sistema inicializuota!');
    this.runDemo();
  }

  runDemo() {
    console.log('\n=== PRODUKTŲ KORTELES SISTEMOS DEMO ===\n');
    
    // Simuliuojame skaičiavimus (tikroje sistemoje būtų per calculator.js)
    this.demoTubCalculation();
    this.demoSaunaCalculation();  
    this.demoCombinedOrder();
    this.demoPDFGeneration();
    this.demoCalculationHistory();
  }

  demoTubCalculation() {
    console.log('🛁 === KUBILŲ SKAIČIAVIMAS ===');
    
    // Simuliuojame ST apvalų kubilą 1800mm
    const tubCalc = {
      id: 'CALC_TUB_001',
      productCode: 'TUB_ST_ROUND_1800_INT',
      customizations: {
        color: 'ral_7015_dark_grey',
        coverType: 'leather',
        stoveType: 'integrated_30kw'
      },
      pricing: {
        materialsCost: 1114.62,
        laborCost: 138.00,
        laborHours: 12,
        totalCost: 1252.62,
        b2bPrice: 1628.41,
        b2cPrice: 1954.09,
        b2cWithVAT: 2364.45,
        profit: {
          b2b: 375.79,
          b2c: 701.47,
          b2cWithVAT: 1111.83
        }
      }
    };
    
    console.log(`✅ Kubilas: ${tubCalc.productCode}`);
    console.log(`💰 Savikaina: ${this.formatMoney(tubCalc.pricing.totalCost)}`);
    console.log(`🏷️ B2B kaina: ${this.formatMoney(tubCalc.pricing.b2bPrice)}`);
    console.log(`🛍️ B2C su PVM: ${this.formatMoney(tubCalc.pricing.b2cWithVAT)}`);
    console.log(`💵 Pelnas B2B: ${this.formatMoney(tubCalc.pricing.profit.b2b)}`);
    console.log(`⏱️ Darbo valandos: ${tubCalc.pricing.laborHours}h`);
    
    // Simuliuojame nuolaidą
    const discountPrice = tubCalc.pricing.b2bPrice * 0.9 - 50; // 10% + 50€
    console.log(`🎯 Po nuolaidos (10% + 50€): ${this.formatMoney(discountPrice)}`);
    
    // Simuliuojame avansą
    const advance = tubCalc.pricing.b2cWithVAT * 0.3;
    console.log(`📋 Avansas (30%): ${this.formatMoney(advance)}`);
    
    this.storedTubCalc = tubCalc;
  }

  demoSaunaCalculation() {
    console.log('\n🏠 === PIRČIŲ SKAIČIAVIMAS ===');
    
    const saunaCalc = {
      id: 'CALC_SAUNA_001',
      productCode: 'SAUNA_ROUND_THERMO',
      configuration: {
        length: 4.0,
        saunaLength: 2.5,
        roofType: 'bitumen_single',
        treatment: 'oiling'
      },
      pricing: {
        materialsCost: 1966.29,
        laborCost: 851.00,
        laborHours: 74,
        savikaina: 2817.29,
        b2bPrice: 3240.88,
        b2cPrice: 3889.06,
        b2cWithVAT: 4705.76,
        profit: {
          b2b: 423.59,
          b2c: 1071.77,
          b2cWithVAT: 1888.47
        }
      }
    };
    
    console.log(`✅ Pirtis: ${saunaCalc.productCode}`);
    console.log(`📐 Konfigūracija: 4m bendras, 2.5m pirtis`);
    console.log(`💰 Savikaina: ${this.formatMoney(saunaCalc.pricing.savikaina)}`);
    console.log(`🏷️ B2B kaina: ${this.formatMoney(saunaCalc.pricing.b2bPrice)}`);
    console.log(`🛍️ B2C su PVM: ${this.formatMoney(saunaCalc.pricing.b2cWithVAT)}`);
    console.log(`💵 Pelnas B2B: ${this.formatMoney(saunaCalc.pricing.profit.b2b)}`);
    console.log(`⏱️ Darbo valandos: ${saunaCalc.pricing.laborHours}h`);
    
    this.storedSaunaCalc = saunaCalc;
  }

  demoCombinedOrder() {
    console.log('\n🎯 === KOMBINUOTAS UŽSAKYMAS ===');
    
    // Kombinuojame kubilą + pirtį
    const combinedCalc = {
      id: 'CALC_COMBINED_001',
      type: 'combined',
      items: [this.storedTubCalc, this.storedSaunaCalc],
      totals: {
        materialsCost: 3080.91,
        laborCost: 989.00,
        laborHours: 86,
        totalCost: 4069.91,
        b2bPrice: 5290.88,
        b2cPrice: 6349.06,
        b2cWithVAT: 7682.36,
        profit: {
          b2b: 1220.97,
          b2c: 2279.15,
          b2cWithVAT: 3612.45
        }
      }
    };
    
    console.log(`✅ Kombinuotas užsakymas: kubilas + pirtis`);
    console.log(`💰 Bendra savikaina: ${this.formatMoney(combinedCalc.totals.totalCost)}`);
    console.log(`🏷️ B2B kaina: ${this.formatMoney(combinedCalc.totals.b2bPrice)}`);
    console.log(`🛍️ B2C su PVM: ${this.formatMoney(combinedCalc.totals.b2cWithVAT)}`);
    console.log(`💵 Pelnas B2B: ${this.formatMoney(combinedCalc.totals.profit.b2b)}`);
    console.log(`⏱️ Bendros darbo valandos: ${combinedCalc.totals.laborHours}h`);
    
    this.storedCombinedCalc = combinedCalc;
  }

  demoPDFGeneration() {
    console.log('\n📄 === PDF GENERAVIMAS ===');
    
    const pdfStructure = {
      filename: `${this.storedTubCalc.id}.pdf`,
      metadata: {
        title: `Kainų pasiūlymas ${this.storedTubCalc.id}`,
        author: 'WildERP System'
      },
      pages: [
        {
          pageNumber: 1,
          sections: [
            { type: 'header', content: 'Wild ERP - Kainų pasiūlymas' },
            { type: 'customerInfo', content: 'Jonas Jonaitis, UAB Pavyzdys' },
            { type: 'productInfo', content: this.storedTubCalc.productCode },
            { type: 'pricing', content: 'Kainų lentelė' },
            { type: 'terms', content: 'Pardavimo sąlygos' }
          ]
        },
        {
          pageNumber: 2, 
          sections: [
            { type: 'bomHeader', content: 'Išsamūs skaičiavimai' },
            { type: 'bomTable', content: 'Medžiagų ir komponentų sąrašas' }
          ]
        }
      ]
    };
    
    console.log(`✅ PDF sugeneruotas: ${pdfStructure.filename}`);
    console.log(`📋 Puslapių skaičius: ${pdfStructure.pages.length}`);
    console.log(`📝 Dokumentas: ${pdfStructure.metadata.title}`);
    
    this.displayPDFStructure(pdfStructure);
  }

  demoCalculationHistory() {
    console.log('\n📊 === SKAIČIAVIMŲ ISTORIJA ===');
    
    const history = [this.storedTubCalc, this.storedSaunaCalc, this.storedCombinedCalc];
    
    console.log(`📈 Viso skaičiavimų: ${history.length}`);
    
    history.forEach((calc, index) => {
      const price = calc.pricing ? calc.pricing.b2cWithVAT : calc.totals.b2cWithVAT;
      const date = new Date().toLocaleDateString('lt-LT');
      console.log(`${index + 1}. ${calc.id} | ${calc.type || 'product'} | ${this.formatMoney(price)} | ${date}`);
    });
    
    console.log('\n🎉 === DEMO BAIGTAS ===');
    console.log('Sistema paruošta naudojimui!');
  }

  displayPDFStructure(pdfStructure) {
    console.log('\n📋 PDF STRUKTŪRA:');
    pdfStructure.pages.forEach((page) => {
      console.log(`\n--- Puslapis ${page.pageNumber} ---`);
      page.sections.forEach(section => {
        console.log(`  • ${section.type}: ${section.content}`);
      });
    });
  }

  formatMoney(amount) {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}

// SISTEMOS PALEIDIMAS  
console.log('Paleidžiamas Wild ERP sistemos demo...');
const demo = new WildERPSystemDemo();

// EKSPORTAS
export {
  WildERPSystemDemo,
  DEMO_MATERIALS
};
