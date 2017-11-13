import * as  Sequelize from 'sequelize'

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
};


import Search from '../Utils/Controllers/search'

import { DATABASE_URL } from '../keys'


const globalSequlize = new Sequelize(DATABASE_URL,{
  logging : false,
  dialect : 'postgres',
  operatorsAliases : operatorsAliases,
  pool: {
    max: 18,
    min: 1,
    idle: 10000
  }
});


export class Database{
   public static Instance : Database;
   private sequelize; 

   public productSearch : Search;

   constructor(connectionString){
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
     
      await this.productSearch.setUp();
    } 
}

export function initDatabase() : Promise<any>{
  var dbController : Database = new Database(DATABASE_URL);
  return dbController.initConnection();
}


/* Notification schema */
export const NotificationSchema = globalSequlize.define('notification', {
  recordId : {
    type: Sequelize.UUID,
    primaryKey : true
  },
  userId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  title : {
    type : Sequelize.STRING,
    allowNull : false
  },
  message : {
    type : Sequelize.TEXT
  },
  type : {
    type : Sequelize.STRING,
    allowNull : false,
    defaultValue : "Message"
  },
  action : {
    type : Sequelize.TEXT
  },
  isViewed : {
    type : Sequelize.BOOLEAN,
    defaultValue : false
  }
 },{
  name: 'action_index',
  fields: ['action'] 
});


/* Auction winning schema */
export const WinningSchema = globalSequlize.define('winning', {  
  winningId : {
    type : Sequelize.UUID,
    primaryKey : true
  },
  billingId : {
    type : Sequelize.UUID,
    allowNull : true
  },
  winnerId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  auctionId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  productId :{
    type : Sequelize.UUID,
    allowNull : false
  },
  sellerId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  selectedTypeId : {
    type : Sequelize.UUID,   
    allowNull : true
  },
  lastBid : {
    type : Sequelize.INTEGER,
    defaultValue : 0,
    allowNull : false
  },
  productTrack : {
    type : Sequelize.STRING,
    allowNull : true
  },  
  status : {
    type : Sequelize.STRING,
    defaultValue : 'New'
  },
  customerInformation : {
    type : Sequelize.JSON,
    allowNull : true
  },
  isFinished : {
    type : Sequelize.BOOLEAN,
    defaultValue : false
  }
})

/* Product schema */
export const ProductSchema = globalSequlize.define('product', {
    prUid : {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true
    }, 
    prTitle : {
     type : Sequelize.STRING,
     allowNull : false
    },
    prDescription : {
      type : Sequelize.TEXT,
      allowNull : false
    },
    prFull : {
      type : Sequelize.TEXT,
      allowNull : false
    },
    prCost : {
      type : Sequelize.FLOAT,
      allowNull : false
    },
    prRating : {
      type : Sequelize.DOUBLE,
      allowNull : true
    },
    prSold : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prWishes : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prLikes : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prViews : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prMaterial : {
      type : Sequelize.STRING,
      defaultValue : "Undefined",
      allowNull : false
    },
    prCategory : {
      type : Sequelize.STRING,
      allowNull : false
    },  
    prGuarantee : {
      type : Sequelize.INTEGER,
      defaultValue : 12
    },
    prShipment : {
      type : Sequelize.FLOAT                        
    },
    prDelivery : {
      type : Sequelize.INTEGER,
      defaultValue  : 0
    },
    prDiscount : {
      type : 'SMALLINT',
      allowNull : true
    },
    prSeller : { 
      type : Sequelize.UUID,
      allowNull : false
    }, 
    prAllowed : {
      type : Sequelize.BOOLEAN      
    },
    prTypes : {
      type : Sequelize.JSON  
    },    
    prDisabled : {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    }    
});

/* Category schema */
export const CategorySchema = globalSequlize.define('category', {
    id : {
      type : Sequelize.STRING(15),
      primaryKey : true
    },
    level : {
      type : Sequelize.STRING(1),
      allowNull : false
    },
    name : {
      type : Sequelize.STRING,
      allowNull : false
    },
    imageUrl : {
      type : Sequelize.STRING(15)
    }

});

/* Type's schema */
export const TypesSchema = globalSequlize.define('type', {
  typeUid :{
    type : Sequelize.UUID,
    primaryKey : true
  },
  productId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  typeId : {
    type : Sequelize.STRING,
    allowNull : false
  },
  sellerId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  title : {
    type  : Sequelize.STRING,
    allowNull : false 
  },
  inStock : {
    type : Sequelize.INTEGER,
    defaultValue : 0
  }
 },{
  indexes: [{
      name: 'stock_index',
      method: 'BTREE',
      fields: ['productId']
  }]
});


