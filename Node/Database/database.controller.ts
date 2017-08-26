import * as  Sequelize from 'sequelize'

import Search from '../Utils/Controllers/search'

import { DATABASE_URL } from '../keys'


const globalSequlize = new Sequelize(DATABASE_URL, {
  logging : false,
  dialect : 'postgres'
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

   public initConnection() : Promise<any> {  
      return new Promise((resolve, reject) => {
        this.sequelize.authenticate()
        .then(() => this.initSchemas().then(()=> resolve("All schemas are initialized")))
        .catch(err => console.error('Unable to connect to the database:', err));
      }); 
   }



   private async initSchemas() : Promise<any> {   

      await UserSchema.sync();
      await ProductSchema.sync();
      await WinningSchema.sync();
      await WishSchema.sync();
      await AuctionSchema.sync();
      await SellerSchema.sync();
      await OrderSchema.sync();
      await this.productSearch.setUp();
    }
   

}

export function initDatabase() : Promise<any>{
  var dbController : Database = new Database(DATABASE_URL);
  return dbController.initConnection();
}


/*Notification schema*/
export const NotificationSchema = globalSequlize.define('notification', {
  recordId : {
    type: Sequelize.UUID,
    primaryKey : true
  },
  userId : {
    type : Sequelize.UUID,
    allowNull : false
  },
  text : {
    type : Sequelize.TEXT
  },
  type : {
    type : Sequelize.STRING,
    allowNull : false,
    defaultValue : "Message"
  },
  isViewed : {
    type : Sequelize.BOOLEAN,
    defaultValue : false
  }
});


/*Auction winning schema*/
export const WinningSchema = globalSequlize.define('winning', {
  winningId : {
    type : Sequelize.UUID,
    primaryKey : true
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
  selectedType : {
    type : Sequelize.STRING,
    defaultValue : "not selected",
    allowNull : false
  },
  lastBid : {
    type : Sequelize.INTEGER,
    defaultValue : 0,
    allowNull : false
  },
  productTrack : {
    type : Sequelize.STRING,
    defaultValue : "No track number represented",
    allowNull : false
  },  
  status : {
    type : Sequelize.STRING
  },
  customerAddress : {
    type : Sequelize.STRING,
    allowNull : true
  },
  isFinished : {
    type : Sequelize.BOOLEAN,
    defaultValue : false
  }
})

/*Product schema*/
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
    prRating : Sequelize.FLOAT,
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
    prSeller : { 
      type : Sequelize.UUID,
      allowNull : false
    }, 
    prTypes : {
      type : Sequelize.JSON  
    },    
    prDisabled : {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    }    
});


/* User schema*/
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
      type: Sequelize.STRING,     
      allowNull: false
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false
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
      type: Sequelize.STRING(15),
      allowNull: false
    },   
    veryfied: {
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
  rating : {
    type : Sequelize.FLOAT,
    allowNull : true
  },
  credit : {
    type : Sequelize.STRING,
    validate : {
      isCreditCard: true
    },
    allowNull : true
  },
  creditExpire : {
    type : Sequelize.DATEONLY,
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

/* Whish schema*/
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


/* Auction schema*/
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

/* Order schema*/
export const OrderSchema= globalSequlize.define('orders', {
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
    status : {
      type : Sequelize.STRING
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
export const BillingSchema = globalSequlize.define('checkout',{
    billingId : {
      type : Sequelize.UUID,
      primaryKey : true
    },
    orderId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    sellerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    customerId : {
      type : Sequelize.UUID,
      allowNull : false
    },
    amount : {
      type : Sequelize.REAL,
      allowNull : false,
      defaultValue : 0
    },
    withdrawed : {
      type : Sequelize.BOOLEAN,
      defaultValue : false
    }

});



/* Sellers */
SellerSchema.belongsTo(UserSchema, { foreignKey: 'userId', sourceKey: 'uid', as : "Seller"} );
UserSchema.hasOne(SellerSchema, { foreignKey: 'userId', targetKey: 'uid' , as : "Seller"} );

/* Orders */
OrderSchema.belongsTo( UserSchema, { foreignKey : 'customerId' , sourceKey : 'uid' , as : "Order"});
UserSchema.hasMany( OrderSchema, { foreignKey : 'customerId' , targetKey : 'uid' , as : "Order"});

OrderSchema.belongsTo( UserSchema, { foreignKey : 'sellerId' , sourceKey : 'uid' , as : "Selling"});
UserSchema.hasMany( OrderSchema, { foreignKey : 'sellerId' , targetKey : 'uid' , as : "Selling"});

OrderSchema.belongsTo(ProductSchema, { foreignKey: 'productId', sourceKey: 'prUid' } );
ProductSchema.hasMany(OrderSchema, { foreignKey: 'productId', targetKey: 'prUid' } );

BillingSchema.belongsTo(OrderSchema, { foreignKey: 'productId', sourceKey: 'prUid', as : "Billing"} );
OrderSchema.hasOne(BillingSchema, { foreignKey: 'productId', targetKey: 'prUid' , as : "Billing"} );



/* Wishes */
WishSchema.belongsTo( UserSchema, { foreignKey : 'uidUser' , sourceKey : 'uid' });
UserSchema.hasMany( WishSchema, { foreignKey : 'uidUser' , targetKey : 'uid' });

WishSchema.belongsTo( ProductSchema , { foreignKey : 'orderId' , sourceKey : 'orderId' });
ProductSchema.hasOne( WishSchema , {foreignKey : 'orderId' , targetKey : 'orderId' });



/* Auction  */
AuctionSchema.belongsTo(ProductSchema, { foreignKey: 'uidProduct', sourceKey: 'prUid' });
ProductSchema.hasMany(AuctionSchema, { foreignKey: 'uidProduct', targetKey: 'prUid' });