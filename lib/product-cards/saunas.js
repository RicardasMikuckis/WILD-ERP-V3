// PIRČIŲ VALDYMO MODULIS (saunas.js)
// Naudoja produktų korteles sistemą BOM skaičiavimams

import { ProductCard, ProductRegistry } from './product_cards_system.js';

// PIRČIŲ MODELIAI (pagal jūsų Excel)
const SAUNA_MODELS = {
  'ROUND_SPRUCE': {
    name: 'Apvali Eglė',
    shape: 'round',
    material: 'spruce',
    description: 'Apvali pirtis iš eglės medienos'
  },
  'ROUND_THERMO': {
    name: 'Apvali Termo',
    shape: 'round', 
    material: 'thermo',
    description: 'Apvali pirtis iš termo medienos'
  },
  'IGLOO_SPRUCE': {
    name: 'Igloo Eglė',
    shape: 'igloo',
    material: 'spruce',
    description: 'Igloo formos pirtis iš eglės'
  },
  'IGLOO_THERMO': {
    name: 'Igloo Termo', 
    shape: 'igloo',
    material: 'thermo',
    description: 'Igloo formos pirtis iš termo medienos'
  },
  'SQUARE_SPRUCE': {
    name: 'Kvadratinė Eglė',
    shape: 'square',
    material: 'spruce', 
    description: 'Kvadratinė pirtis iš eglės medienos'
  },
  'SQUARE_THERMO': {
    name: 'Kvadratinė Termo',
    shape: 'square',
    material: 'thermo',
    description: 'Kvadratinė pirtis iš termo medienos'
  }
};

// PIRČIŲ KOMPONENTŲ FACTORY
class SaunaComponentsFactory {

  // Sukurti rėmą ir paką
  static createFrameAndPackaging(shape, length) {
    const frame = new ProductCard(
      `FRAME_${shape.toUpperCase()}_${length}M`,
      `Rėmas ${shape} ${length}m`,
      'component'
    );

    // Pagrindinės medienos sąnaudos priklauso nuo ilgio
    const woodVolume = length * 0.5; // m3 medienos
    frame.addMaterial('FRAME_TIMBER_45X145', woodVolume, 'm3', 'Konstrukcinė mediena 45x145');
    frame.addMaterial('INSULATION_100MM', length * 2.5, 'm2', 'Mineralinė vata 100mm');
    frame.addMaterial('VAPOR_BARRIER', length * 2.8, 'm2', 'Garų izoliacija su užlaidomis');
    
    // Pakavimas
    frame.addMaterial('PACKAGING_FILM', 15, 'm2', 'Pakavimo plėvelė');
    frame.addMaterial('WOODEN_PALLETS', 2, 'vnt', 'Mediniai palečiai');
    
    frame.setLabor(8, 11.5); // 8 val konstrukcijos darbo
    return frame;
  }

  // Sukurti stogą
  static createRoof(roofType = 'bitumen_single') {
    const roof = new ProductCard(
      `ROOF_${roofType.toUpperCase()}`,
      `Stogas ${roofType}`,
      'component'
    );

    if (roofType === 'bitumen_single') {
      roof.addMaterial('BITUMEN_SHINGLES_BLACK', 1, 'm2', 'Bituminiai čerpių juodi');
      roof.addMaterial('ROOF_MEMBRANE', 1.1, 'm2', 'Stogo membrana');
    } else if (roofType === 'metal') {
      roof.addMaterial('METAL_ROOF_SHEETS', 1, 'm2', 'Metalinės stogo skardos');
      roof.addMaterial('ROOF_SCREWS', 20, 'vnt', 'Stogo varžtai');
    }

    roof.addMaterial('ROOF_BATTENS', 10, 'm', 'Stogkrančiai');
    roof.setLabor(2, 11.5);
    return roof;
  }

  // Sukurti išorės dailylentas
  static createExteriorBoards(material, area) {
    const boards = new ProductCard(
      `EXTERIOR_${material.toUpperCase()}`,
      `Išorės dailylentės ${material}`,
      'component'
    );

    const materialCode = material === 'spruce' ? 'SPRUCE_BOARDS_20MM' : 'THERMO_BOARDS_20MM';
    const priceMultiplier = material === 'thermo' ? 1.8 : 1.0;

    boards.addMaterial(materialCode, area, 'm2', `${material} dailylentės 20mm`);
    boards.addMaterial('EXTERIOR_SCREWS_4X50', area * 25, 'vnt', 'Išorės varžtai 4x50');
    boards.setLabor(area * 0.3, 11.5); // 0.3 val/m2
    return boards;
  }

