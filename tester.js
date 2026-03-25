const { io } = require("socket.io-client");

const URL = process.env.URL || "http://localhost:4000";
const MAX_PLAYERS = 2; // Para testar com 4 basta alterar para 4

const roomName = "teste" + Math.floor(Math.random() * 9999);
let clients = [];

const delay = ms => new Promise(res => setTimeout(res, ms));

async function runTest() {
  console.log(`🃏 Iniciando Testador Automático com ${MAX_PLAYERS} jogadores...`);
  console.log(`Conectando ao servidor em: ${URL}`);
  
  for(let i = 0; i < MAX_PLAYERS; i++) {
    const client = io(URL);
    clients.push(client);
    
    client.on("connect", () => {
      console.log(`[Bot ${i+1}] Conectado -> Socket ID: ${client.id}`);
      if(i === 0) {
        console.log(`[Bot ${i+1}] Criando sala "${roomName}"...`);
        client.emit("createRoom", {
          idRoom: roomName,
          playerName: "Robô 1",
          numPlayers: MAX_PLAYERS,
          avatar: "1"
        });
      } else {
        console.log(`[Bot ${i+1}] Entrando na sala...`);
        client.emit("enterRoom", {
          idRoom: roomName,
          playerName: `Robô ${i+1}`,
          avatar: String(i+1)
        });
      }
    });

    client.on("connect_error", (err) => {
        console.error(`[Bot ${i+1}] Falha na conexão:`, err.message);
    });
    
    client.on("error", (err) => {
        console.error(`[Bot ${i+1}] ❌ ERRO SERVIDOR:`, err);
    });

    // Fica escutando os eventos clássicos
    client.on("startGame", (data) => {
        if(i === 0) console.log(`\n🔥 Partida Iniciada! Trunfo do Jogo: ${data.gameTrump.toUpperCase()}\n`);
        handleTurn(client, data, i + 1, "startGame");
    });

    client.on("card-played", (data) => {
        handleTurn(client, data, i + 1, "card-played");
    });

    client.on("buy-card", (data) => {
        if(i === 0) { // Somente um bot avisa sobre o resumo da rodada para não flodar 2x
            console.log(`\n=================================`);
            console.log(`✅ FIM DE RODADA!`);
            const winnerId = data.playerTurn;
            const roundWinner = data.players.find(p => p.publicId === winnerId);
            console.log(`👑 Vencedor da Rodada: ${roundWinner ? roundWinner.name : 'Desconhecido'}`);
            console.log(`📊 Placar Atual:`);
            data.players.forEach(p => {
                console.log(`   - ${p.name}: ${p.points} pontos`);
            });
            console.log(`🎴 Cartas restantes no Baralho Geral: ${data.numberOfCardsInDeck}`);
            console.log(`=================================\n`);
        }
        handleTurn(client, data, i + 1, "buy-card");
    });

    // Evento de vitória (Mata a execução)
    client.on("winnerTeam", (winners) => {
        if(i === 0) {
            console.log(`\n🏆 FIM DE JOGO!`);
            console.log(`=================================`);
            console.log(`A equipe ${winners[0].team} VENCEU!`);
            console.log(`Integrantes: ${winners.map(w => w.name).join(' e ')}`);
            const pts = winners.reduce((acc, prev) => acc + prev.points, 0);
            console.log(`Pontos Finais (Tirados no Servidor): ${pts}`);
            console.log(`=================================`);
            console.log("Teste finalizado com sucesso!");
            process.exit(0);
        }
    });

    await delay(300); // Pequeno delay de sincronia para cada Bot conectar
  }
  
  await delay(1200);
  console.log(`\n[Servidor Master] Preparando para inicializar as compras...\n`);
  clients[0].emit("startGame", {});
}

function handleTurn(client, data, botId, eventName) {
    if (!data.gameStatus) return;

    const me = data.currentPlayer;
    if (!me) return;

    // Proteção: O evento 'card-played' na última carta da rodada emite um estado intermediário falso.
    // Ignoramos e aguardamos o evento 'buy-card' que trará a soma de cálculos do ganhador verdadeira.
    if (eventName === "card-played" && (data.numberOfPlays % data.numPlayers === 0)) {
        return;
    }

    // Se é a minha vez, devo jogar uma carta
    if (data.playerTurn === me.publicId) {
        
        // Trava para evitar reagir duas vezes ao mesmo turno (ex: evento card-played logo antes de buy-card)
        if (client.lastPlayedTurn === data.numberOfPlays) return;
        client.lastPlayedTurn = data.numberOfPlays;
        
        let validCards = me.hand.filter(card => {
             const isSevenTrump = card.naipe === data.gameTrump && card.order === 8;
             const isAceTrump = card.naipe === data.gameTrump && card.order === 9;
             
             // Regra 1: O Ás de trunfo não pode sair antes do 7 de trunfo (estado em data.statusAs)
             if (isAceTrump && !data.statusAs) return false;
             
             // Regra 2: O 7 de trunfo não pode ser a última carta jogada da rodada
             const isLastPlayOfRound = (data.numberOfPlays % data.numPlayers) === (data.numPlayers - 1);
             if (isSevenTrump && isLastPlayOfRound) return false; 
             
             return true;
        });
        
        // Se as regras te impedirem de jogar tudo, apela pra primeira na mão (mesmo dando erro)
        let cardToPlay = validCards.length > 0 ? validCards[0] : me.hand[0];
        
        if (cardToPlay) {
            setTimeout(() => {
                console.log(`[Bot ${botId}] Jogou: -> ${cardToPlay.name.toUpperCase()} DE ${cardToPlay.naipe.toUpperCase()}`);
                client.emit("playCard", { card_id: cardToPlay.id });
            }, 300); // 300ms por jogada
        }
    }
}

runTest();
