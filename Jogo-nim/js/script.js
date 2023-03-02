var aiMode = false;         // se o modo de computador está ativado
var player = 1;             // rastreia o jogador atual (1 ou 2...2 também é computador)
var itemRemoved = false;    // rastreia se o jogador fez um movimento inicial
var selectedHeap = null;    // faixas que heap o computador deve escolher
var reminderTimeout = null; // manipulador de tempo limite para limpar quando o jogador muda
var gameOver = false;       // mudanças nas condições de vitória
var heapObj = {             // armazena a quantidade de itens em cada heap
  "heap-one": 3,
  "heap-two": 5,
  "heap-three": 7
};

var initGame = function() {
  // exibe os nomes dos jogadores ou o padrão é Jogador 1, Jogador 2
  if($("input[name='player-one']").val()) {
    var playerOneName = $("input[name='player-one']").val();
    $('#player-one').text(playerOneName);
  }
  if(aiMode === true) {
    $('#player-two').text("");
    $('#player-two').append("<i class='material-icons'>computer</i>");
  } else {
    if($("input[name='player-two']").val()){
      var playerTwoName = $("input[name='player-two']").val();
      $('#player-two').text(playerTwoName);
    }
  }
};

var resetGame = function() {
  // remova a mensagem de vitória do jogo anterior
  $('h3').remove();
  $('.brain').remove();
  $('.item').show();

  clearTimeout(reminderTimeout);

  $('#player-one').removeClass('disabled');
  $('#player-two').addClass('disabled');

  player = 1;
  gameOver = false;
  heapObj['heap-one'] = 3;
  heapObj['heap-two'] = 5;
  heapObj['heap-three'] = 7;
  itemRemoved = false;
  selectedHeap = null;
};

var runWinSequence = function() {
  // desative os botões de troca de jogador quando o jogo acaba
  $('.switch-player').addClass('disabled');

  // fechar mensagem de lembrete  que o jogo acabou
  $('.reminder-msg').hide();
  clearTimeout(reminderTimeout);

  if(player === 1) {
      var playerName = $('#player-one').text();
    } else {
      var playerName = $('#player-two').text();
    }
  
  
  setTimeout(function () {
    $('.item').fadeOut(500);
    setTimeout(function() {
      $('.heap-one').hide();
      $('.heap-two').hide();
      
      console.log("player is: ", player);
      // se um dos jogadores vencer, exiba seu nome, caso contrário, mostre a imagem do coputador
      if(player === 1 || player === 2 && aiMode === false) {
        $('.heap-two').append("<h3 class='win-msg'>" + playerName + " Vencedor!</h3>");
      } else {
        $('.heap-one').append("<img src='img/pc.png' class='brain responsive-img'>");
        $('.heap-two').append("<h3 class='win-msg'>O computador Humilhou você kkk...</h3>");
      }
      $('.heap-one').fadeIn("slow") 
      $('.heap-two').fadeIn("slow") 
    }, 750);
  }, 1000);
};

