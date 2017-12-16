import {
    UserSchema,
    BillingSchema,
    WinningSchema,
    ProductSchema,
    AuctionSchema,
    Database
} from '../../Database/database.controller'


import * as moment from 'moment'

interface TripleStats{
    all : number,
    month : number,
    day : number
}

interface UsersStats{
    sellers : number,
    customers : number
}

export default class StatisticsLoader{
    public static Instance : StatisticsLoader;
    
    private weekDay = {
        '1' : 'M',
        '2' : 'T',
        '3' : 'W',
        '4' : 'T',
        '5' : 'F',
        '6' : 'S',
        '7' : 'S',
    }
    
    private monthNames = {
        '0' : 'Jan',
        '1' : 'Feb',
        '2' : 'Mar',
        '3' : 'Apr',
        '4' : 'May',
        '5' : 'Jun',
        '6' : 'Jul',
        '7' : 'Aug',
        '8' : 'Sep',
        '9' : 'Oct',
        '10' : 'Nov',
        '11' : 'Dec'
    }

    constructor(){
        StatisticsLoader.Instance = this;
    }


    public async UsersStats() : Promise<TripleStats>{
        try{
            let all = await UserSchema.count();    
            let month = await UserSchema.count({
                where : Database.Instance.Sequelize.literal(`date_trunc('month',"createdAt") >= date_trunc('month', current_date  - interval '1' month)`) 
            });

            let day = await UserSchema.count({
                where : Database.Instance.Sequelize.literal(`date_trunc('day',"createdAt") >= date_trunc('day', current_date  - interval '1' day)`) 
            });

            return { all, day, month }
        }catch(error){
            return { all: 0, day : 0, month : 0 }
        }
    }

    public async BillingStats() : Promise<TripleStats>{
        try{
            let all = await BillingSchema.sum('amount');    
            let month = await BillingSchema.sum('fee',{
                where : Database.Instance.Sequelize.literal(`date_trunc('month',"createdAt") >= date_trunc('month', current_date  - interval '1' month)`) 
            });

            let day = await BillingSchema.sum('fee',{
                where : Database.Instance.Sequelize.literal(`date_trunc('day',"createdAt") >= date_trunc('day', current_date  - interval '1' day)`) 
            });
         
            return { all, day, month }
        }catch(error){            
            return { all: 0, day : 0, month : 0 }
        }
    }


  
    public async WinningGrouping() : Promise<any>{
        try{
            let grWinning = await Database.Instance.Sequelize.query(`
                SELECT COUNT(*),date_trunc('day',"createdAt") FROM winnings 
                WHERE date_trunc('day',"createdAt") >= date_trunc('day', current_date  - interval '6' day)
                GROUP BY date_trunc('day',"createdAt") ORDER BY date_trunc('day',"createdAt")
            `, { type: Database.Instance.Sequelize.QueryTypes.SELECT})

            return this.FillUp(grWinning);
        }catch(error){
            console.log(error)
        }
    }

    public async ProductsGrouping() : Promise<any>{
        try{
            let grWinning = await Database.Instance.Sequelize.query(`
                SELECT COUNT(*),date_trunc('day',"createdAt") FROM products 
                WHERE date_trunc('day',"createdAt") >= date_trunc('day', current_date  - interval '6' day)
                GROUP BY date_trunc('day',"createdAt") ORDER BY date_trunc('day',"createdAt")
            `, { type: Database.Instance.Sequelize.QueryTypes.SELECT });

            return this.FillUp(grWinning);
        }catch(error){
            console.log(error)
        }
    }



    public async PaymentsGrouping() : Promise<any>{
        try{
            let grWinning = await Database.Instance.Sequelize.query(`
                SELECT COUNT(*),date_trunc('day',"createdAt") FROM payments
                WHERE date_trunc('day',"createdAt") >= date_trunc('day', current_date  - interval '6' day)
                AND "chargeId" IS NOT NULL
                GROUP BY date_trunc('day',"createdAt") ORDER BY date_trunc('day',"createdAt")
            `, { type: Database.Instance.Sequelize.QueryTypes.SELECT });

            return this.FillUp(grWinning);
        }catch(error){
            console.log(error)
        }
    }