  // Sukurti vidaus dailylentas
  static createInteriorBoards(material, area) {
    const boards = new ProductCard(
      `INTERIOR_${material.toUpperCase()}`,
      `Vidaus dailylentės ${material}`,
      'component'
    );

    // Vidui visada naudojame termo arba egę
    const materialCode = material === 'spruce' ? 'SPRUCE_BOARDS_15MM' : 'THERMO_BOARDS_15MM';
    
    boards.addMaterial(materialCode, area, 'm2', `${material} dailylentės 15mm`);
    boards.addMaterial('INTERIOR_SCREWS_3X40', area * 30, 'vnt', 'Vidaus varžtai 3x40');
    boards.setLabor(area * 0.4, 11.5); // 0.4 val/m2
    return boards;
  }

  // Sukurti dažymo/aliejavimo komponentą
  static createFinishTreatment(treatmentType = 'oiling', area) {
    const treatment = new ProductCard(
      `TREATMENT_${treatmentType.toUpperCase()}`,
      `${treatmentType} apdorojimas`,
      'component'
    );

    if (treatmentType === 'oiling') {
      treatment.addMaterial('WOOD_OIL', area * 0.15, 'l', 'Medienos aliejus');
    } else if (treatmentType === 'painting') {
      treatment.addMaterial('EXTERIOR_PAINT', area * 0.2, 'l', 'Lauko dažai');
      treatment.addMaterial('WOOD_PRIMER', area * 0.1, 'l', 'Gruntas medienai');
    }

    treatment.addMaterial('SANDPAPER_120', 5, 'vnt', 'Šlifavimo popierius 120');
    treatment.setLabor(area * 0.2, 11.5); // 0.2 val/m2
    return treatment;
  }

  // Sukurti suolus
  static createBenches(benchType = 'thermo_open', length) {
    const benches = new ProductCard(
      `BENCHES_${benchType.toUpperCase()}_${length}M`,
      `Suolai ${benchType} ${length}m`,
      'component'
    );

    const boardArea = length * 0.6; // 60cm pločio suolai
    const materialCode = benchType.includes('thermo') ? 'THERMO_BOARDS_40MM' : 'SPRUCE_BOARDS_40MM';
    
    benches.addMaterial(materialCode, boardArea, 'm2', `${benchType} lentos 40mm`);
    benches.addMaterial('BENCH_SUPPORTS', length / 0.8, 'vnt', 'Suolų atramos kas 80cm');
    benches.addMaterial('WOOD_SCREWS_6X80', boardArea * 15, 'vnt', 'Varžtai suolams 6x80');
    benches.setLabor(length * 0.8, 11.5); // 0.8 val/m
    return benches;
  }

  // Sukurti krosnies pagrindą ir krosnelę
  static createStoveSystem(stoveType = 'harvia_m3') {
    const stove = new ProductCard(
      `STOVE_${stoveType.toUpperCase()}`,
      `Krosnelė ${stoveType}`,
      'component'
    );

    if (stoveType === 'harvia_m3') {
      stove.addMaterial('HARVIA_M3_6_13M3', 1, 'vnt', 'Harvia M3 krosnelė 6-13m3');
      stove.addMaterial('STOVE_STONES', 20, 'kg', 'Krosnies akmenys');
    }

    stove.addMaterial('STOVE_BASE_CONCRETE', 1, 'vnt', 'Betoninis krosnies pagrindas');
    stove.addMaterial('HEAT_SHIELD', 1, 'vnt', 'Šilumos skyda');
    stove.setLabor(3, 11.5); // 3 val montavimo
    return stove;
  }

  // Sukurti duris
  static createDoors(doorType = 'wooden_small_window') {
    const doors = new ProductCard(
      `DOORS_${doorType.toUpperCase()}`,
      `Durys ${doorType}`,
      'component'
    );

    if (doorType === 'wooden_small_window') {
      doors.addMaterial('WOODEN_DOOR_FRAME', 1, 'vnt', 'Medinių durų rėmas');
      doors.addMaterial('DOOR_GLASS_SMALL', 1, 'vnt', 'Mažas stiklas duryse');
    } else if (doorType === 'glass_full') {
      doors.addMaterial('GLASS_DOOR_FRAME', 1, 'vnt', 'Stiklinių durų rėmas');
      doors.addMaterial('TEMPERED_GLASS', 1, 'vnt', 'Grūdintas stiklas');
    }

    doors.addMaterial('DOOR_HINGES_HEAVY', 3, 'vnt', 'Durų vyrai sunkūs');
    doors.addMaterial('DOOR_HANDLE_WOOD', 1, 'vnt', 'Medinis durų rankenėlis');
    doors.setLabor(2, 11.5); // 2 val montavimo
    return doors;
  }

