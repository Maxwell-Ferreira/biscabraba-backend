export function stringSize(array: Array<string>, size: number, type: number = 1) {
    for (let item of array) {
        if (type == 1) {
            if (item.length > size) {
                return false;
            }
        } else {
            if (item.length < size) {
                return false;
            }
        }
    }

    return true;
}

export function verifyDataCreate(data: any) {
    if (
        data &&
        data.idRoom &&
        data.numPlayers &&
        data.playerName &&
        typeof data.idRoom === 'string' &&
        typeof data.playerName === 'string' &&
        typeof data.numPlayers === 'number' &&
        [2, 4].includes(data.numPlayers) &&
        stringSize([data.playerName], 4, 0) &&
        stringSize([data.idRoom], 4)
    )
        return true;
    return false;
}

export function verifyDataEnter(data: any) {
    if (
        data &&
        data.idRoom &&
        data.playerName &&
        typeof data.idRoom === 'string' &&
        typeof data.playerName === 'string' &&
        stringSize([data.playerName], 4, 0) &&
        stringSize([data.idRoom], 4)
    )
        return true;
    return false;
}

export function verifyPlay(cardPlayed:number){
    if(
        typeof cardPlayed === 'number' &&
        cardPlayed >= 0 &&
        cardPlayed < 3
    ) return true;

    return false;
}