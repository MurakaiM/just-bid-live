import * as express_session from 'express-session'
import * as Redis from 'redis'

const RedisStore = require('connect-redis')(express_session);


export default class RedisStorage{
    public static Instance : RedisStorage;
    private SessionStore : any;

    constructor(options : any){
        this.SessionStore = new RedisStore({url : options });   
        RedisStorage.Instance = this;
    }

    get _session():any { return this.SessionStore };
}