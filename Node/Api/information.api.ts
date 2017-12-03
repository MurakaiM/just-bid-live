import { BuildResponse } from '../Utils/Communication/response'

import BasicController from '../Utils/Controllers/basic.controller'
import { RESOURCES_PATH } from '../keys';


export default class InformationApi extends BasicController{

    Configure(){
        this.Get('/info/copyright', this.renderCopyright);
        this.Get('/info/privacy', this.renderPrivacy);
        this.Get('/info/terms', this.renderTerms);

        this.Get('/info/protection/buyers', this.renderBuyers);
        //this.Get('/info/protection/sellers', this.renderSellers);
    }


    private renderCopyright(req,res){
        return res.render('./Informational/copyright',{
            pageName : 'Copyright Policy',
            resources :  RESOURCES_PATH,
            currentUser: undefined
        });
    }

    private renderPrivacy(req,res){
        return res.render('./Informational/privacy',{
            pageName : 'Privacy Policy',
            resources :  RESOURCES_PATH,
            currentUser: undefined
        });
    }

    private renderTerms(req,res){
        return res.render('./Informational/terms',{
            pageName : 'Terms and Conditions',
            resources :  RESOURCES_PATH,
            currentUser: undefined
        });
    }

    private renderBuyers(req,res){
        return res.render('./Informational/buyers-protection',{
            pageName : "Buyer's Protection",
            resources :  RESOURCES_PATH,
            currentUser: undefined
        });
    }

    private renderSellers(req,res){

    }

}