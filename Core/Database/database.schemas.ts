import * as Sequelize from 'sequelize'

export function defineSchemas(sq) {

    /* Contact schema */
    const QuestionSchema = sq.define('question', {
        questionId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        type: {
            type: Sequelize.STRING(2),
            allowNull: false
        },
        contactor: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isClosed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    /* Notification schema */
    const NotificationSchema = sq.define('notification', {
        recordId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        message: {
            type: Sequelize.TEXT
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "Message"
        },
        action: {
            type: Sequelize.TEXT
        },
        isViewed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
        indexes: [{
            name: 'action_index',
            fields: ['action']
        }]
    });

    /* Auction winning schema */
    const WinningSchema = sq.define('winning', {
        winningId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        billingId: {
            type: Sequelize.UUID,
            allowNull: true
        },
        winnerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        auctionId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        productId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        sellerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        selectedTypeId: {
            type: Sequelize.UUID,
            allowNull: true
        },
        lastBid: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        productTrack: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'New'
        },
        customerInformation: {
            type: Sequelize.JSON,
            allowNull: true
        },
        isFinished: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    /* Product schema */
    const ProductSchema = sq.define('product', {
        prUid: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        prTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        prDescription: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        prFull: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        prCost: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },/*
        prRecommended: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: true
        },*/
        prRating: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        prSold: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prWishes: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prLikes: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prViews: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prMaterial: {
            type: Sequelize.STRING,
            defaultValue: "Undefined",
            allowNull: false
        },
        prCategory: {
            type: Sequelize.STRING,
            allowNull: false
        },
        prGuarantee: {
            type: Sequelize.INTEGER,
            defaultValue: 12
        },
        prShipment: {
            type: Sequelize.DECIMAL(10,2)
        },
        prDelivery: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        prDiscount: {
            type: 'SMALLINT',
            allowNull: true
        },
        prSeller: {
            type: Sequelize.UUID,
            allowNull: false
        },
        prAllowed: {
            type: Sequelize.BOOLEAN
        },
        prTypes: {
            type: Sequelize.JSON
        },
        prDisabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    /* Category schema */
    const CategorySchema = sq.define('category', {
        id: {
            type: Sequelize.STRING(15),
            primaryKey: true
        },
        parent: {
            type: Sequelize.STRING(15),
            allowNull: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING,
            allowNull: true
        }

    });

    /* Type's schema */
    const TypesSchema = sq.define('type', {
        typeUid: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        productId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        typeId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sellerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        inStock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
        indexes: [{
            name: 'stock_index',
            method: 'BTREE',
            fields: ['productId']
        }]
    });
    
    /* User schema */
    const UserSchema = sq.define('user', {
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
        phone: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        country: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        provider: {
            type: Sequelize.STRING(15),
            defaultValue: 'local',
            allowNull: false
        },
        providerId: {
            type: Sequelize.STRING,
            allowNull: true
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
        adminType: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        vrcode: Sequelize.INTEGER,
        birthday: Sequelize.DATEONLY,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        imgUrl: {
            type: Sequelize.STRING(400),
            allowNull: true,
            defaultValue: ""
        }
    }, {
        indexes: [{
            unique: true,
            fields: ['providerId']
        }]
    });

    /* Seller schema */
    const SellerSchema = sq.define('seller', {
        recordId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        paypalEmail: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paypalAccepted: {
            type: Sequelize.DATE,
            allowNull: true
        },
        rating: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subtitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        cover: {
            type: Sequelize.TEXT,
            allowNull: true
        }
    });

    /* Whish schema */
    const WishSchema = sq.define('whish', {
        uidRecord: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        uidUser: {
            type: Sequelize.UUID,
            allowNull: false
        },
        uidProduct: {
            type: Sequelize.UUID,
            allowNull: false
        }
    });

    /* Auction schema */
    const AuctionSchema = sq.define('auction', {
        uidRecord: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        uidProduct: {
            type: Sequelize.UUID,
            allowNull: false
        },
        uidSeller: {
            type: Sequelize.UUID,
            allowNull: false
        },
        uidFee: {
            type: Sequelize.STRING,
            allowNull: false
        },
        uidCategory: {
            type: Sequelize.STRING(5),
            allowNull: false
        },
        currentBid: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        currentUser: {
            type: Sequelize.UUID
        },
        auctionStart: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        auctionEnds: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        inStock: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        },
        onAuction: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isCompleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        temporaryDisabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        offCost: {
            type: Sequelize.INTEGER
        },
        offShipment: {
            type: Sequelize.DOUBLE,
        },
        mainImage: {
            type: Sequelize.STRING
        }
    });

    /* Order schema */
    const OrderSchema = sq.define('orders', {
        orderId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        customerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        productId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        productType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        productQuantity: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false
        },
        productTrack: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sellerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        customerAddress: {
            type: Sequelize.STRING,
            allowNull: false
        },
        billingId: {
            type: Sequelize.UUID,
            allowNull: true
        },
        isFinished: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    /* Billing schema */
    const BillingSchema = sq.define('payment', {
        billingId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        sellerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        itemId: {
            type: Sequelize.UUID,
        },
        customerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        payoutId: {
            type: Sequelize.UUID,
            allowNull: true
        },
        sourceId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        chargeId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        available: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        fee: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        transactional_fee: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 30
        },
        type: {
            type: Sequelize.STRING,
            defaultValue: ""
        }
    }, {
        indexes: [{
            name: 'payments_keys',
            fields: ['payoutId', 'sourceId']
        }]
    });

    /* Payout schema */
    const PayoutSchema = sq.define('payout', {
        payoutId: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        sellerId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        payingId: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        fee: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        transactional_fee: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 30
        }
    });



    /* Billing association */
    PayoutSchema.hasMany(BillingSchema, {
        foreignKey: "payoutId",
        sourceKey: "payoutId",
        as: 'billings'
    })
    BillingSchema.belongsTo(PayoutSchema, {
        foreignKey: "payoutId",
        targetKey: "payoutId",
        as: 'payout'
    })

    UserSchema.hasMany(PayoutSchema, {
        foreignKey: "sellerId",
        sourceKey: "uid",
        as: 'payouts'
    })
    PayoutSchema.belongsTo(UserSchema, {
        foreignKey: "sellerId",
        targetKey: "uid",
        as: 'requestor'
    })

    UserSchema.hasMany(BillingSchema, {
        foreignKey: "customerId",
        sourceKey: "uid",
        as: 'payments'
    })
    BillingSchema.belongsTo(UserSchema, {
        foreignKey: "customerId",
        targetKey: "uid",
        as: 'customer'
    })


    /* Products */
    ProductSchema.hasMany(TypesSchema, {
        foreignKey: "productId",
        sourceKey: "prUid",
        as: "types"
    });
    TypesSchema.belongsTo(ProductSchema, {
        foreignKey: "productId",
        targetKey: "prUid",
        as: "product"
    })

    WinningSchema.belongsTo(ProductSchema, {
        foreignKey: 'productId',
        targetKey: 'prUid'
    });
    ProductSchema.hasMany(WinningSchema, {
        foreignKey: 'productId',
        sourceKey: 'prUid'
    });

    TypesSchema.hasMany(WinningSchema, {
        foreignKey: 'selectedTypeId',
        sourceKey: 'typeUid'
    });
    WinningSchema.belongsTo(TypesSchema, {
        foreignKey: 'selectedTypeId',
        targetKey: 'typeUid'
    });

    WinningSchema.belongsTo(UserSchema, {
        foreignKey: 'winnerId',
        targetKey: 'uid'
    });
    UserSchema.hasMany(WinningSchema, {
        foreignKey: 'winnerId',
        sourceKey: 'uid'
    });


    ProductSchema.belongsTo(UserSchema, {
        foreignKey: 'prSeller',
        targetKey: 'uid',
        as: "creator"
    });
    UserSchema.hasMany(ProductSchema, {
        foreignKey: 'prSeller',
        sourceKey: 'uid',
        as: "products"
    });

    /* Categories */
    CategorySchema.belongsTo(CategorySchema, { 
        foreignKey: 'parent', 
        targetKey: 'id', 
        as: "previous" 
    });
    CategorySchema.hasMany(CategorySchema, { 
        foreignKey: 'parent', 
        sourceKey: 'id',
        as: "children"  
    });
   
    /* Sellers */
    SellerSchema.belongsTo(UserSchema, {
        foreignKey: 'userId',
        targetKey: 'uid',
        as: "user"
    });
    UserSchema.hasOne(SellerSchema, {
        foreignKey: 'userId',
        sourceKey: 'uid',
        as: "seller"
    });



    /* Orders */
    OrderSchema.belongsTo(UserSchema, {
        foreignKey: 'customerId',
        targetKey: 'uid',
        as: "Order"
    });
    UserSchema.hasMany(OrderSchema, {
        foreignKey: 'customerId',
        sourceKey: 'uid',
        as: "Order"
    });

    OrderSchema.belongsTo(UserSchema, {
        foreignKey: 'sellerId',
        targetKey: 'uid',
        as: "Selling"
    });
    UserSchema.hasMany(OrderSchema, {
        foreignKey: 'sellerId',
        sourceKey: 'uid',
        as: "Selling"
    });

    OrderSchema.belongsTo(ProductSchema, {
        foreignKey: 'productId',
        targetKey: 'prUid'
    });
    ProductSchema.hasMany(OrderSchema, {
        foreignKey: 'productId',
        sourceKey: 'prUid'
    });


    /* Wishes */
    WishSchema.belongsTo(UserSchema, {
        foreignKey: 'uidUser',
        targetKey: 'uid'
    });
    UserSchema.hasMany(WishSchema, {
        foreignKey: 'uidUser',
        sourceKey: 'uid'
    });

    /*
    WishSchema.belongsTo(ProductSchema, {
        foreignKey: 'orderId',
        targetKey: 'orderId'
    });
    ProductSchema.hasOne(WishSchema, {
        foreignKey: 'orderId',
        sourceKey: 'orderId'
    });
    */


    /* Auction  */
    AuctionSchema.belongsTo(ProductSchema, {
        foreignKey: 'uidProduct',
        targetKey: 'prUid'
    });
    ProductSchema.hasMany(AuctionSchema, {
        foreignKey: 'uidProduct',
        sourceKey: 'prUid'
    });

    WinningSchema.belongsTo(AuctionSchema, {
        foreignKey: 'auctionId',
        targetKey: 'uidRecord'
    });
    AuctionSchema.hasMany(WinningSchema, {
        foreignKey: 'auctionId',
        sourceKey: 'uidRecord'
    });

    return {
        QuestionSchema,
        NotificationSchema,
        WinningSchema,
        ProductSchema,
        CategorySchema,
        TypesSchema,
        UserSchema,
        SellerSchema,
        WishSchema,
        AuctionSchema,
        OrderSchema,
        BillingSchema,
        PayoutSchema
    }
}