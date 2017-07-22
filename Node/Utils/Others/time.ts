export default class TimeModule{

    public static getSeconds(seconds : number) : number{
        return seconds * 1000; 
    }  

    public static getMinutes(minutes : number) : number{
        return minutes * TimeModule.getSeconds(60); 
    }

    public static getHours(hours : number) : number{
        return hours * TimeModule.getMinutes(60); 
    }

    public static getTime(hours : number, minutes : number, seconds : number){
        return TimeModule.getHours(hours) + TimeModule.getMinutes(minutes) + TimeModule.getSeconds(seconds);
    }

}