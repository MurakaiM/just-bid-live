import { start } from "repl";

export interface AuctionStreamData{
    id : string,
    bid : number,
    user : string,
    name : string,
    type : string,
    category : string,
    start : Date,
    end : Date //Timestamp of ending as number representation  
}