/* User schema */
export const UserSchema = globalSequlize.define('user', {
    uid: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    phone : {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    country : { 
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    provider  : {
      type : Sequelize.STRING(15),
      defaultValue : 'local',
      allowNull : false
    },
    providerId : {
      type : Sequelize.STRING,
      allowNull : true
    },
    password_date: {
      type: Sequelize.DATE,
      defaultValue: 0
    },
    password_link: {
      type: Sequelize.TEXT,
      defaultValue: ""
    },
    salt: {
      type: Sequelize.STRING(15)      
    },   
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isSeller: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    adminType : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    vrcode : Sequelize.INTEGER,
    birthday : Sequelize.DATEONLY,   
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    imgUrl : {
      type : Sequelize.STRING(400),
      allowNull : true,
      defaultValue : ""
    }    
 },{
  indexes : [{
    unique : true,
    fields : ['providerId']
  }]
});

/* Seller schema */
export const SellerSchema = globalSequlize.define('seller',{
  recordId : {
    type : Sequelize.UUID,
    primaryKey : true
  },
  userId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  paypalEmail : {
    type : Sequelize.STRING,
    allowNull : true
  },
  paypalAccepted: {
    type : Sequelize.DATE,
    allowNull : true
  },
  rating : {
    type : Sequelize.DOUBLE,
    allowNull : true
  },
  title : {
    type : Sequelize.STRING,
    allowNull : false
  },
  subtitle : {
    type : Sequelize.STRING,
    allowNull : false
  },
  description : {
    type : Sequelize.STRING,
    allowNull : false
  },
  cover : {
    type : Sequelize.TEXT,
    allowNull : true
  }  
});

/* Whish schema */
export const WishSchema = globalSequlize.define('whish', {
      uidRecord : {
        type : Sequelize.UUID,
        allowNull : false,
        unique : true,
        primaryKey : true
      },      
      uidUser : {
        type : Sequelize.UUID,
        allowNull : false
      },
      uidProduct : {
        type : Sequelize.UUID,
        allowNull : false
      }
});


/* Auction schema */
export const AuctionSchema = globalSequlize.define('auction', {
      uidRecord : {
        type : Sequelize.UUID,
        allowNull : false,
        unique : true,
        primaryKey : true
      },
      uidProduct : {
        type : Sequelize.UUID,
        allowNull : false    
      },
      uidSeller :  {
        type : Sequelize.UUID,
        allowNull : false   
      },
      uidFee : {
        type : Sequelize.STRING,
        allowNull : false
      },
      uidCategory : {
        type : Sequelize.STRING(5),
        allowNull : false
      },
      currentBid : {
        type : Sequelize.FLOAT,
        allowNull : false
      },
      currentUser : {
        type : Sequelize.UUID
      },              
      auctionStart : {
        type : 'TIMESTAMP',
        allowNull : false
      },      
      auctionEnds : {
        type : 'TIMESTAMP',
        allowNull : false
      },     
      inStock : {
        type : Sequelize.INTEGER,
        defaultValue : 1
      },
      onAuction : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      isCompleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      temporaryDisabled : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      offCost : {
        type : Sequelize.INTEGER
      },
      offShipment : {
        type : Sequelize.FLOAT,
      },
      mainImage : {
        type : Sequelize.STRING
      } 
});

/* Order schema */
export const OrderSchema = globalSequlize.define('orders', {
    orderId : { 
      type : Sequelize.UUID,
      primaryKey : true
    },
    customerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    productId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    productType : {
      type : Sequelize.STRING,
      allowNull : false
    },
    productQuantity : {
      type : Sequelize.INTEGER,
      defaultValue : 1,
      allowNull : false
    },
    productTrack : {
      type : Sequelize.STRING,
      allowNull : false
    },   
    sellerId : {
      type : Sequelize.UUID,
      allowNull : false
    }, 
    customerAddress : {
      type : Sequelize.STRING,
      allowNull : false
    },
    billingId : {
      type : Sequelize.UUID,
      allowNull : true
    },
    isFinished : {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    }
});

/* Billing schema */
export const BillingSchema = globalSequlize.define('payment',{
    billingId : {
      type : Sequelize.UUID,
      primaryKey : true
    },
    sellerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    itemId : { 
      type : Sequelize.UUID,
    },   
    customerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    payoutId : {
      type : Sequelize.UUID,
      allowNull : true
    },
    sourceId : {
      type : Sequelize.STRING,
      allowNull : false
    },
    chargeId : {
      type : Sequelize.STRING,
      allowNull : true
    },     
    available : {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    },   
    amount : {
      type : Sequelize.INTEGER,
      allowNull : false,
      defaultValue : 0
    }, 
    fee : {
      type : Sequelize.INTEGER,
      allowNull : true     
    },
    transactional_fee : {
      type : Sequelize.INTEGER,
      allowNull : false,
      defaultValue : 30
    },  
    type : {
      type : Sequelize.STRING,
      defaultValue : ""
    }
  },{
    name: 'payments_keys',
    fields: ['payoutId', 'paymentId','sourceId'] 
});

/* Payout schema */
export const PayoutSchema = globalSequlize.define('payout' ,{
    payoutId : {
      type : Sequelize.UUID,
      primaryKey : true
    },
    sellerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    payingId : {
      type : Sequelize.STRING,
      allowNull : true
    },
    status : {
      type : Sequelize.STRING,
      allowNull : false
    },
    amount : {
      type : Sequelize.INTEGER,
      allowNull : false,
      defaultValue : 0
    }, 
    fee : {
      type : Sequelize.INTEGER,
      allowNull : false,
      defaultValue : 0     
    },
    transactional_fee : {
      type : Sequelize.INTEGER,
      allowNull : false,
      defaultValue : 30
    }
});


/* Billing association */
PayoutSchema.hasMany(BillingSchema, { foreignKey : "payoutId", targetKey : "payoutId", as : 'billings' })
BillingSchema.belongsTo(PayoutSchema, { foreignKey : "payoutId", targetKey : "payoutId", as : 'payout' })

UserSchema.hasMany(PayoutSchema, { foreignKey : "sellerId", targetKey : "uid", as : 'payouts' })
PayoutSchema.belongsTo(UserSchema, { foreignKey : "sellerId", targetKey : "uid", as : 'requestor' })

UserSchema.hasMany(BillingSchema, { foreignKey : "customerId", targetKey : "uid", as : 'payments' })
BillingSchema.belongsTo(UserSchema, { foreignKey : "customerId", targetKey : "uid", as : 'customer' })


/* Products */
ProductSchema.hasMany(TypesSchema, { foreignKey : "productId", targetKey : "prUid", as : "types"});
TypesSchema.belongsTo(ProductSchema,{ foreignKey : "productId", sourceKey : "prUid", as : "product"} )

WinningSchema.belongsTo(ProductSchema, { foreignKey: 'productId', sourceKey: 'prUid'} );
ProductSchema.hasMany(WinningSchema, { foreignKey: 'productId', targetKey: 'prUid'} );

TypesSchema.hasMany(WinningSchema, { foreignKey: 'selectedTypeId', targetKey: 'typeUid'});
WinningSchema.belongsTo(TypesSchema, { foreignKey: 'selectedTypeId', sourceKey: 'typeUid'});

WinningSchema.belongsTo(UserSchema, { foreignKey: 'winnerId', sourceKey: 'uid'} );
UserSchema.hasMany(WinningSchema, { foreignKey: 'winnerId', targetKey: 'uid'} );


ProductSchema.belongsTo(UserSchema, { foreignKey: 'prSeller', sourceKey: 'uid', as : "creator"} );
UserSchema.hasMany(ProductSchema, { foreignKey: 'prSeller', targetKey: 'uid' , as : "products"} );




/* Sellers */
SellerSchema.belongsTo(UserSchema, { foreignKey: 'userId', sourceKey: 'uid', as : "user"} );
UserSchema.hasOne(SellerSchema, { foreignKey: 'userId', targetKey: 'uid' , as : "seller"} );



/* Orders */
OrderSchema.belongsTo( UserSchema, { foreignKey : 'customerId' , sourceKey : 'uid' , as : "Order"});
UserSchema.hasMany( OrderSchema, { foreignKey : 'customerId' , targetKey : 'uid' , as : "Order"});

OrderSchema.belongsTo( UserSchema, { foreignKey : 'sellerId' , sourceKey : 'uid' , as : "Selling"});
UserSchema.hasMany( OrderSchema, { foreignKey : 'sellerId' , targetKey : 'uid' , as : "Selling"});

OrderSchema.belongsTo(ProductSchema, { foreignKey: 'productId', sourceKey: 'prUid' } );
ProductSchema.hasMany(OrderSchema, { foreignKey: 'productId', targetKey: 'prUid' } );



/* Wishes */
WishSchema.belongsTo( UserSchema, { foreignKey : 'uidUser' , sourceKey : 'uid' });
UserSchema.hasMany( WishSchema, { foreignKey : 'uidUser' , targetKey : 'uid' });

WishSchema.belongsTo( ProductSchema , { foreignKey : 'orderId' , sourceKey : 'orderId' });
ProductSchema.hasOne( WishSchema , {foreignKey : 'orderId' , targetKey : 'orderId' });



/* Auction  */
AuctionSchema.belongsTo(ProductSchema, { foreignKey: 'uidProduct', sourceKey: 'prUid' });
ProductSchema.hasMany(AuctionSchema, { foreignKey: 'uidProduct', targetKey: 'prUid' });

WinningSchema.belongsTo(AuctionSchema, { foreignKey: 'auctionId', sourceKey: 'uidRecord'} );
AuctionSchema.hasMany(WinningSchema, { foreignKey: 'auctionId', targetKey: 'uidRecord'} );