  // Sukurti langus
  static createWindows(windowType = 'square_2pcs') {
    const windows = new ProductCard(
      `WINDOWS_${windowType.toUpperCase()}`,
      `Langai ${windowType}`,
      'component'
    );

    if (windowType === 'square_2pcs') {
      windows.addMaterial('SAUNA_WINDOW_SQUARE', 2, 'vnt', 'Kvadratiniai langai pirčiai');
      windows.addMaterial('WINDOW_SEALS', 4, 'm', 'Langų sandarinimas');
    }

    windows.addMaterial('WINDOW_MOUNTING_SCREWS', 16, 'vnt', 'Langų tvirtinimo varžtai');
    windows.setLabor(1.5, 11.5); // 1.5 val montavimo
    return windows;
  }
}

// PIRČIŲ PRODUKTŲ REGISTRAS
class SaunasProductRegistry extends ProductRegistry {
  constructor() {
    super();
    this.initializeSaunaProducts();
  }

  initializeSaunaProducts() {
    this.createAllSaunaComponents();
    this.createAllSaunaModels();
  }

  createAllSaunaComponents() {
    // Rėmai ir pakuotės - įvairiems ilgiams
    [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].forEach(length => {
      ['round', 'igloo', 'square'].forEach(shape => {
        this.register(SaunaComponentsFactory.createFrameAndPackaging(shape, length));
      });
    });

    // Stogai
    this.register(SaunaComponentsFactory.createRoof('bitumen_single'));
    this.register(SaunaComponentsFactory.createRoof('metal'));

    // Dailylentės (išorės/vidaus)
    ['spruce', 'thermo'].forEach(material => {
      [10, 15, 20, 25, 30].forEach(area => { // įvairūs plotai
        this.register(SaunaComponentsFactory.createExteriorBoards(material, area));
        this.register(SaunaComponentsFactory.createInteriorBoards(material, area));
      });
    });

    // Apdorojimai
    [10, 15, 20, 25, 30].forEach(area => {
      this.register(SaunaComponentsFactory.createFinishTreatment('oiling', area));
      this.register(SaunaComponentsFactory.createFinishTreatment('painting', area));
    });

    // Suolai
    [2, 2.5, 3, 3.5, 4].forEach(length => {
      this.register(SaunaComponentsFactory.createBenches('thermo_open', length));
      this.register(SaunaComponentsFactory.createBenches('spruce_open', length));
    });

    // Krosnelės
    this.register(SaunaComponentsFactory.createStoveSystem('harvia_m3'));

    // Durys
    this.register(SaunaComponentsFactory.createDoors('wooden_small_window'));
    this.register(SaunaComponentsFactory.createDoors('glass_full'));

    // Langai
    this.register(SaunaComponentsFactory.createWindows('square_2pcs'));
  }

  createAllSaunaModels() {
    Object.entries(SAUNA_MODELS).forEach(([code, model]) => {
      // Sukuriame bazinį modelį be parametrų
      const baseSauna = new ProductCard(
        `SAUNA_${code}`,
        model.name,
        'sauna',
        model.description
      );

      // Baziniai komponentai (be konkrečių matmenų)
      baseSauna.components = []; // Paliekame tuščius - pildysime konfigūracijoje
      baseSauna.setLabor(5, 11.5); // Bazinis montavimo laikas

      this.register(baseSauna);
    });
  }

