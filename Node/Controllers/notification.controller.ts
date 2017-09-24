import { AwaitResult } from '../Utils/Communication/async'

import Notifications from '../Models/notification.model'
import User from '../Models/user.model'

export default class NotificationController {

    public static LastNotifications(user){
        return Notifications.GetLast(user);
    }

    public static CountNotifications(user){
        return Notifications.GetCount(user);
    }

    public static TypeWnning(user,data){       
        return Notifications.CreateAuction(user, data)
    }

    public static ReviewNotification(user : User, action : string){
        return Notifications.Review(user.PublicData.uid, action)
    }

}