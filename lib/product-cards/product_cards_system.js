// PRODUKTŲ KORTELES SISTEMA (Bill of Materials - BOM)
// Kiekvienas gaminys turi savo produkto kodą ir sudėtį

// Bazinė produkto kortelės klasė
class ProductCard {
  constructor(code, name, category, description = '') {
    this.code = code; // Unikalus produkto kodas, pvz: "TUB_ST_ROUND_1800"
    this.name = name;
    this.category = category; // 'tub', 'sauna', 'component', 'material'
    this.description = description;
    this.components = []; // Sudedamosios dalys
    this.materials = []; // Tiesiogiai naudojamos žaliavos
    this.laborTime = 0; // Darbo valandos
    this.laborCost = 0; // Darbo kaina
    this.version = '1.0';
    this.createdDate = new Date().toISOString();
    this.isActive = true;
  }

  // Pridėti komponentą (kitas produktas)
  addComponent(productCode, quantity, notes = '') {
    this.components.push({
      productCode,
      quantity,
      notes,
      type: 'component'
    });
  }

  // Pridėti žaliavą tiesiogiai
  addMaterial(materialId, quantity, unit, notes = '') {
    this.materials.push({
      materialId,
      quantity,
      unit,
      notes,
      type: 'material'
    });
  }

  // Nustatyti darbo laiką ir kainą
  setLabor(hours, costPerHour) {
    this.laborTime = hours;
    this.laborCost = hours * costPerHour;
  }

  // Gauti visą BOM (rekursyviai)
  getFullBOM(productRegistry) {
    const bom = {
      product: this,
      materials: [...this.materials],
      labor: {
        hours: this.laborTime,
        cost: this.laborCost
      },
      totalCost: 0
    };

    // Išskleisti komponentus
    this.components.forEach(comp => {
      const component = productRegistry.get(comp.productCode);
      if (component) {
        const componentBOM = component.getFullBOM(productRegistry);
        // Sudauginame su kiekiu
        componentBOM.materials.forEach(mat => {
          mat.quantity *= comp.quantity;
        });
        bom.materials = bom.materials.concat(componentBOM.materials);
        bom.labor.hours += componentBOM.labor.hours * comp.quantity;
        bom.labor.cost += componentBOM.labor.cost * comp.quantity;
      }
    });

    return bom;
  }

  // Eksportuoti į JSON
  toJSON() {
    return {
      code: this.code,
      name: this.name,
      category: this.category,
      description: this.description,
      components: this.components,
      materials: this.materials,
      laborTime: this.laborTime,
      laborCost: this.laborCost,
      version: this.version,
      createdDate: this.createdDate,
      isActive: this.isActive
    };
  }

  // Importuoti iš JSON
  static fromJSON(data) {
    const card = new ProductCard(data.code, data.name, data.category, data.description);
    card.components = data.components || [];
    card.materials = data.materials || [];
    card.laborTime = data.laborTime || 0;
    card.laborCost = data.laborCost || 0;
    card.version = data.version || '1.0';
    card.createdDate = data.createdDate;
    card.isActive = data.isActive !== undefined ? data.isActive : true;
    return card;
  }
}

// Produktų registras - visi produktai vienoje vietoje
class ProductRegistry {
  constructor() {
    this.products = new Map();
  }

  // Registruoti produktą
  register(productCard) {
    this.products.set(productCard.code, productCard);
  }

  // Gauti produktą pagal kodą
  get(code) {
    return this.products.get(code);
  }

