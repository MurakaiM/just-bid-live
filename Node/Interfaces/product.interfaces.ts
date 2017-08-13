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
    disabled : false,
    image? : string
}
 
interface TypeGroup{
    [index: string]: TypeItem;
}

interface ProductTypes{
    [index : string] : TypeGroup;
}

interface ProductCategories{
    [index: string]: string; //Categories levels from first to last 
}


interface ProductInterface{
    prUid?: string,
    prTitle : string,
    prSeller? : string,
    prFull : string,
    prDescription : string,
    prCost : number,
    prTypes : any,
    prShipment : number,
    prCategory : any,
    prStock : number,
    prGuarantee : number
} 




export default ProductInterface;