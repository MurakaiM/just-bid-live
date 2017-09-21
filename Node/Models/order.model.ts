import * as uuid from 'uuid/v4'

import TimeModule from '../Utils/Others/time'

import {
    ProductSchema,
    OrderSchema,
    TypesSchema,
    Database
} from '../Database/database.controller'
import {
    IncomingOrder
} from '../Interfaces/order.interfaces'
import {
    AwaitResult
} from '../Utils/Communication/async'

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

    public static Create(user: User, data: IncomingOrder): Promise < any > {
        return new Promise(async(resolve, reject) => {
            let TR = await Database.Instance.Sequelize.transaction({ autocommit: false });

            try {
                let product = await ProductSchema.findOne({ where: { prUid: data.product }});

                if (!product)
                    return reject(`No product with id (${data.product})`);
                    

                let type = await TypesSchema.findOne({ where: { productId: product.prUid, typeId: data.type }});

                if (!type || type.inStock == 0)
                    return reject(`No type/out of stock id provided`);
                    

                let orderId = uuid();

                await OrderSchema.create({
                    orderId: orderId,
                    customerId: user.PublicData.uid,
                    productId: product.prUid,
                    sellerId: product.prSeller,
                    productType: data.type,
                    productQuantity: data.quantity,
                    customerAddress: data.address
                }, { transaction: TR });

                await type.decrement('inStock', { by: 1, transaction: TR });

                TR.commit();
                return resolve(orderId)
            } catch (error) {
                TR.rollback();
                return reject(error)
            }
        });
    }


    public static UpdateStatus(user: User, orderId: string, status: string): Promise < any > {
        return new Promise((resolve, reject) => {

            OrderSchema.findOne({
                    where: {
                        sellerId: user.Data.uid,
                        orderId: orderId
                    }
                })
                .then(order => {
                    if (!order) {
                        return reject("No such order");
                    }
                    order.status = status;
                    return order.save();
                })
                .then(order => resolve("Successfully updated"))
                .catch(error => reject(error));

        });
    }

    public static UpdateTrack(user: User, orderId: string, track: string): Promise < any > {
        return new Promise((resolve, reject) => {

            OrderSchema.findOne({
                    where: {
                        sellerId: user.Data.uid,
                        orderId: orderId
                    }
                })
                .then(order => {
                    if (!order) {
                        return reject("No such order");
                    }
                    order.productTrack = track;
                    return order.save();
                })
                .then(order => resolve("Successfully updated"))
                .catch(error => reject(error));

        });
    }

    public static FinishOrder(user: User, orderId: string): Promise < any > {
        return new Promise((resolve, reject) => {

            OrderSchema.findOne({
                    where: {
                        customerId: user.Data.uid,
                        orderId: orderId
                    }
                })
                .then(order => {
                    if (!order) {
                        return reject("No such order");
                    }
                    order.isFinished = true;
                    return order.save();
                })
                .then(order => resolve("Successfully updated"))
                .catch(error => reject(error));

        });
    }


    public static CurrentCustomers(user: User): Promise < any > {
        return user.Data.getOrders({
            order: [
                ['createdAt']
            ],
            where: {
                isFinished: false
            },
            include: [ProductSchema]
        });
    }

    public static CurrentSeller(user: User): Promise < any > {
        return user.Data.getSellings({
            order: [
                ['createdAt']
            ],
            where: {
                isFinished: false
            },
            include: [ProductSchema]
        });
    }

    public static HistoryCustomers(user: User): Promise < any > {
        return user.Data.getOrders({
            order: [
                ['createdAt']
            ],
            where: {
                isFinished: false
            },
            include: [ProductSchema]
        });
    }

    public static HistorySeller(user: User): Promise < any > {
        return user.Data.getSellings({
            order: [
                ['createdAt']
            ],
            where: {
                isFinished: false
            },
            include: [ProductSchema]
        });
    }


    private static checkType(types: any, incoming: any) {
        let checked = true;

        Object.keys(incoming).forEach(key => {
            if (!types[key][incoming[key]])
                checked = false

            if (types[key][incoming[key]].disabled)
                checked = false;

        });

        return checked;
    }

}