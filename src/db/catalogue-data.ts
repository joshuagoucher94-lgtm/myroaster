export type CoffeeProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tastingNotes: string[];
  originType: string;
  shopCategorySlug: string;
  subtitle: string;
  roastLevel: string;
  heroImagePath: string;
  sourceName?: string;
  sourceUrl?: string;
};

export type BagOption = {
  id: string;
  name: string;
  slug: string;
  colour: string;
  finish: string;
  mockupAssetPath: string;
};

export type BagSize = {
  id: string;
  label: string;
  slug: string;
  grams: number;
};

export type LabelOption = {
  id: string;
  name: string;
  slug: string;
  shape: string;
  widthMm: string;
  heightMm: string;
  safeArea: { top: number; right: number; bottom: number; left: number };
  mockupPlacement: { x: number; y: number; width: number; height: number; radius: number };
};

export type GrindOption = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type ProductPrice = {
  id: string;
  coffeeProductId: string;
  bagOptionId: string;
  bagSizeId: string;
  minQuantity: number;
  unitAmountPence: number;
  setupFeePence: number;
  currency: string;
};

export type Catalogue = {
  coffees: CoffeeProduct[];
  bags: BagOption[];
  sizes: BagSize[];
  labels: LabelOption[];
  grinds: GrindOption[];
  prices: ProductPrice[];
};

const catalogueUnitPriceByCoffeeId: Record<string, number> = {
  "coffee-guayabos-cafe-agrario-colombia-fsc-8227": 1776,
  "coffee-fazenda-pinhal-gabarra-teixeria-family-brazil-fsc-8253": 1377,
  "coffee-imbalu-the-coffee-yard-uganda-fsc-8617": 1995,
  "coffee-bellavista-huabal-peru-fsc-8628": 1900,
  "coffee-kiamabara-ab-nyeri-county-kenya-fsc-8710": 1767,
  "coffee-sidamo-taferi-kela-kickstart-natural-lot-25-17-bette-buna-ethiopia-fsc-7": 1900,
  "coffee-muki-fruity-the-coffee-yard-uganda-fsc-8684": 1805,
  "coffee-cajamarca-falcon-coffees-peru-peru-fsc-8554": 1425,
  "coffee-lala-salama-decaf-abay-teka-district-ethiopia-fsc-8613": 1568,
  "coffee-tegu-factory-ab-karatina-town-kenya-fsc-8711": 2014,
  "coffee-taferi-kela-lot-6-bette-buna-ethiopia-fsc-7614": 2280,
  "coffee-yacuri-juan-pena-ecuador-fsc-8523": 2679,
  "coffee-el-diviso-nestor-lasso-colombia-fsc-8036": 4218,
  "coffee-chito-community-juan-pena-ecuador-fsc-8526": 1805,
  "coffee-coproca-lot-1214-nyamasheke-district-rwanda-fsc-8444": 1653,
  "coffee-butawa-the-coffee-gardens-uganda-fsc-8685": 1805,
  "coffee-malidadi-the-coffee-yard-uganda-fsc-8618": 1615,
  "coffee-hacienda-la-papaya-juan-pena-ecuador-fsc-8509": 3249,
  "coffee-attia-chapata-cooperativa-de-caficultores-de-anserma-colombia-fsc-8575": 2660,
  "coffee-ijen-highlands-botolinggo-village-indonesia-fsc-8457": 2565,
  "coffee-diego-samuel-bermudez-el-paraiso-p02-colombia-fsc-8230": 3287,
  "coffee-el-borbollon-santa-ana-el-salvador-fsc-8057": 1473,
  "coffee-atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8238": 1710,
  "coffee-finca-etiopia-los-naranjos-cafe-el-salvador-fsc-7963": 5320,
  "coffee-hamacas-vides-family-guatemala-fsc-8068": 1615,
  "coffee-las-lajas-chacon-family-costa-rica-fsc-7924": 2375,
  "coffee-noruega-ahuachapon-el-salvador-fsc-7958": 1805,
  "coffee-the-coffee-gardens-yeast-fermentation-uganda-fsc-7755": 2014,
  "coffee-castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8266": 1330,
  "coffee-atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8764": 1852,
  "coffee-lala-salama-sparkling-water-decaf-ethiopia-fsc-8739": 1805,
  "coffee-gatomboya-washing-station-nyeri-ab-kenya-fsc-8712": 1805,
  "coffee-tegu-factory-ab-karatina-town-kenya-fsc-8705": 1852,
  "coffee-el-refugio-agudelo-uribe-family-colombia-fsc-8769": 3278,
  "coffee-castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8261": 1330,
  "coffee-el-borbollon-santa-ana-el-salvador-fsc-8620": 1473,
  "coffee-brazil-ny-2-3-scr-17-18-ss-gc": 1644,
  "coffee-brazil-eagle-monte-carmelo-cafe-delas": 1930,
  "coffee-brazil-ipanema-fazenda-conquista": 1638,
  "coffee-brazil-sitio-boa-esperanca-mundo-novo-natural": 2110,
  "coffee-central-american-decaf-blend": 2010,
  "coffee-colombia-excelso-ep-huila": 1728,
  "coffee-colombia-huila-womens-project": 1640,
  "coffee-colombia-seleccion-planadas-organic": 2160,
  "coffee-costa-rica-shb-san-rafael-tarrazu": 1850,
  "coffee-ethiopia-limu-fully-washed-g2": 2048,
  "coffee-ethiopia-sidamo-natural-g4": 1390,
  "coffee-ethiopia-sidamo-shantawene-washed-g1": 2060,
  "coffee-ethiopia-yirgacheffe-banko-gotiti-g1-fully-washed": 2352,
  "coffee-ethiopia-yirgacheffe-g2-fully-washed": 2064,
  "coffee-green-single-origin-subscription": 1500,
  "coffee-guatemala-huehuetenango-shb-ep-rfa": 1780,
  "coffee-guatemala-jabiru-union-cantinil": 1968,
  "coffee-honduras-finca-el-matazano-elvin-castillo-honey": 2240,
  "coffee-honduras-nkg-bloom-gea-shg-ep-organic": 1935,
  "coffee-honduras-oropendolas-washed": 2160,
  "coffee-honduras-san-andres-shg": 1760,
  "coffee-honduras-shg-hacienda-monte-cristo": 1806,
  "coffee-india-cherry-ab-robusta": 1132,
  "coffee-india-monsooned-malabar-a": 1888,
  "coffee-india-monsooned-malabar-aa-robusta": 1242,
  "coffee-indian-mysore-plantation-a": 1512,
  "coffee-indonesia-old-brown-java-obj-6-year-aged": 1620,
  "coffee-kenya-aa-eaagads-estate": 2314,
  "coffee-kenya-kisii-estate-pb-washed": 2020,
  "coffee-malawi-mzuzu-aa": 2000,
  "coffee-mexico-mountain-water-decaf": 2076,
  "coffee-nicaragua-shg-ep": 1532,
  "coffee-peru-g1-finca-mesapata-women-farmed-double-certified": 1700,
  "coffee-peru-g1-gonzilla-estate-g1-organic": 1725,
  "coffee-sumatra-mandheling-tekengon-triple-picked": 2020,
  "coffee-uganda-mt-elgon-arabica-aa": 1650,
  "coffee-uganda-mubuku-drugar-fully-washed": 1550,
  "coffee-ugandan-robusta-scr-18-direct-trade": 1150,
  "coffee-ugandan-rwenzori-byaruhanga-farm-robusta-scr-14": 950,
  "coffee-vietnam-robusta-wet-polish-scr18-rfa": 930,
  "coffee-vietnam-son-la-g1-arabica": 1340
};

