import * as uuid from 'uuid/v4'

import TimeModule from '../Utils/Others/time'

import {
    ProductSchema,
    OrderSchema
} from '../Database/database.controller'
import {
    IncomingOrder
} from '../Interfaces/order.interfaces'

import User from './user.model'


export default class Order {
    private dbOrder: any;
    private uuid: string;

    constructor(uuid ? : string) {
        if (uuid) {
            this.uuid = uuid;
        }
    }


    public ForceLoad(dbOrder: any): Order {
        this.dbOrder = dbOrder;
        return this;
    }

    public static Create(user: User, data: IncomingOrder): Promise <any> {
        return new Promise((resolve, reject) => {
            ProductSchema.findOne({
                    where: {
                        prUid: data.product
                    }
                }).then(product => {
                    if(product.inStock < 0)
                        return reject("Empty stock for product")

                    if(!this.checkType(product.prTypes, data.type))
                        return reject("Invalid types of incoming order");

                    product.inStock = product.inStock -1;                
                    return product.save()
                })
                .then( product => {
                    let order = OrderSchema.build({
                        orderId: uuid(),
                        customerId: user.Data.uuid,
                        productId: product.prUid,
                        sellerId: product.prSeller,
                        productQuantity: data.product,
                        productType: data.type,
                        productTrack: "No track available for now",
                        status: "Waiting for review",
                        customerAddress: data.address
                    });
                    return order.save()
                })
                .then(order => resolve( new Order().ForceLoad(order) ))
                .catch(error => reject(error));
        });
    }


    public static UpdateStatus(user: User, orderId: string, status: string): Promise < any > {
        return new Promise((resolve, reject) => {
            
            OrderSchema.findOne({
                where: {
                    sellerId: user.Data.uid,
                    orderId : orderId
                }
            })
            .then( order => {
                if(!order){
                    return reject("No such order");
                }
                order.status = status;
                return order.save();
            })
            .then( order => resolve("Successfully updated"))
            .catch( error => reject(error));

        });
    }

    public static UpdateTrack( user : User, orderId : string, track : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            
            OrderSchema.findOne({
                where: {
                    sellerId: user.Data.uid,
                    orderId : orderId
                }
            })
            .then( order => {
                if(!order){
                    return reject("No such order");
                }
                order.productTrack = track;
                return order.save();
            })
            .then( order => resolve("Successfully updated"))
            .catch( error => reject(error));

        });
    }

    public static FinishOrder( user : User, orderId : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            
            OrderSchema.findOne({
                where: {
                    customerId: user.Data.uid,
                    orderId : orderId
                }
            })
            .then( order => {
                if(!order){
                    return reject("No such order");
                }
                order.isFinished = true;
                return order.save();
            })
            .then( order => resolve("Successfully updated"))
            .catch( error => reject(error));

        });
    }


    public static CurrentCustomers( user : User) : Promise<any>{
        return user.Data.getOrders({
            order : [ ['createdAt'] ],
            where : { isFinished : false },
            include: [ ProductSchema ]
        });
    }

    public static CurrentSeller( user : User) : Promise<any>{
        return user.Data.getSellings({
            order : [ ['createdAt'] ],
            where : { isFinished : false },
            include: [ ProductSchema ]
        });
    }

    public static HistoryCustomers( user : User ) : Promise<any>{
        return user.Data.getOrders({
            order : [ ['createdAt'] ],
            where : { isFinished : false },
            include: [ ProductSchema ]
        });
    } 

    public static HistorySeller( user : User) : Promise<any>{
        return user.Data.getSellings({
            order : [ ['createdAt'] ],
            where : { isFinished : false },
            include: [ ProductSchema ]
        });
    }


    private static checkType( types : any , incoming : any ){
        let checked = true;

        Object.keys(incoming).forEach( key => {
            if( !types[key][incoming[key]] ) 
                checked =  false

            if( types[key][incoming[key]].disabled)
                checked = false;

        });
        
        return checked;
    }

}

