import { Socket } from 'socket.io';
import Game from './models/Game';
import Player from './models/Player';

import { createProps, enterProps } from './models/Interfaces';
import { emitError, findGameIndex, findGame, findGameIndexByPlayerId } from './Utils';
import { stringSize, verifyDataCreate, verifyDataEnter, verifyPlay } from './Validate';

function App(io: any) {

    let games: Array<Game> = [];

    io.on('connection', function (socket: Socket) {
        console.log(`Socket connected -> id:${socket.id}`);

        //Event that a player tries to create a new game
        socket.on('createGame', function (props) {

            const data = <createProps>props;

            if (verifyDataCreate(data)) {
                if (!findGame(games, data.idRoom)) {

                    socket.join(data.idRoom);

                    const newGame: Game = new Game(data.idRoom, data.numPlayers);

                    games.push(newGame);

                    socket.emit('createGame', 'Jogo criado.');

                } else {
                    emitError(socket, 'Já existe uma sala com este ID.');
                }

            } else {
                emitError(socket, 'Dados inválidos.');
            }
        });

        //Event that a new player tries to enter in a room
        socket.on('enterRoom', (props) => {
            const data = <enterProps>props;

            if (verifyDataEnter(data)) {

                const gameIndex = findGameIndex(games, data.idRoom);

                if (gameIndex !== -1) {
                    const player = new Player(socket.id, data.playerName, data.idRoom);
                    const game = games[gameIndex];

                    game.addNewPlayer(player);
                    games[gameIndex] = game;

                    socket.join(game.getId());
                    socket.emit('playerData', player);

                    socket.broadcast.to(data.idRoom).emit('newPlayer', player.getPublicData());
                } else {
                    emitError(socket, 'Socket não conectado à nenhuma sala.');
                }
            }
            else {
                emitError(socket, 'Dados inválidos.');
            }
        });

        socket.on('gameInitialize', () => {
            const gameIndex = findGameIndexByPlayerId(games, socket.id);

            if (gameIndex !== -1) {
                const game = games[gameIndex];

                if (game.initialize()) {
                    for (let player of game.getPlayers()) {
                        io.to(player.getId()).emit('updateGameData', game.getPublicData(player.getId()));
                    }

                    games[gameIndex] = game;
                } else {
                    emitError(socket, 'Ainda faltam jogadores para a partida ser iniciada.');
                }
            } else {
                emitError(socket, 'Socket não conectado à nenhuma sala.');
            }
        })

        //Event that a player tries to play a card
        socket.on('playCard', (play) => {
            if (verifyPlay(play)) {
                const gameIndex = findGameIndexByPlayerId(games, socket.id);

                if (gameIndex !== -1) {
                    const game = games[gameIndex];

                    const playResult = game.playCard(play, socket.id);

                    if(playResult === true){
                        
                        for (let player of game.getPlayers()) {
                            io.to(player.getId()).emit('updateGameData', game.getPublicData(player.getId()));
                        }

                        game.verifyRoundCompleted();

                        for (let player of game.getPlayers()) {
                            io.to(player.getId()).emit('updateGameData', game.getPublicData(player.getId()));
                        }

                        if(game.end()){
                            let winnerTeam = game.getWinner();

                            io.to(game.getId()).emit("winnerTeam", winnerTeam);
                        }

                        games[gameIndex] = game;
                    }

                } else {
                    emitError(socket, 'Socket não conectado à nenhuma sala.');
                }
            } else {
                emitError(socket, 'Dados inválidos.');
            }
        })

        socket.on('message', message => {
            const gameIndex = findGameIndexByPlayerId(games, socket.id);

            if (gameIndex !== -1) {
                const player = games[gameIndex].getPlayerById(socket.id);
                if (typeof message === 'string' && stringSize([message], 255) && stringSize([message], 0, 0)) {

                    const messageObject = {
                        playerName: player?.getName(),
                        text: message
                    }

                    io.to(player?.getRoom()).emit('message', messageObject);
                }
            }
        });

        socket.on('disconnect', () => {
            const gameIndex = findGameIndexByPlayerId(games, socket.id);

            if (gameIndex !== -1) {
                const game = games[gameIndex];

                if (game.getStatus() || game.getPlayers().length === 1) {
                    io.to(game.getId()).emit('playerDisconnected', `${game.getPlayerById(socket.id)} foi desconectado! A partida foi encerrada.`);
                    games.slice(gameIndex, 1);
                } else {
                    io.to(game.getId()).emit('removePlayer', game.getPlayerById(socket.id)?.getName());
                    games.slice(gameIndex, 1);
                }
            }

            console.log(`Socket disconnected -> id: ${socket.id}`);
        });
    });;
}

export default App;