export const fallbackCatalogue: Catalogue = {
  coffees: [
      {
          "id": "coffee-guayabos-cafe-agrario-colombia-fsc-8227",
          "name": "Guayabos, Café Agrario, Colombia",
          "slug": "guayabos-cafe-agrario-colombia-fsc-8227",
          "subtitle": "Colombia washed from Falcon Micro.",
          "description": "Location: Ortega, Tolima Producer Café Agrario. Varietal: Castillo, Colombia, Caturra. Process: Washed. Cup score: 86. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Morello cherry",
              "Dark chocolate",
              "Demerara",
              "Panela",
              "Bergamot"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/FSC-8227.png?v=1766050162",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/guayabos-cafe-agrario-colombia-washed-fsc-8227"
      },
      {
          "id": "coffee-fazenda-pinhal-gabarra-teixeria-family-brazil-fsc-8253",
          "name": "Fazenda Pinhal, Gabarra Teixeria Family, Brazil",
          "slug": "fazenda-pinhal-gabarra-teixeria-family-brazil-fsc-8253",
          "subtitle": "Brazil natural from Falcon Micro.",
          "description": "Location: San Antonio Do Amparo, Sul De Minas Producer Gabarra Teixeria Family. Varietal: Mixed. Process: Natural. Cup score: 83. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Mandarin",
              "Lemon",
              "Hazlenut",
              "Milk chocolate"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/pinhal_micro-1_copy_3.jpg?v=1773159468",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/fazenda-pinhal-gabarra-teixeria-family-brazil-natural-fsc-8253"
      },
      {
          "id": "coffee-imbalu-the-coffee-yard-uganda-fsc-8617",
          "name": "Imbalu, The Coffee Yard, Uganda",
          "slug": "imbalu-the-coffee-yard-uganda-fsc-8617",
          "subtitle": "Uganda anaerobic natural from Falcon Micro.",
          "description": "Location: Sironko District, Eastern Uganda Producer Imbalu. Varietal: SL14, SL28. Process: Anaerobic Natural. Cup score: 86.25. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Cherry",
              "Cassis",
              "Plum",
              "Cacao",
              "Nutmeg"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Anaerobic Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/imbalu_micro-1_copy_2.jpg?v=1776267430",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/imbalu-the-coffee-yard-uganda-anaerobic-natural-fsc-8617"
      },
      {
          "id": "coffee-bellavista-huabal-peru-fsc-8628",
          "name": "Bellavista, Huabal, Peru",
          "slug": "bellavista-huabal-peru-fsc-8628",
          "subtitle": "Peru natural from Falcon Micro.",
          "description": "Location: Bellavista Producer Bellavista. Varietal: Marshel,Geisha,Catuai. Process: Natural. Cup score: 85. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green pear",
              "Raisin",
              "Orange",
              "Pistachio",
              "Milk chocolate"
          ],
          "originType": "Peru",
          "shopCategorySlug": "blends",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/bellavista-28.jpg?v=1776335583",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/bellavista-huabal-peru-natural-fsc-8628"
      },
      {
          "id": "coffee-kiamabara-ab-nyeri-county-kenya-fsc-8710",
          "name": "Kiamabara AB, Nyeri County, Kenya",
          "slug": "kiamabara-ab-nyeri-county-kenya-fsc-8710",
          "subtitle": "Kenya washed from Falcon Micro.",
          "description": "Location: Kiamabara, Kirinyaga, Nyeri Producer Mugaga Farmers’ Cooperative Society. Varietal: SL28 & 34, Ruiru11. Process: Washed. Cup score: 87. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Lemon",
              "Orange",
              "Peach iced tea",
              "Brown sugar"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/kiamabara-28.jpg?v=1774871474",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/kiamabara-ab-nyeri-county-kenya-washed-fsc-8710"
      },
      {
          "id": "coffee-sidamo-taferi-kela-kickstart-natural-lot-25-17-bette-buna-ethiopia-fsc-7",
          "name": "Sidamo Taferi Kela - Kickstart Natural - Lot 25.17, Bette Buna, Ethiopia",
          "slug": "sidamo-taferi-kela-kickstart-natural-lot-25-17-bette-buna-ethiopia-fsc-7",
          "subtitle": "Ethiopia natural from Falcon Micro.",
          "description": "Location: Sidamo, Taferi Kela Producer Bette Buna. Varietal: 74112,74110, Enat Buna. Process: Natural. Cup score: 86.75. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Blackberry",
              "Raisin",
              "Tea",
              "Red fruits",
              "Blood orange"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/bette_b-28.jpg?v=1773931664",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/sidamo-taferi-kela-kickstart-lot-25-17-bette-buna-ethiopia-natural-fsc-7761"
      },
      {
          "id": "coffee-muki-fruity-the-coffee-yard-uganda-fsc-8684",
          "name": "Muki Fruity, The Coffee Yard, Uganda",
          "slug": "muki-fruity-the-coffee-yard-uganda-fsc-8684",
          "subtitle": "Uganda anaerobic natural from Falcon Micro.",
          "description": "Location: Sironko District, Eastern Uganda Producer Muki Fruity. Varietal: Nyasaland, SL14, SL28. Process: Anaerobic Natural. Cup score: 86. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Pineapple",
              "Plum",
              "Cocoa",
              "Tamarind",
              "Almond"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Anaerobic Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/muki-28.jpg?v=1776267301",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/muki-fruity-the-coffee-yard-uganda-anaerobic-natural-fsc-8684"
      },
      {
          "id": "coffee-cajamarca-falcon-coffees-peru-peru-fsc-8554",
          "name": "Cajamarca, Falcon Coffees Peru, Peru",
          "slug": "cajamarca-falcon-coffees-peru-peru-fsc-8554",
          "subtitle": "Peru washed from Falcon Micro.",
          "description": "Location: Jaen, Cajamarca Producer Cajamarca. Varietal: Pache, Typica, Caturra. Process: Washed. Cup score: 84. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green apple",
              "Hazelnut",
              "Milk chocolate"
          ],
          "originType": "Peru",
          "shopCategorySlug": "blends",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/cajamarca_micro-1_copy_3.jpg?v=1776335640",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/cajamarca-falcon-coffees-peru-peru-washed-fsc-8554"
      },
      {
          "id": "coffee-lala-salama-decaf-abay-teka-district-ethiopia-fsc-8613",
          "name": "Lala Salama Decaf, Abay Teka District, Ethiopia",
          "slug": "lala-salama-decaf-abay-teka-district-ethiopia-fsc-8613",
          "subtitle": "Ethiopia decaf from Falcon Micro.",
          "description": "Location: Abay Teka District Producer Mixed. Varietal: Mixed. Process: Decaf. Cup score: 83. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Raisin",
              "Black tea",
              "Banana",
              "Chocolate biscuit"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "decaf",
          "roastLevel": "Decaf",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/lala_salama_decaf-36.jpg?v=1772197576",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/lala-salama-decaf-abay-teka-district-ethiopia-decaf-fsc-8613"
      },
      {
          "id": "coffee-tegu-factory-ab-karatina-town-kenya-fsc-8711",
          "name": "Tegu Factory AB, Karatina Town, Kenya",
          "slug": "tegu-factory-ab-karatina-town-kenya-fsc-8711",
          "subtitle": "Kenya washed from Falcon Micro.",
          "description": "Location: Karatina Town, Nyeri District Producer Tegu Factory. Varietal: SL28 & 34, Ruiru11. Process: Washed. Cup score: 87. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Strawberry",
              "Rhubarb",
              "Custard",
              "Orange",
              "Butter"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/tegu_micro-1copy2.jpg?v=1774871127",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/tegu-factory-ab-karatina-town-kenya-washed-fsc-8711"
      },
      {
          "id": "coffee-taferi-kela-lot-6-bette-buna-ethiopia-fsc-7614",
          "name": "Taferi Kela - Lot 6 , Bette Buna, Ethiopia",
          "slug": "taferi-kela-lot-6-bette-buna-ethiopia-fsc-7614",
          "subtitle": "Ethiopia anaerobic washed from Falcon Micro.",
          "description": "Location: Sidamo, Taferi Kela Producer Taferi Kela - Lot 6. Varietal: 74112,74158 & Enat Buna. Process: Anaerobic Washed. Cup score: 87.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Bergamot",
              "Lime",
              "Orange blossom",
              "Red fruits",
              "Earl grey"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Anaerobic Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/taferi_kela_6_micro-1copy2.png?v=1756209247",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/taferi-kela-lot-6-bette-buna-ethiopia-anaerobic-washed-muk-7614"
      },
      {
          "id": "coffee-yacuri-juan-pena-ecuador-fsc-8523",
          "name": "Yacuri, Juan Peña, Ecuador",
          "slug": "yacuri-juan-pena-ecuador-fsc-8523",
          "subtitle": "Ecuador washed from Falcon Micro.",
          "description": "Location: Saraguro Formation, Loja, Ecuador Producer Juan Peña. Varietal: Sidra. Process: Washed. Cup score: 86.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Lemon",
              "Raspberry",
              "Blueberry",
              "Bergamot",
              "Dark chocolate"
          ],
          "originType": "Ecuador",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/yacuri-28.jpg?v=1770725181",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/yacuri-juan-pena-ecuador-washed-fsc-8523"
      },
      {
          "id": "coffee-el-diviso-nestor-lasso-colombia-fsc-8036",
          "name": "El Diviso, Nestor Lasso, Colombia",
          "slug": "el-diviso-nestor-lasso-colombia-fsc-8036",
          "subtitle": "Colombia natural from Falcon Micro.",
          "description": "Location: Pitalito, Huilla Producer Nestor Lasso. Varietal: Ombligon. Process: Natural. Cup score: 87.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Bakewell tart",
              "Cherry liqueur",
              "Marshmallow",
              "Lime",
              "Chocolate mousse"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/el_diviso_micro-1_copy_2.jpg?v=1772618494",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/el-diviso-nestor-lasso-colombia-natural-fsc-8036"
      },
      {
          "id": "coffee-chito-community-juan-pena-ecuador-fsc-8526",
          "name": "Chito Community, Juan Peña, Ecuador",
          "slug": "chito-community-juan-pena-ecuador-fsc-8526",
          "subtitle": "Ecuador washed from Falcon Micro.",
          "description": "Location: Saraguro Formation, Loja, Ecuador Producer Juan Peña. Varietal: Mixed. Process: Washed. Cup score: 85. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Black tea",
              "Liquorice",
              "Milk chocolate",
              "Cocoa nibs"
          ],
          "originType": "Ecuador",
          "shopCategorySlug": "blends",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/ChitoCommunity-28.jpg?v=1771599729",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/chito-community-juan-pena-ecuador-washed-fsc-8526"
      },
      {
          "id": "coffee-coproca-lot-1214-nyamasheke-district-rwanda-fsc-8444",
          "name": "Coproca Lot 1214, Nyamasheke District, Rwanda",
          "slug": "coproca-lot-1214-nyamasheke-district-rwanda-fsc-8444",
          "subtitle": "Rwanda natural from Falcon Micro.",
          "description": "Location: Western Province, Nyamasheke District,Kanjongo Sector Producer Coproca 1214. Varietal: Red Bourbon. Process: Natural. Cup score: 85.75. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Lime",
              "Apple",
              "Licorice",
              "Black tea",
              "Caramel"
          ],
          "originType": "Rwanda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/coproca-28.jpg?v=1776267768",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/coproca-lot1214-nyamasheke-district-rwanda-natural-fsc-8444"
      },
      {
          "id": "coffee-butawa-the-coffee-gardens-uganda-fsc-8685",
          "name": "Butawa, The Coffee Gardens, Uganda",
          "slug": "butawa-the-coffee-gardens-uganda-fsc-8685",
          "subtitle": "Uganda washed from Falcon Micro.",
          "description": "Location: Mt Elgon Producer TCG - Butawa. Varietal: Nyasaland, SL14, SL28. Process: Washed. Cup score: 85.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Juicy",
              "Stone fruits",
              "Cola",
              "Vanilla"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/butawa-28.jpg?v=1776267822",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/butawa-the-coffee-gardens-uganda-washed-fsc-8685"
      },
      {
          "id": "coffee-malidadi-the-coffee-yard-uganda-fsc-8618",
          "name": "Malidadi, The Coffee Yard, Uganda",
          "slug": "malidadi-the-coffee-yard-uganda-fsc-8618",
          "subtitle": "Uganda washed from Falcon Micro.",
          "description": "Location: Sironko District, Eastern Uganda Producer TCY - Malidadi. Varietal: Nyasaland, SL14, SL28. Process: Washed. Cup score: 85.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Orange",
              "Lemon",
              "Black tea",
              "Caramel"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/malidadi-28.jpg?v=1776267361",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/malidadi-the-coffee-yard-uganda-washed-fsc-8618"
      },
      {
          "id": "coffee-hacienda-la-papaya-juan-pena-ecuador-fsc-8509",
          "name": "Hacienda La Papaya, Juan Peña, Ecuador",
          "slug": "hacienda-la-papaya-juan-pena-ecuador-fsc-8509",
          "subtitle": "Ecuador fully washed from Falcon Micro.",
          "description": "Location: Saraguro Formation, Loja, Ecuador Producer Juan Peña. Varietal: Typica Mejorado. Process: Fully Washed. Cup score: 87. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green apple",
              "Orange",
              "Butterscotch",
              "Chocolate"
          ],
          "originType": "Ecuador",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Fully Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/HaciendaLaPapaya_micro-1copy2.jpg?v=1771599779",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/hacienda-la-papaya-juan-pena-ecuador-fully-washed-fsc-8509"
      },
      {
          "id": "coffee-attia-chapata-cooperativa-de-caficultores-de-anserma-colombia-fsc-8575",
          "name": "Attia - Chapata, Cooperativa de Caficultores de Anserma, Colombia",
          "slug": "attia-chapata-cooperativa-de-caficultores-de-anserma-colombia-fsc-8575",
          "subtitle": "Colombia natural from Falcon Micro.",
          "description": "Location: Anserma, Caldas Producer Cooperativa de Caficultores de Anserma. Varietal: Castillo. Process: Natural. Cup score: 86. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green mango",
              "Papaya",
              "Tamarind",
              "Banana",
              "Rum"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/attia_-28.jpg?v=1773159421",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/attia-chapata-cooperativa-de-caficultores-de-anserma-colombia-natural-fsc-8575"
      },
      {
          "id": "coffee-ijen-highlands-botolinggo-village-indonesia-fsc-8457",
          "name": "Ijen Highlands, Botolinggo Village, Indonesia",
          "slug": "ijen-highlands-botolinggo-village-indonesia-fsc-8457",
          "subtitle": "Colombia natural from Falcon Micro.",
          "description": "Location: Botolinggo Village, East Java Province, Indonesia Producer Kevenka Coffee. Varietal: Komasti, Andungsari, Bourbon, Kartika. Process: Natural. Cup score: 85.25. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Cherry",
              "Strawberry",
              "Vanilla",
              "Dark chocolate"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/ijen_high-28.jpg?v=1776092025",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/ijen-highlands-botolinggo-village-indonesia-natural-fsc-8458"
      },
      {
          "id": "coffee-diego-samuel-bermudez-el-paraiso-p02-colombia-fsc-8230",
          "name": "Diego Samuel Bermudez, El Paraíso P02, Colombia",
          "slug": "diego-samuel-bermudez-el-paraiso-p02-colombia-fsc-8230",
          "subtitle": "Colombia double fermentation from Falcon Micro.",
          "description": "Location: El Tambo, Cauca Producer Diego Samuel Bermudez. Varietal: Castillo. Process: Double Fermentation. Cup score: 86.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Crimson grape",
              "Nectar-like",
              "Ceylon tea",
              "Sugarcane",
              "Fruit-like"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Double Fermentation",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/double_ferment.jpg?v=1765878885",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/diego-samuel-bermudez-el-paraiso-p02-colombia-double-fermentation-fsc-8230"
      },
      {
          "id": "coffee-el-borbollon-santa-ana-el-salvador-fsc-8057",
          "name": "El Borbollon, Santa Ana, El Salvador",
          "slug": "el-borbollon-santa-ana-el-salvador-fsc-8057",
          "subtitle": "El Salvador natural from Falcon Micro.",
          "description": "Location: Calzontes Arriba Producer El Borbollon Mill. Varietal: Red Bourbon. Process: Natural. Cup score: 85.25. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Orange",
              "Chocolate mousse",
              "Medium acidity",
              "Snickers"
          ],
          "originType": "El Salvador",
          "shopCategorySlug": "blends",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/el_borbollon_micro-1copy3.jpg?v=1764675111",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/el-borbollon-santa-ana-el-salvador-natural-fsc-8057"
      },
      {
          "id": "coffee-atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8238",
          "name": "Atunkaa Caficauca, Sugar Cane Decaf, Colombia",
          "slug": "atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8238",
          "subtitle": "Colombia sugar cane decaf from Falcon Micro.",
          "description": "Location: Piendamo, Cauca Producer Cooperativa de Caficultores del Cauca. Varietal: Caturra, Castillo, Colombia. Process: Sugar Cane Decaf. Cup score: 85. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Sweet pretzel",
              "Honeycomb",
              "Orange",
              "Caramel wafer"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "decaf",
          "roastLevel": "Sugar Cane Decaf",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/atunkaa_c-29.jpg?v=1762871101",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/atunkaa-caficauca-sugar-cane-decaf-colombia-sugar-cane-decaf-muk-8239"
      },
      {
          "id": "coffee-finca-etiopia-los-naranjos-cafe-el-salvador-fsc-7963",
          "name": "Finca Etiopia, Los Naranjos Cafe, El Salvador",
          "slug": "finca-etiopia-los-naranjos-cafe-el-salvador-fsc-7963",
          "subtitle": "Ethiopia honey from Falcon Micro.",
          "description": "Location: Cerro Ilamatepec, Santa Ana Producer Los Naranjos Cafe. Varietal: Geisha. Process: Honey. Cup score: 87.25. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Violets",
              "Zesty",
              "Blueberry",
              "Almond paste",
              "Honey"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Honey",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/los_naranjos_micro-1copy2.jpg?v=1762272185",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/finca-etiopia-los-naranjos-cafe-el-salvador-honey-muk-7963"
      },
      {
          "id": "coffee-hamacas-vides-family-guatemala-fsc-8068",
          "name": "Hamacas, Vides Family, Guatemala",
          "slug": "hamacas-vides-family-guatemala-fsc-8068",
          "subtitle": "Guatemala washed from Falcon Micro.",
          "description": "Location: La Libertad, Huehuetenango Producer Vides Family. Varietal: Bourbon, Caturra. Process: Washed. Cup score: 85.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Blood orange",
              "Tomato",
              "Bright",
              "Tea-like",
              "Stone-fruit caramel"
          ],
          "originType": "Guatemala",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/hamacas-28_9668088f-58a9-401a-b2ba-2a59d6f139fb.jpg?v=1759412286",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/hamacas-vides-family-guatemala-washed-muk-8068"
      },
      {
          "id": "coffee-las-lajas-chacon-family-costa-rica-fsc-7924",
          "name": "Las Lajas , Chacon Family, Costa Rica",
          "slug": "las-lajas-chacon-family-costa-rica-fsc-7924",
          "subtitle": "Costa Rica anaerobic honey from Falcon Micro.",
          "description": "Location: Central Valley - Sabanilla de Alajuela Producer Chacon Family. Varietal: Tipica Lima. Process: Anaerobic Honey. Cup score: 86.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Red berry coulis",
              "Conference pear",
              "Pink rose petal",
              "Grenadine",
              "Cinnamon spice"
          ],
          "originType": "Costa Rica",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Anaerobic Honey",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/las_lajas.jpg?v=1759418068",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/las-lajas-copy-chacon-family-costa-rica-anaerobic-honey-muk-7924"
      },
      {
          "id": "coffee-noruega-ahuachapon-el-salvador-fsc-7958",
          "name": "Noruega, Ahuachapon, El Salvador",
          "slug": "noruega-ahuachapon-el-salvador-fsc-7958",
          "subtitle": "Honduras natural from Falcon Micro.",
          "description": "Location: Ahuachapon, El Salvador Producer Sigfredo Corado. Varietal: Pacamara. Process: Natural. Cup score: 86.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green kiwi",
              "Carambola",
              "Lime",
              "Wild strawberry",
              "Earl-Grey"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/noruega_micro-1copy2.jpg?v=1759411862",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/noruega-ahuachapon-el-salvador-natural-muk-7958"
      },
      {
          "id": "coffee-the-coffee-gardens-yeast-fermentation-uganda-fsc-7755",
          "name": "The Coffee Gardens, Yeast Fermentation, Uganda",
          "slug": "the-coffee-gardens-yeast-fermentation-uganda-fsc-7755",
          "subtitle": "Uganda yeast fermentation washed from Falcon Micro.",
          "description": "Location: Upper Bukyabo Producer The Coffee Gardens. Varietal: Nyasaland, SL14, SL28. Process: Fruit Fermentation. Cup score: 86.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Green apple",
              "Red berries",
              "Earl grey florals"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Yeast Fermentation Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/garden_yeast-20.jpg?v=1751984739",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/the-coffee-gardens-yeast-ferment-uganda-yeast-ferment-muk-7755"
      },
      {
          "id": "coffee-castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8266",
          "name": "Castanhas Do Brazil, Cocatrel Cooperative, Brazil",
          "slug": "castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8266",
          "subtitle": "Brazil natural from Falcon Micro.",
          "description": "Location: Tres Pontas, Sul de Minas Producer Cocatrel Cooperative. Varietal: Mixed. Process: Natural. Cup score: 82.75. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Orange",
              "Lime",
              "Hazelnut",
              "Caramel",
              "Dark chocolate"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "blends",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/castanhas_micro-1_copy_3.jpg?v=1776867662",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/castanhas-do-brazil-cocatrel-cooperative-brazil-natural-fsc-8266"
      },
      {
          "id": "coffee-atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8764",
          "name": "Atunkaa Caficauca, Sugar Cane Decaf, Colombia",
          "slug": "atunkaa-caficauca-sugar-cane-decaf-colombia-fsc-8764",
          "subtitle": "Colombia decaf from Falcon Micro.",
          "description": "Location: Piendamo, Cauca Producer Siruma. Varietal: Castillo, Colombia, Caturra. Process: Decaf. Cup score: 84.25. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Orange",
              "Apple",
              "Milk chocolate",
              "Almond",
              "Caramel ATUNKAA \"Atunkaa\" in"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "decaf",
          "roastLevel": "Decaf",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/atinkaa_26-29.jpg?v=1777389727",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/atunkaa-caficauca-sugar-cane-decaf-colombia-decaf-fsc-8764"
      },
      {
          "id": "coffee-lala-salama-sparkling-water-decaf-ethiopia-fsc-8739",
          "name": "Lala Salama , Sparkling Water Decaf, Ethiopia",
          "slug": "lala-salama-sparkling-water-decaf-ethiopia-fsc-8739",
          "subtitle": "Ethiopia decaf from Falcon Micro.",
          "description": "Location: Odo Shakiso Woreda, Tero Kebell Producer Dimtu Coffee Industry PLC. Varietal: Heirloom. Process: Decaf. Cup score: 82. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Plum",
              "Pear",
              "Almond",
              "Dark chocolate",
              "Cedar wood"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "decaf",
          "roastLevel": "Decaf",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/lala_salama_26-29.jpg?v=1777391016",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/lala-salama-decaf-sparkling-water-decaf-ethiopia-decaf-fsc-8739"
      },
      {
          "id": "coffee-gatomboya-washing-station-nyeri-ab-kenya-fsc-8712",
          "name": "Gatomboya Washing Station, Nyeri AB, Kenya",
          "slug": "gatomboya-washing-station-nyeri-ab-kenya-fsc-8712",
          "subtitle": "Kenya washed from Falcon Micro.",
          "description": "Location: Nyeri District Producer Gatomboya Washing Station. Varietal: SL28 & 34, Ruiru11. Process: Washed. Cup score: 87. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Pink Grapefruit",
              "Baked apple",
              "Custard",
              "Toffee Earning it's name from"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "blends",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/gatomboya-28.jpg?v=1777391107",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/gatomboya-washing-station-nyeri-ab-kenya-washed-fsc-8712"
      },
      {
          "id": "coffee-tegu-factory-ab-karatina-town-kenya-fsc-8705",
          "name": "Tegu Factory AB, Karatina Town, Kenya",
          "slug": "tegu-factory-ab-karatina-town-kenya-fsc-8705",
          "subtitle": "Kenya washed from Falcon Micro.",
          "description": "Location: Karatina Town, Nyeri County, Central Kenya Producer Tegu Factory. Varietal: SL28 & 34, Ruiru11. Process: Washed. Cup score: 87. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Lemon",
              "Lime",
              "Toffee apple",
              "Black tea",
              "Operated by"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/tegu_factory-28.jpg?v=1777390789",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/tegu-factory-ab-karatina-town-kenya-washed-fsc-8705"
      },
      {
          "id": "coffee-el-refugio-agudelo-uribe-family-colombia-fsc-8769",
          "name": "El Refugio, Agudelo Uribe family, Colombia",
          "slug": "el-refugio-agudelo-uribe-family-colombia-fsc-8769",
          "subtitle": "Colombia washed geisha from Falcon Micro.",
          "description": "Location: Villamaría – Caldas Producer Agudelo Uribe family. Varietal: Geisha. Process: Washed. Cup score: 87.5. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Lemon zest",
              "Tomato",
              "Mango",
              "Buttery",
              "Black tea"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed Geisha",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/el_refugio_micro-1copy2.jpg?v=1777390663",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/el-refugio-agudelo-uribe-family-colombia-washed-fsc-8769"
      },
      {
          "id": "coffee-castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8261",
          "name": "Castanhas do Brazil, Cocatrel Cooperative, Brazil",
          "slug": "castanhas-do-brazil-cocatrel-cooperative-brazil-fsc-8261",
          "subtitle": "Brazil natural from Falcon Micro.",
          "description": "Location: Tres Pontas, Sul de Minas Producer Cocatrel Cooperative. Varietal: Mixed. Process: Natural. Cup score: 82.75. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Dark chocolate",
              "Cashew",
              "Caramel"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "blends",
          "roastLevel": "Natural",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/casthanas_2_micro-1copy3.jpg?v=1777390139",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/castanhas-do-brazil-cocatrel-cooperative-brazil-natural-fsc-8261"
      },
      {
          "id": "coffee-el-borbollon-santa-ana-el-salvador-fsc-8620",
          "name": "El Borbollon, Santa Ana, El Salvador",
          "slug": "el-borbollon-santa-ana-el-salvador-fsc-8620",
          "subtitle": "El Salvador washed from Falcon Micro.",
          "description": "Location: Santa Ana Volcano Producer Alvarez family. Varietal: Red Bourbon. Process: Washed. Cup score: 83. Supplied by Falcon Micro.",
          "tastingNotes": [
              "Stone fruits",
              "Milk chocolate",
              "Hazelnut"
          ],
          "originType": "El Salvador",
          "shopCategorySlug": "blends",
          "roastLevel": "Washed",
          "heroImagePath": "https://cdn.shopify.com/s/files/1/0826/3978/2207/files/el_borbollon_micro-1copy3_2edb0d94-a133-446a-8bda-20668837f2f4.jpg?v=1778585818",
          "sourceName": "Falcon Micro",
          "sourceUrl": "https://www.falcon-micro.com/products/el-borbollon-santa-ana-el-salvador-washed-fsc-8620"
      },
      {
          "id": "coffee-brazil-ny-2-3-scr-17-18-ss-gc",
          "name": "Brazil – NY 2/3 Scr 17/18 SS GC",
          "slug": "brazil-ny-2-3-scr-17-18-ss-gc",
          "subtitle": "Brazil specialty from Small Batch Roasting.",
          "description": "Brazilian green coffee graded NY 2/3 with screen 17/18 and a Strictly Soft Good Cup profile. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Orange",
              "Honey",
              "Cherry",
              "A creamy body"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/11/campo_184-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/brazil/brazil-ny-2-3-scr-17-18-ss-gc/"
      },
      {
          "id": "coffee-brazil-eagle-monte-carmelo-cafe-delas",
          "name": "Brazil Eagle Monte Carmelo (Cafe Delas)",
          "slug": "brazil-eagle-monte-carmelo-cafe-delas",
          "subtitle": "Brazil specialty from Small Batch Roasting.",
          "description": "Brazil Eagle Monte Carmelo Café Delas is a Brazilian single origin from Cerrado Mineiro, Monte Carmelo. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Hazelnut",
              "Dried fruit",
              "Gentle sweetness"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Brazil-Eagle-2.png?fit=511%2C491&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/brazil-eagle-monte-carmelo-cafe-delas/"
      },
      {
          "id": "coffee-brazil-ipanema-fazenda-conquista",
          "name": "Brazil Ipanema – Fazenda Conquista",
          "slug": "brazil-ipanema-fazenda-conquista",
          "subtitle": "Brazil specialty from Small Batch Roasting.",
          "description": "Brazil Eagle Monte Carmelo Café Delas is a Brazilian single origin from Cerrado Mineiro, Monte Carmelo. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Hazelnut",
              "Dried fruit",
              "Gentle sweetness"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/03/conquista-2.jpg?fit=669%2C446&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/brazil-ipanema-fazenda-conquista/"
      },
      {
          "id": "coffee-brazil-sitio-boa-esperanca-mundo-novo-natural",
          "name": "Brazil Sitio Boa Esperanca – Mundo Novo Natural",
          "slug": "brazil-sitio-boa-esperanca-mundo-novo-natural",
          "subtitle": "Brazil natural from Small Batch Roasting.",
          "description": "Single origin Brazilian Arabica green coffee from Sitio Boa Esperanca (Low Mogiana). Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "And a creamy body"
          ],
          "originType": "Brazil",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_af5c9f62c96c4c32bac4846f0af1a21cmv2.webp?fit=500%2C667&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/brazil-sitio-boa-esperanca-mundo-novo-natural/"
      },
      {
          "id": "coffee-central-american-decaf-blend",
          "name": "Central American Decaf Blend",
          "slug": "central-american-decaf-blend",
          "subtitle": "Nicaragua decaf from Small Batch Roasting.",
          "description": "MC (methylene chloride) decaffeinated blend from Nicaragua and El Salvador. Varieties include Bourbon, Caturra, Catuai and Typica. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Cocoa",
              "Nut",
              "Apricot notes",
              "Gentle fruitiness",
              "A clean finish"
          ],
          "originType": "Nicaragua",
          "shopCategorySlug": "decaf",
          "roastLevel": "Decaf",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2025/09/decaf.jpg?fit=797%2C800&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/green/decaf/central-american-decaf-blend/"
      },
      {
          "id": "coffee-colombia-excelso-ep-huila",
          "name": "Colombia Excelso EP Huila",
          "slug": "colombia-excelso-ep-huila",
          "subtitle": "Colombia specialty from Small Batch Roasting.",
          "description": "Rainforest Alliance certified Arabica green coffee from Huila, Colombia. Fully washed and prepared to a clean, consistent cup profile. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_50d8466bb4eb4886a48355deb682c55cmv2-1.webp?fit=500%2C333&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/colombia/colombia-excelso-ep-huila/"
      },
      {
          "id": "coffee-colombia-huila-womens-project",
          "name": "Colombia Huila Womens Project",
          "slug": "colombia-huila-womens-project",
          "subtitle": "Colombia specialty from Small Batch Roasting.",
          "description": "Colombia CoAgroBrisas Women’s Project is a high-quality, community-driven coffee produced by a collective of women farmers in Huila. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Vibrant acidity",
              "Balanced sweetness",
              "A smooth",
              "Silky body"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2026/04/Colombia_MG_2205-16-600x902-1.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/colombia-huila-womens/"
      },
      {
          "id": "coffee-colombia-seleccion-planadas-organic",
          "name": "Colombia Seleccion Planadas Organic",
          "slug": "colombia-seleccion-planadas-organic",
          "subtitle": "Colombia organic from Small Batch Roasting.",
          "description": "Colombia Selección Planadas Organic is an organic, washed Arabica green coffee from Planadas, Tolima. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Milk chocolate",
              "Caramel tones",
              "Red fruit",
              "Citrus notes"
          ],
          "originType": "Colombia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Organic",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Colombia-Seleccion-1.png?fit=510%2C490&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/latest-arrivals/colombia-seleccion-planadas-organic/"
      },
      {
          "id": "coffee-costa-rica-shb-san-rafael-tarrazu",
          "name": "Costa Rica SHB – San Rafael – Tarrazu",
          "slug": "costa-rica-shb-san-rafael-tarrazu",
          "subtitle": "Costa Rica specialty from Small Batch Roasting.",
          "description": "Arabica green coffee from Tarrazú (San Marcos and San Pablo), washed processed, with a creamy body, decent acidity, and flavours of chocolate and plum. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Chocolate",
              "Plum"
          ],
          "originType": "Costa Rica",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_4c79a3694b4c4948b0cbd83f0fde257cmv2.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/costa-rica/costa-rica-tarrazu/"
      },
      {
          "id": "coffee-ethiopia-limu-fully-washed-g2",
          "name": "Ethiopia Limu Fully Washed G2",
          "slug": "ethiopia-limu-fully-washed-g2",
          "subtitle": "Ethiopia fully washed from Small Batch Roasting.",
          "description": "Fully washed Grade 2 coffee with a clean, balanced profile from Ethiopia. Limu is known for delicate florals and a cup that leans towards citrus and black tea, with a rounded body. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "A rounded body"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Fully Washed",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/Ethiopia-Limu-G2-A-scaled.jpg?fit=1200%2C800&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/ethiopia/ethiopia-limu-fully-washed-g2/"
      },
      {
          "id": "coffee-ethiopia-sidamo-natural-g4",
          "name": "Ethiopia Sidamo Natural G4",
          "slug": "ethiopia-sidamo-natural-g4",
          "subtitle": "Ethiopia natural from Small Batch Roasting.",
          "description": "Ethiopia Sidamo Natural G4 is a naturally processed coffee from various small Sidamo estates in Ethiopia. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Natural",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_9a655c6d8ed44af29b7f4f7727332c0bmv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/ethiopia-sidamo-natural-g4/"
      },
      {
          "id": "coffee-ethiopia-sidamo-shantawene-washed-g1",
          "name": "Ethiopia Sidamo Shantawene Washed G1",
          "slug": "ethiopia-sidamo-shantawene-washed-g1",
          "subtitle": "Ethiopia washed from Small Batch Roasting.",
          "description": "Fully washed Grade 1 Ethiopian Arabica microlots from Shantawene, Sidamo, grown by around 1,600 smallholders in the foothills of the Bombe mountains at about 1950 masl and beyond. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Often described as black tea",
              "Apricot",
              "Citrus",
              "Dark chocolate"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/Ethiopia-Sidamo-Shantawene-G2-A-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/ethiopia-sidamo-g1-shantawene/"
      },
      {
          "id": "coffee-ethiopia-yirgacheffe-banko-gotiti-g1-fully-washed",
          "name": "Ethiopia Yirgacheffe Banko Gotiti G1 Fully Washed",
          "slug": "ethiopia-yirgacheffe-banko-gotiti-g1-fully-washed",
          "subtitle": "Ethiopia fully washed from Small Batch Roasting.",
          "description": "Ethiopia Banko Gotiti Washed (2025) is a clean, expressive Ethiopian Arabica green coffee from the Banko Gotiti area, fully washed to emphasise floral aromatics and citrus clarity, with notes including lemon, bergamot, j Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Lemon",
              "Bergamot",
              "Jasmine",
              "Sweet peach",
              "Honey"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Fully Washed",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Ethiopia-Yirg-3.png?fit=508%2C488&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/latest-arrivals/ethiopia-yirgacheffe-banko-gotiti-g1-fully-washed/"
      },
      {
          "id": "coffee-ethiopia-yirgacheffe-g2-fully-washed",
          "name": "Ethiopia Yirgacheffe G2 – Fully Washed",
          "slug": "ethiopia-yirgacheffe-g2-fully-washed",
          "subtitle": "Ethiopia fully washed from Small Batch Roasting.",
          "description": "Fully washed Arabica from Yirgacheffe, Sidama. Grown at 1,700–2,200 masl by various small estates. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Citrus fruit",
              "Apple",
              "Lemongrass",
              "Black tea"
          ],
          "originType": "Ethiopia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Fully Washed",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_3aa77c7076f745eb8f3db9452ef2cacbmv2-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/ethiopia-yirgacheffe-g2-fully-washed-arriving-w-c-29-09-25/"
      },
      {
          "id": "coffee-green-single-origin-subscription",
          "name": "Green Single Origin Subscription",
          "slug": "green-single-origin-subscription",
          "subtitle": "Specialty specialty from Small Batch Roasting.",
          "description": "Monthly Purchasers Choice speciality green coffee subscription. Receive 1kg per selected origin each month (choose 1 to 10 origins). Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Specialty",
          "shopCategorySlug": "samples",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_39f6cad436514ce2bd2584bcb6d847a4mv2.webp?fit=500%2C333&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/green-single-origin-subscription/"
      },
      {
          "id": "coffee-guatemala-huehuetenango-shb-ep-rfa",
          "name": "Guatemala Huehuetenango SHB EP RFA",
          "slug": "guatemala-huehuetenango-shb-ep-rfa",
          "subtitle": "Guatemala specialty from Small Batch Roasting.",
          "description": "A clean, high-altitude regional blend from Huehuetenango in western Guatemala. Fully washed and built around classic varieties (Bourbon, Catuaí, Caturra and Typica) for vivid acidity with prominent fruit and floral notes. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Prominent fruit",
              "Floral notes"
          ],
          "originType": "Guatemala",
          "shopCategorySlug": "blends",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_2164e169c7f1496f890f7aef5b8e8a9cmv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/guatemala/guatemala-huehuetenango-shb-ep/"
      },
      {
          "id": "coffee-guatemala-jabiru-union-cantinil",
          "name": "Guatemala Jabiru Union Cantinil",
          "slug": "guatemala-jabiru-union-cantinil",
          "subtitle": "Guatemala specialty from Small Batch Roasting.",
          "description": "Guatemala Jabiru Union Cantinil is a washed Arabica green coffee from Union Cantinil in Huehuetenango, sourced from smallholder farms at high altitude. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Dark chocolate",
              "Caramel/toffee sweetness",
              "Supported by apple",
              "Red grape",
              "A bright citrus lift"
          ],
          "originType": "Guatemala",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Guatemala-Jabiru-2.png?fit=513%2C485&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/latest-arrivals/guatemala-jabiru-union-cantinil/"
      },
      {
          "id": "coffee-honduras-finca-el-matazano-elvin-castillo-honey",
          "name": "Honduras Finca El Matazano Elvin Castillo Honey",
          "slug": "honduras-finca-el-matazano-elvin-castillo-honey",
          "subtitle": "Honduras honey from Small Batch Roasting.",
          "description": "Farm-traceable Honduran Arabica from Montecillos, produced by Elvin Adolfo Castillo at Finca El Matazano (1,500 masl). Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Raspberry",
              "Lemongrass",
              "Dark chocolate"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Honey",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2025/04/Elvin-Castillo-Honduras-Finca-El-Matazano-1.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/honduras/honduras-finca-el-matazano-elvin-castillo-honey/"
      },
      {
          "id": "coffee-honduras-nkg-bloom-gea-shg-ep-organic",
          "name": "Honduras NKG BLOOM GEA SHG EP Organic",
          "slug": "honduras-nkg-bloom-gea-shg-ep-organic",
          "subtitle": "Honduras organic from Small Batch Roasting.",
          "description": "Discover the rich and distinct flavors of our Honduras NKG BLOOM GEA SHG EP Organic green coffee, sourced from various women-owned farms across the lush regions of Lempira, Ocotepeque, Intibuca, Copan, La Paz, El Paraiso, and Comayagua. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Ocotepeque",
              "Intibuca",
              "Copan",
              "La Paz",
              "El Paraiso"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "blends",
          "roastLevel": "Organic",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_bca7f6a831c64d47acbf2949fa4c67a5mv2.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/honduras-nkg-bloom-gea-shg-ep-organic/"
      },
      {
          "id": "coffee-honduras-oropendolas-washed",
          "name": "Honduras Oropendolas Washed",
          "slug": "honduras-oropendolas-washed",
          "subtitle": "Honduras washed from Small Batch Roasting.",
          "description": "Honduras Selección Oropendolas Washed is a clean and expressive single origin coffee from smallholder farms in the El Paraíso region of Honduras. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Peach",
              "Butterscotch",
              "Malt biscuit"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Honduras-Oropen-2.png?fit=402%2C406&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/latest-arrivals/honduras-oropendolas-washed-arriving-21-01-26/"
      },
      {
          "id": "coffee-honduras-san-andres-shg",
          "name": "Honduras San Andres SHG",
          "slug": "honduras-san-andres-shg",
          "subtitle": "Honduras specialty from Small Batch Roasting.",
          "description": "Download Info Sheet Indulge in the rich flavors of the Honduras San Andres SHG coffee, sourced directly from the Lempira region and meticulously cultivated by 25 producers in the town of San Andres. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Sourced directly from"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "blends",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_828a0fdcedb44ef6841c54265dbe09c7mv2.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/honduras-san-andres-shg/"
      },
      {
          "id": "coffee-honduras-shg-hacienda-monte-cristo",
          "name": "Honduras SHG Hacienda Monte Cristo",
          "slug": "honduras-shg-hacienda-monte-cristo",
          "subtitle": "Honduras specialty from Small Batch Roasting.",
          "description": "Organic single-estate Honduran coffee from Hacienda Monte Cristo in western Honduras, grown at 1670 masl (SHG). Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Milk chocolate",
              "Nuts",
              "Tropical fruit"
          ],
          "originType": "Honduras",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/afd28f_46fd1c0283ce4a50a1cae838a46cf113mv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/green/honduras-shg-hacienda-monte-cristo/"
      },
      {
          "id": "coffee-india-cherry-ab-robusta",
          "name": "India Cherry AB Robusta",
          "slug": "india-cherry-ab-robusta",
          "subtitle": "India robusta from Small Batch Roasting.",
          "description": "India Cherry AB Robusta is a bold, naturally processed coffee from the Western Ghats of Southern India. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "With subtle earthy spice"
          ],
          "originType": "India",
          "shopCategorySlug": "blends",
          "roastLevel": "Robusta",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/India-Cherry-AB-4.jpg?fit=810%2C608&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/green/india-cherry-ab-robusta/"
      },
      {
          "id": "coffee-india-monsooned-malabar-a",
          "name": "India Monsooned Malabar A",
          "slug": "india-monsooned-malabar-a",
          "subtitle": "India specialty from Small Batch Roasting.",
          "description": "Arabica coffee from various Highland Malabar estates in Karnataka, Western Ghats. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Dark chocolate",
              "Cinnamon aromas"
          ],
          "originType": "India",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_6e954ece4ea54dcdb4b396841144e6bdmv2.jpg?fit=893%2C600&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/india/india-monsooned-malabar/"
      },
      {
          "id": "coffee-india-monsooned-malabar-aa-robusta",
          "name": "India Monsooned Malabar AA Robusta",
          "slug": "india-monsooned-malabar-aa-robusta",
          "subtitle": "India robusta from Small Batch Roasting.",
          "description": "Download Info Sheet Our India Monsooned Malabar is sourced from various Highland Malabar Estates in Southern India’s Karnataka region, nestled in the Western Ghats. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Strong earthy",
              "Spicy notes",
              "Aromas of dark chocolate",
              "Cinnamon"
          ],
          "originType": "India",
          "shopCategorySlug": "dark-roast",
          "roastLevel": "Robusta",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_6e954ece4ea54dcdb4b396841144e6bdmv2.jpg?fit=893%2C600&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/india/india-monsooned-malabar-aa-robusta-arriving-w-c-05-01-26/"
      },
      {
          "id": "coffee-indian-mysore-plantation-a",
          "name": "Indian Mysore Plantation A",
          "slug": "indian-mysore-plantation-a",
          "subtitle": "Specialty specialty from Small Batch Roasting.",
          "description": "Wet processed Indian Mysore Arabica (Grade A) grown at 1100–1300 masl in Karnataka. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Specialty",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_61bb5540f69643cdb9287740cf25f29amv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/india/indian-mysore-plantation-a/"
      },
      {
          "id": "coffee-indonesia-old-brown-java-obj-6-year-aged",
          "name": "Indonesia Old Brown Java (OBJ) 6 Year Aged",
          "slug": "indonesia-old-brown-java-obj-6-year-aged",
          "subtitle": "Indonesia specialty from Small Batch Roasting.",
          "description": "A traditional Old Brown Java style coffee from Java, Indonesia, wet hulled and aged for six years to create a heavy-bodied, low-acidity cup with earthy dark notes and hints of red wine, cedarwood and molasses. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "And hints of red wine",
              "Cedarwood",
              "Molasses"
          ],
          "originType": "Indonesia",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_57721e6f17514473867de5955cee9a55mv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/indonesia-old-brown-java-obj-6-year-aged/"
      },
      {
          "id": "coffee-kenya-aa-eaagads-estate",
          "name": "Kenya AA Eaagads Estate",
          "slug": "kenya-aa-eaagads-estate",
          "subtitle": "Kenya specialty from Small Batch Roasting.",
          "description": "Kenya AA Eaagads Estate is a washed Kenyan Arabica green coffee from highland growing areas, offering a bright, expressive cup profile with fruit-forward notes such as blackcurrant, cranberry, citrus zest and red cherry, Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Such as blackcurrant",
              "Cranberry",
              "Citrus zest",
              "Red cherry",
              "Aromatic lift"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2026/01/Kenya-aa-4.png",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/green/kenya-aa-eaagads-estate-arriving-21-01-26/"
      },
      {
          "id": "coffee-kenya-kisii-estate-pb-washed",
          "name": "Kenya Kisii Estate PB – Washed",
          "slug": "kenya-kisii-estate-pb-washed",
          "subtitle": "Kenya washed from Small Batch Roasting.",
          "description": "Peaberry lot from Kisii County, fully washed and sun-dried. SL28, SL34, Ruiru 11. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Blackcurrant",
              "Peach",
              "Citrus",
              "Cane sugar"
          ],
          "originType": "Kenya",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Washed",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2025/10/Kenya-Kisii-PB-2.jpg?fit=1280%2C776&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/kenya/kenya-gatina-nyeri-ab-washed-copy/"
      },
      {
          "id": "coffee-malawi-mzuzu-aa",
          "name": "Malawi Mzuzu AA",
          "slug": "malawi-mzuzu-aa",
          "subtitle": "Malawi specialty from Small Batch Roasting.",
          "description": "Specialty-grade Malawi Mzuzu AB from smallholder farmers in Northern and Central Malawi, grown at 1,100–2,000 metres and fully washed. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Blueberry",
              "Hibiscus",
              "Tart apple notes"
          ],
          "originType": "Malawi",
          "shopCategorySlug": "blends",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2025/01/P1160730-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/malawi/malawi-mzuzu-aa/"
      },
      {
          "id": "coffee-mexico-mountain-water-decaf",
          "name": "Mexico Mountain Water Decaf",
          "slug": "mexico-mountain-water-decaf",
          "subtitle": "Mexico decaf from Small Batch Roasting.",
          "description": "Mexico Mountain Water Decaf is a traceable single-estate decaf coffee from Veracruz, Mexico, processed using the Mountain Water Process to preserve flavour. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Mexico",
          "shopCategorySlug": "decaf",
          "roastLevel": "Decaf",
          "heroImagePath": "https://i0.wp.com/www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/afd28f_a0eb6e83648b493488fde9adb5d3423dmv2-scaled.jpg?fit=600%2C800&ssl=1",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/mexico/mexico-mountain-water-decaf/"
      },
      {
          "id": "coffee-nicaragua-shg-ep",
          "name": "Nicaragua SHG EP",
          "slug": "nicaragua-shg-ep",
          "subtitle": "Nicaragua specialty from Small Batch Roasting.",
          "description": "High-grown SHG green coffee from Matagalpa, Nicaragua, produced by smallholder members of Cooperativa Agropecuaria Multisectorial Sagrada Familia R.L. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "And delicate acidity"
          ],
          "originType": "Nicaragua",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2026/04/Nicaragua-washed-min-scaled-1-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/nicaragua/nicaragua-shg/"
      },
      {
          "id": "coffee-peru-g1-finca-mesapata-women-farmed-double-certified",
          "name": "Peru G1 Finca Mesapata – Women Farmed Double Certified.",
          "slug": "peru-g1-finca-mesapata-women-farmed-double-certified",
          "subtitle": "Peru specialty from Small Batch Roasting.",
          "description": "Download Info Sheet Discover the exceptional Peruvian coffee from Finca Mesapata, owned by Gregoria Miranda Huaman. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Peru",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_e4867605fa1a4f0a9b587a9906b54464mv2.png",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/peru/peru-g1-finca-mesapata-women-farmed-double-certified/"
      },
      {
          "id": "coffee-peru-g1-gonzilla-estate-g1-organic",
          "name": "Peru G1 Gonzilla Estate G1 Organic",
          "slug": "peru-g1-gonzilla-estate-g1-organic",
          "subtitle": "Peru organic from Small Batch Roasting.",
          "description": "Speciality-grade Arabica green coffee from Peru’s Andes Mountain Range. Typica variety, Grade 1, Organic and Fairtrade certified, wet processed for a clean, creamy cup. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Specialty coffee",
              "Supplier selected",
              "Roasted to order"
          ],
          "originType": "Peru",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Organic",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_de90dfaffe054554b9bdfb53deb5f3fbmv2.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/peru-g1-gonzilla-estate-g1-organic/"
      },
      {
          "id": "coffee-sumatra-mandheling-tekengon-triple-picked",
          "name": "Sumatra Mandheling Tekengon Triple Picked",
          "slug": "sumatra-mandheling-tekengon-triple-picked",
          "subtitle": "Sumatra specialty from Small Batch Roasting.",
          "description": "Indonesian Arabica green coffee from Mandheling, Sumatra, processed using Giling Basah (wet-hulled) and triple-picked for a more consistent cup. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Molasses",
              "Bitter chocolate",
              "Tropical fruit",
              "Brown sugar",
              "Liquorice"
          ],
          "originType": "Sumatra",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Specialty",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/08/f46ad1_c9b9f84b845e4dd4aa72c1f14c8355camv2.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/indonesia/sumatra-mandheling-tekengon-triple-picked/"
      },
      {
          "id": "coffee-uganda-mt-elgon-arabica-aa",
          "name": "Uganda Mt Elgon Arabica AA",
          "slug": "uganda-mt-elgon-arabica-aa",
          "subtitle": "Uganda arabica from Small Batch Roasting.",
          "description": "Washed Arabica from the volcanic slopes of Mt Elgon near Mbale, Uganda. High-altitude coffee (about 1700–2200 masl) with mild floral and citrusy notes, strawberry-jam sweetness, bright acidity and a clean aftertaste. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Mild floral",
              "Citrusy notes",
              "Strawberry-jam sweetness",
              "Bright acidity",
              "A clean aftertaste"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Arabica",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/10/Screenshot-2024-10-24-112720.png",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/uganda/uganda-mt-elgon/"
      },
      {
          "id": "coffee-uganda-mubuku-drugar-fully-washed",
          "name": "Uganda Mubuku drugar fully washed",
          "slug": "uganda-mubuku-drugar-fully-washed",
          "subtitle": "Uganda fully washed from Small Batch Roasting.",
          "description": "Fully washed Ugandan coffee from Kasese in Western Uganda, sourced from smallholder farmers delivering to Mubuku Washing Station. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Molasses",
              "Spiced rum",
              "Cherry"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Fully Washed",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_1cfbc7fcd7a64acd94931979e5a07e9cmv2-scaled.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/uganda/uganda-mubuku-drugar-fully-washed/"
      },
      {
          "id": "coffee-ugandan-robusta-scr-18-direct-trade",
          "name": "Ugandan Robusta Scr 18 – Direct Trade",
          "slug": "ugandan-robusta-scr-18-direct-trade",
          "subtitle": "Uganda robusta from Small Batch Roasting.",
          "description": "High quality Screen 18, fully washed Robusta coffee from Uganda with tasting notes that lean towards black tea, cola and spice. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Black tea",
              "Cola",
              "Spice"
          ],
          "originType": "Uganda",
          "shopCategorySlug": "dark-roast",
          "roastLevel": "Robusta",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_efd72c5aec20490caf2c4f39d050cdeemv2.jpeg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/ugandan-robusta-scr-18/"
      },
      {
          "id": "coffee-ugandan-rwenzori-byaruhanga-farm-robusta-scr-14",
          "name": "Ugandan Rwenzori – Byaruhanga Farm Robusta Scr 14+",
          "slug": "ugandan-rwenzori-byaruhanga-farm-robusta-scr-14",
          "subtitle": "Specialty robusta from Small Batch Roasting.",
          "description": "Naturally sun-dried Ugandan Robusta from Byaruhanga Farm near Fort Portal in the Rwenzori foothills (1,200–1,500 masl). Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "A rich body",
              "Clean finish"
          ],
          "originType": "Specialty",
          "shopCategorySlug": "blends",
          "roastLevel": "Robusta",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2025/07/Byaruhanga.webp",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/uganda/ugandan-rwenzori-byaruhanga-farm-robusta-scr-14/"
      },
      {
          "id": "coffee-vietnam-robusta-wet-polish-scr18-rfa",
          "name": "Vietnam Robusta Wet Polish Scr18 RFA",
          "slug": "vietnam-robusta-wet-polish-scr18-rfa",
          "subtitle": "Vietnam robusta from Small Batch Roasting.",
          "description": "Wet-polished Robusta from Vietnam’s Central Highlands (Daklak Province), screened Scr16–18. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "And citrus buzz",
              "A long finish"
          ],
          "originType": "Vietnam",
          "shopCategorySlug": "dark-roast",
          "roastLevel": "Robusta",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/afd28f_83479152e06c42e48e5c676bc52ade40mv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/all-products/vietnam-robusta-wet-polish-scr18-rfa/"
      },
      {
          "id": "coffee-vietnam-son-la-g1-arabica",
          "name": "Vietnam Son La G1 Arabica",
          "slug": "vietnam-son-la-g1-arabica",
          "subtitle": "Vietnam arabica from Small Batch Roasting.",
          "description": "Vietnamese Arabica from various estates in Vietnam, Typica variety, Screen 16 grade. Supplied by Small Batch Roasting.",
          "tastingNotes": [
              "Clove",
              "Nutmeg notes",
              "Low acidity",
              "A smoky aroma"
          ],
          "originType": "Vietnam",
          "shopCategorySlug": "single-origin",
          "roastLevel": "Arabica",
          "heroImagePath": "https://www.smallbatchroasting.co.uk/wp-content/uploads/2024/09/f46ad1_3c4b4135f46a4154bcc1024ec9457e5bmv2.jpg",
          "sourceName": "Small Batch Roasting",
          "sourceUrl": "https://www.smallbatchroasting.co.uk/origin/vietnam/vietnam-son-la-g1-arabica/"
      }
  ],
  bags: [
    {
      id: "bag-kraft",
      name: "Kraft",
      slug: "kraft",
      colour: "#b88752",
      finish: "Natural paper",
      mockupAssetPath: "/mockups/bag-kraft.svg",
    },
    {
      id: "bag-matte-black",
      name: "Matte Black",
      slug: "matte-black",
      colour: "#111111",
      finish: "Soft-touch matte",
      mockupAssetPath: "/mockups/bag-black.svg",
    },
    {
      id: "bag-matte-white",
      name: "Matte White",
      slug: "matte-white",
      colour: "#f7f2e8",
      finish: "Smooth matte",
      mockupAssetPath: "/mockups/bag-white.svg",
    },
  ],
  sizes: [
    { id: "size-250g", label: "250g", slug: "250g", grams: 250 },
    { id: "size-500g", label: "500g", slug: "500g", grams: 500 },
    { id: "size-1kg", label: "1kg", slug: "1kg", grams: 1000 },
  ],
  labels: [
    {
      id: "label-rectangle",
      name: "Tall Rectangle",
      slug: "rectangle",
      shape: "rectangle",
      widthMm: "80.00",
      heightMm: "120.00",
      safeArea: { top: 4, right: 4, bottom: 4, left: 4 },
      mockupPlacement: { x: 31, y: 34, width: 38, height: 34, radius: 4 },
    },
    {
      id: "label-square",
      name: "Square",
      slug: "square",
      shape: "square",
      widthMm: "85.00",
      heightMm: "85.00",
      safeArea: { top: 4, right: 4, bottom: 4, left: 4 },
      mockupPlacement: { x: 31, y: 38, width: 38, height: 28, radius: 4 },
    },
    {
      id: "label-circle",
      name: "Circle",
      slug: "circle",
      shape: "circle",
      widthMm: "85.00",
      heightMm: "85.00",
      safeArea: { top: 6, right: 6, bottom: 6, left: 6 },
      mockupPlacement: { x: 32, y: 38, width: 36, height: 28, radius: 999 },
    },
    {
      id: "label-oval",
      name: "Oval",
      slug: "oval",
      shape: "oval",
      widthMm: "100.00",
      heightMm: "70.00",
      safeArea: { top: 5, right: 6, bottom: 5, left: 6 },
      mockupPlacement: { x: 29, y: 40, width: 42, height: 24, radius: 999 },
    },
  ],
  grinds: [
    {
      id: "grind-whole-bean",
      name: "Whole Bean",
      slug: "whole-bean",
      description: "Best for businesses grinding fresh for each brew method.",
    },
    {
      id: "grind-espresso",
      name: "Espresso",
      slug: "espresso",
      description: "Fine grind for traditional espresso machines.",
    },
    {
      id: "grind-filter",
      name: "Filter",
      slug: "filter",
      description: "Medium grind for batch brew, pour-over, and filter service.",
    },
    {
      id: "grind-cafetiere",
      name: "Cafetiere",
      slug: "cafetiere",
      description: "Coarse grind for immersion brewing.",
    },
  ],
  prices: [],
};