// esta função revisa o tabuleiro do jogo e determina a quantidade e a pilha de onde retirar
var aiComputeMove = function() {
  var heapArray = [];    // array de números existentes em cada heap
  var itemsToRemove = {  // armazena o número de itens a serem removidos de uma pilha
    "heap-index": null,
    "quantity": null
  };

  for(heap in heapObj) {
      heapArray.push(heapObj[heap]);
  }

  // verifique quantas pilhas são maiores que 1 (para ver se você pode reduzir para um número ímpar de 1 pilhas)
  var largeHeap = 0;
  for(let i = 0; i < heapArray.length; i++) {
    if(heapArray[i] > 1) {
      largeHeap++;
    }
  }

  // se houver apenas um heap para reduzir para 1
  if(largeHeap <= 1) {
    //obter número de pilhas maior que 0
    var numHeaps = 0;
    for(let i = 0; i < heapArray.length; i++) {
      if(heapArray[i] > 0) {
        numHeaps++;
      }
    }
    // determinar se o número de pilhas restantes é ímpar
    var maxHeap = Math.max(...heapArray);
    var maxHeapIndex = heapArray.indexOf(maxHeap);
    itemsToRemove["heap-index"] = maxHeapIndex;

    if(numHeaps % 2 === 1) {
      //remover toda a pilha de um número ímpar de pilhas restantes
      itemsToRemove["quantity"] = maxHeap - 1;
    } else {
      // remover toda a pilha de um número par de pilhas restantes
      itemsToRemove["quantity"] = maxHeap;
    }
    return itemsToRemove;
  }

  // reduza o método com retornos exponenciais a soma digital binária!
  var binarySum = heapArray.reduce(function(x, y) { return x^y;});

  var heapSums = heapArray.map(function(heapSize) {return heapSize ^ binarySum});

  // verifique se alguma das somas individuais da pilha é menor que a pilha
  for(let i = 0; i < heapSums.length; i++) {
    if(heapSums[i] < heapArray[i]) {
      itemsToRemove["heap-index"] = i;
      itemsToRemove["quantity"] = heapArray[i] - heapSums[i]; 
      // verifique o caso em que o próximo movimento reduz a todos os tamanhos de heap de 1
      var move = 'Move: Take ' + (heapArray[i] - heapSums[i]) + ' from heap ' + (i+1);
    } else {
      var index = heapArray.indexOf(Math.max(...heapArray)) + 1;
    }
  }

  // se nenhum movimento útil for encontrado (por exemplo, a soma nim é zero), apenas remova 1 da maior pilha
  if(!itemsToRemove["quantity"]) {
    itemsToRemove["heap-index"] = heapArray.indexOf(Math.max(...heapArray));
    itemsToRemove["quantity"] = 1; 
  }

  return itemsToRemove;
}

// esta função chama o Computador  e então reproduz os movimentos calculados
var aiPlayTurn = function() {
  
  // versão local de heapObj, mas sempre contém o tamanho máximo de cada heap
  var maxHeaps = { "heap-one": 3,
                   "heap-two": 5,
                   "heap-three": 7
  };

  
  var itemIds = { "heap-one": ["h1-1", "h1-2", "h1-3"],
                  "heap-two": ["h2-1", "h2-2", "h2-3", "h2-4", "h2-5"],
                  "heap-three": ["h3-1", "h3-2", "h3-3", "h3-4", "h3-5", "h3-6", "h3-7"]
                };

  // a função retorna o objeto com o heap de onde extrair e quantos extrair
  var itemsToRemove = aiComputeMove();
  console.log("Computer will remove: ", itemsToRemove);


  // obtém o nome do heap para corresponder à classe dos divs em html
  var heapKeys = Object.keys(heapObj);
  var heapName = heapKeys[itemsToRemove["heap-index"]];

  var quantityToRemove = itemsToRemove["quantity"];

  var quantityRemoved = 0;
  var itr = 0;

  var idString = '';

  // remover a quantidade correta de peças
  while(quantityRemoved < quantityToRemove) {
    
    idString = "#" + itemIds[heapName][itr];

    if($(idString).css("display") != 'none') {

      $(idString).triggerHandler("click");
      quantityRemoved++;
    }
    // se você chegar ao fim do heap, volta ao início
    // trata do caso em que alguém puxa do meio
    if(itr > maxHeaps[heapName]) {
      itr = 0;
    }
    itr++;
  }

  var heapSum = 0;
  for(heap in heapObj) {
    heapSum += heapObj[heap];
  }

  // alternar o botão do jogador quando o computador terminar de se revezar
  if(!gameOver) {
    player = 1;
    $('#player-two').addClass('disabled');
    $('#player-one').removeClass('disabled');
  }

};

