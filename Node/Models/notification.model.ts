import * as uuid from 'uuid/v4'

import { NotificationSchema } from '../Database/database.controller'

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

    public static CreateAuction(user : User, data : any ) : Promise<any>{
        return Notification.Create({
            userId : user.PublicData.uid,
            title : `Auction winnings !`,
            message : `Congratulations ! You won "${data.title}".`,
            action : ``,
            type : `aw`
        });
    }

}