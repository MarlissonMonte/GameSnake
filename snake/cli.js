const readline = require('readline');
const Snake    = require('./snake')
const base     = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])


// Estado é mutável
let State = Snake.initialState() 


// Operações da matriz de jogo
const Matrix = {
  make:       table => rep(rep('🌾')(table.cols))(table.rows),         // A função make serve para criar a mesa/mapa, repetindo '.' pela quantidade de colunas e linhas definidas no estado inicialEssa, ou seja, a função é responsável por retornar o campo do jogo, cada quadrado do campo é representado por (.). 
  set:        val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))),    // A função set rececebe como parâmentro um val e uma pos e devolve uma comparação dentre tals parâmetros para assim o valor de um for igual ao o outro devolver o primeiro parâmetro caso contrário o proximo parâmetro.
  addSnake:   state => pipe(...map(Matrix.set('🔘'))(state.snake)),    // Essa função adiciona a cobra como vemos no jogo, definido como será o elemento na qual ela se constitui e adicionando ela no mapa. Alteramos o corpo da cobra para ('🔘'), assim a estética dela ficará mais destacada.
  addApple:   state => Matrix.set('🍎')(state.apple),                  // Essa função representa a estrutura da "maça" onde pega seu estado atual e devolve o lugar em que ela se encontra. Alteramos a "maça" para ('🍎'), assim a estética ficará similiar a de uma maça e o jogo fica mais divertido/criativo.
  addPoison1: state => Matrix.set('⛔')(state.poison1),                // A criaçao dessa função tem intuito deixa o jogo mais dinâmico, ela irá dimiuir uma fração do tamanho da cobra, ou seja, UM pedaço dela, caso a cobra esteja penas com UM PONTO ela dará Game Over.
  addPoison2: state => Matrix.set('⛔')(state.poison2),                //*A criaçao dessa função tem intuito deixa o jogo mais dinâmico, ela irá dimiuir uma fração do tamanho da cobra, ou seja, UM pedaço dela, caso a cobra esteja penas com UM PONTO ela dará Game Over.
  addtrap:    state => Matrix.set('💀')(state.trap),                   // Criamos essa função com objetivo de criar um "veneno" onde pega seu estado atual e devolve o lugar em que ele se encontra.
  addtrap2:   state => Matrix.set('💀')(state.trap2),                  //*Criamos essa função com objetivo de criar um "veneno" onde pega seu estado atual e devolve o lugar em que ele se encontra.
  addCrash:   state => state.snake.length == 0 ? map(map(k('😭'))):id, // Essa função usa uma CONDIÇÃO TERNÁRIA para verificar o tamanho da cobra, se o tamanho da cobra for igual a 0 ele irá da GAME OVER com a interface do jogo com o simbolo ('😭'), caso contrario retorna o seu estado. Alteramos a ilustração final do fim do jogo para ('😭'), assim ficará mais didático que a partida do jogo chegou ao seu fim, ou seja, Game Over.  
  toString:   xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'),       // Essa função é resposável pelo espaçamento entre cada quadrado do campo do jogo. 
  fromState:  state => pipe( 
    Matrix.make,              // Adiciona o espaço do jogo de forma visível na mesa/campo (dentro do jogo).
    Matrix.addSnake(state),   // Adiciona a cobra de forma visível na mesa/campo (dentro do jogo).
    Matrix.addApple(state),   // Adiciona a maça de forma visível na mesa/campo (dentro do jogo).
    Matrix.addCrash(state),   // Adiciona a colisão de forma visível na mesa/campo (dentro do jogo).
    Matrix.addPoison1(state), // Adiciona o veneno de forma visível na mesa/campo (dentro do jogo).
    Matrix.addPoison2(state), // Adiciona o segundo veneno de forma visível na mesa/campo (dentro do jogo).
    Matrix.addtrap2(state),   // Adiciona a armadilha de forma visível na mesa/campo (dentro do jogo).
    Matrix.addtrap(state)     // Adiciona a segunda armadilha de forma visível na mesa/campo (dentro do jogo).
  )(state)
}


// Eventos do teclado
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => { 
  if (key.ctrl && key.name === 'c') process.exit()
  switch (key.name.toUpperCase()) {  // Essa funcão switch garante o sistema de movimentação do jogo com base ao combado no usuário, indicando para que direção e sentido a cobra irá se mover, alterando o estado dela dentro do jogo.
    case 'W': case 'K': case 'UP':    State = Snake.enqueue(State, Snake.NORTH); break  // Essa case indica a direção NORTE (Para cima).
    case 'A': case 'H': case 'LEFT':  State = Snake.enqueue(State, Snake.WEST);  break  // Essa case indica a direção OESTE (Para esquerda).
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, Snake.SOUTH); break  // Essa case indica a direção SUL   (Para baixo).
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST);  break  // Essa case indica a direção LESTE (Para direita).
  } 
});


/**
 * LAÇO PRINCIPAL DO JOGO
 */
const score = state => state.snake.length -1 // A constante criada para retonar o tamanho da cobra durante o jogo e conseguinte pontuação ao decorrer do Game.
                                            // Ela utiliza o estado atual do jogo e retorna o tamanho da lista referente a cobra.
const velociPNVL = state => score(state) >= 5 ? (score(state) >= 10 ? (score(state) >= 15 ? 6 : 5) : 4 ): 3

const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State))+ '\n' + '[score:' + score(State)+']'+ '[speed:' + velociPNVL(State) +']') // A constante shown é resposável por mostrar o jogo no Terminal, adicionamos um contador de ponto no jogo chamado de 'score' que conta quantas maças a cobra comeu no momento.
const step = () => State = Snake.next(State) // Movimentação da cobra

const vel = (v=3) => {              // Referente a taxa de atualização do jogo em milisegundos; dependendo do numero que essa funcao retorna, o jogo atualizará na taxa em milisegundos descrita pelo numero retornado.
    switch (v) {
        case 1:  return 250; break; //  Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
        case 2:  return 200; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo. 
        case 3:  return 150; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
        case 4:  return 100; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
        case 5:  return 075; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
        case 6:  return 050; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
        default: return 150; break; // *Esses casos se referem ao nível de velocidade em que o jogo atualiza e por consequencia a velocidade de movimentação da cobra dentro do jogo.
    }
}

setInterval(() => { step();  show();  }, vel(3)) //vel(1) to vel(5); default = vel(3) 
//'setInteval' é uma funcao que retorna determinada(s) funcao(oes) em um tempo definido em milisegundos. 