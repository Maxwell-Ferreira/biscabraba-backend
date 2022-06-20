interface WithError {
    errors: Array<any>
}

export interface PlayerPublicData {
    publicId: number,
    name: string,
    avatar: number,
    points: number,
    team: number,
    numCards: number,
    actualMove: Card|null
};

export interface Card {
    id: number,
    name: string,
    naipe: string,
    value: number,
    order: number
}

export interface Message {
    player: string,
    text: string
}

export interface createProps extends WithError{
    idRoom: string,
    avatar: number,
    playerName: string,
    numPlayers: number
}

export interface enterProps extends WithError{
    idRoom: string,
    playerName: string,
    avatar: number
}