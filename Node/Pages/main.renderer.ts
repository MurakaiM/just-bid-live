import TimeModule from '../Utils/Others/time'

import categoriesPopups from '../Database/database.categories'

import UserController from '../Controllers/user.controller'
import ProductController from '../Controllers/product.controller'
import PaymentController from '../Controllers/payment.controller'
import WinningController from '../Controllers/winning.controller'
import NotificationController from '../Controllers/notification.controller'

import Statistics from '../Services/Statistics/statistics.loader'

import { isAuth , isAdmin } from '../Utils/Communication/rules'
import { RESOURCES_PATH, STRIPE_PUBLIC } from '../keys'
import { Codes } from '../Database/database.static'


interface Redirector{   
    render : string,
    info : any
}

export default class Renderer {    
   
    public static home(req,res){
        res.render('preview',{
            pageName: "Welcome !",
            resources : RESOURCES_PATH,
            currentUser : req.user,
            login : false        
        });
    }

    public static live(req,res){         
        res.render('home', {
            pageName : "Live",
            resources : RESOURCES_PATH,
            categories : categoriesPopups,
            currentUser : req.user,
            login : false        
        });    
    }

    public static about(req,res){
        res.render('preview', {
            pageName : "Live",
            resources : RESOURCES_PATH,
            categories : categoriesPopups,
            currentUser : req.user,
            login : false        
        });
    }

    public static signin(req,res){
        var pageInfo = {
            pageName : "Sign In",
            resources : RESOURCES_PATH,
            currentUser : req.user,
            login : true 
        };

        res.render('home', pageInfo);
    }

    public static contact(req,res){
        var pageInfo = {
            pageName : "Contact",
            resources : RESOURCES_PATH,
            currentUser : req.user,
            login : false
        };

        res.render('contact', pageInfo);
    }

    public static stock(req,res){
        var pageInfo = {
            pageName : "Stock",
            resources : RESOURCES_PATH,
            currentUser : req.user,
            login : false,
            popups : categoriesPopups.popups
        };

        res.render('stock', pageInfo);  
    }

    public static product(req,res){
        let pageInfo = {
            pageName : "",
            currentUser : req.user,
            resources : RESOURCES_PATH,           
            login : false
        };

        ProductController.GetProduct(req.params.product)
            .then( product => {
                if(!product) return res.redirect('/');
                
                if(!product.prAllowed) return res.redirect('/');                    
                product.increment('prViews');
                pageInfo['product'] = product;
                pageInfo['pageName'] = product.prTitle;
                       
                return res.render('Products/product', pageInfo);
            })
            .catch( error => { console.log(error); res.redirect('/') });
    }


    public static signup(req,res){
        var pageInfo = {
          resources :  RESOURCES_PATH,   
          pageName : "Sign Up",       
          currentUser : req.user
        };

        res.render('signup', pageInfo);
    }

    public static helpCategory(req,res){
        var pageInfo = {
            pageName : "Categories list",
            resources :  RESOURCES_PATH,
            currentUser : req.user,
            login : false,
            popups : categoriesPopups.popups
        };

        return res.render('Store/help', pageInfo);
    }



    public static profile(req,res){
        var pageInfo = {
            pageName : "My orders & winnings",
            currentUser : req.user,            
            resources :  RESOURCES_PATH,  
            login : false        
        };

        isAuth(req,res,true).allowed( async user => {
            if(user.isSeller()){
                return res.redirect('/seller/mystore');
            }

            try{
               pageInfo['winnings'] = await WinningController.ReadyCustomersWinnings(req.user)
            }catch(error){
               pageInfo['winnings'] = [];
            }

            return res.render('Users/my', pageInfo)
        })
    }

    public static profileAuction(req,res){
        var pageInfo = {
            pageName : "My auction",
            currentUser : req.user,
            resources :  RESOURCES_PATH,   
            login : false        
        };

        isAuth(req,res,true).allowed(user => { 
            WinningController.LoadWinnings(req.user).then( winnings => {
                pageInfo['winnings'] = winnings;
                pageInfo['cuurentUser'] = user;
                
                Renderer.AccountRedirect(req, res, {          
                    render : "Users/my_auction",
                    info : pageInfo
                }); 
            })    
        })    
    }



    public static forgot(req,res){
        var pageInfo = {
            pageName : "Forgot", 
            currentUser : req.user,
            resources :  RESOURCES_PATH               
        };

        return res.render('Users/forgot', pageInfo);
    }
    
    public static restore(req,res){    
        UserController.ResetVlidate(req.params.link)
            .then( result => res.render('Users/reset',{ 
                pageName : "Reset password", 
                link : req.params.link, 
                currentUser : req.user,
                resources :  RESOURCES_PATH 
            }))
            .catch( error => res.redirect('/'))
    }



    public static sellerSignup(req,res){
        var pageInfo = {
            pageName : "Sign up",
            currentUser : req.user,
            resources :  RESOURCES_PATH            
        };
            
        return res.render('Sellers/signup', pageInfo);
    }

    public static sellerSignin(req,res){
        var pageInfo = {
            pageName : "Sign in",
            currentUser : req.user,
            resources : RESOURCES_PATH            
        };

        if(req.isAuthenticated()){
            return res.redirect('/seller/mystore');
        }
            
        return res.render('Sellers/signin', pageInfo);
    }

    public static sellerStore(req,res){
        var pageInfo = {
            pageName : "My store",
            currentUser : req.user,
            resources : RESOURCES_PATH, 
            login : false         
        };        

        Renderer.SellerRedirect(req,res, {
            render : 'Sellers/mystore',
            info : pageInfo
        });
    }


    public static winningCheckout(req,res){
        let wngId = req.params.id;
        let pageInfo = {
            stripeKey : STRIPE_PUBLIC,
            pageName : "Winning checkout",
            currentUser : req.user,
            resources : RESOURCES_PATH,   
            login : false,
            winning : null
        };         
  
        isAuth(req,res,true).allowed( async user => {
            let answer = await WinningController.WinningRender(user, wngId);
           
            if(!answer.success) return res.redirect('/');

            if(answer.result.status.toLowerCase() != 'new') return res.redirect('/');
               
            pageInfo.winning = answer.result;
            pageInfo.winning.dataValues.createdAt = TimeModule.convertTime(answer.result.createdAt);       
            pageInfo.winning.image = answer.result.product.prTypes.colors[Object.keys(answer.result.product.prTypes.colors)[0]].image;
        
            req.session.lastPayment = wngId;

            await NotificationController.ReviewNotification(user, wngId);
            return res.render('Users/my_checkout', pageInfo);               
        });            
    }
    


    private static AccountRedirect(req,res, data : Redirector ){
        if(req.isAuthenticated() && req.user.isSeller())
            return res.redirect('/seller/mystore');           
        else if(req.isAuthenticated())
            return res.render(data.render, data.info);
        else            
            return res.redirect('/');
    }

    private static SellerRedirect(req,res, data : Redirector){
        if(req.isAuthenticated() && req.user.isSeller())
            return res.render(data.render, data.info);            
         else if(req.isAuthenticated())
             return res.redirect('/my');
         else
            return res.redirect('/seller/signin');
    }
}