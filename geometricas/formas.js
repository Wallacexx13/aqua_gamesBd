const feedback = document.getElementById('feedback');

const somAcerto = new Audio('som/next-level.mp3');
const somErro = new Audio('som/erro.mp3');
const nextlvl = new Audio('som/victory.mp3');

const imgfase = document.getElementById('imagem1');
//  Controle de fases
let faseAtual = 'imagem1'; // Começa na fase 1
const formasJaClicadas = new Set(); // Guarda IDs únicos das formas clicadas

let dicasRestantes = 0; // Dicas por fase (reseta a cada fase)

function atualizarBotaoDica() {
  const btn = document.getElementById('btnDica');
  if (btn) {
    btn.textContent = `Dica (${dicasRestantes} restantes)`;
    btn.disabled = dicasRestantes <= 0;
  }
}

function mostrarDica() {
  if (dicasRestantes <= 0) return;

  const mapa = mapasImagens[faseAtual];
  if (!mapa || !mapa.formas) return;

  // Filtra formas ainda não clicadas
  const formasDisponiveis = mapa.formas.filter(
    (forma) => !formasJaClicadas.has(forma.id),
  );
  if (formasDisponiveis.length === 0) {
    feedback.textContent = 'Nenhuma forma restante para dica!';
    return;
  }

  // Seleciona uma forma aleatória
  const formaSelecionada =
    formasDisponiveis[Math.floor(Math.random() * formasDisponiveis.length)];

  // Calcula posição (igual ao verificarClique)
  const imagemElement = imgfase;
  const rect = imagemElement.getBoundingClientRect();
  const larguraAtual = rect.width;
  const alturaAtual = rect.height;
  const proporcaoAtual = larguraAtual / alturaAtual;
  const proporcaoOriginal = mapa.proporcaoOriginal || proporcaoAtual;
  const ajusteX = proporcaoAtual / proporcaoOriginal;
  const ajusteY = 1 / ajusteX;

  const f = converterFormaParaPixels(
    formaSelecionada,
    larguraAtual,
    alturaAtual,
    ajusteX,
    ajusteY,
  );

  // Cria overlay de destaque
  const container = imagemElement.parentElement;
  const overlay = document.createElement('div');
  overlay.className = 'dica-overlay';
  overlay.style.position = 'absolute';
  overlay.style.border = '3px solid red';
  overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '10';

  // Define posição e tamanho baseado no tipo de forma
  let ladoQuadrado;
  let centroX, centroY;
  switch (formaSelecionada.tipo.toLowerCase()) {
    case 'circulo':
      // Baseado no raio (largura/2), mas usa largura total para consistência
      ladoQuadrado = f.largura * 3; // 3x maior
      centroX = f.x + f.largura / 2; // Centro do círculo
      centroY = f.y + f.largura / 2;
      break;
    case 'triangulo':
      // Usa o retângulo ao redor do triângulo como base
      const largTriBase =
        Math.max(f.x1, f.x2, f.x3) - Math.min(f.x1, f.x2, f.x3);
      const altTriBase =
        Math.max(f.y1, f.y2, f.y3) - Math.min(f.y1, f.y2, f.y3);
      ladoQuadrado = Math.max(largTriBase, altTriBase) * 3; // Quadrado baseado no maior lado, 3x maior
      centroX = (Math.min(f.x1, f.x2, f.x3) + Math.max(f.x1, f.x2, f.x3)) / 2; // Centro aproximado
      centroY = (Math.min(f.y1, f.y2, f.y3) + Math.max(f.y1, f.y2, f.y3)) / 2;
      break;
    default: // Retângulo, cilindro, losango, etc.
      ladoQuadrado = Math.max(f.largura, f.altura) * 3; // Quadrado baseado no maior lado, 3x maior
      centroX = f.x + f.largura / 2; // Centro
      centroY = f.y + f.altura / 2;
      break;
  }
  // Aplica o quadrado centralizado
  overlay.style.width = `${ladoQuadrado}px`;
  overlay.style.height = `${ladoQuadrado}px`;
  overlay.style.left = `${centroX - ladoQuadrado / 2}px`; // Centraliza no centroX
  overlay.style.top = `${centroY - ladoQuadrado / 2}px`; // Centraliza no centroY

  container.appendChild(overlay);

  // Remove após 3 segundos
  setTimeout(() => {
    if (overlay.parentElement) overlay.remove();
  }, 3000);

  // Decrementa dicas e atualiza botão
  dicasRestantes--;
  atualizarBotaoDica();
  feedback.textContent = 'Dica mostrada! Procure na área destacada.';
}

