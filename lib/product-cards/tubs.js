// KUBILŲ VALDYMO MODULIS (tubs.js)
// Naudoja produktų korteles sistemą BOM skaičiavimams

// Importuojame produktų korteles sistemą
import { ProductCard, ProductRegistry } from './product_cards_system.js';

// Kubilų duomenų bazė (pagal jūsų Excel)
const TUB_MODELS = {
  // ST (Stiklo pluoštas) modeliai
  'ST_ROUND_1800_INT': {
    name: 'ST apvalus integruotas 1800',
    category: 'ST',
    shape: 'round',
    size: '1800',
    type: 'integrated',
    basePrice: 1350,
    description: 'Stiklo pluošto apvalus integruotas kubilas 1800mm'
  },
  'ST_ROUND_2000_INT': {
    name: 'ST apvalus integruotas 2000',
    category: 'ST',
    shape: 'round', 
    size: '2000',
    type: 'integrated',
    basePrice: 1450,
    description: 'Stiklo pluošto apvalus integruotas kubilas 2000mm'
  },
  'ST_ROUND_1800_EXT': {
    name: 'ST apvalus išorinis 1800',
    category: 'ST',
    shape: 'round',
    size: '1800', 
    type: 'external',
    basePrice: 1250,
    description: 'Stiklo pluošto apvalus išorinis kubilas 1800mm'
  },
  'ST_SQUARE_2000': {
    name: 'ST kvadratinis 2000x2000',
    category: 'ST',
    shape: 'square',
    size: '2000x2000',
    type: 'integrated',
    basePrice: 1700,
    description: 'Stiklo pluošto kvadratinis kubilas 2000x2000mm'
  },
  'ST_OFURO': {
    name: 'ST Ofuro',
    category: 'ST',
    shape: 'ofuro',
    size: 'standard',
    type: 'integrated',
    basePrice: 1200,
    description: 'Stiklo pluošto Ofuro stiliaus kubilas'
  },
  'ST_COLD': {
    name: 'ST Šaltas kubilas',
    category: 'ST',
    shape: 'round',
    size: 'standard',
    type: 'cold',
    basePrice: 600,
    description: 'Šaltam vandeniui skirtas kubilas'
  },

  // AK (Akrilinis) modeliai
  'AK_ROUND_1800_INT': {
    name: 'AK apvalus integruotas 1800',
    category: 'AK',
    shape: 'round',
    size: '1800',
    type: 'integrated', 
    basePrice: 1650,
    description: 'Akrilinis apvalus integruotas kubilas 1800mm'
  },
  'AK_ROUND_2000_INT': {
    name: 'AK apvalus integruotas 2000',
    category: 'AK',
    shape: 'round',
    size: '2000',
    type: 'integrated',
    basePrice: 1800,
    description: 'Akrilinis apvalus integruotas kubilas 2000mm'
  },
  'AK_SQUARE_2000_JACUZZI': {
    name: 'AK kvadratinis jacuzzi 2000x2000',
    category: 'AK',
    shape: 'square',
    size: '2000x2000',
    type: 'jacuzzi',
    basePrice: 2100,
    description: 'Akrilinis kvadratinis jacuzzi kubilas'
  }
};

// KUBILŲ KOMPONENTŲ FACTORY
class TubComponentsFactory {
  
  // Sukurti mediną pagrindą
  static createWoodenBase(size) {
    const base = new ProductCard(
      `BASE_WOODEN_${size}`,
      `Medinis pagrindas ${size}mm`,
      'component'
    );
    
    // Žaliavos priklauso nuo dydžio
    const area = size === '1800' ? 2.54 : 3.14; // m2
    base.addMaterial('WOOD_BOARD_18MM', area, 'm2', 'Medienos plokštės 18mm');
    base.addMaterial('WOOD_SCREWS_5X60', 16, 'vnt', 'Varžtai 5x60');
    base.addMaterial('PAINT_EXTERIOR', 0.3, 'l', 'Lauko dažai');
    base.setLabor(1.5, 11.5);
    return base;
  }