  // Konfigūruoti konkretų pirties modelį su parametrais
  configureSauna(modelCode, config) {
    const baseModel = this.get(`SAUNA_${modelCode}`);
    if (!baseModel) return null;

    const configuredSauna = new ProductCard(
      `${baseModel.code}_CONF_${Date.now()}`,
      `${baseModel.name} ${config.length}m`,
      'sauna',
      `${baseModel.description} - ${config.length}m ilgio`
    );

    // Kopijuojame bazinę informaciją
    configuredSauna.materials = [...baseModel.materials];
    
    // Pridėti komponentus pagal konfigūraciją
    const shape = SAUNA_MODELS[modelCode].shape;
    const material = SAUNA_MODELS[modelCode].material;
    
    // 1. Rėmas ir pakavimas
    configuredSauna.addComponent(`FRAME_${shape.toUpperCase()}_${config.length}M`, 1);

    // 2. Stogas
    configuredSauna.addComponent(`ROOF_${(config.roofType || 'BITUMEN_SINGLE').toUpperCase()}`, 1);

    // 3. Dailylentės
    const exteriorArea = this.calculateExteriorArea(shape, config.length, config.saunaLength || config.length);
    const interiorArea = this.calculateInteriorArea(shape, config.saunaLength || config.length);
    
    configuredSauna.addComponent(`EXTERIOR_${material.toUpperCase()}`, 1);
    configuredSauna.addComponent(`INTERIOR_${material.toUpperCase()}`, 1);

    // 4. Apdorojimas
    configuredSauna.addComponent(`TREATMENT_${(config.treatment || 'OILING').toUpperCase()}`, 1);

    // 5. Suolai
    configuredSauna.addComponent(`BENCHES_${material.toUpperCase()}_OPEN_${config.saunaLength || config.length}M`, 1);

    // 6. Krosnelė
    configuredSauna.addComponent(`STOVE_${(config.stoveType || 'HARVIA_M3').toUpperCase()}`, 1);

    // 7. Durys
    configuredSauna.addComponent(`DOORS_${(config.doorType || 'WOODEN_SMALL_WINDOW').toUpperCase()}`, 1);

    // 8. Langai (jei nurodyti)
    if (config.windows) {
      configuredSauna.addComponent(`WINDOWS_${(config.windowType || 'SQUARE_2PCS').toUpperCase()}`, 1);
    }

    // Apskaičiuoti darbo laiką pagal sudėtingumą
    let totalLaborHours = 20; // bazinis laikas
    totalLaborHours += config.length * 8; // +8 val už kiekvieną metrą
    if (config.saunaLength !== config.length) totalLaborHours += 5; // kompleksiškumas
    if (material === 'thermo') totalLaborHours += config.length * 2; // termo reikalauja daugiau darbo

    configuredSauna.setLabor(totalLaborHours, 11.5);

    return configuredSauna;
  }

  // Apskaičiuoti išorės plotą
  calculateExteriorArea(shape, totalLength, saunaLength) {
    const height = 2.1; // standartinis aukštis
    if (shape === 'round') {
      return Math.PI * 2 * height * totalLength;
    } else if (shape === 'square') {
      return 4 * totalLength * height;
    } else { // igloo
      return Math.PI * 1.8 * height * totalLength;
    }
  }

  // Apskaičiuoti vidaus plotą
  calculateInteriorArea(shape, saunaLength) {
    const height = 2.0; // vidaus aukštis
    if (shape === 'round') {
      return Math.PI * 1.8 * height * saunaLength;
    } else if (shape === 'square') {
      return 4 * saunaLength * height * 0.9; // 90% - durys ir kt.
    } else { // igloo
      return Math.PI * 1.6 * height * saunaLength;
    }
  }

  // Gauti pirčių sąrašą UI
  getSaunasList() {
    return this.getByCategory('sauna').map(sauna => ({
      code: sauna.code,
      name: sauna.name,
      description: sauna.description,
      isActive: sauna.isActive
    }));
  }

  // Apskaičiuoti pirties kainą su konfigūracija
  calculateSaunaPricing(modelCode, config, materialsDb) {
    const configuredSauna = this.configureSauna(modelCode, config);
    if (!configuredSauna) return null;

    // Privaikiai registruojame konfigūruotą modelį skaičiavimui
    this.register(configuredSauna);
    
    const cost = this.calculateCost(configuredSauna.code, materialsDb);
    if (!cost) return null;

    // Kainos su antkainiais (pagal jūsų duomenis)
    const b2bPrice = cost.totalCost * 1.15; // +15% pirčims
    const b2cPrice = b2bPrice * 1.2; // +20%
    const b2cWithVAT = b2cPrice * 1.21; // +21% PVM

    return {
      configuration: config,
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
      bom: cost.bom,
      configuredProduct: configuredSauna
    };
  }
}

// EKSPORTAS
export {
  SaunasProductRegistry,
  SaunaComponentsFactory,
  SAUNA_MODELS
};

// Pavyzdys naudojimui:
/*
const saunasRegistry = new SaunasProductRegistry();

const config = {
  length: 4.0,          // bendras ilgis
  saunaLength: 2.5,     // pačios pirties ilgis
  roofType: 'bitumen_single',
  treatment: 'oiling', 
  stoveType: 'harvia_m3',
  doorType: 'wooden_small_window',
  windows: true,
  windowType: 'square_2pcs'
};

const pricing = saunasRegistry.calculateSaunaPricing('ROUND_THERMO', config, materialsDatabase);
console.log('Pirties Apvali Termo kainos:', pricing);
*/