function carregarFase(idImagem) {
  faseAtual = idImagem;
  formasJaClicadas.clear(); // Zera cliques anteriores
  desenharMapeamentos(idImagem); // 🔧 CORREÇÃO: Mantém a chamada aqui (única)
  inicializarProgresso(idImagem);
  document.getElementById('btnProximaFase').style.display = 'none';
  dicasRestantes = 2; // Aqui muda a uantidade de dicas
  atualizarBotaoDica();
}

// Mapeamento simplificado das formas geométricas
// Coordenadas como frações (0 a 1) da imagem original.
const mapasImagens = {
  imagem1: {
    src: 'imagens/imagem1.jpg',
    proporcaoOriginal: 1.5,
    formas: [
      {
        tipo: 'circulo',
        x: 0.37,
        y: 0.21,
        largura: 0.069,
        altura: 0.017,
      },
      {
        tipo: 'cilindro',
        x: 0.62,
        y: 0.37,
        largura: 0.079,
        altura: 0.105,
      },
      {
        tipo: 'triangulo',
        pontos: [
          { x: 0.271, y: 0.19 }, // canto inferior esquerdo
          { x: 0.34, y: 0.19 }, // canto inferior direito
          { x: 0.31, y: 0.12 }, // ponta central em cima
        ],
      },
      {
        tipo: 'cilindro2',
        x: 0.634,
        y: 0.303,
        largura: 0.056,
        altura: 0.067,
      },
      {
        tipo: 'cilindro3',
        x: 0.828,
        y: 0.339,
        largura: 0.042,
        altura: 0.06,
      },
      {
        tipo: 'cilindro4',
        x: 0.818,
        y: 0.395,
        largura: 0.063,
        altura: 0.079,
      },
      {
        tipo: 'cilindro5',
        x: 0.64,
        y: 0.259,
        largura: 0.04,
        altura: 0.047,
      },
      {
        tipo: 'cilindro6',
        x: 0.833,
        y: 0.529,
        largura: 0.075,
        altura: 0.102,
      },
      {
        tipo: 'cilindro7',
        x: 0.897,
        y: 0.585,
        largura: 0.0742,
        altura: 0.0946,
      },
      {
        tipo: 'cilindro8',
        x: 0.965,
        y: 0.562,
        largura: 0.054,
        altura: 0.081,
      },
    ],
  },
  imagem2: {
    src: 'imagens/casa.jpg',
    proporcaoOriginal: 1.5,
    formas: [
      {
        tipo: 'circulo',
        x: 0.321,
        y: 0.732,
        largura: 0.018,
        altura: 0.017,
      },
      {
        tipo: 'triangulo',
        pontos: [
          { x: 0.61, y: 0.25 }, // canto inferior esquerdo
          { x: 0.65, y: 0.25 }, // canto inferior direito
          { x: 0.626, y: 0.2 }, // ponta central em cima
        ],
      },

      {
        tipo: 'retangulo',
        x: 0.33,
        y: 0.64,
        largura: 0.07,
        altura: 0.07,
      },
      {
        tipo: 'retangulo2',
        x: 0.32,
        y: 0.6,
        largura: 0.09,
        altura: 0.29,
      },

      {
        tipo: 'quadrado',
        x: 0.485,
        y: 0.61,
        largura: 0.035,
        altura: 0.06,
      },
      {
        tipo: 'quadrado2',
        x: 0.71,
        y: 0.89,
        largura: 0.03,
        altura: 0.04,
      },
      {
        tipo: 'quadrado3',
        x: 0.779,
        y: 0.89,
        largura: 0.03,
        altura: 0.04,
      },
      {
        tipo: 'quadrado4',
        x: 0.525,
        y: 0.61,
        largura: 0.035,
        altura: 0.06,
      },
      {
        tipo: 'quadrado5',
        x: 0.525,
        y: 0.68,
        largura: 0.035,
        altura: 0.06,
      },
      {
        tipo: 'quadrado6',
        x: 0.485,
        y: 0.68,
        largura: 0.035,
        altura: 0.06,
      },
      {
        tipo: 'quadrado7',
        x: 0.475,
        y: 0.59,
        largura: 0.09,
        altura: 0.17,
      },
    ],
  },
  imagem3: {
    src: 'imagens/dentro_casa.jpg',
    proporcaoOriginal: 1.5,
    formas: [
      {
        tipo: 'circulo',
        x: 0.836,
        y: 0.07,
        largura: 0.105,
        altura: 0.04,
      },
      {
        tipo: 'retangulo',
        x: 0.37,
        y: 0.09,
        largura: 0.12,
        altura: 0.05,
      },
      {
        tipo: 'retangulo2',
        x: 0.37,
        y: 0.16,
        largura: 0.15,
        altura: 0.05,
      },
      {
        tipo: 'retangulo3',
        x: 0.37,
        y: 0.23,
        largura: 0.15,
        altura: 0.05,
      },

      {
        tipo: 'quadrado',
        x: 0.61,
        y: 0.05,
        largura: 0.22,
        altura: 0.185,
      },
      {
        tipo: 'quadrado2',
        x: 0.695,
        y: 0.25,
        largura: 0.12,
        altura: 0.105,
      },
      {
        tipo: 'quadrado3',
        x: 0.1,
        y: 0.14,
        largura: 0.11,
        altura: 0.1,
      },
      {
        tipo: 'quadrado4',
        x: 0.1,
        y: 0.25,
        largura: 0.11,
        altura: 0.09,
      },
      {
        tipo: 'quadrado5',
        x: 0.22,
        y: 0.13,
        largura: 0.1,
        altura: 0.095,
      },
      {
        tipo: 'quadrado6',
        x: 0.22,
        y: 0.23,
        largura: 0.11,
        altura: 0.09,
      },
    ],
  },
};

