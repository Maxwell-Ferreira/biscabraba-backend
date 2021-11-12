export interface Card{
    name: string,
    naipe: string,
    value: number,
    order: number
}

export interface Message{
    player: string,
    text: string
}

export interface createProps{
    idRoom: string,
    playerName: string,
    numPlayers: number
}