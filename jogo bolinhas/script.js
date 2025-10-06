

document.addEventListener('DOMContentLoaded', function () {
  // Elementos do DOM
  const ballsContainer = document.getElementById('balls-container');
  const boxContainer = document.getElementById('box-container');
  const checkBtn = document.getElementById('check-btn');
  const nextBtn = document.getElementById('next-btn');
  const resetBtn = document.getElementById('reset-btn');
  const feedbackEl = document.getElementById('feedback');
  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const solvedEl = document.getElementById('solved');

  const errorSound = document.getElementById('error-sound');
  const successSound = document.getElementById('success-sound');

  // Estado do jogo (adicionado: levelCompleted para evitar múltiplos increments)
  let gameState = {
    level: 1,
    score: 0,
    problemsSolved: 0,
    problems: [],
    balls: [],
    levelCompleted: false, // Flag para controlar se o nível já foi acertado
  };

  const colors = ['vermelho', 'azul', 'verde', 'amarelo', 'roxo', 'laranja'];

  initGame();

  checkBtn.addEventListener('click', checkAnswers);
  nextBtn.addEventListener('click', nextLevel);
  resetBtn.addEventListener('click', resetGame);

  // Função para determinar a dificuldade baseada no level
  function getDifficulty(level) {
    if (level <= 3) return 'easy';
    if (level <= 6) return 'medium';
    return 'hard';
  }

  // Inicializa o jogo (adicionado: reset levelCompleted)
  function initGame() {
    ballsContainer.innerHTML = '';
    boxContainer.innerHTML = '';

    // Reset flag para novo nível
    gameState.levelCompleted = false;
    checkBtn.disabled = false; // Reabilita o botão check para novo nível

    generateProblems();
    generateBalls();
    updateStats();
    nextBtn.disabled = true;
  }

  // Gera caixas e problemas
  function generateProblems() {
    gameState.problems = [];
    //Define a qntt de problemas, ou as caixas
    const numProblems = Math.min(gameState.level + 1, 4);
    const difficulty = getDifficulty(gameState.level);

    //Esse loop cria cada problema de matemática
    // selecina cor, operações e sinais
    //________________________________________________
    for (let i = 0; i < numProblems; i++) {
      const color = colors[i % colors.length];
      let num1, num2, answer, operator;
      if (difficulty === 'easy') {
        // Fácil: apenas contagem de bolinhas, sem operações ou números visíveis nas bolinhas
        answer = Math.floor(Math.random() * (gameState.level * 2 + 1)) + 1; // Ex: level 1: 1-3, level 2: 1-5, level 3: 1-7
        operator = null;
        num1 = null;
        num2 = null;
      } else {
        // Médio e Difícil: com operações
        operator = Math.random() > 0.5 ? '+' : '-';
        if (difficulty === 'medium') {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
        } else {
          // hard
          num1 = Math.floor(Math.random() * 15) + 1;
          num2 = Math.floor(Math.random() * 15) + 1;
        }
        if (operator === '-' && num2 > num1) [num1, num2] = [num2, num1];
        answer = operator === '+' ? num1 + num2 : num1 - num2;
      }

      const problem = {
        color,
        expression:
          difficulty === 'easy'
            ? `${answer} bolinhas ${color}`
            : `${num1} ${operator} ${num2}`,
        answer,
        balls: [], // Inicializa vazio
      };
      gameState.problems.push(problem);

      // Criar caixa
      const box = document.createElement('div');
      box.className = `math-box box-${color}`;
      box.dataset.problemIndex = i;
      box.dataset.color = color;

      //Modelo da caixa - Texto simples
      const problemEl = document.createElement('div');
      problemEl.className = 'problem';
      if (difficulty === 'easy') {
        problemEl.textContent = `Caixa ${color}: Coloque ${answer} bolinhas ${color}`;
      } else {
        problemEl.textContent = `Caixa ${color}: ${num1} ${operator} ${num2} = ?`;
      }

      const boxContent = document.createElement('div');
      boxContent.className = 'box-content';

      box.appendChild(problemEl);
      box.appendChild(boxContent);
      boxContainer.appendChild(box);

      // Drag & drop na caixa (corrigido: usa dataset para index)
      box.addEventListener('dragover', (e) => e.preventDefault());

      box.addEventListener('drop', function (e) {
        e.preventDefault();
        const ballId = e.dataTransfer.getData('text/plain');
        const ball = document.getElementById(ballId);
        if (ball) {
          // Move o elemento DOM para esta caixa (appendChild move automaticamente se já existir em outro lugar)
          this.querySelector('.box-content').appendChild(ball);

          // Limpa o estado de TODAS as caixas (remove a bolinha de qualquer uma)
          gameState.problems.forEach((p) => {
            p.balls = p.balls.filter((b) => b.id !== ballId);
          });

          // Adiciona à caixa ATUAL (usa dataset para index seguro)
          const currentIndex = parseInt(this.dataset.problemIndex);
          gameState.problems[currentIndex].balls.push({
            id: ballId,
            value: parseInt(ball.dataset.value),
            color: ball.dataset.color,
          });
        }
      });
    }
  }

  // Gerar bolinhas
  function generateBalls() {
    ballsContainer.innerHTML = '';
    gameState.balls = [];
    const difficulty = getDifficulty(gameState.level);

    const totalBallsNeeded = gameState.problems.reduce(
      (sum, p) => sum + p.answer,
      0,
    );
    const totalBalls = totalBallsNeeded + 5;

    const values = [];
    if (difficulty === 'hard') {
      // Difícil: bolinhas com valores variáveis (1-3) e números visíveis
      for (const problem of gameState.problems) {
        let remaining = problem.answer;
        while (remaining > 0) {
          const value = Math.min(remaining, Math.floor(Math.random() * 3) + 1);
          values.push({ value, color: problem.color });
          remaining -= value;
        }
      }
    } else {
      // Fácil e Médio: todas bolinhas valem 1 (sem números visíveis)
      for (const problem of gameState.problems) {
        for (let j = 0; j < problem.answer; j++) {
          values.push({ value: 1, color: problem.color });
        }
      }
    }

    // Bolinhas extras (distratores)
    const extraBalls = totalBalls - values.length;
    for (let i = 0; i < extraBalls; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const value =
        difficulty === 'hard' ? Math.floor(Math.random() * 3) + 1 : 1;
      values.push({ value, color });
    }

    shuffleArray(values);

    values.forEach((v, i) => {
      const ball = document.createElement('div');
      ball.className = `ball ${v.color}`;
      ball.id = `ball-${i}`;
      // Só mostra número em modo difícil
      if (difficulty === 'hard') {
        ball.textContent = v.value;
      }
      ball.draggable = true;
      ball.dataset.value = v.value;
      ball.dataset.color = v.color;

      ball.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', ball.id);
        ball.classList.add('dragging');
      });
      ball.addEventListener('dragend', () => ball.classList.remove('dragging'));

      ballsContainer.appendChild(ball);
      gameState.balls.push({ id: ball.id, value: v.value, color: v.color });
    });
  }

  // Permitir devolver bolinhas ao container (corrigido: limpa estado)
  ballsContainer.addEventListener('dragover', (e) => e.preventDefault());
  ballsContainer.addEventListener('drop', function (e) {
    e.preventDefault();
    const ballId = e.dataTransfer.getData('text/plain');
    const ball = document.getElementById(ballId);
    if (ball) {
      // Move o elemento DOM de volta ao container
      ballsContainer.appendChild(ball);
      // Remove de QUALQUER caixa no estado
      gameState.problems.forEach((p) => {
        p.balls = p.balls.filter((b) => b.id !== ballId);
      });
    }
  });

  // Verificar respostas (corrigido: só incrementa se !levelCompleted)
  function checkAnswers() {
    let allCorrect = true;
    let messages = [];

    // Reconstrói o estado das bolinhas baseado no DOM atual (evita desyncs de arrastar)
    gameState.problems.forEach((problem, index) => {
      const box = document.querySelector(
        `.math-box[data-problem-index="${index}"]`,
      );
      const boxContent = box.querySelector('.box-content');
      const currentBalls = Array.from(boxContent.querySelectorAll('.ball')).map(
        (ball) => ({
          id: ball.id,
          value: parseInt(ball.dataset.value),
          color: ball.dataset.color,
        }),
      );
      // Atualiza o estado com as bolinhas reais no DOM
      problem.balls = currentBalls;
    });

    gameState.problems.forEach((problem, index) => {
      const box = document.querySelector(
        `.math-box[data-problem-index="${index}"]`,
      );
      let sumCorrectColor = 0;
      let wrongColors = [];

      problem.balls.forEach((ball) => {
        if (ball.color === problem.color) {
          sumCorrectColor += ball.value;
        } else {
          wrongColors.push(ball.color);
        }
      });

      if (sumCorrectColor === problem.answer && wrongColors.length === 0) {
        box.classList.add('correct');
        box.classList.remove('incorrect');
      } else {
        box.classList.add('incorrect');
        box.classList.remove('correct');
        allCorrect = false;

        if (wrongColors.length > 0) {
          // Remove duplicatas para mensagem mais limpa (opcional)
          const uniqueWrong = [...new Set(wrongColors)];
          messages.push(
            `Caixa ${problem.color} contém cores erradas: ${uniqueWrong.join(
              ', ',
            )}`,
          );
        } else if (sumCorrectColor !== problem.answer) {
          messages.push(
            `Caixa ${problem.color}: Quantidade incorreta (esperado: ${problem.answer}).`,
          );
        }
      }
    });

    feedbackEl.textContent = allCorrect
      ? 'Parabéns! Todas corretas!'
      : messages.join(' | ') ||
        'Algumas respostas estão incorretas. Tente novamente!';

    if (allCorrect && !gameState.levelCompleted) {
      successSound.currentTime = 0;
      successSound.play();
    } else if (!allCorrect) {
      errorSound.currentTime = 0;
      errorSound.play();
    }
    feedbackEl.className = allCorrect
      ? 'feedback correct-feedback'
      : 'feedback incorrect-feedback';

    // SÓ incrementa se TUDO correto E nível não completado ainda
    if (allCorrect && !gameState.levelCompleted) {
      gameState.score += gameState.level * 10;
      gameState.problemsSolved += gameState.problems.length;
      gameState.levelCompleted = true; // Marca como completado (evita múltiplos increments)
      updateStats();
      nextBtn.disabled = false;
      checkBtn.disabled = true; // Desabilita check para evitar cliques extras (opcional, mas recomendado)
    } else if (allCorrect && gameState.levelCompleted) {
      // Se já completado, só mostra feedback sem incrementar
      feedbackEl.textContent =
        'Parabéns! Já verificado. Vá para o próximo nível!';
    } else {
      // Incorreto: Reset classes se incorreto, para próximo check
      setTimeout(() => {
        gameState.problems.forEach((_, index) => {
          const box = document.querySelector(
            `.math-box[data-problem-index="${index}"]`,
          );
          box.classList.remove('correct', 'incorrect');
        });
      }, 2000);
    }
  }

  function nextLevel() {
    gameState.level++;
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    // Reset flag para novo nível
    gameState.levelCompleted = false;
    checkBtn.disabled = false; // Reabilita check para novo nível
    initGame();
  }

  function resetGame() {
    gameState = {
      level: 1,
      score: 0,
      problemsSolved: 0,
      problems: [],
      balls: [],
      levelCompleted: false, // Reset flag
    };
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';
    checkBtn.disabled = false; // Reabilita check
    initGame();
  }

  function updateStats() {
    levelEl.textContent = gameState.level;
    scoreEl.textContent = gameState.score;
    solvedEl.textContent = gameState.problemsSolved;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});
