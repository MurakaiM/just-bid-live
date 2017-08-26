import * as Sequelize from 'sequelize'

interface SearchOptions{
    sequelize : any,
    weights : Weights
}

interface Weights{
    [index : string] : string
}

export default class Search{
    private tableName : string;
    private weightsSQL : string;
    private sequelize : any;
    

    constructor(model : any, options : SearchOptions){
        this.tableName  = model.tableName;
        this.sequelize = options.sequelize;
        this.weightsSQL = this.generateSQL(options);
    }

    private generateSQL(options : SearchOptions ){
        let SQLStatment = '';
        let keys = Object.keys(options.weights);

        for(let i = 0; i < keys.length; i++ ){
            if(i == keys.length-1){
                SQLStatment+= `setweight( coalesce( to_tsvector("${keys[i]}"),'' ), '${options.weights[keys[i]]}' )`;
                break;
            }

            SQLStatment+= `setweight( coalesce( to_tsvector("${keys[i]}"),'' ), '${options.weights[keys[i]]}' ) || ' ' ||` 
        }

        return SQLStatment;
    }
    
    public search(attributes : [string], text : string) : Promise<any>{
        let tsvectorSQL : string = text.match(/\b(\w+)\b/g).join('|');       
        let attributesSQL : string = '';
        
        attributes.forEach( (attr,i) => {
            if(i == attributes.length - 1){
                attributesSQL+= this.tableName+`."${attr}"`
                return;
            }

            attributesSQL+= this.tableName+`."${attr}", `
        });

        console.log(tsvectorSQL);

        return this.sequelize.query(`
            SELECT ${attributesSQL}, ts_rank_cd(tsv, to_tsquery(:query)) AS rank
            FROM ${this.tableName}
            WHERE tsv @@ to_tsquery(:query)
            ORDER BY rank DESC;
        `,{ replacements: { query: tsvectorSQL },
            type: this.sequelize.QueryTypes.SELECT 
        })        
    }

    public setUp(){ 
        return new Promise((resolve, reject) => {            
            this.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`)
           .then( result => this.sequelize.query(`ALTER TABLE ${this.tableName} ADD COLUMN IF NOT EXISTS tsv tsvector`))
           .then( result =>  this.sequelize.query(`UPDATE ${this.tableName} SET tsv = ${this.weightsSQL}`))
           .then( result =>  this.sequelize.query(`CREATE INDEX IF NOT EXISTS tsv_index ON ${this.tableName} USING gin(tsv)`))
           .then( result => resolve(result))
           .catch( error => reject(error));
        });
    }



}