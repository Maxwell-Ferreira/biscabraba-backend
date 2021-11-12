export function stringSize(array:Array<string>, size:number, type:number = 1){
    for(let item of array){
        if(type == 1){
            if(item.length > size){
                return false;
            }
        }else{
            if(item.length < size){
                return false;
            }
        }
    }

    return true;
}