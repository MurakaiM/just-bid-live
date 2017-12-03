import { AwaitResult } from '../Utils/Communication/async'
import { validQuestionCreate } from '../Utils/Others/validator'
 
import Question from '../Models/question.model'



export default class QuestionController{

    public static async ForceCreate(params: any): Promise<AwaitResult>{
        let hasError = validQuestionCreate(params);

        if(hasError.invalid){
            return { success : false, error : hasError.reason }
        }

        try{
            await Question.create({
                email : params.email,
                firstName : params.firstName,
                lastName : params.lastName,
                message : params.message,
                type : params.type
            })
            
            return { success : true, result : 'Successfully created' }
        }catch(error){
            console.log(error)
            return { success : false, error }
        }

    }

    public static getNew(): Promise<any>{
        return Question.getNew();
    }
}