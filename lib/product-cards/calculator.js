// SKAIČIUOKLĖS MODULIS (calculator.js)
// Apjungia kubilų ir pirčių skaičiavimus su PDF generavimu

import { TubsProductRegistry } from './tubs.js';
import { SaunasProductRegistry } from './saunas.js';

// SKAIČIUOKLĖS KLASĖ
class WildERPCalculator {
  constructor(materialsDatabase) {
    this.materialsDb = materialsDatabase;
    this.tubsRegistry = new TubsProductRegistry();
    this.saunasRegistry = new SaunasProductRegistry();
    this.calculations = new Map(); // Išsaugoti skaičiavimų istorija
  }

  // KUBILŲ SKAIČIAVIMAS
  calculateTub(tubCode, customizations = {}) {
    const pricing = this.tubsRegistry.calculateTubPricing(tubCode, this.materialsDb);
    if (!pricing) {
      throw new Error(`Kubilas ${tubCode} nerastas`);
    }

    // Pritaikyti individualizacijas
    if (customizations.color && customizations.color !== 'standard') {
      pricing.materialsCost += this.getColorSurcharge(customizations.color);
    }

    if (customizations.coverType && customizations.coverType !== 'leather') {
      pricing.materialsCost += this.getCoverSurcharge(customizations.coverType);
    }

    if (customizations.stoveType && customizations.stoveType !== 'integrated_30kw') {
      pricing.materialsCost += this.getStoveSurcharge(customizations.stoveType);
    }

    // Perskaičiuoti kainas su papildomomis sąnaudomis
    this.recalculatePricing(pricing);

    const calculation = {
      id: this.generateCalculationId(),
      type: 'tub',
      productCode: tubCode,
      customizations,
      pricing,
      timestamp: new Date().toISOString(),
      currency: 'EUR'
    };

    this.calculations.set(calculation.id, calculation);
    return calculation;
  }

  // PIRČIŲ SKAIČIAVIMAS
  calculateSauna(modelCode, configuration) {
    const pricing = this.saunasRegistry.calculateSaunaPricing(modelCode, configuration, this.materialsDb);
    if (!pricing) {
      throw new Error(`Pirtis ${modelCode} nerasta`);
    }

    const calculation = {
      id: this.generateCalculationId(),
      type: 'sauna', 
      productCode: modelCode,
      configuration,
      pricing,
      timestamp: new Date().toISOString(),
      currency: 'EUR'
    };

    this.calculations.set(calculation.id, calculation);
    return calculation;
  }

  // KOMBINUOTO UŽSAKYMO SKAIČIAVIMAS
  calculateCombinedOrder(items) {
    const calculations = [];
    let totalMaterialsCost = 0;
    let totalLaborCost = 0;
    let totalLaborHours = 0;

    items.forEach(item => {
      let calc;
      if (item.type === 'tub') {
        calc = this.calculateTub(item.productCode, item.customizations);
      } else if (item.type === 'sauna') {
        calc = this.calculateSauna(item.productCode, item.configuration);
      }

      if (calc) {
        // Množimo pagal kiekį
        const quantity = item.quantity || 1;
        calc.quantity = quantity;
        
        totalMaterialsCost += calc.pricing.materialsCost * quantity;
        totalLaborCost += calc.pricing.laborCost * quantity;
        totalLaborHours += calc.pricing.laborHours * quantity;
        
        calculations.push(calc);
      }
    });

    const totalCost = totalMaterialsCost + totalLaborCost;
    const combinedOrder = {
      id: this.generateCalculationId(),
      type: 'combined',
      items: calculations,
      totals: {
        materialsCost: totalMaterialsCost,
        laborCost: totalLaborCost, 
        laborHours: totalLaborHours,
        totalCost: totalCost,
        b2bPrice: totalCost * 1.3,
        b2cPrice: totalCost * 1.3 * 1.2,
        b2cWithVAT: totalCost * 1.3 * 1.2 * 1.21
      },
      timestamp: new Date().toISOString(),
      currency: 'EUR'
    };

    // Apskaičiuoti pelną
    combinedOrder.totals.profit = {
      b2b: combinedOrder.totals.b2bPrice - totalCost,
      b2c: combinedOrder.totals.b2cPrice - totalCost,
      b2cWithVAT: combinedOrder.totals.b2cWithVAT - totalCost
    };

    this.calculations.set(combinedOrder.id, combinedOrder);
    return combinedOrder;
  }

  // PAPILDOMŲ SĄNAUDŲ SKAIČIAVIMAS
  getColorSurcharge(color) {
    const colorSurcharges = {
      'ral_7015_dark_grey': 0,
      'ral_6005_moss_green': 25,
      'ral_3009_oxide_red': 35,
      'custom': 50
    };
    return colorSurcharges[color] || 0;
  }

