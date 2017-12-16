import { BuildResponse } from '../Utils/Communication/response'
import { isAuth, isAdmin } from '../Utils/Communication/rules'
import { DOMAIN } from '../keys'

import BasicController from '../Utils/Controllers/basic.controller'
import ProductController from '../Controllers/product.controller'
import Statistics from '../Services/Statistics/statistics.loader'
import Render from '../Pages/admin.renderer'

import RealtimeController from '../Controllers/realtime.controller'
import QuestionController from '../Controllers/question.controller';


export default class AdminApi extends BasicController {

    Configure(){   
        this.Get('/admin/ab/dashboard', Render.adminDashboard)
        this.Get('/admin/ab/products', Render.adminProduct)
        
        this.Get('/admin/ab/signout', this.signOut)
        this.Get('/admin/ab/product/:product', Render.adminExact)

        this.Post('/admin/ab/product/approval', this.approvalProduct)

        this.Get('/admin/ab/payouts', Render.adminPayouts)
        this.Get('/admin/ab/finished', Render.adminFinishedPayouts)
        this.Get('/admin/ab/progress', Render.adminProgress)

        this.Get('/admin/ab/questions/new', this.newQuestions)
        this.Get('/admin/ab/questions', Render.adminQuestions)

        this.Get('/admin/ab/request/:id', Render.adminRequest)
    }



    protected async approvalProduct(req,res){
        isAdmin(req,res).allowed( admin => 
            ProductController.ApprovalProduct(admin, req.body)
                .then( answer =>  answer.success ? 
                        res.send( BuildResponse(0,'Product was changed')) :
                        res.send( BuildResponse(10, answer.error)) 
                )                
        )
    }

    protected signOut(req,res): void{
        if(req.user) 
            var uid = req.user.PublicData.uid;      
        else 
            return res.redirect('/');

        req.session.destroy((err) => {         
            RealtimeController.Instance.emitExit(uid);
            res.redirect('/');
        });
    }
    
    protected newQuestions(req,res){
        isAdmin(req,res).allowed( admin => 
            QuestionController.getNew()
                .then(result => res.send( BuildResponse(0, 'New questions were successfully fetched',result)))
                .catch(error => res.send(BuildResponse(10,error)))                
        )
    }
}