let progresso = {}; // Armazena quantas de cada tipo restam

function inicializarProgresso(idImagem) {
  const mapa = mapasImagens[idImagem];
  if (!mapa || !mapa.formas) return;

  progresso = {};

  // Atribui um ID único a cada forma
  mapa.formas.forEach((f, index) => {
    f.id = `${idImagem}_${f.tipo}_${index}`;
    const tipoBase = obterTipoBase(f.tipo); // Remove número (cilindro1 → cilindro)
    progresso[tipoBase] = (progresso[tipoBase] || 0) + 1;
  });

  atualizarPainelFormas();
}

// Remove números do nome (ex: cilindro4 → cilindro)
function obterTipoBase(tipo) {
  return tipo.replace(/[0-9]/g, '').toLowerCase();
}

// Atualiza o painel visual com as quantidades
function atualizarPainelFormas() {
  const container = document.getElementById('formas-cont');
  if (!container) return;
  container.innerHTML = '';
  // Itera apenas sobre os tipos que têm progresso > 0 (presentes na fase atual)
  Object.keys(progresso).forEach((tipo) => {
    const qtd = progresso[tipo];
    if (qtd <= 0) return; // Pula tipos com 0 (não mostra se não há mais)
    // Cria a <img> para o tipo
    const img = document.createElement('img');
    img.src = `imagens/${tipo}.png`; // Ajuste o caminho se necessário (ex.: se for .jpg)
    img.alt = tipo; // Para acessibilidade
    img.style.width = '50px'; // Ajuste o tamanho conforme seu CSS
    img.style.height = '50px';
    img.style.margin = '5px';
    // Cria o <span> contador
    const contador = document.createElement('span');
    contador.className = 'contador';
    contador.style.marginLeft = '6px';
    contador.style.fontWeight = 'bold';
    contador.textContent = `x${qtd}`;
    // Adiciona ao container
    container.appendChild(img);
    container.appendChild(contador);
  });
}