  // Sukurti apšiltinimą
  static createInsulation(shape, size) {
    const insulation = new ProductCard(
      `INSUL_${shape.toUpperCase()}_${size}`,
      `Apšiltinimas ${shape} ${size}mm`, 
      'component'
    );
    
    const area = shape === 'round' ? 
      (size === '1800' ? 5.65 : 6.28) : // apvalus
      (size === '2000x2000' ? 8.0 : 6.0); // kvadratinis
      
    insulation.addMaterial('INSULATION_50MM', area, 'm2', 'Mineralinė vata 50mm');
    insulation.addMaterial('VAPOR_BARRIER', area * 1.1, 'm2', 'Garų izoliacija');
    insulation.setLabor(1, 11.5);
    return insulation;
  }

  // Sukurti apdailas
  static createFinishing(shape, size, finishType = 'termo') {
    const finishing = new ProductCard(
      `FINISH_${shape.toUpperCase()}_${size}_${finishType.toUpperCase()}`,
      `Apdailos ${shape} ${size} ${finishType}`,
      'component'
    );
    
    const area = shape === 'round' ? 
      (size === '1800' ? 5.65 : 6.28) :
      (size === '2000x2000' ? 8.0 : 6.0);
      
    const materialCode = finishType === 'termo' ? 'THERMO_BOARDS' : 'SPRUCE_BOARDS';
    finishing.addMaterial(materialCode, area, 'm2', `${finishType} dailylentės`);
    finishing.addMaterial('WOOD_SCREWS_3X30', area * 20, 'vnt', 'Varžtai dailylentėms');
    finishing.setLabor(2, 11.5);
    return finishing;
  }

  // Sukurti juostas
  static createStraps(shape, size) {
    const straps = new ProductCard(
      `STRAPS_${shape.toUpperCase()}_${size}`,
      `Juostos ${shape} ${size}mm`,
      'component'
    );
    
    const length = shape === 'round' ?
      (size === '1800' ? 5.65 : 6.28) :
      (size === '2000x2000' ? 8.0 : 6.0);
      
    straps.addMaterial('METAL_STRAP_40MM', length, 'm', 'Metalinės juostos 40mm');
    straps.addMaterial('STRAP_BUCKLES', 2, 'vnt', 'Juostų sagtys');
    straps.setLabor(0.3, 11.5);
    return straps;
  }

  // Sukurti dangtį
  static createCover(shape, size, coverType = 'leather') {
    const cover = new ProductCard(
      `COVER_${coverType.toUpperCase()}_${shape.toUpperCase()}_${size}`,
      `Dangtis ${coverType} ${shape} ${size}mm`,
      'component'
    );
    
    const area = shape === 'round' ?
      Math.PI * Math.pow(parseInt(size)/2000, 2) :
      Math.pow(parseInt(size.split('x')[0])/1000, 2);
      
    const materialCode = coverType === 'leather' ? 'LEATHER_COVER' : 'VINYL_COVER';
    cover.addMaterial(materialCode, area, 'm2', `${coverType} dangčio medžiaga`);
    cover.addMaterial('COVER_HINGES', 2, 'vnt', 'Dangčio vyrai');
    cover.setLabor(1, 11.5);
    return cover;
  }

  // Sukurti laiptus
  static createSteps(stepType = 'termo_a') {
    const steps = new ProductCard(
      `STEPS_${stepType.toUpperCase()}`,
      `Laiptai ${stepType}`,
      'component'
    );
    
    steps.addMaterial('THERMO_BOARDS_20MM', 0.5, 'm2', 'Termo lentos 20mm');
    steps.addMaterial('WOOD_SCREWS_5X50', 12, 'vnt', 'Varžtai 5x50');
    steps.addMaterial('WOOD_GLUE', 0.1, 'l', 'Medienos klijai');
    steps.setLabor(2, 11.5);
    return steps;
  }

