import { BuildResponse } from '../Utils/Communication/response'
import { isAuth, AdminPath } from '../Utils/Communication/rules'
import { DOMAIN } from '../keys'

import BasicController from '../Utils/Controllers/basic.controller'
import ProductController from '../Controllers/product.controller'
import Statistics from '../Services/Statistics/statistics.loader'
import Render from '../Pages/admin.renderer'

import RealtimeController from '../Controllers/realtime.controller'
import QuestionController from '../Controllers/question.controller';
import Question from '../Models/question.model';
import Notificator from '../Services/Norifications/email.service';


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

        this.Get('/admin/ab/question/:id', Render.adminQuestion)
        this.Post('/admin/ab/question', this.answerQuestion)

        this.Post('/admin/ab/import', this.uploadProducts)
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
    

    @AdminPath
    protected newQuestions(req,res): void{    
        QuestionController.getNew()
            .then(result => res.send( BuildResponse(0, 'New questions were successfully fetched',result)))
            .catch(error => res.send(BuildResponse(10,error)))    
    }

    @AdminPath
    protected approvalProduct(req,res): void{
        ProductController.ApprovalProduct(req.user, req.body)
            .then( answer =>  answer.success ? 
                res.send( BuildResponse(0,'Product was changed')) :
                res.send( BuildResponse(10, answer.error)) 
            )   
    }

    protected uploadProducts(req,res): void{       
        ProductController.UploadProducts(req.user, req.files.cvs).then(result => res.send(result));
    }

    @AdminPath
    protected async answerQuestion(req,res): Promise<any>{
        let options: Array<string> = (<String>req.headers.referer).split('/');
        let id: string = options.pop();
        
        let question = await Question.byId(id);                
        question.isClosed = true;

        await Notificator.Instance.sendAnswer(req.body.message,question.email);
        await question.save();

        return res.send(`
            Your answer was successfully submitted.<br>
            Redirecting back in 3 seconds.

            <script>
                setTimeout(function(){ window.location.href='/admin/ab/questions'; }, 3000)
            </script>
        `);
    }
}