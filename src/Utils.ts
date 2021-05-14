export class Utils {
    // redundant as typescript compiles to js intelligently same as Object.keys(object)
    static getKeys = (object: any) => {
        let keyArray: any[] = [];
        
        for (let key in object) {
            keyArray.push(key)
        }
        return keyArray
    }


}