var switchPlayer = function() {
  $('.reminder-msg').hide();
  clearTimeout(reminderTimeout);
  console.log("itemRemoved= ", itemRemoved);
  if(!itemRemoved) {
    M.toast({html: 'You have to remove at least one item!', classes: 'rounded'});
  } else {
    // var heapSum = 0;

    if(!gameOver) {
      if(player === 1) {
        player = 2;
        $('#player-one').addClass('disabled');
        $('#player-two').removeClass('disabled');
      } else {
        player = 1;
        $('#player-two').addClass('disabled');
        $('#player-one').removeClass('disabled');
      }
    }
  }

  // redefine o movimento booleano para o próximo jogador escolher em qualquer heap
  itemRemoved = false;

  //timeout faz com que o computador demore um segundo para jogar sua vez
  setTimeout(function() {
    if(aiMode && player === 2 && !gameOver) {
      aiPlayTurn();
      itemRemoved = false;
    }
  }, 1000);
};

var removeItem = function() {
  M.Toast.dismissAll();

  // armazenar a pilha do primeiro objeto clicado pelo jogador
  if(!itemRemoved) {
    selectedHeap = $(this).parent().attr('id');
    itemRemoved = true;
    
    if(!aiMode || aiMode && player !== 2) {
      // exibir lembrete para tocar em seu nome para trocar de jogador
      reminderTimeout = setTimeout(function() {
        $('.reminder-msg').fadeIn(1000);
        setTimeout(function() {
        $('.reminder-msg').fadeOut(500);
        }, 3000);
      }, 3000);
    }
  }

  // movimento válido se escolher um item da mesma pilha
  if($(this).parent().attr('id') === selectedHeap) {
    console.log(heapObj[selectedHeap]);
    heapObj[selectedHeap]--;
    $(this).hide();

    var heapSum = 0;
    for(heap in heapObj) {
      heapSum += heapObj[heap];
    }
    console.log("heapSum =", heapSum);

    // se sobrar uma peça, temos um vencedor
    if(heapSum === 1 && !gameOver) {
      gameOver = true;
      runWinSequence();
    }

    // se o heap for esvaziado, troca automaticamente o jogador
    // if(heapObj[selectedHeap] === 0){
    // switchPlayer(); troca o jogador 
  } else {
    // caso em que o usuário seleciona um item de uma segunda pilha durante sua vez
    M.toast({html: 'Você só pode remover itens de uma pilha!', classes: 'rounded'});
  }
};

$(document).ready(function() {
  $('.reminder-msg').hide();
  // inicializar e abrir o modal no carregamento da página
  $('.modal').modal({'opacity': 0.75});
  
  // Bot"ao de modo de jogo
  $(".game-mode").on("click", function() {
    if($(this).hasClass("two-player")) {
      $(this).css("border","2px solid black");
      $(".computer").css("border","none");
      aiMode = false;
      $('.players').remove();
      $('.modal-content').append("<label class='players'>Jogador 1:<input type='text' name='player-one'></label><label class='players'>Jogador 2:<input type='text' name='player-two'></label>");
    } else {
      $(this).css("border","2px solid black");
      $(".two-player").css("border","none");
      aiMode = true;
      $('.players').remove();
      $('.modal-content').append("<label class='players'>Seu Nome:<input type='text' name='player-one'>");
    }
  });
  
  $('.modal').modal('open');

  // inicializar o jogo com opções selecionadas pelo usuário no modal
  $("a.modal-close").on("click", initGame);

  // remover um item quando ele é clicado
  $(".item").on("click", removeItem);
  
  // redefinir o tabuleiro de jogo
  $(".reset").on("click", resetGame);

  // mudar o jogador atual
  $(".switch-player").on("click", switchPlayer);

  // pop-ups ao passar o mouse sobre os botões
  $('.tooltipped').tooltip();

  // Comando Materialize para criar um menu pop-out em tamanho pequeno
  $('.sidenav').sidenav();
});