  // Sukurti krosnelę
  static createStove(stoveType, power = '30kw') {
    const stove = new ProductCard(
      `STOVE_${stoveType.toUpperCase()}_${power.toUpperCase()}`,
      `Krosnelė ${stoveType} ${power}`,
      'component'
    );
    
    if (stoveType === 'integrated') {
      stove.addMaterial('STOVE_INTEGRATED_30KW_316', 1, 'vnt', 'Integruota krosnelė 30kW 316');
      stove.addMaterial('CHIMNEY_PROTECTION', 1, 'vnt', 'Kamino apsauga');
    } else {
      stove.addMaterial('STOVE_EXTERNAL_MILK_304', 1, 'vnt', 'Išorinė krosnelė 304');
    }
    
    stove.setLabor(0.5, 11.5);
    return stove;
  }
}

// KUBILŲ PRODUKTŲ REGISTRAS
class TubsProductRegistry extends ProductRegistry {
  constructor() {
    super();
    this.initializeTubProducts();
  }

  // Inicializuoti visus kubilų produktus
  initializeTubProducts() {
    // Sukurti visus komponentus
    this.createAllComponents();
    
    // Sukurti visus pagridinius kubilų modelius
    this.createAllTubModels();
  }

  createAllComponents() {
    // Mediniai pagrindai
    ['1800', '2000'].forEach(size => {
      this.register(TubComponentsFactory.createWoodenBase(size));
    });

    // Apšiltinimai
    [
      {shape: 'round', size: '1800'},
      {shape: 'round', size: '2000'}, 
      {shape: 'square', size: '2000x2000'}
    ].forEach(({shape, size}) => {
      this.register(TubComponentsFactory.createInsulation(shape, size));
    });

    // Apdailos
    [
      {shape: 'round', size: '1800', type: 'termo'},
      {shape: 'round', size: '2000', type: 'termo'},
      {shape: 'square', size: '2000x2000', type: 'termo'}
    ].forEach(({shape, size, type}) => {
      this.register(TubComponentsFactory.createFinishing(shape, size, type));
    });

    // Juostos
    [
      {shape: 'round', size: '1800'},
      {shape: 'round', size: '2000'},
      {shape: 'square', size: '2000x2000'}
    ].forEach(({shape, size}) => {
      this.register(TubComponentsFactory.createStraps(shape, size));
    });

    // Dangčiai
    [
      {shape: 'round', size: '1800', type: 'leather'},
      {shape: 'round', size: '2000', type: 'leather'},
      {shape: 'square', size: '2000x2000', type: 'leather'}
    ].forEach(({shape, size, type}) => {
      this.register(TubComponentsFactory.createCover(shape, size, type));
    });

    // Laiptai
    this.register(TubComponentsFactory.createSteps('termo_a'));

    // Krosnelės
    this.register(TubComponentsFactory.createStove('integrated', '30kw'));
    this.register(TubComponentsFactory.createStove('external', '50kw'));

    // RCD ir pakavimas
    this.register(this.createRCD());
    this.register(this.createPackaging());
  }

  createRCD() {
    const rcd = new ProductCard('RCD_STANDARD', 'RCD apsaugos blokas', 'component');
    rcd.addMaterial('RCD_16A', 1, 'vnt', 'RCD 16A');
    rcd.addMaterial('ELECTRIC_CABLE', 2, 'm', 'Elektros kabelis');
    rcd.setLabor(0.5, 11.5);
    return rcd;
  }

  createPackaging() {
    const pack = new ProductCard('PACK_STANDARD', 'Standartinis pakavimas', 'component');
    pack.addMaterial('CARDBOARD_BOX', 1, 'vnt', 'Kartono dėžė');
    pack.addMaterial('PROTECTIVE_FILM', 2, 'm', 'Apsauginė plėvelė');
    pack.setLabor(0.3, 11.5);
    return pack;
  }

