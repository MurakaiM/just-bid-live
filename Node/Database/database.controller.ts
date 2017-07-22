import * as  Sequelize from 'sequelize'

const connectionString : string = 'postgres://admin:md53c17b0bb7cd76e4f80ad10e45d4acb56@localhost:5432/auction';

export class Database{
   public static Instance : Database;
   private sequelize; 

   constructor(connectionString){
      this.sequelize = new Sequelize(connectionString, {
        logging : false,
        dialect : 'postgres'
      });

      Database.Instance = this;
      this.initConnection();
   }


   get Sequelize() : any{ 
     return this.sequelize; 
   }

   private initConnection() : void {     
      this.sequelize.authenticate()
        .then(() => this.initSchemas().then(()=> console.log("All schemas are initialized")))
        .catch(err => console.error('Unable to connect to the database:', err));
   }

   private async initSchemas() : Promise<any> {
      
      await UserSchema.sync();
      await ProductSchema.sync();
      await WhishSchema.sync();
      await AuctionSchema.sync();
   }
   

}

export function initDatabase(){
  console.log("Required connection");
}


var dbController : Database = new Database(connectionString);


/*Product schema*/
export const ProductSchema = dbController.Sequelize.define('product', {
    prUid : {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      unique: true
    }, 
    prTitle : Sequelize.STRING,
    prDescription : Sequelize.TEXT,
    prCost : Sequelize.FLOAT,
    prSold : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prWishes : {
      type : Sequelize.INTEGER,
      defaultValue : 0
    },
    prCategory : {
      type : Sequelize.JSON
    },  
    prShipment : {
      type : Sequelize.JSON                        
    },
    prSeller : Sequelize.UUID,
    prTypes : {
      type : Sequelize.JSON  
    }

});

/* User schema*/
export const UserSchema = dbController.Sequelize.define('user', {
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
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    imgUrl : {
      type : Sequelize.STRING(400),
      defaultValue : ""
    }    
});


/* Whish schema*/
export const WhishSchema = dbController.Sequelize.define('whish', {
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
export const AuctionSchema = dbController.Sequelize.define('auction', {
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

      currentBid : {
        type : Sequelize.INTEGER,
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


AuctionSchema.belongsTo(ProductSchema, { foreignKey: 'uidProduct', sourceKey: 'prUid' });
ProductSchema.hasMany(AuctionSchema, { foreignKey: 'uidProduct', targetKey: 'prUid' });