// Função chamada ao clicar na imagem
function verificarClique(event, idImagem) {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const larguraAtual = rect.width;
  const alturaAtual = rect.height;

  const mapa = mapasImagens[idImagem];
  if (!mapa || !mapa.formas) return;

  const proporcaoAtual = larguraAtual / alturaAtual;
  const proporcaoOriginal = mapa.proporcaoOriginal || proporcaoAtual;
  const ajusteX = proporcaoAtual / proporcaoOriginal;
  const ajusteY = 1 / ajusteX;

  for (let forma of mapa.formas) {
    if (
      estaDentroDaForma(
        x,
        y,
        forma,
        larguraAtual,
        alturaAtual,
        ajusteX,
        ajusteY,
      )
    ) {
      //  Impede múltiplos cliques na mesma forma
      if (formasJaClicadas.has(forma.id)) {
        return;
      }
      formasJaClicadas.add(forma.id);

      somAcerto.play(); //  Toca som de acerto

      const tipoBase = obterTipoBase(forma.tipo);
      if (progresso[tipoBase] && progresso[tipoBase] > 0) {
        progresso[tipoBase]--;
        atualizarPainelFormas();

        const todasFeitas = Object.values(progresso).every((q) => q === 0);
        if (todasFeitas) {
          nextlvl.play();

          const btn = document.getElementById('btnProximaFase');
          btn.style.display = 'inline-block';
        }
      }

      return;
    }
  }

  somErro.play(); //  Toca som de erro
}

// 🎯 Verifica se o ponto está dentro de alguma forma
function estaDentroDaForma(
  x,
  y,
  forma,
  larguraAtual,
  alturaAtual,
  ajusteX,
  ajusteY,
) {
  const f = converterFormaParaPixels(
    forma,
    larguraAtual,
    alturaAtual,
    ajusteX,
    ajusteY,
  );

  const tipo = f.tipo.toLowerCase();

  if (tipo.includes('circulo')) {
    return estaDentroDoCirculo(x, y, f.centroX, f.centroY, f.raio);
  }
  if (tipo.includes('retangulo')) {
    return estaDentroDoRetangulo(x, y, f.x, f.y, f.largura, f.altura);
  }
  if (tipo.includes('quadrado')) {
    return estaDentroDoQuadrado(x, y, f.x, f.y, f.largura);
  }
  if (tipo.includes('triangulo')) {
    return estaDentroDoTriangulo(x, y, f.x1, f.y1, f.x2, f.y2, f.x3, f.y3);
  }
  if (tipo.includes('cilindro')) {
    return estaDentroDoRetangulo(x, y, f.x, f.y, f.largura, f.altura);
  }
  if (tipo.includes('losango')) {
    return estaDentroDoLosango(x, y, f.centroX, f.centroY, f.largura, f.altura);
  }

  return false;
}

// Converte frações em pixels, calcula centros e ajusta para proporção
function converterFormaParaPixels(
  forma,
  larguraAtual,
  alturaAtual,
  ajusteX,
  ajusteY,
) {
  const f = { ...forma };
  const toPX = (v, ref, ajuste) => v * ref * ajuste;

  if (f.x !== undefined) f.x = toPX(f.x, larguraAtual, ajusteX);
  if (f.y !== undefined) f.y = toPX(f.y, alturaAtual, ajusteY);
  if (f.largura !== undefined)
    f.largura = toPX(f.largura, larguraAtual, ajusteX);
  if (f.altura !== undefined) f.altura = toPX(f.altura, alturaAtual, ajusteY);

  // Círculo → calcula centro e raio
  if (f.tipo === 'circulo') {
    f.raio = f.largura / 2;
    f.centroX = f.x + f.raio;
    f.centroY = f.y + f.raio;
  }

  // Losango → calcula centro
  if (f.tipo === 'losango') {
    f.centroX = f.x + f.largura / 2;
    f.centroY = f.y + f.altura / 2;
  }

  // Triângulo → converte pontos para pixels com ajuste
  if (f.tipo === 'triangulo' && Array.isArray(f.pontos)) {
    const [p1, p2, p3] = f.pontos;
    f.x1 = toPX(p1.x, larguraAtual, ajusteX);
    f.y1 = toPX(p1.y, alturaAtual, ajusteY);
    f.x2 = toPX(p2.x, larguraAtual, ajusteX);
    f.y2 = toPX(p2.y, alturaAtual, ajusteY);
    f.x3 = toPX(p3.x, larguraAtual, ajusteX);
    f.y3 = toPX(p3.y, alturaAtual, ajusteY);
  }

  console.log(`Forma convertida (${f.tipo}):`, f); // Depuração
  return f;
}

