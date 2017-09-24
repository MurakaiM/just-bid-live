import * as socketIo from 'socket.io'
import * as io_passport from 'passport.socketio'
import * as cookieParser from 'cookie-parser'

import { AuctionStreamData } from '../Interfaces/auction.interfaces'

import NotificationController from '../Controllers/notification.controller'

import Redis from '../Database/database.redis'
import User from '../Models/user.model'

export default class RealtimeSocket{
    public static Instance : RealtimeSocket;

    private io;
    
    /* Namespaces */
    private authNms;
    private auctionNms;
    private notificationNms;


    constructor(server){
        this.io = socketIo(server);

        this.io.use(io_passport.authorize({ 
            cookie: {
                maxAge: 30 * 24 * 60 * 60 * 1000
            },      
            passport : require('passport'), 
            store : Redis.Instance._session,
            cookieParser: cookieParser,
            secret: 'small kittens',
            success: (data, accept) => { console.log('recconnect'); accept(null, true)},
            fail:  (data, message, error, accept) =>{ console.log('recconnect'); accept(null,true)}
          }));

        RealtimeSocket.Instance = this;
        
        this.initNamespaces();
        this.configureAuth()
        this.configureAuction();
    }

    private initNamespaces(){   
        this.authNms = this.io.of('/auth');
        this.auctionNms = this.io.of('/auction');
        this.notificationNms = this.io.of('/notifications');
    }

    private configureAuth(){
        this.authNms.on('connection', socket => {
            let user = this.socketUser(socket);

               
            if(user.logged_in == false){   
                  
                return socket.disconnect(true);
            }

            socket.join(user.PublicData.uid);

            socket.on('status', e => this.authNms.to(user.PublicData.uid).emit('status', buildResponse(socket)));

            socket.on('count', e => this.NotificationCount(user))
        });

        function buildResponse(socket){
            if(socket.request.user.logged_in)
                return {
                    signedIn : true,
                    user: socket.request.user.PublicData
                }
            else
                return {
                    signedIn : false,
                    user: undefined
                }    
        }
    }

    private configureAuction(){
        this.auctionNms.on('connection', socket => {
            
            socket.on('bid', (auctionUid, price) => {
                //refresh auction by auctUId and get new time

                var auction : AuctionStreamData;
                socket.emmit('new bid', auction);
            }); 

            socket.on('refresh', auctionUid => {
                var auction : AuctionStreamData;
                socket.emit('refresh', auction);
            });         
        });

        
    }   


    public emitExit( uid : string){  
        this.authNms.to(uid).emit('exit',false);
    }


    public emitBid( newBid : AuctionStreamData){
        this.auctionNms.emit('bid' , newBid);
    }

    public emitEnd( uidRecord : string){
        this.auctionNms.emit('end' , uidRecord);
    }

    public emitStock( oldItem : any){
        this.auctionNms.emit('stock' , oldItem); 
    }

    public emitNew( newItem : any){
        this.auctionNms.emit('new' , newItem);
    }

    public emitNewNotification( userId : string, data : any){      
        this.authNms.to(userId).emit('new:notification', data);
    }

    public emitReviewNotification( userId : string, data : any){ 
        this.authNms.to(userId).emit('view:notification', data);
    }

    
    private NotificationCount(user : User){
        NotificationController.CountNotifications(user)
            .then( 
                count => this.authNms.to(user.PublicData.uid).emit('count',count),
                error => this.authNms.to(user.PublicData.uid).emit('count',0)
            )
    }


    private socketUser(socket : any) { return socket.request.user; }

    get Io() {
        return this.io;
    }
}