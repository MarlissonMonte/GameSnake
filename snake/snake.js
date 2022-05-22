const base = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// Constantes de movimentação
const NORTH = { x: 0, y:-1 }
const SOUTH = { x: 0, y: 1 }
const EAST  = { x: 1, y: 0 }
const WEST  = { x:-1, y: 0 }
/*
Tais constantes servem para retornar a direcao que a cobra irá seguir. 
Cada constante recebe dois parametros que serão coerentes as direcoes e sentidos que a cobra ira tracar dentro da matriz/mapa.
*/

const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y
/*
A constante PointEq recebe dois parametros (p1) e (p2), respectivamente.
O objetivo dessa constante é comparar as posições de determinado item no mapa/matriz, testando se as cordenadas de p1 (x,y) são iguais a de p2 (x,y), 
retornando um valor True caso seja validado o teste e False, caso não.
*/


// Funções de ações
const willEat   = state => pointEq(nextHead(state))(state.apple) // retorna booleano
/*
Essa constante willEat testa se a cabeça/inicio da cobra está no mesmo lugar que a maça, confirmando assim que a cobra "comeu",
sendo o objetivo do jogo para acrecimo de pontuacao e de tamanho da cobra.
*/
const willPoison = state => pointEq(nextHead(state))(state.poison) //retorna booleano
//
const willCrash = state => state.snake.find(pointEq(nextHead(state)))
/*
Essa constante 'WillCrash' vereficada se a cabeca da cobra se encontra na mesma posicao que uma parte da cobra. 
*/
const validMove = move => state =>
  state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0
/*
A constante validMove serve para testar a validade do movimento. 
Ou seja, ela tem o objetivo de evitar que a cobra se movimente contra o seu sentido de direcao atual,
por exemplo se ela estiver vindo da esquerda para direita, ela não podera alternar esse sentido, senão passaria por cima de si mesma, ocasionando em uma colisão/Game Over.
*/


// Próximos valores baseados no estado atual
const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
const nextApple = state => willEat(state) ? rndPos(state) : state.apple //# retorna um novo state de maça, i.e uma nova posição dentro da martrix/mapa.
const nextPoison = state => willPoison(state) ? rndPos(state) : state.poison //

const nextHead  = state => state.snake.length == 0
  ? { x: 2, y: 2 }
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
  }
const nextSnake = state => willCrash(state) //A constante nextSnake testa o estado da cobra atraves da funcao willCrash que por sua vez, caso retorne true, a cobra será reduzida a uma lista vazia.
  ? []
  : (willEat(state) // Caso contrário, retornara um teste usando a funcao willEat para confirmar se a cobra "comeu" uma maça, caso positivo adicionará um novo elemento a cobra aumentando seu tamanho atravez da concatencação da nextHead com a snake em sua completude. Caso contrário, concatenará com a snake diminuida de seu ultimo elemento atraves da função dropLast
    ? [nextHead(state)].concat(state.snake)
    : [nextHead(state)].concat(dropLast(state.snake)))

// Aleatoriedade
const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})
/*
A constante rnd tem o objetivo de retornar uma posicao aleatória dentro da matriz/mapa,
recebendo o mapa como parametro e trazendo uma coordenada aleatória utilizando da funcao rnd (explicada no arquivo base.js) a qual recebe um valor minimo 0 e maximo 
sendo o numero de fileiras(referente ao eixo x) e colunas (referente o eixo y). 
*/


// Estado inicial
const initialState = () => ({
  cols:  20, // O cols é a quantidade de colunas da matriz do jogo. 
  rows:  15, // -Aumentamos o tamanho da linha para 15, assim agora o tamanho da matriz do jogo ficou 20x15.
  moves: [EAST], // A direção inicial da cobra está direcionado para o leste (direita).
  snake: [], // Em seu estado incial a cobra será dada como uma lista vazia([]).
  apple: { x: 16, y: 2 }, // A posição inicial da primeira maça do jogo (está na coluna/linha (16x2)). 
  poison: { x: 10, y: 5 } // A posição inicial do primeiro veneno do jogo (está na coluna/linha (10x5)). 
})

const next = spec({ // objetos
  rows:  prop('rows'),
  cols:  prop('cols'),
  moves: nextMoves,
  snake: nextSnake,
  apple: nextApple,
  poison: nextPoison //#
})

const enqueue = (state, move) => validMove(move)(state)
  ? merge(state)({ moves: state.moves.concat([move]) })
  : state

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