// Funções geométricas (inalteradas, mas com logs para depuração)
function estaDentroDoCirculo(x, y, centroX, centroY, raio) {
  const distancia = Math.sqrt((x - centroX) ** 2 + (y - centroY) ** 2);
  const dentro = distancia <= raio;
  console.log(
    console.log(
      `Círculo: Distância ${distancia.toFixed(2)} <= ${raio.toFixed(
        2,
      )}? ${dentro}`,
    ),
  );
  return dentro;
}

function estaDentroDoQuadrado(x, y, xEsq, yTopo, lado) {
  const dentro =
    x >= xEsq && x <= xEsq + lado && y >= yTopo && y <= yTopo + lado;
  console.log(`Quadrado: Dentro? ${dentro}`);
  return dentro;
}

function estaDentroDoRetangulo(x, y, xEsq, yTopo, largura, altura) {
  const dentro =
    x >= xEsq && x <= xEsq + largura && y >= yTopo && y <= yTopo + altura;
  console.log(`Retângulo: Dentro? ${dentro}`);
  return dentro;
}

function estaDentroDoTriangulo(x, y, x1, y1, x2, y2, x3, y3) {
  const areaTotal = Math.abs(
    (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2,
  );
  const area1 = Math.abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2);
  const area2 = Math.abs((x1 * (y - y3) + x * (y3 - y1) + x3 * (y1 - y)) / 2);
  const area3 = Math.abs((x1 * (y2 - y) + x2 * (y - y1) + x * (y1 - y2)) / 2);
  const dentro = Math.abs(area1 + area2 + area3 - areaTotal) < 0.01;
  console.log(
    `Triângulo: Áreas somadas ${(area1 + area2 + area3).toFixed(
      2,
    )} ≈ ${areaTotal.toFixed(2)}? ${dentro}`,
  );
  return dentro;
}

