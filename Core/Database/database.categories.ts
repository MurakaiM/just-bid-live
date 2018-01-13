import * as _ from 'lodash'

import { RESOURCES_PATH } from '../keys'

interface CategorySQL{
  name: string,
  parent?: string,
  id : string,
  imageUrl?: string
}


const forWomens = [
  {
      name : "Hot Categories",
      url : "1",
      subnames : [
        { name : 'Dresses', url : '1'},
        { name : 'Blouses & Shirts', url : '2'},
        { name : 'T-Shirts', url : '3'},
        { name : 'Jumpsuits', url : '4'},
        { name : 'Socks', url : '5'},
        { name : 'Rompers', url : '6'}
      ]
  },
  {
      name : "Bottoms",
      url : "2",
      subnames : [
        { name : 'Skirts', url : '1'},
        { name : 'Shorts', url : '2'},
        { name : 'Leggings', url : '3'},
        { name : 'Jeans', url : '4'},
        { name : 'Pants & Capris', url : '5'},
        { name : 'Wide Leg Pants', url : '6'}
      ]
  },
  {
      name : "Intimates & Sleepwear",
      url : "/url.....",
      subnames : [
        { name : 'Bras', url : ''},
        { name : 'Bra & Brief Sets', url : ''},
        { name : 'Bustiers & Corsets', url : ''},
        { name : 'Panties', url : ''},
        { name : 'Nightgowns & Sleepshirts', url : ''},
        { name : 'Pajama Sets', url : ''}
      ]
  },
  {
      name : "Outwear & Jackets",
      url : "/url.....",
      subnames : [
        { name : 'Blazers', url : ''},
        { name : 'Basic Jackets', url : ''},
        { name : 'Trench', url : ''},
        { name : 'Leather & Suede', url : ''},
        { name : 'Parkas', url : ''},
        { name : 'Down Coats', url : ''}
      ]
  },
  {
      name : "Weddings & Events",
      url : "/url.....",
      subnames : [
        { name : 'Wedding Dresses', url : ''},
        { name : 'Evening Dresses', url : ''},
        { name : 'Prom Dresses', url : ''},
        { name : 'Bridesmaid Dresses', url : ''},
        { name : 'Flower Girl Dresses', url : ''},
        { name : 'Cocktail Dresses', url : ''}
      ]
  },
  {
      name : "Accessories",
      url : "/url.....",
      subnames : [
        { name : 'Sunglasses', url : ''},
        { name : 'Headwear', url : ''},
        { name : 'Baseball Caps', url : ''},
        { name : 'Scarves & Wraps', url : ''},
        { name : 'Belts', url : ''},
        { name : 'Skullies & Beanies', url : ''}
      ]
  },
]

const forMens = [
  {
    name : "Hot Sale",
    url : "/url.....",
    subnames : [ 
      { name : 'T-Shirts', url : ''},
      { name : 'Tank Tops', url : ''},
      { name : 'Polo', url : ''},
      { name : ' Board Shorts', url : ''},
      { name : 'Shirts', url : ''},
      { name : 'Hoodies & Sweatshirts', url : ''}
    ]            
  },
  {
    name : "Bottoms",
    url : "/url.....",
    subnames : [ 
      { name : 'Casual Pants', url : ''},
      { name : 'Cargo Pants', url : ''},
      { name : 'Jeans', url : ''},
      { name : 'Sweatpants', url : ''},
      { name : 'Harem Pants', url : ''},
      { name : 'Shorts', url : ''}
    ]            
  },
  {
    name : "Outerwear & Jackets",
    url : "/url.....",
    subnames : [ 
      { name : 'Jackets', url : ''},
      { name : 'Genuine Leather', url : ''},
      { name : 'Trench', url : ''},
      { name : 'Parkas', url : ''},
      { name : 'Sweaters', url : ''},
      { name : 'Suits & Blazer', url : ''}
    ]            
  },
  {
    name : "Underwear & Loungewear",
    url : "/url.....",
    subnames : [ 
      { name : 'Boxers', url : ''},
      { name : 'Briefs', url : ''},
      { name : `Men's Sleep & Lounge`, url : ''},
      { name : 'Pajama Sets', url : ''},
      { name : 'Robes', url : ''},
      { name : 'Socks', url : ''}
    ]            
  },
  {
    name : "Accessories",
    url : "/url.....",
    subnames : [ 
      { name : 'Eyewear Frames', url : ''},
      { name : 'Baseball Caps', url : ''},
      { name : 'Scarves', url : ''},
      { name : 'Belts & Cummerbunds', url : ''},
      { name : 'Ties & Handkerchiefs', url : ''},
      { name : 'Skullies & Beanies', url : ''}
    ]            
  },
  {
    name : "Sunglasses",
    url : "/url.....",
    subnames : [ 
      { name : 'Pilot', url : ''},
      { name : 'Sunglasses', url : ''},
      { name : 'Square', url : ''},
      { name : 'Round', url : ''},
      { name : 'Oval', url : ''}
    ]            
  },
]

