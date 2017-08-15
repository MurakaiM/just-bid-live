import categoriesPopups from '../Database/database.categories'

import UserController from '../Controllers/user.controller'
import ProductController from '../Controllers/product.controller'
import { isAuth } from '../Utils/Communication/rules'

export default class Renderer {    
   
    public static live(req,res){        
        var pageInfo = {
            pageName : "Live",
            currentUser : req.user,
            login : false        
        };

        res.render('home', pageInfo);
    }

    public static signin(req,res){
        var pageInfo = {
            pageName : "Live",
            currentUser : req.user,
            login : true 
        };

        res.render('home', pageInfo);
    }

    public static contact(req,res){
        var pageInfo = {
            pageName : "Contact",
            currentUser : req.user,
            login : false
        };

        res.render('contact', pageInfo);
    }

    public static stock(req,res){
        var pageInfo = {
            pageName : "Stock",
            currentUser : req.user,
            login : false,
            popups : categoriesPopups.popups
        };

        res.render('stock', pageInfo);  
    }

    public static product(req,res){
        ProductController.GetProduct(req.params.product)
            .then( product => {
                if(!product){
                    return res.redirect('/');
                }

                product.increment('prViews');
                var pageInfo = {
                    pageName : "Product",
                    currentUser : req.user,
                    product : product,
                    login : false
                };
                       
               return res.render('Products/product', pageInfo);
            })
            .catch( error => res.redirect('/'));
    }

    public static signup(req,res){
        var pageInfo = {
          pageName : "Sign up",       
          currentUser : req.user
        };

        res.render('signup', pageInfo);
    }

    public static profile(req,res){
        var pageInfo = {
            pageName : "Sign up",
            currentUser : req.user,
            login : false        
        };

        if(req.isAuthenticated() && req.user.isSeller())
            return res.redirect('/seller/mystore');           
        else if(req.isAuthenticated())
            return res.render('my', pageInfo);
        else            
            return res.redirect('/');
    }

    public static forgot(req,res){
        var pageInfo = {
            pageName : "Forgot",                
        };

        return res.render('Users/forgot', pageInfo);
    }
    
    public static restore(req,res){    
        UserController.ResetVlidate(req.params.link)
            .then( result => res.render('Users/reset',{ pageName : "Reset password", link : req.params.link }))
            .catch( error => res.redirect('/'))
    }

    public static sellerSignup(req,res){
        var pageInfo = {
            pageName : "Sign up",
            currentUser : req.user            
        };
            
        return res.render('Sellers/signup', pageInfo);
    }

    public static sellerSignin(req,res){
        var pageInfo = {
            pageName : "Sign in",
            currentUser : req.user            
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
            login : false         
        };        

        if(req.isAuthenticated() && req.user.isSeller())
           return res.render('Sellers/mystore',pageInfo);            
        else if(req.isAuthenticated())
            return res.redirect('/my');
        else
           return res.redirect('/seller/signin');
    }
}