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
   }
   

}


export const dbController : Database = new Database(connectionString);


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
      type : Sequelize.TEXT
    },  
    prShipment : {
      type : Sequelize.JSON                        
    },
    prSeller : Sequelize.UUID,
    prTypes : {
      type : Sequelize.JSON  
    }

});