const forWatches = [
  {
    name : "Fine Jewelry",
    url : "/url.....",
    subnames : [ 
      { name : '925 Silver Jewelry', url : ''},
      { name : 'Diamond Jewelry', url : ''},
      { name : 'Pearls Jewelry', url : ''},
      { name : 'Various Gemstones', url : ''},
      { name : 'K-Gold', url : ''},
      { name : 'Fine Earrings', url : ''},
      { name : `Fine Jewelry Sets`, url : ''},
      { name : `Men's Fine Jewelry`, url : ''}
    ]            
  },
  {
    name : "Wedding & Engagement",
    url : "/url.....",
    subnames : [ 
      { name : 'Bridal Jewelry Sets', url : ''},
      { name : 'Engagement Rings', url : ''},
      { name : 'Wedding Hair Jewelry', url : ''}   
    ]            
  },
  {
    name : "Men's Watches",
    url : "/url.....",
    subnames : [ 
      { name : 'Mechanical Watches', url : ''},
      { name : 'Quartz Watches', url : ''},
      { name : 'Digital Watches', url : ''},
      { name : 'Dual Display Watches', url : ''},
      { name : 'Sports Watches', url : ''}
    ]            
  },
  {
    name : "Women's Watches",
    url : "/url.....",
    subnames : [ 
      { name : 'Sports Watches', url : ''},
      { name : `Women's Bracelet Watches`, url : ''},
      { name : 'Dress Watches', url : ''},
      { name : `Lovers' Watches`, url : ''},
      { name : `Children's Watches`, url : ''},
      { name : `Creative Watches`, url : ''}
    ]            
  },
  {
    name : "Fashion Jewelry",
    url : "/url.....",
    subnames : [ 
      { name : 'Necklaces & Pendants', url : ''},
      { name : 'Hot Rings', url : ''},
      { name : 'Trendy Earrings', url : ''},
      { name : 'Bracelets & Bangles', url : ''},
      { name : `Men's Cuff Links`, url : ''},
      { name : 'Fashion Jewelry Sets', url : ''},
      { name : 'Charms', url : ''},
      { name : 'Body Jewelry', url : ''}
    ]            
  },
  {
    name : "Beads & DIY Jewelry",
    url : "/url.....",
    subnames : [ 
      { name : 'Beads', url : ''},
      { name : 'Jewelry Findings & Components', url : ''},
      { name : 'Jewelry Packaging & Display', url : ''}  
    ]            
  }
]

