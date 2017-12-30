import * as csv from 'fast-csv'


class CSVParser{

    public parseFile(file: any): Promise<any[]>{
        return this.promisedParse(file.data.toString(), {
            headers: true
        });
    }

    private promisedParse(incoming: string, options: Object): Promise<any[]>{
        return new Promise((resolve,reject) => {
            let result = [];
           
            csv.fromString(incoming, options)
            .on("data", data => result.push(data))            
            .on("end", event => resolve(result));
        })        
    }

}


export default new CSVParser();
