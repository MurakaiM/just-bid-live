import * as uuid from 'uuid/v4'
import { QuestionSchema } from '../Database/database.controller'

interface QuestionParams{
    message : string,
    firstName : string,
    lastName : string,
    email : string,
    type : number
}

export default class Question{

    public static create(params : QuestionParams): Promise<any>{
        return QuestionSchema.create({
            questionId : uuid(),
            message : params.message,
            contactor : `${params.firstName} ${params.lastName}`,
            email : params.email,
            type : params.type
        })
    }

    public static closeQuestion(id: string): Promise<any>{
        return QuestionSchema.update({
            isClosed: false
         },{
            where: {
                questionId: id
            }
        });
    }

    public static byId(id : string): Promise<any>{
        return QuestionSchema.findOne({
            where : { 
                questionId : id 
            }
        })
    }

    public static getNew(): Promise<any>{
        return QuestionSchema.findAll({
            order : [[ 'createdAt', 'DESC']],
            where : {
                isClosed : false
            }
        })
    }
    
}