const forBags = [
  {
    name : "Women's Luggage & Bags",
    url : "/url.....",
    subnames : [ 
      { name : 'Shoulder Bags', url : ''},
      { name : 'Top-Handle Bags', url : ''},
      { name : 'Crossbody Bags', url : ''},
      { name : 'Wallets', url : ''},
      { name : 'Backpacks', url : ''},
      { name : 'Clutches', url : ''},
      { name : 'Coin Purses & Holders', url : ''}
    ]            
  },
  {
    name : "Women's Shoes",
    url : "/url.....",
    subnames : [ 
      { name : 'Sandals', url : ''},
      { name : 'Slippers', url : ''},
      { name : 'Flats', url : ''},
      { name : 'Pumps', url : ''},
      { name : 'Boots', url : ''},
      { name : 'Vulcanize Shoes', url : ''}
    ]            
  },
  {
    name : "Men's Luggage & Bags",
    url : "/url.....",
    subnames : [ 
      { name : 'Men’s Crossbody', url : ''},
      { name : 'Bags', url : ''},
      { name : 'Men’s Backpacks', url : ''},
      { name : 'Men’s Wallets', url : ''},
      { name : 'Luggage & Travel', url : ''},
      { name : 'Bags', url : ''}
    ]            
  },
  {
    name : "Men's Shoes",
    url : "/url.....",
    subnames : [ 
      { name : 'Sandals', url : ''},
      { name : 'Slippers', url : ''},
      { name : 'Casual Shoes', url : ''},
      { name : 'Formal Shoes', url : ''},
      { name : 'Boots', url : ''},
      { name : 'Vulcanize Shoes', url : ''}
    ]            
  },
  {
    name : "Bestselling bags",
    url : "/url.....",
    subnames : [ 
      { name : 'Shoulder Bag with Solid Color', url : ''},
      { name : 'Day Clutches', url : ''},
      { name : 'Fashion Backpacks', url : ''},
      { name : 'Kids & Baby Bags', url : ''}
    ]            
  },
  {
    name : "Bestselling Shoes",
    url : "/url.....",
    subnames : [ 
      { name : 'Wedges Pumps', url : ''},
      { name : 'Slingback Pumps', url : ''},
      { name : 'Cross-Strap Sandals', url : ''},
      { name : `Men's Loafers`, url : ''},
      { name : `Men's Flip Flops`, url : ''},
      { name : `Women's Flip Flops`, url : ''},
      { name : 'Mules', url : ''}
    ]            
  },
]

const forHealth = [
  {
    name : "Hair & Accessories",
    url : "/url.....",
    subnames : [ 
      { name : 'Human Hair', url : ''},
      { name : 'Fusion Hair Extensions', url : ''},
      { name : 'Clip-in Hair Extensions', url : ''},
      { name : 'Colored Hair Extensions', url : ''},
      { name : 'Hair Weaves with Closures', url : ''}
    ]            
  },
  {
    name : "Synthetic & Blended Hair",
    url : "/url.....",
    subnames : [ 
      { name : 'Synthetic Hair Extensions', url : ''},
      { name : 'Synthetic Wigs', url : ''},
      { name : 'Synthetic Clip in Hair', url : ''},
      { name : 'Braiding Hair Extensions', url : ''},
      { name : 'Cosplay Wigs', url : ''},
      { name : 'Skin Weft Hair Extensions', url : ''}
    ]            
  },
  {
    name : "Makeup",
    url : "/url.....",
    subnames : [ 
      { name : 'Beauty Essentials', url : ''},
      { name : 'Makeup Set', url : ''},
      { name : 'Makeup Brushes', url : ''},
      { name : 'Eyeshadow', url : ''},
      { name : 'Lipstick', url : ''},
      { name : 'False Eyelashes', url : ''}
    ]            
  },
  {
    name : "Nail Art & Tools",
    url : "/url.....",
    subnames : [ 
      { name : 'Nail Art Kits', url : ''},
      { name : 'Nail Gel', url : ''},
      { name : 'Nail Dryers', url : ''},
      { name : 'Nail Glitters', url : ''},
      { name : 'Stickers & Decals', url : ''},
      { name : 'Nail Decorations', url : ''}
    ]            
  },
  {
    name : "Beauty Tools",
    url : "/url.....",
    subnames : [ 
      { name : 'Curling Iron', url : ''},
      { name : 'Straightening Irons', url : ''},
      { name : 'Electric Face Cleanser', url : ''},
      { name : 'Facial Steamer', url : ''},
      { name : 'Face Skin Care Tools', url : ''},
      { name : 'Massage & Relaxation', url : ''}
    ]            
  },
  {
    name : "Skin care",
    url : "/url.....",
    subnames : [ 
      { name : 'Essential Oil', url : ''},
      { name : 'Face Mask', url : ''},
      { name : 'Facial Care', url : ''},
      { name : 'Sun care', url : ''},
      { name : 'Body Care', url : ''},
      { name : 'Razor', url : ''}
    ]            
  },
]