  createAllTubModels() {
    Object.entries(TUB_MODELS).forEach(([code, model]) => {
      const tub = new ProductCard(
        `TUB_${code}`,
        model.name,
        'tub',
        model.description
      );

      // Pagrindinė vonia (žaliava)
      tub.addMaterial(`TUB_${model.category}_${model.shape.toUpperCase()}_${model.size}`, 1, 'vnt', 'Vonios korpusas');

      // Standartiniai komponentai (jei ne šaltas kubilas)
      if (model.type !== 'cold') {
        tub.addComponent(`BASE_WOODEN_${model.size.split('x')[0]}`, 1);
        tub.addComponent(`INSUL_${model.shape.toUpperCase()}_${model.size}`, 1);
        tub.addComponent(`FINISH_${model.shape.toUpperCase()}_${model.size}_TERMO`, 1);
        tub.addComponent(`STRAPS_${model.shape.toUpperCase()}_${model.size}`, 1);
        tub.addComponent(`COVER_LEATHER_${model.shape.toUpperCase()}_${model.size}`, 1);
        tub.addComponent('RCD_STANDARD', 1);
      }

      // Laiptai (išskyrus Ofuro)
      if (model.shape !== 'ofuro' && model.type !== 'cold') {
        tub.addComponent('STEPS_TERMO_A', 1);
      }

      // Krosnelė (tik integruotiems)
      if (model.type === 'integrated') {
        tub.addComponent('STOVE_INTEGRATED_30KW', 1);
      } else if (model.type === 'external') {
        tub.addComponent('STOVE_EXTERNAL_50KW', 1);
      }

      // Pakavimas
      tub.addComponent('PACK_STANDARD', 1);

      // Darbo laikas (priklauso nuo dydžio ir sudėtingumo)
      let laborHours = 8; // bazinis laikas
      if (model.size.includes('2000')) laborHours += 2;
      if (model.shape === 'square') laborHours += 2;
      if (model.type === 'jacuzzi') laborHours += 4;
      
      tub.setLabor(laborHours, 11.5);

      this.register(tub);
    });
  }

  // Gauti kubilų sąrašą UI
  getTubsList() {
    return this.getByCategory('tub').map(tub => ({
      code: tub.code,
      name: tub.name,
      description: tub.description,
      isActive: tub.isActive
    }));
  }

  // Skaičiuoti kubilo kainą su visais variantais
  calculateTubPricing(tubCode, materialsDb, options = {}) {
    const cost = this.calculateCost(tubCode, materialsDb);
    if (!cost) return null;

    // Kainos su antkainiais (pagal jūsų duomenis)
    const b2bPrice = cost.totalCost * 1.3; // +30%
    const b2cPrice = b2bPrice * 1.2; // B2B + 20%
    const b2cWithVAT = b2cPrice * 1.21; // + 21% PVM

    return {
      savikaina: cost.totalCost,
      b2bPrice: b2bPrice,
      b2cPrice: b2cPrice,
      b2cWithVAT: b2cWithVAT,
      materialsCost: cost.materialsCost,
      laborCost: cost.laborCost,
      laborHours: cost.laborHours,
      profit: {
        b2b: b2bPrice - cost.totalCost,
        b2c: b2cPrice - cost.totalCost,
        b2cWithVAT: b2cWithVAT - cost.totalCost
      },
      bom: cost.bom
    };
  }
}

// EKSPORTAS
export {
  TubsProductRegistry,
  TubComponentsFactory,
  TUB_MODELS
};

// Pavyzdys naudojimui:
/*
const tubsRegistry = new TubsProductRegistry();
const pricing = tubsRegistry.calculateTubPricing('TUB_ST_ROUND_1800_INT', materialsDatabase);
console.log('Kubilo ST 1800 kainos:', pricing);
*/