function estaDentroDoLosango(x, y, centroX, centroY, largura, altura) {
  const metadeLargura = largura / 2;
  const metadeAltura = altura / 2;
  const dentro =
    Math.abs(x - centroX) / metadeLargura +
      Math.abs(y - centroY) / metadeAltura <=
    1;
  console.log(`Losango: Dentro? ${dentro}`);
  return dentro;
}
function desenharMapeamentos(idImagem) {
  const imagemElement = imgfase; // Elemento fixo da imagem
  const container = imagemElement.parentElement; // Assume que #imagem é o pai (ajuste se necessário)
  const mapa = mapasImagens[idImagem]; // Usa idImagem apenas para acessar o mapa
  if (!mapa || !mapa.formas) return;

  const existentes = container.querySelectorAll('.mapeamento-visual');
  existentes.forEach((el) => el.remove());
  const rect = imagemElement.getBoundingClientRect();
  const larguraAtual = rect.width;
  const alturaAtual = rect.height;
  // Calcula proporção para ajuste (igual ao verificarClique)
  const proporcaoAtual = larguraAtual / alturaAtual;
  const proporcaoOriginal = mapa.proporcaoOriginal || proporcaoAtual;
  const ajusteX = proporcaoAtual / proporcaoOriginal;
  const ajusteY = 1 / ajusteX;

  mapa.formas.forEach((forma, index) => {
    const f = converterFormaParaPixels(
      forma,
      larguraAtual,
      alturaAtual,
      ajusteX,
      ajusteY,
    );

    // Cria um <div> para representar a forma
    const div = document.createElement('div');
    div.className = 'mapeamento-visual';
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none'; // Não interfere em cliques

    switch (forma.tipo) {
      case 'circulo':
      case 'circulo2':
      case 'circulo3':
      case 'circulo4':
      case 'circulo5':
        div.style.borderRadius = '50%'; // Faz circular
        div.style.width = `${f.largura}px`;
        div.style.height = `${f.largura}px`; // Altura = largura para círculo
        div.style.left = `${f.x}px`;
        div.style.top = `${f.y}px`;
        break;
      case 'retangulo':
      case 'retangulo1':
      case 'retangulo2':
      case 'retangulo3':
      case 'retangulo4':
      case 'retangulo5':
      case 'retangulo6':
      case 'retangulo7':
      case 'retangulo8':
      case 'retangulo9':
      case 'retangulo10':
        div.style.width = `${f.largura}px`;
        div.style.height = `${f.altura}px`;
        div.style.left = `${f.x}px`;
        div.style.top = `${f.y}px`;
        break;
      case 'cilindro':
      case 'cilindro2':
      case 'cilindro3':
      case 'cilindro4':
      case 'cilindro5':
      case 'cilindro6':
      case 'cilindro7':
      case 'cilindro8':
      case 'cilindro9':
        div.style.width = `${f.largura}px`;
        div.style.height = `${f.altura}px`;
        div.style.left = `${f.x}px`;
        div.style.top = `${f.y}px`;
        break;
      case 'triangulo':
      case 'triangulo2':
      case 'triangulo3':
      case 'triangulo4':
      case 'triangulo5':
        // Para triângulo, usa clip-path para aproximar (mais simples que SVG)
        div.style.width = `${
          Math.max(f.x1, f.x2, f.x3) - Math.min(f.x1, f.x2, f.x3)
        }px`;
        div.style.height = `${
          Math.max(f.y1, f.y2, f.y3) - Math.min(f.y1, f.y2, f.y3)
        }px`;
        div.style.left = `${Math.min(f.x1, f.x2, f.x3)}px`;
        div.style.top = `${Math.min(f.y1, f.y2, f.y3)}px`;
        div.style.clipPath = `polygon(${f.x1 - Math.min(f.x1, f.x2, f.x3)}px ${
          f.y1 - Math.min(f.y1, f.y2, f.y3)
        }px, ${f.x2 - Math.min(f.x1, f.x2, f.x3)}px ${
          f.y2 - Math.min(f.y1, f.y2, f.y3)
        }px, ${f.x3 - Math.min(f.x1, f.x2, f.x3)}px ${
          f.y3 - Math.min(f.y1, f.y2, f.y3)
        }px)`;
        break;
      case 'losango':
        div.style.width = `${f.largura}px`;
        div.style.height = `${f.altura}px`;
        div.style.left = `${f.x}px`;
        div.style.top = `${f.y}px`;
        div.style.transform = 'rotate(45deg)'; // Aproximação simples para losango
        break;
      case 'quadrado':
      case 'quadrado2':
      case 'quadrado3':
      case 'quadrado4':
      case 'quadrado5':
      case 'quadrado6':
      case 'quadrado7':
        div.style.width = `${f.largura}px`;
        div.style.height = `${f.altura}px`;
        div.style.left = `${f.x}px`;
        div.style.top = `${f.y}px`;
        break;
      default:
        console.warn(
          `Tipo de forma não suportado para visualização: ${forma.tipo}`,
        );
        return;
    }

    container.appendChild(div);
  });
}
window.addEventListener('load', () => {
  carregarFase('imagem1'); // já inicializa tudo
});

window.addEventListener('resize', () => {
  desenharMapeamentos(faseAtual);
});

//  Array com as chaves das fases, na ordem desejada
const listaFases = Object.keys(mapasImagens);
let indiceFaseAtual = 0;

const btnProxima = document.getElementById('btnProximaFase');
btnProxima.addEventListener('click', () => {
  indiceFaseAtual++;

  if (indiceFaseAtual < listaFases.length) {
    const proximaFase = listaFases[indiceFaseAtual];
    const novaImagem = mapasImagens[proximaFase];

    // Troca o src da imagem principal
    imgfase.src = novaImagem.src;

    // Espera a imagem carregar antes de redesenhar as formas
    imgfase.onload = () => {
      carregarFase(proximaFase);
      desenharMapeamentos(proximaFase);
    };

    btnProxima.style.display = 'none';
  } else {
    feedback.textContent = 'Todas as fases concluídas!';
    btnProxima.style.display = 'none';
  }
});
// Evento para o botão de dica
document.getElementById('btnDica').addEventListener('click', mostrarDica);
