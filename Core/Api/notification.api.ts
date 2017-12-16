import { BuildResponse } from '../Utils/Communication/response'
import { isAuth }  from '../Utils/Communication/rules'

import BasicController from '../Utils/Controllers/basic.controller'
import NotificationController from '../Controllers/notification.controller'

export default class NotificationApi extends BasicController{

    Configure(){
        this.Get('/notification/review', this.reviewNotification);        
    }

    protected reviewNotification(req,res){
        isAuth(req,res).allowed(user => NotificationController.ReviewRedirected(user, req.query.id)
                        .then(result => res.redirect(req.query.redirect))
                        .catch(error => res.redirect(req.query.redirect))
        )
    }


}
