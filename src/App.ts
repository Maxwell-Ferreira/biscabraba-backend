import { Socket } from 'socket.io';
import Game from './models/Game';
import { createProps } from './models/Interfaces';
import { stringSize } from './Utils';


declare type Teste = {
    idRoom: string,
    playerName: string,
    numPlayers: number
}

function App(io: any) {
    //const Helper = require('./Helper.js');

    var games: Array<Game> = [];

    io.on('connection', function (socket: Socket) {
        console.log(`Socket connected -> id:${socket.id}`);

        socket.on('createGame', function(req: Teste) {

            const data: createProps = req;

            if (stringSize([data.playerName], 4, 0) && stringSize([data.idRoom], 4) && data && data.idRoom && data.numPlayers && data.playerName) {

                let gameExist = games.find(game => game.getId() === data.idRoom);

                if (!gameExist) {

                    socket.join(data.idRoom);

                    let newGame: Game = new Game(data.idRoom, data.numPlayers);

                    games.push(newGame);

                    socket.emit('msg', 'Jogo criado.');

                    console.log(games);

                } else {
                    socket.emit('msg', { type: 'error', text: 'Esta sala já existe.' })
                }

            } else {
                socket.emit('msg', { type: 'error', text: 'Preencha os campos corretamente.' })
            }


            /* var verificacao = helper.verificarCriar(dados, jogos, socket.id);
            if (verificacao.result) {
                socket.join(dados.idSala);
                socket.sala = dados.idSala;
                jogos[socket.sala] = verificacao.resposta;
                console.log('iniciou a partida')
                socket.emit(verificacao.emit, verificacao.resposta.jogadores);
            } else {
                socket.emit(verificacao.emit, verificacao.resposta);
            } */
        });

        /* socket.on('entrarSala', (dados) => {
            var verificacao = helper.verificarEntrar(dados, jogos, socket.id);
            if (verificacao.result) {
                socket.join(dados.idSala);
                socket.sala = dados.idSala;
                jogos[socket.sala] = verificacao.resposta;
                socket.emit(verificacao.emit, jogos[socket.sala].jogadores);
    
                var player = jogos[socket.sala].jogadores[socket.id];
                socket.broadcast.to(dados.idSala).emit("novoJogador", { player });
            } else {
                socket.emit(verificacao.emit, verificacao.resposta);
            }
    
        });
    
        socket.on('iniciarPartida', () => {
            var verificacao = helper.verificarIniciar(jogos[socket.sala], socket.id);
            if (verificacao.result) {
                jogos[socket.sala] = verificacao.resposta.jogo;
    
                for (var j in jogos[socket.sala].jogadores) {
                    var dados = {
                        jogador: jogos[socket.sala].jogadores[j],
                        jogoEstado: jogos[socket.sala].getState(),
                        times: verificacao.resposta.times,
                        turnoJogador: verificacao.resposta.turnoJogador.nome
                    };
                    io.to(jogos[socket.sala].jogadores[j].id).emit(verificacao.emit, dados);
                }
            } else {
                socket.emit(verificacao.emit, verificacao.resposta);
            }
        });
    
        socket.on('jogarCarta', (jogada) => {
            verificacao = helper.verificarJogar(jogada, jogos[socket.sala], socket.id);
            if (verificacao.result) {
                var jogo = verificacao.resposta;
                jogos[socket.sala] = jogo;
    
                socket.emit('removerCartaMao', jogada);
    
                socket.broadcast.to(jogo.id).emit("removerCartaAdversario");
                io.to(jogo.id).emit(verificacao.emit, jogo.jogadores[socket.id].jogada);
                io.to(jogo.id).emit("jogadorTurno", jogo.jogadores[jogo.turno].nome);
    
                var pronto = helper.pronto(jogos[socket.sala]);
                if (pronto.result) {
                    jogos[socket.sala] = pronto.resposta;
                    if (jogos[socket.sala].baralho.length > 0) {
                        jogos[socket.sala].comprarCartas();
                    }
    
                    var acabaramCartas = true;
                    for (var j in jogos[socket.sala].jogadores) {
                        if (jogos[socket.sala].jogadores[j].mao.length > 0) {
                            acabaramCartas = false;
                            break;
                        }
                    }
    
                    for (var j in jogos[socket.sala].jogadores) {
                        io.to(jogos[socket.sala].jogadores[j].id).emit(pronto.emit, jogos[socket.sala].jogadores[j]);
                    }
    
                    if (acabaramCartas) {
                        var vencedor = helper.getVencedorPartida(jogos[socket.sala]);
                        io.to(socket.sala).emit("vencedor", vencedor);
                    }
    
                    io.to(jogo.id).emit("jogadorTurno", jogos[socket.sala].jogadores[jogos[socket.sala].turno].nome);
                }
            } else {
                socket.emit(verificacao.emit, verificacao.resposta);
            }
        });
    
        socket.on('mensagem', mensagem => {
            if (typeof socket.sala !== "undefined") {
                if (typeof mensagem === "string") {
                    if (mensagem.length <= 255 && mensagem.length > 0) {
                        var jogador = jogos[socket.sala].jogadores[socket.id];
                        io.to(socket.sala).emit("mensagem", { jogador: jogador.nome, texto: mensagem });
                    }
                }
            }
        });
    
        socket.on('disconnect', () => {
            if (typeof socket.sala !== "undefined") {
                if (typeof jogos[socket.sala] !== "undefined") {
                    if (jogos[socket.sala].status || Object.keys(jogos[socket.sala].jogadores).length == 1) {
                        io.to(socket.sala).emit("desconexao", `${jogos[socket.sala].jogadores[socket.id].nome} se desconectou! A partida foi encerrada :(`);
                        delete jogos[socket.sala];
                    } else {
                        io.to(jogos[socket.sala].id).emit("removerJogador", jogos[socket.sala].jogadores[socket.id].nome);
                        delete jogos[socket.sala].jogadores[socket.id];
                    }
                }
            }
    
            console.log(`Socket desconectado -> id: ${socket.id}`);
        }) */
    });;
}

export default App;