const categoriesPopups = {
    popups : [
      {
        id : 'women_clothing',
        name : "Women's Clothing",
        url : "wm",
        image : RESOURCES_PATH+"/u.assets/img/LinearIcons/dress.png",
        subcategories : forWomens
      },
      {
        id : 'men_clothing',
        image : RESOURCES_PATH+"/u.assets/img/LinearIcons/polo.png",
        name :  "Men's Clothing",
        url : "mn",
        subcategories : forMens
      },
      {
        id : 'watches',
        name :  "Jewelry & Watches",
        url : "wt",
        image : RESOURCES_PATH+"/u.assets/img/LinearIcons/watch.png",
        subcategories : forWatches
      },
      {
        id : 'bags',
        name :  "Bags & Shoes",
        url : "bg",
        image : RESOURCES_PATH+"/u.assets/img/LinearIcons/hand-bag.png",
        subcategories : forBags
      },
      {
        id : 'health',
        url : "hl",
        name :  "Health & Beauty, Hair",
        image : RESOURCES_PATH+"/u.assets/img/LinearIcons/purse.png",
        subcategories : forHealth
      },
      {
        id : 'phone',
        url : "ph",
        name :  "Phones & Accessories",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/smartphone.png",
        subcategories : []
      },
      {
        id : 'electronics',
        url : "el",
        name :  "Consumer Electronics",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/quality.png",
        subcategories : []
      },
      {
        id : 'office',
        url : "of",
        name :  "Computer & Office",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/monitor.png",
        subcategories : []
      },
      {
        id : 'house',
        url : "hs",
        name :  "Home & Garden, Furniture",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/house.png",
        subcategories : []
      },
      {
        id : 'toys',
        url : "ts",
        name :  "Toys, Kids & Baby",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/robot.png",
        subcategories : []
      },
      {
        id : 'tent',
        url : "tn",
        name :  "Sports & Outdoors",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/tent.png",
        subcategories : []
      },
      {
        id : 'car',
        url : "cr",
        name :  "Automobiles & Motorcycles",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/car.png",
        subcategories : []
      },
      {
        id : 'imporvments',
        url : "hi",
        name :  "Home Improvements",
        image : RESOURCES_PATH+"/u.assets/img/OtherIcons/drawing.png",
        subcategories : []
      }
    ]
};

export default categoriesPopups;


function transpiler(categories : any){
  var readyResult = {};
  categories.forEach( (element,i) => {
        if(element.subcategories && element.subcategories.length > 0){
            element.subcategories.forEach( (subelement,j) => {              
              if(subelement.subnames && subelement.subnames.length > 0){                
                  subelement.subnames.forEach((subname,l) => {
                    readyResult[element.url+"_"+j+"_"+l] = { 
                      name : subname.name, 
                      category : element.name,
                      parent: element.url+"_"+j
                    }; 
                  });
              }
               
              readyResult[element.url+"_"+j]  = { 
                name : subelement.name, 
                category : element.name,
                parent : element.url
              };               
            }); 
        }
          
        readyResult[element.url]  = { name : element.name, category : element.name};
        
  });
  return readyResult;
}

function sqlTranspiler(categories: any){
  let bulkArray: CategorySQL[] = [];  

  categories.forEach( (element,i) => {
    if(element.subcategories && element.subcategories.length > 0){
        element.subcategories.forEach( (subelement,j) => {              
          if(subelement.subnames && subelement.subnames.length > 0){                
              subelement.subnames.forEach((subname,l) => {
                bulkArray.push({ 
                  name : subname.name, 
                  id : `${element.url}_${j}_${l}`,
                  parent: `${element.url}_${j}`
                })             
              });
          }
            
          bulkArray.push({ 
            name : subelement.name, 
            id : `${element.url}_${j}`,
            parent: `${element.url}`
          })
        }); 
    }

    bulkArray.push({ 
      name : element.name, 
      id : `${element.url}`,
      imageUrl : element.image
    })     
  });

  return bulkArray;
}

function testerTranspiler( compiled : any){
   let result = {};
   Object.keys(compiled).forEach( key  => result[compiled[key].name] = key );
   return result;
}

export const compiled = transpiler(categoriesPopups.popups);
export const compiledSql = sqlTranspiler(categoriesPopups.popups);
export const compiledTester = testerTranspiler(compiled);


export function collectCategory(id: string){
  let category = compiled[id];
  return category.parent ? [{ id, ...category }].concat(collectCategory(category.parent)) : [{ id, ...category }];
}

