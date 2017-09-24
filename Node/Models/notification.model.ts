import * as uuid from 'uuid/v4'

import { NotificationSchema } from '../Database/database.controller'
import RealtimeController from '../Controllers/realtime.controller'

import User from '../Models/user.model'

interface NotificationCreation{
    type : string,
    action : string,
    message : string,
    title : string,
    userId : string
}

export default class Notification {
    private dbNotification : any;

    public static Create(data : NotificationCreation) : Promise<any>{
        return NotificationSchema.create({
            recordId : uuid(),
            userId : data.userId,
            type : data.type,
            title : data.title,
            message : data.message,
            action : data.action
        });
    }

    public static Review(user : string, action : string) : Promise<any>{
        return new Promise((resolve, reject) => {
            NotificationSchema.update({
                isViewed : true
               },{
                where : {
                    userId : user,
                    action : action
                },
                returning: true
            })
             .then( result => {            
                RealtimeController.Instance.emitReviewNotification(user, result[1][0].recordId )
                resolve("Emitted and saved")
             })
             .catch( error => reject(error))
        });
    }

    public static GetLast(user : User) : Promise<any>{
        return NotificationSchema.findAll({
            where : {
                userId : user.PublicData.uid,
                isViewed : false
            },
            order: [['updatedAt', 'DESC']]
        })
    }

    public static GetCount(user : User) : Promise<any>{
        return NotificationSchema.count({
            where : {
                userId : user.PublicData.uid,
                isViewed : false
            }
        });
    }

    public static ReviewLast(user : User) : Promise<any>{
        return NotificationSchema.update({
            isViewed : true
        },{
            where : {
                userId : user.PublicData.uid,
                isViewed : false
            }
        })
    }

    public static CreateAuction(user : string , data : any ) : Promise<any>{
        return Notification.Create({
            userId : user,
            title : `Auction winnings !`,
            message : `Congratulations ! You won "${data.title}".`,
            action : data.action,
            type : `aw`
        });
    }

}