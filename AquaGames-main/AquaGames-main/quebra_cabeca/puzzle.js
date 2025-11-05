const canvas = document.getElementById("puzzle");
const ctx = canvas.getContext("2d");
const answersDiv = document.getElementById("answers");
const pontuacaop = document.getElementById("pontuacao");
const feedback = document.querySelector(".feedback");
const botaoProximaFase = document.getElementById("botaoProximaFase");

// Configurações do quebra-cabeça
const pieceRows = 2;
const pieceCols = 3;
const pieceWidth = canvas.width / pieceCols;
const pieceHeight = canvas.height / pieceRows;

// Sistema de níveis
let nivelAtual = 1;
const niveis = [
  { min: 1, max: 7, img: "imagem/minions.png" },
  { min: 5, max: 11, img: "imagem/peterpan.png" },
  { min: 7, max: 14, img: "imagem/cachorro.jpg" }
];

// Pontuação
let pontos = 0;
const pontosBase = 100;
const descontoPorErro = 20;
let errosNaPartida = 0;

// Arrays
let operations = [];
let pieces = [];
let draggingAnswer = null;

// Função para gerar operações aleatórias
function gerarOperacoes(qtd, nivel) {
  const { min, max } = niveis[nivel - 1];
  let ops = [];
  for (let i = 0; i < qtd; i++) {
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;
    let sinal = Math.random() < 0.5 ? "+" : "-";
    if (sinal === "-" && b > a) [a, b] = [b, a];
    let resultado = sinal === "+" ? a + b : a - b;
    ops.push({ question: `${a} ${sinal} ${b}`, answer: resultado.toString() });
  }
  return ops;
}

// Funções para desenhar e criar respostas
function desenharFundo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < operations.length; i++) {
    const row = Math.floor(i / pieceCols);
    const col = i % pieceCols;
    const x = col * pieceWidth + pieceWidth / 2;
    const y = row * pieceHeight + pieceHeight / 2;
    if (!pieces[i].revealed) ctx.fillText(operations[i].question, x, y);
  }
}

function criarRespostas() {
  answersDiv.innerHTML = "";
  let shuffled = [...operations].sort(() => Math.random() - 0.5);
  shuffled.forEach(op => {
    const div = document.createElement("div");
    div.className = "answer";
    div.textContent = op.answer;
    div.draggable = true;
    div.addEventListener("dragstart", () => draggingAnswer = op.answer);
    div.addEventListener("dragend", () => draggingAnswer = null);
    answersDiv.appendChild(div);
  });
}

// Inicializa peças
function inicializarPecas() {
  pieces = [];
  for (let i = 0; i < operations.length; i++) {
    const row = Math.floor(i / pieceCols);
    const col = i % pieceCols;
    pieces.push({ x: col * pieceWidth, y: row * pieceHeight, w: pieceWidth, h: pieceHeight, revealed: false });
  }
}

// Carrega fase
const img = new Image();
function carregarFase() {
  const fase = niveis[nivelAtual - 1];
  img.src = fase.img;
  img.onload = () => {
    operations = gerarOperacoes(pieceRows * pieceCols, nivelAtual);
    errosNaPartida = 0;
    inicializarPecas();
    desenharFundo();
    criarRespostas();
    feedback.textContent = "";
    botaoProximaFase.style.display = "none";
  };
}

// Soltar respostas no canvas
canvas.addEventListener("dragover", e => e.preventDefault());
canvas.addEventListener("drop", e => {
  e.preventDefault();
  if (!draggingAnswer) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  let acertouAlguma = false;

  for (let i = 0; i < pieces.length; i++) {
    const p = pieces[i];
    if (!p.revealed && x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) {
      if (draggingAnswer === operations[i].answer) {
        p.revealed = true;
        acertouAlguma = true;
        desenharFundo();
        revelarPecas();
      }
    }
  }

  if (acertouAlguma) feedback.textContent = "✅ Acertou!";
  else {
    feedback.textContent = "❌ Errou!";
    errosNaPartida++;
  }

  // Se todas peças reveladas, calcula pontuação e habilita botão próxima fase
  if (pieces.every(p => p.revealed)) {
    calcularPontuacao();
    feedback.textContent = "🎉 Todas as peças reveladas!";
    botaoProximaFase.style.display = "inline-block";
  }

  draggingAnswer = null;
});

// Revela peças
function revelarPecas() {
  pieces.forEach((p, i) => {
    if (p.revealed) {
      ctx.drawImage(
        img,
        (img.width / pieceCols) * (i % pieceCols),
        (img.height / pieceRows) * Math.floor(i / pieceCols),
        img.width / pieceCols,
        img.height / pieceRows,
        p.x, p.y, p.w, p.h
      );
    }
  });
}

// Calcula pontuação da fase
function calcularPontuacao() {
  let pontuacaoPartida = pontosBase;
  if (errosNaPartida > 0) {
    pontuacaoPartida -= errosNaPartida * descontoPorErro;
    if (pontuacaoPartida < 0) pontuacaoPartida = 0;
  }
  if (errosNaPartida === 0) pontuacaoPartida = pontosBase * 2;
  pontos += pontuacaoPartida;
  pontuacaop.textContent = `🏆 ${pontos}`;
}

// Botão próxima fase: mostra imagem completa e avança
botaoProximaFase.addEventListener("click", () => {
  pieces.forEach(p => p.revealed = true);
  revelarPecas();
  feedback.textContent = "📷 Imagem completa!";
  botaoProximaFase.style.display = "none";

  setTimeout(() => {
    if (nivelAtual < niveis.length) {
      nivelAtual++;
      carregarFase();
    } else {
      feedback.textContent = "🏆 Parabéns! Você completou todas as fases!";
    }
  }, 2000);
});

// Inicializa primeira fase
carregarFase();