export function validateCategory(name: string): boolean{ 
  return (compiledTester[name] !== undefined)   
}




/* Fees part */
export const Fees = {
  standard : {
    fee : 200,
    begin : 200,
    goes : {
      by : 100,
      type : "dollar"
    },
    type : "dollar",
    explanation : "Bids Begin at $2 and bids goes up at $1 at a time",
    appearance : "No Color Border"
  },
  featured : {
    fee : 300,
    begin : 300,
    goes : {
      by : 100,
      type : "dollar"
    },
    type : "dollar",
    explanation : "Bids Begin at $3 and bids goes up at $1 at a time",
    appearance : "Purple Color Border"
  },
  small : {
    fee : 5,
    begin : 100,
    goes : {
      by : 20,
      type : "per"
    },
    type : "per",
    explanation : "Bids Begin at $1 and bids goes up at 20% at a time",
    appearance : "Orange Color Border"
  },
  big : {    
    fee : 10,
    begin : 100,
    goes : {
      by : 50,
      type : "per"
    },
    type : "per",
    explanation : "Bids Begin at $1 and bids goes up at 50% at a time",
    appearance : "Pink Color Border"
  },
  reserved : {
    fee : 15,
    begin : "custom",
    goes : {
      by : 100,
      type : "dollar"
    },
    type : "per",
    explanation : "Bids Begin at selected price and bids goes up at 15% at a time",
    appearance : "Red Color Border"
  }
}

export function validateFee( name : string) : boolean{
  return (Fees[name] !== undefined)
}

export function getFee( name : string) : any{
  return Fees[name];
}

function calcFee( amount : number, name : string) : number{
  let feeType = getFee(name);
  /**
   * For wrong fee we collect 1$ as standart
   */
  if(!feeType){
    return 100 
  }

  if(feeType.type == 'dollar'){
    return feeType.fee;
  }else{
    return (amount * feeType.fee)/100
  }
}

export function getWinningFee(winning : any){
  return calcFee(winning.lastBid, winning.auction.uidFee)  
}

/* Deprecated mapper */
export const mapper = {
  'Women': 'wm',
  'Women\'s Dresses': 'wm_0_0',
  'Tees & T-Shirts': 'wm_0_2',
  'Blouses': ' ',
  'Sweaters & Cardigans': ' ',
  'Jackets & Coats': ' ',
  'Denim & Jeans': ' ',
  'Pajamas': ' ',
  'Hosiery': ' ',
  'Gloves': ' ',
  'Hats': ' ',
  'Babydolls': ' ',
  'Corset & Bustiers': ' ',
  'Men': 'mn',
  'Cardigans & Sweaters': ' ',
  'Pants': ' ',
  'Kids': ' ',
  ' Green': ' ',
  'Kids Accessories': 'ts',
  'Long sleeves': ' ',
  'Women\'s Handbags': ' ',
  'Home & Garden': ' ',
  'ROSE GOLD': ' ',
  'Womens Flats': ' ',
  'Bra sets': ' ',
  'Vintage Dresses': 'wm_0_0',
  'Print Dresses': 'wm_0_0',
  'Tote Bags': ' ',
  'Blankets & throws': ' ',
  'Long Sleeve Dresses': 'wm_0_0',
  'Bikinis': ' ',
  'Long Sleeves': ' ',
  'Casual Dresses': ' ',
  'Womens Boots': ' ',
  'One-Pieces': ' ',
  'Casual': ' ',
  'Decorative Accents': ' ',
  'Hoodies': ' ',
  'Tankinis': ' ',
  'Romper': ' ',
  'Big & Tall': ' ',
  'Necklaces': ' ',
  'T-shirts': 'wm_0_2',
  'Outerwear': ' ',
  'Athletic Shoes': ' ',
  'Sneakers': ' ',
  'Two Piece Dresses': 'wm_0_0',
  'Platform Shoes': ' ',
  'Wall Stickers': ' ',
  'Bedding Sets': ' ',
  'Pet Supplies': ' ',
  'Hair Extensions': ' ',
  'Bracelets': ' ',
  'Womens Slippers': ' ',
  'Sweatshirts & Hoodies' : ' '
};



 