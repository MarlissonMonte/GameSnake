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
const willEatW   = state => pointEq(nextHead(state))(state.trap)
const willEatP1  = state => pointEq(nextHead(state))(state.poison1)
const willEatP2  = state => pointEq(nextHead(state))(state.poison2)
const willEatW2  = state => pointEq(nextHead(state))(state.trap2)
//# retorna um booleano
/*
testa se a cabeça/inicio da cobra está no mesmo lugar que a maça,
confirmando assim que a cobra "comeu", sendo o objetivo do jogo para acrecimo de pontuacao e de tamanho da cobra.
*/

// Funções de ações
const willEat   = state => pointEq(nextHead(state))(state.apple) // #retorna booleano
/*
Essa constante willEat testa se a cabeça/inicio da cobra está no mesmo lugar que a maça, confirmando assim que a cobra "comeu",
sendo o objetivo do jogo para acrecimo de pontuacao e de tamanho da cobra.
*/
const willPoison = state => pointEq(nextHead(state))(state.poison) //retorna booleano
//
const willCrash = state => state.snake.find(pointEq(nextHead(state)))  
    || pointEq(nextHead(state))(state.trap) // #Adicionando trap
    || pointEq(nextHead(state))(state.trap2)
/*
Adicionamos uma condição para o caso da cobra entrar em contato com o veneno. 
O willCrash testa se a cobra entou em contato com ou ela mesma ou se sua "cabeça" se encontra na mesma posição dentro da matriz q o veneno. Caso retorne True em qualquer uma das condições, o jogo se encerra
*/
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

const nexttrap    = state => willEatW(state)  ? rndPos(state) : state.trap    // trap
const nextPoison1 = state => willEatP1(state) ? rndPos(state) : state.poison1 // 
const nextPoison2 = state => willEatP2(state) ? rndPos(state) : state.poison2 //
const nexttrap2   = state => willEatW2(state) ? rndPos(state) : state.trap2   // retorna um novo state de venon, i.e uma nova posição dentro da martrix/mapa

const nextHead  = state => state.snake.length == 0
  ? { x: 2, y: 2 }
  : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
  }
const nextSnake = state => willCrash(state) //A constante nextSnake testa o estado da cobra atraves da funcao willCrash que por sua vez, caso retorne true, a cobra será reduzida a uma lista vazia.
? [] 
: (willEatP1(state)) 
  || (willEatP2(state)) 
  || (willEatW2(state)) 
    ? dropLast([nextHead(state)]).concat(dropLast(state.snake)) // Adicinado uma condiçao para testar se a cobra entrou em contato com o veneno e, caso positivo, será subtraido um ponto do tamanho da cobra. Isso é feito zerando o newHead utilizando a funcao dropLast resultando em uma lista vazia que concatenara com a lista da cobra retornada com 1 ponto a menos atraves da própria funcao dropLast.
                                                                // Outra situação é caso a cobra tenha apenas 1 ponto de tamanho e entrar em contato com o veneno, ela ficará zerada, resultando no final do jogo.
    : (willEat(state) 
      ? [nextHead(state)].concat(state.snake)                   // Caso de positivo, um novo ponto de tamanho será adicionado a lista   da cobra usando da funcao .concat.
      : [nextHead(state)].concat(dropLast(state.snake)))        // caso negativo, o ponto também será adiconado, entretanto a lista da cobra perderá um ponto, assim a soma resultara em nenhuma mudança no total da cobra



// Aleatoriedade
const rndPos = table => ({
  x: rnd(0)(table.cols - 1),
  y: rnd(0)(table.rows - 1)
})
/*
A constante rndPos tem o objetivo de retornar uma posicao aleatória dentro da matriz/mapa,
recebendo o mapa como parametro e trazendo uma coordenada aleatória utilizando da funcao rnd (explicada no arquivo base.js) a qual recebe um valor minimo 0 e maximo 
sendo o numero de fileiras(referente ao eixo x) e colunas (referente o eixo y). 
*/


// Estado inicial
const initialState = () => ({ 
  cols:  20, // O cols é a quantidade de colunas da matriz do jogo. 
  rows:  15, // #Aumentamos o tamanho da linha para 15, assim agora o tamanho da matriz do jogo ficou 20x15.
  moves: [EAST], // A direção inicial da cobra está direcionado para o leste (direita).
  snake: [], // Em seu estado incial a cobra será dada como uma lista vazia, ou seja, seu tamanho ([]).
  poison1: {x: rnd(0)(19),y: rnd(0)(14)},
  poison2: {x: rnd(0)(19),y: rnd(0)(14)},
  trap2:   {x: rnd(0)(19),y: rnd(0)(14)},
  trap:    {x: rnd(0)(19),y: rnd(0)(14)},
  apple:   {x: rnd(0)(19),y: rnd(0)(14)}
})

/*
Essa constante initialState retorná um objt com seu estado inicial no jogo. 
*/
const next   = spec({ // objetos
  rows:    prop('rows'),
  cols:    prop('cols'),
  moves:   nextMoves,
  snake:   nextSnake,
  apple:   nextApple,
  poison1: nextPoison1, //#
  poison2: nextPoison2,
  trap2:   nexttrap2,
  trap:    nexttrap //#
})

const enqueue = (state, move) => validMove(move)(state)
  ? merge(state)({ moves: state.moves.concat([move]) })
  : state

module.exports = { EAST, NORTH, SOUTH, WEST, initialState, enqueue, next, }
