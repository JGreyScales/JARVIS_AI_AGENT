import { diff } from "node:util";

class objectType {
    constructor() {}

    public displayObject(){
        Object.entries(this).forEach(property => {
            console.log(`${property[0]}: ${property[1]}`)
        });
    }

    public getDifferences(other: Object, own: Object){
        let differences: Map<string, any> = new Map();
        if (other.constructor.name != own.constructor.name){
            return differences;
        }

        Object.entries(own).forEach(property => {
            const otherValue = (other as any)[property[0]]

            if (property[1] != otherValue){
                differences.set(property[0], otherValue);
            }
        })

        return differences;
    }
}

export default objectType