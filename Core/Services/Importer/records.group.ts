import * as _ from 'lodash'

interface GrouperOptions{
    id: string,
    toGroup: {
        translator: Function,
        into: string,
        id: string
    }[]
}

class RecordsGrouper{

    public productGroup(payload: any[],options: GrouperOptions): any[]{
        let result = {};
        let temp = null;
        
        payload.forEach(e => {
            if(result[e[options.id]]){
                temp = result[e[options.id]];

                options.toGroup.forEach(gr => temp[gr.into].push(gr.translator(e[gr.id],e)));
                result[e[options.id]] = temp;                   
            }else{               
                options.toGroup.forEach(gr => e[gr.into] = [gr.translator(e[gr.id],e)])
                result[e[options.id]] = e;
            }
        });

        result = Object.values(result).map(e => {
            options.toGroup.forEach(gr => e[gr.into] = _.uniqWith(e[gr.into],_.isEqual));
            return e;
        });
        return (<Array<any>>result);
    }

}

export default new RecordsGrouper()