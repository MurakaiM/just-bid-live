import { AwaitResult } from '../Utils/Communication/async'

import Notifications from '../Models/notification.model'

export default class NotificationController {

    public static LastNotifications(user){
        return Notifications.GetLast(user);
    }

    public static CountNotifications(user){
        return Notifications.GetCount(user);
    }

}