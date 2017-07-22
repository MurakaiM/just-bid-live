import * as socketIo from 'socket.io'
import { AuctionStreamData } from '../Interfaces/auction.interfaces'

export default class RealtimeSocket{
    public static Instance : RealtimeSocket;

    private io;
    
    /* Namespaces */
    private authNms;
    private auctionNms;
    private notificationNms;


    constructor(server){
        this.io = socketIo(server);

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
            var user = this.socketUser(socket);
            if(user.logged_in == false){
                return socket.disconnect(true);
            }

            socket.join(user.uid);
            socket.on('status',() => this.authNms.to(user.uid).emit('status', buildResponse(socket)));
        });

        function buildResponse(socket){
            if(socket.request.user.logged_in)
                return {
                    signedIn : true,
                    user: socket.request.user
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

    
    private socketUser(socket : any) { return socket.request.user; }

    get Io() {
        return this.io;
    }

}