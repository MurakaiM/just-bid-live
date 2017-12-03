export default class TimeModule{

    public static getSeconds(seconds: number): number{
        return seconds * 1000; 
    }  

    public static getMinutes(minutes: number): number{
        return minutes * TimeModule.getSeconds(60); 
    }

    public static getHours(hours: number): number{
        return hours * TimeModule.getMinutes(60); 
    }

    public static getTime(hours: number, minutes: number, seconds: number) : number{
        return TimeModule.getHours(hours) + TimeModule.getMinutes(minutes) + TimeModule.getSeconds(seconds);
    }

    public static getRandomSeconds(min: number, max: number): number {
        return TimeModule.getSeconds(Math.random() * (max - min) + min)
    }

    public static convertTime( date: any): string{
        const dt = new Date(date);
        const data = {
            day : dt.getDate() < 10 ? 0+""+dt.getDate() : dt.getDate(),
            month : (dt.getMonth() + 1) < 10 ? 0+""+(dt.getMonth()+1) : dt.getMonth()
        };

        return `${data.day}.${data.month}.${dt.getFullYear()}`
    }
    
}