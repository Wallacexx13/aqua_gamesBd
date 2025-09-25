// ================== FUNÇÃO PARA EMBARALHAR ==================
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ================== OBJETO DE FASES ==================
const fases = {
  facil: [
    { palavra: "ANEL", imagem: "imagens/anel.png" },
    { palavra: "CELULAR", imagem: "imagens/celular.png" },
    { palavra: "UVA", imagem: "imagens/uva.png" },
    { palavra: "SAPATO", imagem: "imagens/sapato.png" },
    { palavra: "IGREJA", imagem: "imagens/igreja.png" }
  ],
  medio: [
    { palavra: "BOLA", imagem: "imagens/bola.png" },
    { palavra: "LATA", imagem: "imagens/lata.png" },
    { palavra: "GATO", imagem: "imagens/gato.png" },
    { palavra: "MESA", imagem: "imagens/mesa.png" },
    { palavra: "DADO", imagem: "imagens/dado.png" }
  ],
  dificil: [
    { palavra: "PATO", imagem: "imagens/pato.png" },
    { palavra: "TREM", imagem: "imagens/trem.png" },
    { palavra: "BANANA", imagem: "imagens/banana.png" },
    { palavra: "TIGRE", imagem: "imagens/tigre.png" },
    { palavra: "CASA", imagem: "imagens/casa.png" },
    { palavra: "CAVALO", imagem: "imagens/cavalo.png" }
  ]
};

// Embaralha as palavras de cada fase
fases.facil = embaralhar(fases.facil);
fases.medio = embaralhar(fases.medio);
fases.dificil = embaralhar(fases.dificil);

// ================== ELEMENTOS HTML ==================
const imgEl = document.querySelector(".image-area img");
const wordDisplay = document.getElementById("word-display");
const lettersArea = document.getElementById("letters-area");
const feedback = document.getElementById("feedback");
const btnProxima = document.getElementById("proxima-fase");
const pontuacaoEl = document.querySelector(".pontuacao");
const faseTitulo = document.getElementById("fase-titulo");

// ================== VARIÁVEIS DE CONTROLE ==================
let faseAtual = "facil";
let usadas = [];
let pontos = 0;
let palavraAtual;
let lacunas = [];
let faltando = []; // índice das letras que faltam

// ================== FUNÇÃO PARA MOSTRAR DESAFIO ==================
function mostrarDesafio() {
  // Seleciona palavras ainda não usadas
  const restantes = fases[faseAtual].filter(p => !usadas.includes(p.palavra));

  if (restantes.length === 0) {
    avancarFase();
    return;
  }

  palavraAtual = restantes[Math.floor(Math.random() * restantes.length)];
  usadas.push(palavraAtual.palavra);

  // Atualiza título da fase
  faseTitulo.textContent = "Fase: " + faseAtual.charAt(0).toUpperCase() + faseAtual.slice(1);

  // Atualiza imagem
  imgEl.src = palavraAtual.imagem;

  // Define lacunas e quais letras faltam dependendo da fase
  let letras = palavraAtual.palavra.split("");
  lacunas = [...letras];

if (faseAtual === "facil") {
  // Fase 1: só 1 vogal faltando
  let indicesVogais = letras
    .map((l, i) => ("AEIOU".includes(l.toUpperCase()) ? i : -1))
    .filter(i => i !== -1);

  if (indicesVogais.length > 0) {
    let idx = indicesVogais[Math.floor(Math.random() * indicesVogais.length)];
    faltando = [idx];
  } else {
    // se não tiver vogal na palavra, remove 1 letra qualquer
    let idx = Math.floor(Math.random() * letras.length);
    faltando = [idx];
  }

} else if (faseAtual === "medio") {
  // Fase 2: 1 letra faltando (vogal OU consoante)
  // 50% de chance de escolher vogal ou consoante
  let escolherVogal = Math.random() < 0.5;

  let indicesEscolhidos = letras
    .map((l, i) => {
      let isVogal = "AEIOU".includes(l.toUpperCase());
      return (escolherVogal && isVogal) || (!escolherVogal && !isVogal) ? i : -1;
    })
    .filter(i => i !== -1);

  // se não tiver a categoria escolhida (ex: palavra sem vogais)
  if (indicesEscolhidos.length === 0) {
    let idx = Math.floor(Math.random() * letras.length);
    faltando = [idx];
  } else {
    let idx = indicesEscolhidos[Math.floor(Math.random() * indicesEscolhidos.length)];
    faltando = [idx];
  }

} else {
  // Fase 3: 2 letras faltando
  let idx1 = Math.floor(Math.random() * letras.length);
  let idx2;
  do {
    idx2 = Math.floor(Math.random() * letras.length);
  } while (idx2 === idx1);
  faltando = [idx1, idx2];
}


  // Apaga as letras faltantes nas lacunas
  faltando.forEach(i => lacunas[i] = "_");
  wordDisplay.textContent = lacunas.join(" ");

  // Gera opções de letras
  lettersArea.innerHTML = "";
  let opcoes = [];
  if (faseAtual === "facil") opcoes = ["A","E","I","O","U"];
  else opcoes = embaralhar([...palavraAtual.palavra.split(""), ...gerarLetrasExtras(10)]);
  opcoes.forEach(l => {
    const btn = document.createElement("div");
    btn.classList.add("letter");
    btn.textContent = l;
    btn.addEventListener("click", () => verificarLetra(l, btn));
    lettersArea.appendChild(btn);
  });

  feedback.textContent = "";
  btnProxima.style.display = "none";
}

// ================== FUNÇÃO PARA GERAR LETRAS EXTRAS ==================
function gerarLetrasExtras(qtd) {
  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  let extras = [];
  while (extras.length < qtd) {
    const letra = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    if (!palavraAtual.palavra.includes(letra) && !extras.includes(letra)) extras.push(letra);
  }
  return extras;
}

// ================== FUNÇÃO PARA VERIFICAR LETRA ==================
function verificarLetra(letra, btn) {
  let acertou = false;

  faltando.forEach(i => {
    if (palavraAtual.palavra[i] === letra && lacunas[i] === "_") {
      lacunas[i] = letra;
      acertou = true;
    }
  });

  if (acertou) {
    wordDisplay.textContent = lacunas.join(" ");
    feedback.textContent = "✅ Acertou!";
    feedback.className = "feedback correct";

    if (!lacunas.includes("_")) {
      feedback.textContent = "🎉 Palavra completa!";
      btnProxima.style.display = "inline-block";
      pontos += 10;
      pontuacaoEl.textContent = `🏆 ${pontos}`;
    }
  } else {
    feedback.textContent = "❌ Tente novamente";
    feedback.className = "feedback wrong";
  }

  btn.style.pointerEvents = "none";
  btn.style.opacity = "0.5";
}

// ================== FUNÇÃO PARA AVANÇAR FASE ==================
function avancarFase() {
  if (faseAtual === "facil") faseAtual = "medio";
  else if (faseAtual === "medio") faseAtual = "dificil";
  else {
    feedback.textContent = "🏆 Parabéns, você completou todas as fases!";
    lettersArea.innerHTML = "";
    btnProxima.style.display = "none";
    return;
  }
  usadas = [];
  mostrarDesafio();
}

// ================== EVENTO DO BOTÃO PRÓXIMA PALAVRA ==================
btnProxima.addEventListener("click", mostrarDesafio);

// ================== INICIAR JOGO ==================
mostrarDesafio();



