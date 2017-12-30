import * as db from '../../Database/database.controller'
import * as shd from 'node-schedule'
import * as moment from 'moment'

import { JobCallback } from 'node-schedule';


export default class TaskRunner{

    constructor(){
        this.payoutSchedule();
        this.winningSchedule();
    }


    private payoutSchedule(){
        shd.scheduleJob('seller:payout-available',{ hour: 0}, async () => {
            await db.BillingSchema.update({
                available: true
             },{
                where: {
                    chargeId: { $ne : null },
                    updatedAt: { $lte : moment().subtract('14','days')}
                }
            });
        })
    }

    private winningSchedule(){
        shd.scheduleJob('customer:winning-stash',{ hour: 0}, async () => {
            await db.WinningSchema.destroy({
                where: {            
                    status: 'New',    
                    createdAt: { $lte : moment().subtract('14','days')}
                }
            });
        })   
    }


}