  getCoverSurcharge(coverType) {
    const coverSurcharges = {
      'leather': 0,
      'vinyl': -50,
      'insulated': 100,
      'premium': 150
    };
    return coverSurcharges[coverType] || 0;
  }

  getStoveSurcharge(stoveType) {
    const stoveSurcharges = {
      'integrated_30kw': 0,
      'external_50kw': 200,
      'premium_60kw': 400,
      'electric': -100
    };
    return stoveSurcharges[stoveType] || 0;
  }

  // PERSKAIČIUOTI KAINAS
  recalculatePricing(pricing) {
    pricing.totalCost = pricing.materialsCost + pricing.laborCost;
    pricing.b2bPrice = pricing.totalCost * 1.3;
    pricing.b2cPrice = pricing.b2bPrice * 1.2;
    pricing.b2cWithVAT = pricing.b2cPrice * 1.21;
    
    pricing.profit = {
      b2b: pricing.b2bPrice - pricing.totalCost,
      b2c: pricing.b2cPrice - pricing.totalCost,  
      b2cWithVAT: pricing.b2cWithVAT - pricing.totalCost
    };
  }

  // NUOLAIDŲ PRITAIKYMAS
  applyDiscount(calculationId, discountPercent, discountAmount = 0) {
    const calculation = this.calculations.get(calculationId);
    if (!calculation) return null;

    const originalPrice = calculation.pricing.b2bPrice || calculation.totals.b2bPrice;
    
    // Nuolaida procentais
    const percentDiscount = originalPrice * (discountPercent / 100);
    
    // Bendras nuolaidos dydis
    const totalDiscount = percentDiscount + discountAmount;
    
    // Pritaikyti nuolaidą
    calculation.discount = {
      percent: discountPercent,
      amount: discountAmount,
      totalDiscount: totalDiscount,
      finalPrice: originalPrice - totalDiscount
    };

    return calculation;
  }

  // APSKAIČIUOTI AVANSĄ
  calculateAdvance(calculationId, advancePercent = 30) {
    const calculation = this.calculations.get(calculationId);
    if (!calculation) return null;

    const finalPrice = calculation.discount ? 
      calculation.discount.finalPrice : 
      (calculation.pricing?.b2cWithVAT || calculation.totals?.b2cWithVAT);

    calculation.advance = {
      percent: advancePercent,
      amount: finalPrice * (advancePercent / 100),
      vatAmount: finalPrice * (advancePercent / 100) * 0.21,
      remaining: finalPrice * (1 - advancePercent / 100)
    };

    return calculation;
  }

