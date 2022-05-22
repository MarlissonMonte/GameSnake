//Funções de apoio
const adjust    = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
/*
A constante Adjust recebe um parâmetro (n), uma função (f) e uma lista ([xs]). Usando a função mapi que recebe 
a lista [(xs)] como segundo parâmetro e uma condição como primeiro parâmetro, 
tal qual : se i for igual ao n, ela retorna a a função (f) usando (x) como parâmetro, 
caso contrário, retorna (x).
*/
const dropFirst = xs => xs.slice(1)
/*
A função slice() retorna uma cópia de parte de um array  
a partir de uma certa posição passada, ou seja, posições inícial e final de um array original.
(lembrando que a posição final não é necessariamente preciso ser passado,
e o primeiro indice é a posição de número 0).
Nesse caso, a constante 'dropFirst' receberá uma lista ([xs]) e retornará uma nova cópia da lista
a partir do segundo indice. 
IMUTABILIDADE.........(continuar comentario) 
*/
const dropLast  = xs => xs.slice(0, xs.length - 1)
/*
A constante 'dropLast' receberá uma lista ([xs]) e retornará uma nova cópia da lista, 
do primeiro indice (posição 0) até o penultimo indece (posição -1) da lista original.
IMUTABILIDADE.........(continuar comentario)
*/
const id        = x => x
/*
A constante id é uma funcao que recebe um parâmentro (x) e retorna esse mesmo parâmetro (x).
Ou seja, retornando uma espécie de cópia para poder ser alterada 
sem ferir o principio da imutabilidade.
IMUTABILIDADE.........(continuar comentario)
 */
const k         = x => y => x
/*
A constante (k) recebe dois parâmetros (x,y) e retorna o primeiro parâmetro(x). 
 */
const map       = f => xs => xs.map(f)
/*
A função map() percorre o array da esquerda para a direita invocando uma função de retorno
em cada elemento com parâmetros. Então a partir de cada chamada de retorno o valor que será devolvido
se torna o elemento do novo array.
Nesse caso, a constante 'map' receberá dois parâmetros, uma função (f) e uma lista ([xs]), 
e retornará cada valor da lista ([xs]) com aplicaçao da função (f). 
*/
const mapi      = f => xs => xs.map((x, i) => f(x)(i))
/*
A constante 'mapi' recebe uma função (f) como parâmetro e também recebe uma lista ([xs]),
e retorna uma lista onde há uma função anonima (funções que não dependem de nomes, 
somente são declaradas e armazenadas em uma variável) dentro do (.map)
que recebe como parâmetro (x, i) e retorna na função (f) como novos parâmetros.
(comentário sujeito a melhorias)
*/
const merge     = o1 => o2 => Object.assign({}, o1, o2)
/*
A constante merge recebe dois parâmetros: (o1,o2) respectivamente, e,
usando da funcao (Object.assign), copia as propriedades do primeiro parâmetro o1 e de um objeto vazio ({}),
tranferindo para o segundo parâmetro o2 assim,
criando uma cópia que garante a imutabilidade garantida pelo paradigma funcional
*/
const mod       = x => y => ((y % x) + x) % x
/*
A constante mod recebe como parâmetro (x) e (y) respectivamente e retorna um resultado, que é obtido
1- consiste no restante da divisão de y por x,
2- consiste a soma do resultado (da divisão de y por x) com x,
e por fim retornará o restante da divisão do o resultado anterios por x.
*/
const objOf     = k => v => ({ [k]: v })
const pipe      = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

const prop      = k => o => o[k]
/*
A constante prop recebe dois parâmetros, (k) e (o), respectivamente.
Sendo (k) um elemento e ([o]) uma lista, a constante tem por finalidade usar o elem.
(k) como índice para uma busca na lista ([o]) e retorna o resultado correspondente dentro da lista.
*/
const range     = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep       = c => n => map(k(c))(range(0)(n))
/*

*/
const rnd       = min => max => Math.floor(Math.random() * max) + min
/*
Recebe dois parâmetros, (min) e (max), respectivamente que condicional um intervalo 
onde (min) indica o minimo e (max) indica o maximo desse intervalo.
Assim a constante 'rnd' retorna um valor aleatório pertencente a esse intervalo definido. 
a funcão (Math.random()) retorna um número dentro do intervalo [0,1[ o qual é multiplicado pelo valor máximo 
retornando um valor que será aproximado ao inteiro mais baixo usando a funcao Math.floor.
Sendo somado assim com o valor min no final para permanecer dentro do intervalo dado no começo da funçao rnd
*/
const spec      = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

module.exports = { adjust, dropFirst, dropLast, id, k, map, merge, mod, objOf, pipe, prop, range, rep, rnd, spec }
