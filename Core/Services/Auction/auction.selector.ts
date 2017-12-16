import Auction from '../../Models/auction.model'

import { AuctionSchema, Database as db } from '../../Database/database.controller'
import { Counted,PerCategory } from './auction.loader'


export function LoadStep( current : Counted ){
    return queryRunner(current)
} 

export function LoadFirst( current : Counted ){
    return queryRunner(current, true)
}



function queryRunner( current : Counted, first : boolean = false ){
    return db.Instance.Sequelize.query(queryGenerator(current,first),  { model: AuctionSchema })
}

function queryGenerator( current : Counted, first : boolean) : string {
    let sql = ``
    let keys = Object.keys(current);

    keys.forEach( (key : string, i : number) => {
        if( current[key] == PerCategory){
            return ``
        }

        sql+=queryMapper((PerCategory-current[key]),key,first)

        if(i != keys.length - 1){
            sql+='UNION ALL'
        }
    })

    return sql;
}

function queryMapper(num : number, category : string, first : boolean){
    return `(SELECT "auctions".*, "products"."prTitle", "products"."prCost" FROM "auctions"  
                LEFT JOIN "products" ON "auctions"."uidProduct" = "products"."prUid"
                WHERE "auctions"."isCompleted" = FALSE                      
                    ${first == false ? `AND "auctions"."onAuction" = FALSE` : `` }
                    AND "auctions"."uidCategory" = '${category}'
                    AND "auctions"."inStock" > 0 
                ORDER BY "auctions"."auctionStart" DESC  
                LIMIT ${num})`
}