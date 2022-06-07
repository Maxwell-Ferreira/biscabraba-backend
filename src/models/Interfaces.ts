export interface PlayerPublicData {
    publicId: number,
    name: string,
    points: number,
    team: number,
};

export interface Card {
    name: string,
    naipe: string,
    value: number,
    order: number
}

export interface Message {
    player: string,
    text: string
}

export interface createProps {
    idRoom: string,
    playerName: string,
    numPlayers: number
}

export interface enterProps {
    idRoom: string,
    playerName: string
}