  // GENERUOTI SKAIČIAVIMO ID
  generateCalculationId() {
    return 'CALC_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // GAUTI SKAIČIAVIMŲ ISTORIJĄ
  getCalculationHistory(limit = 50) {
    const calculations = Array.from(this.calculations.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return calculations;
  }

  // EKSPORTUOTI SKAIČIAVIMĄ PDF
  async generatePDF(calculationId, options = {}) {
    const calculation = this.calculations.get(calculationId);
    if (!calculation) {
      throw new Error('Skaičiavimas nerastas');
    }

    const pdfData = {
      calculation,
      options: {
        includeBOM: options.includeBOM || false,
        includeImages: options.includeImages || false,
        language: options.language || 'lt',
        companyInfo: options.companyInfo || this.getDefaultCompanyInfo(),
        customerInfo: options.customerInfo || {}
      }
    };

    // TODO: Integruoti su PDF generavimo biblioteka
    return this.createPDFDocument(pdfData);
  }

  // PDF DOKUMENTO SUKŪRIMAS
  async createPDFDocument(pdfData) {
    // Čia būtų tikrasis PDF generavimas
    // Kol kas grąžinam struktūrą
    return {
      filename: `${pdfData.calculation.id}.pdf`,
      pages: this.generatePDFPages(pdfData),
      metadata: {
        title: `Skaičiavimas ${pdfData.calculation.id}`,
        author: 'WildERP System',
        creator: 'WildERP Calculator',
        creationDate: new Date()
      }
    };
  }

  // PDF PUSLAPIŲ GENERAVIMAS
  generatePDFPages(pdfData) {
    const pages = [];
    const { calculation, options } = pdfData;

    // 1 puslapis - Pagrindinis
    pages.push(this.createMainPage(calculation, options));

    // 2 puslapis - Detalūs skaičiavimai
    if (options.includeBOM) {
      pages.push(this.createBOMPage(calculation, options));
    }

    // 3 puslapis - Nuotraukos/schemos
    if (options.includeImages) {
      pages.push(this.createImagesPage(calculation, options));
    }

    return pages;
  }

  // PAGRINDINIO PUSLAPIO STRUKTŪRA
  createMainPage(calculation, options) {
    return {
      pageNumber: 1,
      sections: [
        {
          type: 'header',
          content: {
            companyLogo: options.companyInfo.logo,
            companyName: options.companyInfo.name,
            documentTitle: `Kainų pasiūlymas Nr. ${calculation.id}`,
            date: new Date().toLocaleDateString('lt-LT')
          }
        },
        {
          type: 'customerInfo',
          content: options.customerInfo
        },
        {
          type: 'productInfo',
          content: this.formatProductInfo(calculation)
        },
        {
          type: 'pricing',
          content: this.formatPricingTable(calculation)
        },
        {
          type: 'terms',
          content: this.getDefaultTerms(options.language)
        },
        {
          type: 'footer',
          content: {
            contactInfo: options.companyInfo.contact,
            signature: options.companyInfo.signature
          }
        }
      ]
    };
  }

  // BOM PUSLAPIO STRUKTŪRA
  createBOMPage(calculation, options) {
    return {
      pageNumber: 2,
      sections: [
        {
          type: 'bomHeader',
          content: 'Išsamūs skaičiavimai ir medžiagų sąrašas'
        },
        {
          type: 'bomTable',
          content: this.formatBOMTable(calculation)
        },
        {
          type: 'laborBreakdown',
          content: this.formatLaborBreakdown(calculation)
        }
      ]
    };
  }

  // FORMATUOTI PRODUKTO INFO
  formatProductInfo(calculation) {
    if (calculation.type === 'tub') {
      return {
        type: 'Kubilų skaičiavimas',
        model: calculation.productCode,
        customizations: calculation.customizations || {}
      };
    } else if (calculation.type === 'sauna') {
      return {
        type: 'Pirčių skaičiavimas', 
        model: calculation.productCode,
        configuration: calculation.configuration || {}
      };
    } else {
      return {
        type: 'Kombinuotas užsakymas',
        items: calculation.items.map(item => ({
          type: item.type,
          model: item.productCode,
          quantity: item.quantity || 1
        }))
      };
    }
  }

  // FORMATUOTI KAINŲ LENTELĘ
  formatPricingTable(calculation) {
    const pricing = calculation.pricing || calculation.totals;
    return {
      rows: [
        ['Žaliavos', this.formatMoney(pricing.materialsCost)],
        ['Darbas (' + pricing.laborHours + ' val)', this.formatMoney(pricing.laborCost)],
        ['Savikaina', this.formatMoney(pricing.totalCost)],
        ['Pardavimo kaina (be PVM)', this.formatMoney(pricing.b2cPrice)],
        ['PVM 21%', this.formatMoney(pricing.b2cWithVAT - pricing.b2cPrice)],
        ['VISO su PVM', this.formatMoney(pricing.b2cWithVAT)]
      ]
    };
  }

  // PINIGŲ FORMATAVIMAS
  formatMoney(amount) {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  // NUMATYTOJI ĮMONĖS INFO
  getDefaultCompanyInfo() {
    return {
      name: 'Wild ERP',
      logo: '/assets/logo.png',
      contact: {
        phone: '+370 XXX XXXXX',
        email: 'info@wilderp.com',
        address: 'Adresas, miestas'
      },
      signature: 'Pardavimų vadybininkas'
    };
  }

  // NUMATYTOSIOS SĄLYGOS
  getDefaultTerms(language = 'lt') {
    const terms = {
      lt: [
        'Kainos galioja 30 dienų nuo pasiūlymo datos.',
        'Avansas 30% užsakymo metu.',
        'Gamybos laikas 2-4 savaitės.',
        'Pristatymas aptariamas atskirai.'
      ],
      en: [
        'Prices valid for 30 days from quotation date.',
        'Advance payment 30% upon order.',
        'Production time 2-4 weeks.',
        'Delivery terms to be discussed separately.'
      ]
    };
    
    return terms[language] || terms.lt;
  }
}

// EKSPORTAS
export {
  WildERPCalculator
};

// Pavyzdys naudojimui:
/*
const calculator = new WildERPCalculator(materialsDatabase);

// Kubilo skaičiavimas
const tubCalc = calculator.calculateTub('TUB_ST_ROUND_1800_INT', {
  color: 'ral_7015_dark_grey',
  coverType: 'leather',
  stoveType: 'integrated_30kw'
});

// Nuolaidos pritaikymas  
calculator.applyDiscount(tubCalc.id, 10, 50); // 10% + 50 EUR

// Avanso skaičiavimas
calculator.calculateAdvance(tubCalc.id, 30); // 30%

// PDF generavimas
const pdf = await calculator.generatePDF(tubCalc.id, {
  includeBOM: true,
  includeImages: true,
  language: 'lt',
  customerInfo: {
    name: 'Jonas Jonaitis',
    company: 'UAB Pavyzdys',
    email: 'jonas@pavyzdys.lt'
  }
});
*/