    public async UsersGrouping() : Promise<any>{
        try{
            let grWinning = await Database.Instance.Sequelize.query(`
                SELECT COUNT(*),date_trunc('month',"createdAt") FROM users 
                WHERE date_trunc('month',"createdAt") >= date_trunc('month', current_date  - interval '12' month)    
                AND "verified" = True           
                GROUP BY date_trunc('month',"createdAt") ORDER BY date_trunc('month',"createdAt")
            `, { type: Database.Instance.Sequelize.QueryTypes.SELECT });
            
                       return this.FillUpMonthly(grWinning);
        }catch(error){
            console.log(error)
        }
    }
 
    public async  WinningMonthGrouping() : Promise<any>{
      try{
            let grWinning = await Database.Instance.Sequelize.query(`
                SELECT COUNT(*),date_trunc('month',"createdAt") FROM winnings 
                WHERE date_trunc('month',"createdAt") >= date_trunc('month', current_date  - interval '12' month)    
                AND "winnings"."billingId" IS NOT NULL          
                GROUP BY date_trunc('month',"createdAt") ORDER BY date_trunc('month',"createdAt")
            `, { type: Database.Instance.Sequelize.QueryTypes.SELECT });
        
            return this.FillUpMonthly(grWinning);
        }catch(error){
            console.log(error)
        }
    }

    public async AllUsers() : Promise<UsersStats>{
        try{
            let customers = await UserSchema.count({ where : { isSeller : false }});
            let sellers = await UserSchema.count({ where : { isSeller : true }})

            return { sellers, customers }
        }catch(error){
            return { sellers : 0, customers : 0 }
        }
    }


    public async AllStats(){
        try{      
            let usersSt = await this.UsersStats();
            let usersSa = await this.AllUsers();
            let billingSt = await this.BillingStats();

            let productGR = await this.ProductsGrouping();
            let winningGR = await this.WinningGrouping();
            let paymentGR = await this.PaymentsGrouping();

            let usersMGR = await this.UsersGrouping();
            let winningMGR = await this.WinningMonthGrouping();
           

            return{
                customers : usersSt,
                billing : billingSt,            
                users : usersSa,
                grouping : {
                    product : productGR ? productGR : DEFAULT,
                    winning : winningGR ? winningGR : DEFAULT,
                    payment : paymentGR ? paymentGR : DEFAULT,
                    mwinnings : winningMGR ? winningMGR : DEFAULT,
                    users : usersMGR ? usersMGR : DEFAULT
                }
            }   
        }catch(error){
            console.log(error)
        }   
    }

   
    private FillUp(data){
        let trunced = {};
        data.forEach( key => trunced[moment(key.date_trunc).format('YYYY-MM-DD')] = key.count);
        
        let tomorrow = moment();        
        let filled = [];
        let max = 0;

        for(let i = 0; i <= 6; i++){
            let locale = moment().subtract(i, 'day');
            let str = locale.format('YYYY-MM-DD');
            
            filled[i] = {
                count  : trunced[str] ? trunced[str] : 0,           
                date_week_day : this.weekDay[locale.isoWeekday()]
            }

            max = (filled[i].count > max) ? parseInt(filled[i].count) : max;
        }
        return { 
            max : (max + 5),
            filled
        };
    }

    private FillUpMonthly(data){
        let trunced = {};
        data.forEach( key => trunced[moment(key.date_trunc).format('YYYY-MM')] = key.count);
     
        let tomorrow = moment();        
        let filled = [];
        let max = 0;

        for(let i = 0; i <= 11; i++){
            let locale = moment().subtract(i, 'month');
            let str = locale.format('YYYY-MM');
            
            filled[i] = {
                count  : trunced[str] ? trunced[str] : 0,           
                date_month : this.monthNames[locale.month()]
            }

            max = (filled[i].count > max) ? parseInt(filled[i].count) : max;
        }
        return { 
            max : (max + 5),
            filled
        };
    }


}

const DEFAULT = { max : 7, filled : [0,0,0,0,0,0,0] }