fallbackCatalogue.prices = fallbackCatalogue.coffees.flatMap((coffee) => {
  const size250g = fallbackCatalogue.sizes.find((size) => size.slug === "250g");
  const size1kg = fallbackCatalogue.sizes.find((size) => size.slug === "1kg");
  const unit1kg = catalogueUnitPriceByCoffeeId[coffee.id] ?? 0;

  return fallbackCatalogue.bags.flatMap((bag) => {
    const prices: ProductPrice[] = [];

    if (size250g) {
      prices.push({
        id: `price-${coffee.slug}-${bag.slug}-250g-24`,
        coffeeProductId: coffee.id,
        bagOptionId: bag.id,
        bagSizeId: size250g.id,
        minQuantity: 24,
        unitAmountPence: Math.round(unit1kg / 4),
        setupFeePence: 0,
        currency: "gbp",
      });
    }

    if (size1kg) {
      prices.push({
        id: `price-${coffee.slug}-${bag.slug}-1kg-6`,
        coffeeProductId: coffee.id,
        bagOptionId: bag.id,
        bagSizeId: size1kg.id,
        minQuantity: 6,
        unitAmountPence: unit1kg,
        setupFeePence: 0,
        currency: "gbp",
      });
    }

    return prices;
  });
});

export function formatMoney(pence: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(pence / 100);
}
