import { countries } from 'country-data';

import categoriesPopups from '../Database/database.categories'

export default class Renderer {
    

    public static live(req,res){
        var pageInfo = {
            pageName : "Live"
        };

        res.render('home', pageInfo);
    }

    public static contact(req,res){
        var pageInfo = {
        pageName : "Contact"
        };

        res.render('contact', pageInfo);
    }

    public static stock(req,res){
        var pageInfo = {
            pageName : "Stock",
            popups : categoriesPopups.popups
        };

        res.render('stock', pageInfo);  
    }

    public static product(req,res){
        var pageInfo = {
            pageName : "Product"    
        };

        res.render('Products/product', pageInfo);
    }

    public static signup(req,res){
        var pageInfo = {
          pageName : "Sign up",
          countryData : countries  
        };

        res.render('signup', pageInfo);
    }

}