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
import Question from '../Models/question.model';


interface Redirector{   
    render : string,
    info : any
}

export default class Renderer {    
   

    public static adminExact(req,res){
        let pageInfo = {
            pageName : "",
            currentUser : req.user,
            resources : RESOURCES_PATH,           
            login : false
        };

        isAdmin(req,res,true).allowed( admin => {
            ProductController.GetProduct(req.params.product)
                .then( product => {
                    if(!product) return res.redirect('/admin/ab/products');  

                    product.increment('prViews');
                    pageInfo['product'] = product;
                    pageInfo['pageName'] = product.prTitle;
                        
                    return res.render('Owner/product', pageInfo);
                })
                .catch( error => res.redirect('/'));
        });
    }

    public static adminPayouts(req,res){
        isAdmin(req,res,true).allowed(async admin =>{ 
            let pageInfo = { 
                resources : RESOURCES_PATH,
                requests : (await PaymentController.getRequestedPayouts())
            }
            
            return res.render('Owner/Payouts/payouts', pageInfo);            
        });
    }

    public static adminFinishedPayouts(req,res){
        isAdmin(req,res,true).allowed(async admin =>{ 
            let pageInfo = { 
                resources : RESOURCES_PATH,
                requests : (await PaymentController.getFinishedPayouts())
            }
            
            return res.render('Owner/Payouts/finished', pageInfo);            
        });
    }

    public static adminProgress(req,res){ 
        isAdmin(req,res,true).allowed(async admin =>{ 
            let pageInfo = { 
                resources : RESOURCES_PATH,
                requests : (await PaymentController.getProgressPayouts())
            }
            
            return res.render('Owner/Payouts/progress', pageInfo);            
        });
    }

    public static adminDashboard(req,res){
        let pageInfo = {
            pageName : "Dashboard",
            resources : RESOURCES_PATH                
        };

        isAdmin(req,res).allowed( admin =>  Statistics.Instance.AllStats().then(all => {           
            pageInfo['stats'] = all;
            return res.render('Owner/admin',pageInfo)
        }));
    }

    public static adminProduct(req,res){
        let pageInfo = {
            pageName : "Dashboard",
            resources : RESOURCES_PATH                
        };

        isAdmin(req,res).allowed( admin =>  ProductController.GetUnchecked().then(all => {                 
            pageInfo['products'] = all;
            return res.render('Owner/products',pageInfo)
        }));
    }

    public static adminRequest(req,res){
        isAdmin(req,res).allowed( async admin => {
           let request = (await PaymentController.getRequest(req.params.id));
           
           if(!request.success){
               return res.redirect('/admin/ab/dashboard')
           }

           let pageInfo = { resources : RESOURCES_PATH, result : request.result }

           return res.render('Owner/Payouts/request', pageInfo)
        });
    }
    
    public static adminQuestions(req,res){
        isAdmin(req,res).allowed( async admin => { 
            let pageInfo = { resources : RESOURCES_PATH }
 
            return res.render('Owner/Support/questions', pageInfo)
         });
    }

    public static adminQuestion(req,res){
        isAdmin(req,res).allowed( async admin => {
            let pageInfo = { 
                resources : RESOURCES_PATH,
                question: (await Question.byId(req.params['id']))
            }
            
            return pageInfo.question ?  
                    res.render('Owner/Support/question', pageInfo): 
                    res.redirect('/admin/ab/questions')
        })
    }
}

