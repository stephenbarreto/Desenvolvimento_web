const readline = require('readline-sync');

const palavras = ['banana', 'abacaxi', 'laranja', 'limao'];
const palavra = palavras[Math.floor(Math.random() * palavras.length)];
const letras = palavra.split('');
const tracos = letras.map(() => '_');
let tentativas = 6;

while (tentativas > 0 && tracos.includes('_')) {
  console.log(`Palavra: ${tracos.join(' ')}`);
  const letra = readline.question('Digite uma letra: ');

  if (letras.includes(letra)) {
    letras.forEach((l, i) => {
      if (l === letra) {
        tracos[i] = letra;
      }
    });
  } else {
    console.log(`A letra ${letra} não está na palavra. Tentativas restantes: ${--tentativas}`);
  }
}

if (tracos.includes('_')) {
  console.log(`Você perdeu! A palavra era ${palavra}.`);
} else {
  console.log(`Parabéns, você ganhou! A palavra era ${palavra}.`);
}
