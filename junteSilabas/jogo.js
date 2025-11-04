const fases = {
  facil: [
    { palavra: "BOLO", imagem: "imagens/BOLO.png" },
    { palavra: "CASA", imagem: "imagens/CASA.png" },
    { palavra: "PATO", imagem: "imagens/PATO.png" },
    { palavra: "MESA", imagem: "imagens/MESA.png" },
  ],
  medio: [
    { palavra: "BONECA", imagem: "imagens/BONECA.png" },
    { palavra: "JANELA", imagem: "imagens/JANELA.png" },
    { palavra: "SAPATO", imagem: "imagens/SAPATO.png" },
    { palavra: "ÓCULOS", imagem: "imagens/ÓCULOS.png" },
  ],
  dificil: [
    { palavra: "HELICÓPTERO", imagem: "imagens/HELICÓPTERO.png" },
    { palavra: "BICICLETA", imagem: "imagens/BICICLETA.png" },
    { palavra: "BORBOLETA", imagem: "imagens/BORBOLETA.png" }, // corrigido
  ]
};

// --- Elementos da página ---
const grid = document.getElementById("silabas-grid");
const imagem = document.querySelector(".imagem-palavra");
const palavraAlvo = document.querySelector(".palavra-alvo");
const botaoProxima = document.getElementById("botao-proxima");
const pontuacaoEl = document.getElementById("pontuacao");
const feedback = document.getElementById("feedback");

// --- Controle do jogo ---
let dificuldade = "facil";
let indicePalavra = 0;
let palavraAtual = "";
let silabasCertas = [];
let silabasSelecionadas = [];
let silabasNaTela = [];

// --- Pontuação ---
let pontos = 0;
let errosNaPartida = 0;
const pontosBase = 100;
const descontoPorErro = 20;

// --- Sílabas base ---
const silabasAleatoriasBase = [
  "ba","be","bi","bo","bu","ca","ce","ci","co","cu","da","de","di","do","du",
  "fa","fe","fi","fo","fu","ga","ge","gi","go","gu","la","le","li","lo","lu",
  "ma","me","mi","mo","mu","na","ne","ni","no","nu","pa","pe","pi","po","pu",
  "ra","re","ri","ro","ru","sa","se","si","so","su","ta","te","ti","to","tu"
];

function dividirEmSilabas(palavra) {
  const silabasPersonalizadas = {
    "ÓCULOS": ["ó", "cu", "los"],
    "HELICÓPTERO": ["he", "li", "cóp", "te", "ro"],
    "BICICLETA": ["bi", "ci", "cle", "ta"],
    "BORBOLETA": ["bor", "bo", "le", "ta"]
  };

  const chave = palavra.toUpperCase();
  if (silabasPersonalizadas[chave]) return silabasPersonalizadas[chave];

  const silabas = [];
  for (let i = 0; i < palavra.length; i += 2) {
    silabas.push(palavra.slice(i, i + 2).toLowerCase());
  }
  return silabas;
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function gerarGrade() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = "repeat(4, 70px)";
  grid.style.gridTemplateRows = "repeat(4, 70px)";

  silabasNaTela = [];
  const aleatorias = embaralhar([...silabasAleatoriasBase]).slice(0, 16);
  silabasCertas.forEach((silaba, i) => { aleatorias[i] = silaba; });
  const final = embaralhar(aleatorias);

  final.forEach(silaba => {
    const div = document.createElement("div");
    div.classList.add("silaba");
    div.textContent = silaba;
    div.addEventListener("click", () => selecionarSilaba(div, silaba));
    grid.appendChild(div);
    silabasNaTela.push(div);
  });
}

function carregarPalavra() {
  const fase = fases[dificuldade];
  const item = fase[indicePalavra];
  palavraAtual = item.palavra;
  silabasCertas = dividirEmSilabas(palavraAtual);
  silabasSelecionadas = [];
  imagem.src = item.imagem;
  atualizarPalavraExibida();
  gerarGrade();
  feedback.textContent = ""; // limpa mensagem anterior
}

function atualizarPalavraExibida() {
  const exibicao = silabasCertas
    .map(s => (silabasSelecionadas.includes(s) ? s.toUpperCase() : "_"))
    .join(" - ");
  palavraAlvo.textContent = exibicao;
}

function selecionarSilaba(div, silaba) {
  div.style.pointerEvents = "none";

  if (silabasCertas.includes(silaba) && !silabasSelecionadas.includes(silaba)) {
    div.style.opacity = "0.5";
    silabasSelecionadas.push(silaba);
    feedback.textContent = "✅ Acertou!";
    feedback.className = "feedback correct";
    atualizarPalavraExibida();

    if (silabasSelecionadas.length === silabasCertas.length) {
      feedback.textContent = "🎉 Parabéns, acertou a palavra!";
      feedback.className = "feedback correct";
      finalizarPartida();
      setTimeout(proximaPalavra, 1000);
    }

  } else {
    feedback.textContent = "❌ Errou!";
    feedback.className = "feedback wrong";
    errosNaPartida++;
  }
}

function finalizarPartida() {
  let pontuacaoPartida = pontosBase;
  if (errosNaPartida > 0) {
    pontuacaoPartida -= errosNaPartida * descontoPorErro;
    if (pontuacaoPartida < 0) pontuacaoPartida = 0;
  }
  if (errosNaPartida === 0) {
    pontuacaoPartida = pontosBase * 2;
  }

  pontos += pontuacaoPartida;
  atualizarPlacar();
  errosNaPartida = 0;
}

function atualizarPlacar() {
  pontuacaoEl.textContent = `Pontuação: ${pontos}`;
}

function proximaPalavra() {
  indicePalavra++;
  if (indicePalavra >= fases[dificuldade].length) {
    feedback.textContent= "🎉 Fase concluída!";
    feedback.className = "feedback correct";
    proximaFase();
  } else {
    carregarPalavra();
  }
}

function proximaFase() {
  if (dificuldade === "facil") dificuldade = "medio";
  else if (dificuldade === "medio") dificuldade = "dificil";
  else {
    feedback.textContent= "Parabéns você completou as fases";
    feedback.className = "feedback correct";
    dificuldade = "facil";
  }

  indicePalavra = 0;
  carregarPalavra();
}

carregarPalavra();