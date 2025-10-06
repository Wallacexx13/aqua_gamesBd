

const botaoProximaFase = document.getElementById("proxima-fase");
botaoProximaFase.style.display = "none"; // esconde o botão ao iniciar
botaoProximaFase.addEventListener("click", () => {


  avancarFase();// evento do botão para avançar a fase 
});


//Todas as fases vão ser cadastradas no cosnt abaixo
 
 const fases = {
    facil: [
      { palavra: "GATO", imagem: "../img/gato02.jpg" },
      { palavra: "CASA", imagem: "../img/casa02.jpg" },
      { palavra: "BOLA", imagem: "../img/OIP.webp" },
      { palavra: "LÁPIS", imagem: "../img/lapis.webp" },
    ],
    medio: [
      { palavra: "CADEIRA", imagem: "../img/cadeira.webp" },
      { palavra: "BANANA", imagem: "../img/banana02.jpg" },
    ],
    dificil: [
      { palavra: "ELEFANTE", imagem: "../img/elefante.jpg" },
      { palavra: "ABACAXI", imagem: "../img/abacaxi.jpg" }
    ]
  };

  let faseAtual = "facil"; // pode trocar para 'medio' ou 'dificil'
  let palavraSelecionada = "";
  let resposta = [];

  const imgEl = document.querySelector(".image-area img");
  const wordDisplay = document.getElementById("word-display");
  const lettersArea = document.getElementById("letters-area");
  const feedback = document.getElementById("feedback");

  function iniciarJogo() {
    // Pega um item aleatório da fase atual
    const itens = fases[faseAtual];
    const sorteado = itens[Math.floor(Math.random() * itens.length)];
    palavraSelecionada = sorteado.palavra;
    resposta = Array(palavraSelecionada.length).fill("_");

    // Atualiza imagem
    imgEl.src = sorteado.imagem;

    // Mostra underline da palavra
    atualizarDisplay();

    // Cria lista de letras embaralhadas + extras
    const letras = embaralhar([...palavraSelecionada.split(""), ...gerarLetrasExtras(4)]);
    renderizarLetras(letras);
      feedback.textContent = "";       // limpa feedback
    feedback.className = "";         // remove classe anterior
    botaoProximaFase.style.display = "none"; // esconde botão
  }

  function atualizarDisplay() {
    wordDisplay.textContent = resposta.join(" ");
  }

  function embaralhar(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function gerarLetrasExtras(qtd) {
    const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let extras = [];
    while (extras.length < qtd) {
      const letra = alfabeto[Math.floor(Math.random() * alfabeto.length)];
      if (!palavraSelecionada.includes(letra) && !extras.includes(letra)) {
        extras.push(letra);
      }
    }
    return extras;
  }

  function renderizarLetras(letras) {
    lettersArea.innerHTML = "";
    letras.forEach(letra => {
      const div = document.createElement("div");
      div.classList.add("letter");
      div.textContent = letra;
      div.addEventListener("click", () => verificarLetra(letra, div));
      lettersArea.appendChild(div);
    });
  }
  const pontuacaop = document.querySelector(".pontuacao");
let pontos = 0;

// contadores por partida
let errosNaPartida = 0;
let acertosNaPartida = 0;
const pontosBase = 100;       // valor cheio se acertar tudo sem errar
const descontoPorErro = 20;   // desconto por erro

// Atualiza o placar na tela
function atualizarPlacar() {
  pontuacaop.textContent = `🏆 ${pontos}`;
}
function verificarLetra(letra, elemento) {
  let acertou = false;

  for (let i = 0; i < palavraSelecionada.length; i++) {
    if (palavraSelecionada[i] === letra && resposta[i] === "_") {
      resposta[i] = letra; // preenche só o primeiro "_"
      acertou = true;
      break; // para o loop depois de preencher UM
    }
  }

  if (acertou) {
    atualizarDisplay();
    
    if (!resposta.includes("_")) {
      feedback.textContent = "🎉 Parabéns, acertou a palavra!";
      feedback.className = "feedback correct";
      botaoProximaFase.style.display = "inline-block";





      finalizarPartida();

    } else {
      feedback.textContent = "✅ Acertou!";
      feedback.className = "feedback correct";
      
    }
  } else {
    feedback.textContent = "❌ Errou!";
    feedback.className = "feedback wrong";
    errosNaPartida++; // conta erro
  }

  // desabilita o botão clicado
  elemento.style.pointerEvents = "none";
  elemento.style.opacity = "0.5";
}

// Calcula a pontuação da partida quando completar uma palavra
function finalizarPartida() {
  let pontuacaoPartida = pontosBase;

  if (errosNaPartida > 0) {
    pontuacaoPartida -= errosNaPartida * descontoPorErro;
    if (pontuacaoPartida < 0) pontuacaoPartida = 0;
  }

  // bônus extra se não errou nenhuma vez
  if (errosNaPartida === 0) {
    pontuacaoPartida = pontosBase * 2;
  }

  pontos += pontuacaoPartida;
  atualizarPlacar();

  // reseta contadores para a próxima palavra
  errosNaPartida = 0;
  acertosNaPartida = 0;
}



  let usadas = []; // palavras já usadas na fase atual
let  contador = 0;

function palavraCertas(){
   
     usadas.push(palavraSelecionada);
    if (contador === 4) {
      feedback.textContent = "🎉 Parabéns, você completou todas as palavras!";
      proxnivel();
      contador = 0;
    }else{
        botaoProximaFase.style.display = "inline-block";
        contador++;
        console.log(contador);
    }
    
}

function proxnivel() {
    if (faseAtual === "facil") {
        faseAtual = "medio";
    } else if (faseAtual === "medio") {
        faseAtual = "dificil";
    } else {
        // Já terminou o jogo
        feedback.textContent = "🏆 Parabéns, você terminou o jogo!";
        botaoProximaFase.style.display = "none";
        return;
    }

    usadas = []; // reinicia palavras usadas na nova fase
    contador = 0; // reinicia contador
    iniciarJogo();
}

function avancarFase() {
    // Marca a palavra atual como usada
    usadas.push(palavraSelecionada);

    // Filtra as palavras ainda não usadas da fase atual
    const itensRestantes = fases[faseAtual].filter(p => !usadas.includes(p.palavra));

    if (itensRestantes.length === 0) {
        proxnivel(); // avança de nível se acabou palavras
    } else {
        // Sorteia uma palavra diferente da atual
        const novaPalavra = itensRestantes[Math.floor(Math.random() * itensRestantes.length)];
        palavraSelecionada = novaPalavra.palavra;

        // Reset do array resposta e display
        resposta = Array(palavraSelecionada.length).fill("_");
        atualizarDisplay();

        // Atualiza imagem
        imgEl.src = novaPalavra.imagem;

        // Gera novas letras
        const letras = embaralhar([...palavraSelecionada.split(""), ...gerarLetrasExtras(4)]);
        renderizarLetras(letras);

        // Reseta feedback e botão
        feedback.textContent = "";
        feedback.className = "";
        botaoProximaFase.style.display = "none";
    }
}
   

  // Inicia o jogo ao carregar
  iniciarJogo();







