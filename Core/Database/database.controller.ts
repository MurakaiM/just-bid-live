import * as  Sequelize from 'sequelize'

import Search from '../Utils/Controllers/search'

import { compiledSql } from './database.categories'
import { defineSchemas } from './database.schemas'
import { DATABASE_URL } from '../keys'


const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
}
const globalSequlize = new Sequelize(DATABASE_URL,{
  logging : false,
  dialect : 'postgres',
  operatorsAliases : operatorsAliases,
  pool: {
    max: 10,
    min: 1,
    idle: 10000
  }
});

const builded = defineSchemas(globalSequlize);

/* Aliases for future usage */
export const NotificationSchema = builded.NotificationSchema;

export const QuestionSchema = builded.QuestionSchema;
export const CategorySchema = builded.CategorySchema;

export const BillingSchema = builded.BillingSchema;
export const WinningSchema = builded.WinningSchema;
export const ProductSchema = builded.ProductSchema;
export const AuctionSchema = builded.AuctionSchema;

export const PayoutSchema = builded.PayoutSchema;
export const SellerSchema = builded.SellerSchema;

export const OrderSchema = builded.OrderSchema;
export const TypesSchema = builded.TypesSchema;

export const UserSchema = builded.UserSchema;
export const WishSchema = builded.WishSchema;


export class Database{
  public static Instance : Database;
  private sequelize; 

  public productSearch : Search;

  constructor(){
     this.sequelize = globalSequlize;

     Database.Instance = this;
    
     this.productSearch = new Search(ProductSchema, {
       sequelize : this.sequelize,
       weights : {
         prTitle : 'A',
         prDescription : 'B',
         prFull : 'C'
       }
     });
  }

  get Sequelize() : any{ 
    return this.sequelize; 
  }

  get Search() : Search {
    return this.productSearch;
  }

  public initConnection() : Promise<any> {  
     return new Promise((resolve, reject) => {
       this.sequelize.authenticate()
       .then(() => this.initSchemas().then(()=> resolve("All schemas are initialized")))
       .catch(err => console.error('Unable to connect to the database:', err));
     }); 
  }

  private async initSchemas() : Promise<any> {   
    await UserSchema.sync();
    await SellerSchema.sync();

    await ProductSchema.sync();

    await TypesSchema.sync();      
    await AuctionSchema.sync();
          
    await WinningSchema.sync();
    await OrderSchema.sync();

    await PayoutSchema.sync();
    await BillingSchema.sync();
     
    await WishSchema.sync();      
     
    await NotificationSchema.sync();
    await QuestionSchema.sync();
    await CategorySchema.sync();
    
    await this.productSearch.setUp();
  } 
}

export const initDatabase = (): Promise<any> => new Database().initConnection();
