export default class Middleware{

    public static RawBody(req,res,next){
        req.rawBody = '';
        req.setEncoding('utf8');

        req.on('data', chunk => req.rawBody += chunk);      
        req.on('end', event => next());
    }
}
