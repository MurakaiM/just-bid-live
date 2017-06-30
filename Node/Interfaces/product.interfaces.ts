interface ShipmentItem {
    country : string,
    cost : number
}

interface ProductShipment{
 [index: string]: ShipmentItem;
}


interface TypeItem {
    value : string,
    title : string,
    image? : string
}

interface ProductTypes{
    [index: string]: TypeItem;
}

interface ProductCategories{
    [index: string]: string; //Categories levels from first to last 
}


interface ProductInterface{
    prUid?: string,
    prTitle : string,
    prSeller : string,
    prDescription : string,
    prCost : number,
    prSold? : number,
    prWishes? : number,    
    prTypes : ProductTypes,
    prShipment : ProductShipment,
    prCategory : ProductCategories
} 




export default ProductInterface;