  // Gauti visus produktus pagal kategoriją
  getByCategory(category) {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  // Gauti visus aktyvius produktus
  getActive() {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  // Skaičiuoti produkto kainą
  calculateCost(productCode, materialsDb, laborRate = 11.5) {
    const product = this.get(productCode);
    if (!product) return null;

    const bom = product.getFullBOM(this);
    let totalMaterialCost = 0;

    // Skaičiuoti žaliavų kainą
    bom.materials.forEach(item => {
      const material = materialsDb.find(m => m.id === item.materialId);
      if (material) {
        totalMaterialCost += material.currentPrice * item.quantity;
      }
    });

    const laborCost = bom.labor.hours * laborRate;
    const totalCost = totalMaterialCost + laborCost;

    return {
      materialsCost: totalMaterialCost,
      laborCost: laborCost,
      laborHours: bom.labor.hours,
      totalCost: totalCost,
      bom: bom
    };
  }

  // Eksportuoti visus produktus
  exportAll() {
    const data = {};
    this.products.forEach((product, code) => {
      data[code] = product.toJSON();
    });
    return data;
  }

  // Importuoti produktus
  importAll(data) {
    Object.values(data).forEach(productData => {
      const product = ProductCard.fromJSON(productData);
      this.register(product);
    });
  }
}

// PAVYZDŽIAI pagal jūsų duomenis:

// 1. KOMPONENTAI (GALI BŪTI NAUDOJAMI KELIUOSE GAMINIUOSE)
const createWoodenBase = () => {
  const base = new ProductCard(
    'BASE_WOODEN_1800',
    'Medinis pagrindas 1800mm',
    'component',
    'Dažytas medinis pagrindas kubilui'
  );
  base.addMaterial('MAT_001', 2.5, 'm2', 'Medienos plokštės');
  base.addMaterial('MAT_045', 0.5, 'l', 'Dažai');
  base.setLabor(1.5, 11.5);
  return base;
};

const createInsulation = () => {
  const insulation = new ProductCard(
    'INSUL_ROUND_1800',
    'Apšiltinimas apvalus 1800mm',
    'component',
    'Pilnas apšiltinimas'
  );
  insulation.addMaterial('MAT_020', 3.2, 'm2', 'Izoliacijos medžiaga');
  insulation.setLabor(1.0, 11.5);
  return insulation;
};

const createRCD = () => {
  const rcd = new ProductCard(
    'RCD_STANDARD',
    'RCD apsaugos blokas',
    'component',
    'Elektros apsaugos sistema'
  );
  rcd.addMaterial('MAT_150', 1, 'vnt', 'RCD 16A');
  rcd.addMaterial('MAT_151', 2, 'm', 'Elektros kabelis');
  rcd.setLabor(0.5, 11.5);
  return rcd;
};

const createPackaging = () => {
  const pack = new ProductCard(
    'PACK_STANDARD',
    'Standartinis pakavimas',
    'component',
    'Apsauginis pakavimas transportavimui'
  );
  pack.addMaterial('MAT_200', 1, 'vnt', 'Kartono dėžė');
  pack.addMaterial('MAT_201', 2, 'm', 'Apsauginė plėvelė');
  pack.setLabor(0.3, 11.5);
  return pack;
};

// 2. PAGRINDINIS GAMINYS - KUBILAS
const createHotTubST1800 = () => {
  const tub = new ProductCard(
    'TUB_ST_ROUND_1800_INT',
    'ST apvalus integruotas 1800',
    'tub',
    'Stiklo pluošto apvalus integruotas kubilas 1800mm'
  );
  
  // Pagrindinė vonia (žaliava)
  tub.addMaterial('MAT_TUB_ST_1800', 1, 'vnt', 'ST vonios korpusas 1800mm');
  
  // Komponentai
  tub.addComponent('BASE_WOODEN_1800', 1, 'Medinis pagrindas');
  tub.addComponent('INSUL_ROUND_1800', 1, 'Apšiltinimas');
  tub.addComponent('RCD_STANDARD', 1, 'Elektros apsauga');
  tub.addComponent('PACK_STANDARD', 1, 'Pakavimas');
  
  // Tiesiogiai prieš vonią dedamos žaliavos
  tub.addMaterial('MAT_050', 5, 'm', 'Juostos apvaliam kubilui');
  tub.addMaterial('MAT_070', 1, 'vnt', 'Dangtis odinis');
  tub.addMaterial('MAT_090', 1, 'vnt', 'Laiptai Termo A');
  tub.addMaterial('MAT_110', 1, 'vnt', 'Krosnelė integruota 30kW');
  
  // Darbo laikas tiesiogiai ant šio produkto
  tub.setLabor(8, 11.5); // 8 val montavimo darbo
  
  return tub;
};

// SISTEMOS NAUDOJIMO PAVYZDYS
const initializeProductSystem = () => {
  const registry = new ProductRegistry();
  
  // Registruojame komponentus
  registry.register(createWoodenBase());
  registry.register(createInsulation());
  registry.register(createRCD());
  registry.register(createPackaging());
  
  // Registruojame pagrindinį gaminį
  registry.register(createHotTubST1800());
  
  return registry;
};

// EKSPORTAS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ProductCard,
    ProductRegistry,
    initializeProductSystem
  };
}

// Pavyzdys naudojimui:
/*
const registry = initializeProductSystem();
const cost = registry.calculateCost('TUB_ST_ROUND_1800_INT', materialsDatabase);
console.log('Kubilo savikaina:', cost.totalCost);
console.log('Žaliavos:', cost.materialsCost);
console.log('Darbas:', cost.laborCost);
console.log('Darbo valandos:', cost.laborHours);
*/
