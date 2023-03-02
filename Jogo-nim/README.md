# Nim - Um jogo de estratégia matemática
## Cliqui no link para jogar o jogo
Jogue online: https://jogo-nim.netlify.app/

### Este jogo foi desenvolvido com:
* HTML
* CSS
* JavaScript
* D.o.m
* jQuery
* Materializar

### Descrição

 um jogo de estratégia matemática simples em que os jogadores se revezam removendo itens de três pilhas distintas. Os jogadores podem remover tantos itens de uma única pilha durante um turno. O jogador que resta para remover a última peça restante perde. É um jogo simples de jogar, mas envolve uma matemática interessante para calcular o movimento ideal em cada turno.

O primeiro passo foi fazer  layout básico do jogo,  Isso torna muito fácil visualizar o layout HTML e determinar o posicionamento do elemento. Também estou usando o Materialize pela primeira vez, então descobrir quais classes adicionar para obter a aparência visual levou algum tempo. Eu queria um layout realmente limpo e simples que parecesse profissional, além de ter uma boa aparência no celular.

Quando chegou a hora de começar a codificar, quis dividir esse jogo em partes que pudessem ser resolvidas e garantir que cada fase funcionasse bem antes de passar para a próxima. O primeiro passo lógico foi criar a versão simples para dois jogadores que alterna entre os turnos e verifica as condições de vitória. 


#### Lógica do jogo:

Os movimentos corretos do jogo podem ser determinados usando algo chamado 'nim-sum', que é a soma digital binária das quantidades de itens em cada pilha. Inicialmente, pensei que teria que converter cada quantidade de pilha em um número binário e, em seguida, escrever uma função para calcular a soma digital (não é o mesmo que adição). Depois de muito brainstorming e pesquisando no Google, descobri que o método de redução de matriz JavaScript poderia simplificar esse processo para mim. Elevar o acumulador à potência do próximo item passado para a função de redução resultará na soma digital binária!

```javascript
var binarySum = array.reduce(function(x, y) {return x ^ y;});
```

Existe uma prova matemática que demonstra que, se o tabuleiro tiver uma soma nim diferente de zero, o próximo jogador sempre terá um movimento específico que pode criar uma soma nim zero. O oposto também é verdadeiro - se o nim-sum for zero em um turno, o próximo jogador SEMPRE tornará o nim-sum diferente de zero depois de mover qualquer número de itens de qualquer pilha. Embora isso possa parecer confuso, na verdade torna a jogabilidade bastante simples: encontre a soma nim do estado atual do tabuleiro e determine quantas peças remover de uma pilha para reduzir a soma nim a zero. Se for a sua vez e o nim-sum já for zero, você perderá, a menos que o outro jogador cometa um erro em uma jogada posterior!

Uma vez que você tenha o 'nim-sum' do tabuleiro (chame-o de N), você calcula os nim-sums de cada pilha com N. Supondo que N seja diferente de zero no seu turno, você deve remover itens de qualquer pilha de nim-sum com N é menor que o tamanho da pilha. Isso foi feito por meio de um loop simples para verificar cada soma em relação ao tamanho da pilha e, em seguida, criar um objeto que armazena a pilha específica e a quantidade a ser removida.

A parte difícil foi lidar com o estado final do tabuleiro, pois tive que verificar se o computador tinha a chance de criar um número ímpar de pilhas com um item cada. Este é o objetivo, pois isso faria com que o jogo alternado deixasse o outro jogador com o último item para remover (e portanto perder).
