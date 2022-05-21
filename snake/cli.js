const readline = require('readline');
const Snake    = require('./snake')
const base     = require('./base')
Object.getOwnPropertyNames(base).map(p => global[p] = base[p])

// Estado é mutável
let State = Snake.initialState()

// Operações da matriz de jogo
const Matrix = {
  make:      table => rep(rep('.')(table.cols))(table.rows),
  set:       val   => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake:  state => pipe(...map(Matrix.set('O'))(state.snake)), // -Alteramos o corpo da cobra para "O", assim a estética dela ficará mais similar a de uma cobra.
  addApple:  state => Matrix.set('*')(state.apple), // -Alteramos a "maça" para "*", assim a estética ficará similiar a de uma maça.
  addPoison: state => Matrix.set('X')(state.poison),
  addCrash:  state => state.snake.length == 0 ? map(map(k(':('))) : id, // -Alteramos o a ilustração final do fim do jogo para ":(", assim fica com uma didático que que a partido do jogo chegou ao seu fim, ou seja, game over.  
  toString:  xsxs  => xsxs.map(xs => xs.join(' ')).join('\r\n'),
  fromState: state => pipe(
    Matrix.make,
    Matrix.addSnake(state),
    Matrix.addApple(state),
    Matrix.addCrash(state),
    Matrix.addPoison(state),
  )(state)
}

// Eventos do teclado
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit()
  switch (key.name.toUpperCase()) {
    case 'W': case 'K': case 'UP':    State = Snake.enqueue(State, Snake.NORTH); break
    case 'A': case 'H': case 'LEFT':  State = Snake.enqueue(State, Snake.WEST);  break
    case 'S': case 'J': case 'DOWN':  State = Snake.enqueue(State, Snake.SOUTH); break
    case 'D': case 'L': case 'RIGHT': State = Snake.enqueue(State, Snake.EAST);  break
  }
});

/**
 * LAÇO PRINCIPAL DO JOGO
 */

const show = () => console.log('\x1Bc' + Matrix.toString(Matrix.fromState(State)))
const step = () => State = Snake.next(State)

const vel = (v=3) => {
    switch (v) {
        case 1: return 250; break;
        case 2: return 200; break;
        case 3: return 150; break;
        case 4: return 100; break;
        case 5: return 50; break;
        default: return 150; break;
    }
}

setInterval(() => { step(); show() }, vel(3)) //vel(1) to vel(5); default = vel(3)
