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

    public static TypeWinning(user,data){       
        return Notifications.CreateAuction(user, data)
    }

    public static TypePaid(user,data){
        return Notifications.CreateCharge(user, data)
    }

    public static TypePaidError(user,data){
        return Notifications.CreateError(user,data)
    }

    public static ReviewNotification(user : User, action : string){
        return Notifications.Review(user.PublicData.uid, action)
    }

    public static ReviewRedirected(user : User, id : string){
        return Notifications.ReviewRedirected(user.PublicData.uid, id)
    }

    public static ReviewAllNotifications(user : User){
        return Notifications.ReviewLast(user);
    }
}