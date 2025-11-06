document.addEventListener('DOMContentLoaded', function () {
  const ballsContainer = document.getElementById('balls-container');
  const boxContainer = document.getElementById('box-container');
  const nextBtn = document.getElementById('next-btn');
  const resetBtn = document.getElementById('reset-btn');
  const feedbackEl = document.getElementById('feedback');
  const levelEl = document.getElementById('level');
  const scoreEl = document.getElementById('score');
  const solvedEl = document.getElementById('solved');
  const errorSound = document.getElementById('error-sound');
  const successSound = document.getElementById('success-sound');
  const victorySound = document.getElementById('victory');
<<<<<<< HEAD
=======
  const complet = document.getElementById('btnComplet');
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc

  // Estado do jogo
  let gameState = {
    level: 1,
    score: 0,
    problemsSolved: 0,
    problems: [],
    balls: [],
    levelCompleted: false, // Flag para controlar se o nível já foi acertado (mantido para evitar múltiplas verificações)
  };

<<<<<<< HEAD
  const colors = ['vermelho', 'azul', 'verde', 'amarelo', 'roxo', 'laranja'];
=======
  const colors = ['vermelha', 'azul', 'verde', 'amarela', 'roxa', 'laranja'];
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc

  initGame();

  nextBtn.addEventListener('click', verifyAndAdvance);
  resetBtn.addEventListener('click', resetGame);

  // Função para determinar a dificuldade baseada no level
  function getDifficulty(level) {
    if (level <= 3) return 'easy'; // Primeiros 3 níveis: contagem simples, bolinhas peso 1, sem números visíveis
    return 'hard'; // A partir do nível 4: operações simples, bolinhas com números visíveis (1-2)
  }

  // Inicializa o jogo
  function initGame() {
    ballsContainer.innerHTML = '';
    boxContainer.innerHTML = '';

    // Reset flag para novo nível
    gameState.levelCompleted = false;

    generateProblems();
    generateBalls();
    updateStats();
    feedbackEl.textContent = ''; // Limpa feedback no início
    feedbackEl.className = 'feedback';
    nextBtn.disabled = false; // Next sempre habilitado, mas verificação interna
  }

  // Gera caixas e problemas (ajustado para dificuldades simplificadas e operações mais fáceis)
<<<<<<< HEAD
  function generateProblems() {
    gameState.problems = [];
    // Define a qntt de problemas, ou as caixas (até 4)
    const numProblems = Math.min(gameState.level + 1, 4);
    const difficulty = getDifficulty(gameState.level);

=======

function pluralColor(color, count) {

if (count <= 1) return color;

if (color.endsWith('l')) return color.slice(0, -1) + 'is'; // azul → azuis

return color + 's';

}


  // Gera caixas e problemas (ajustado para dificuldades simplificadas e operações mais fáceis)
  
  function generateProblems() {
    gameState.problems = [];
    // Define a qntt de problemas, ou as caixas (até 4)
    const numProblems = Math.min(gameState.level + 1, 3);
    const difficulty = getDifficulty(gameState.level);

    // Embaralha as cores para torná-las aleatórias
    const shuffledColors = [...colors];
    shuffleArray(shuffledColors);

>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
    // Esse loop cria cada problema de matemática
    // seleciona cor, operações e sinais
    //________________________________________________
    for (let i = 0; i < numProblems; i++) {
<<<<<<< HEAD
      const color = colors[i % colors.length];
=======
      const color = shuffledColors[i]; // Usa cores embaralhadas para aleatoriedade
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
      let num1, num2, answer, operator;
      if (difficulty === 'easy') {
        // Fácil: apenas contagem de bolinhas, sem operações ou números visíveis nas bolinhas
        // Números pequenos para crianças: 1 a 5 no nível 1, crescendo levemente
        answer =
          Math.floor(Math.random() * Math.min(gameState.level * 2 + 1, 5)) + 1;
        operator = null;
        num1 = null;
        num2 = null;
      } else {
<<<<<<< HEAD
        // Hard (a partir do nível 4): operações simples para crianças de 6 anos
        // Números de 1 a 5, só + e -, sem subtração negativa
        operator = Math.random() > 0.5 ? '+' : '-';
        num1 = Math.floor(Math.random() * 5) + 1; // 1-5
        num2 = Math.floor(Math.random() * 5) + 1; // 1-5
=======
        // Hard (a partir do nível 4):
        // Números de 1 a 5, só + e -, sem subtração negativa
        operator = Math.random() > 0.5 ? '+' : '-';
        num1 = Math.floor(Math.random() * 9) + 1; // 1-5
        num2 = Math.floor(Math.random() * 9) + 1; // 1-5
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
        if (operator === '-' && num2 > num1) [num1, num2] = [num2, num1]; // Garante resultado >=0
        answer = operator === '+' ? num1 + num2 : num1 - num2;
      }

      const problem = {
        color,
<<<<<<< HEAD
        expression:
          difficulty === 'easy'
            ? `${answer} bolinhas ${color}`
            : `${num1} ${operator} ${num2}`,
=======
        expression: `${answer} bolinha${answer > 1 ? 's' : ''} ${color}${
          answer > 1 ? 's' : ''
        }`,
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
        answer,
        balls: [], // Inicializa vazio
      };
      gameState.problems.push(problem);

      // Criar caixa
      const box = document.createElement('div');
      box.className = `math-box box-${color}`;
      box.dataset.problemIndex = i;
      box.dataset.color = color;
<<<<<<< HEAD

      // Modelo da caixa - Texto simples
      const problemEl = document.createElement('div');
      problemEl.className = 'problem';
      if (difficulty === 'easy') {
        problemEl.textContent = `Caixa ${color}: Coloque ${answer} bolinhas ${color}`;
=======
      
      // Modelo da caixa - Texto simples 
      const problemEl = document.createElement('div');
      problemEl.className = 'problem';

      if (difficulty === 'easy') {
        problemEl.textContent = `Caixa ${color}: Coloque ${answer} bolinha${answer > 1 ? 's' : ''} ${pluralColor(color, answer)};`;
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
      } else {
        problemEl.textContent = `Caixa ${color}: ${num1} ${operator} ${num2} = ?`;
      }

      const boxContent = document.createElement('div');
      boxContent.className = 'box-content';

      box.appendChild(problemEl);
      box.appendChild(boxContent);
      boxContainer.appendChild(box);

      // Drag & drop na caixa (mantido como estava)
      box.addEventListener('dragover', (e) => e.preventDefault());

      box.addEventListener('drop', function (e) {
        e.preventDefault();
        const ballId = e.dataTransfer.getData('text/plain');
        const ball = document.getElementById(ballId);
        if (ball) {
          // Move o elemento DOM para esta caixa
          this.querySelector('.box-content').appendChild(ball);

          // Limpa o estado de TODAS as caixas
          gameState.problems.forEach((p) => {
            p.balls = p.balls.filter((b) => b.id !== ballId);
          });

          // Adiciona à caixa ATUAL
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

  // Gerar bolinhas (easy=1 sem números; hard=1-2 com números)
  function generateBalls() {
    ballsContainer.innerHTML = '';
    gameState.balls = [];
    const difficulty = getDifficulty(gameState.level);

    const totalBallsNeeded = gameState.problems.reduce(
      (sum, p) => sum + p.answer,
      0,
    );
    const totalBalls = totalBallsNeeded + 5; // + distratores

    const values = [];
    if (difficulty === 'hard') {
      // Hard: bolinhas com valores 1-2 (mais simples) e números visíveis
      for (const problem of gameState.problems) {
        let remaining = problem.answer;
        while (remaining > 0) {
<<<<<<< HEAD
          const value = Math.min(remaining, Math.floor(Math.random() * 2) + 1); // 1 ou 2
=======
          const value = Math.min(remaining, Math.floor(Math.random() * 4) + 1); // 1 ou 2
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
          values.push({ value, color: problem.color });
          remaining -= value;
        }
      }
    } else {
      // Easy: todas bolinhas valem 1 (sem números visíveis)
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
<<<<<<< HEAD
        difficulty === 'hard' ? Math.floor(Math.random() * 2) + 1 : 1; // 1-2 em hard, 1 em easy
=======
        difficulty === 'hard' ? Math.floor(Math.random() * 3) + 1 : 1; // 1-2 em hard, 1 em easy
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
      values.push({ value, color });
    }

    shuffleArray(values);

    values.forEach((v, i) => {
      const ball = document.createElement('div');
      ball.className = `ball ${v.color}`;
      ball.id = `ball-${i}`;
      // Só mostra número em modo hard
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

  // Permitir devolver bolinhas ao container (mantido)
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

  // Função de verificação
  function verifyAnswers() {
    let allCorrect = true;
    let messages = [];

    // Reconstrói o estado das bolinhas baseado no DOM atual
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

    // Feedback
    feedbackEl.textContent = allCorrect
      ? 'Parabéns! Todas corretas! Avançando para o próximo nível...'
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

    // Se incorreto: Reset classes após 2s
    if (!allCorrect) {
      setTimeout(() => {
        gameState.problems.forEach((_, index) => {
          const box = document.querySelector(
            `.math-box[data-problem-index="${index}"]`,
          );
          box.classList.remove('correct', 'incorrect');
        });
      }, 2000);
    }

    return allCorrect;
  }

  //  função para nextBtn: verifica e avança se correto
  function verifyAndAdvance() {
    const allCorrect = verifyAnswers();
<<<<<<< HEAD
=======
    const maxLevel = 6; //  Limite de fases
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc

    // SÓ avança e soma pontos se TUDO correto E nível não completado ainda
    if (allCorrect && !gameState.levelCompleted) {
      gameState.score += gameState.level * 10;
      gameState.problemsSolved += gameState.problems.length;
      gameState.levelCompleted = true; // Marca como completado
      updateStats();

<<<<<<< HEAD
      // Avança para próximo nível
      setTimeout(() => {
        gameState.level++;
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        gameState.levelCompleted = false; // Reset para novo nível
        initGame();
      }, 1500); // Pequeno delay para ver o feedback
    } else if (allCorrect && gameState.levelCompleted) {
      // Se já verificado antes (raro, mas evita loops)
      feedbackEl.textContent = 'Já verificado! Avançando...';
      setTimeout(() => {
        gameState.level++;
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';
        gameState.levelCompleted = false;
        initGame();
      }, 1000);
    }
    // Se incorreto: não avança, feedback já mostrado
=======
      // Avança para próximo nível ou finaliza o jogo
      setTimeout(() => {
        if (gameState.level < maxLevel) {
          gameState.level++;
          feedbackEl.textContent = '';
          feedbackEl.className = 'feedback';
          gameState.levelCompleted = false;
          initGame();
        } else {
          //  Quando chega no nível máximo
          feedbackEl.textContent =
            '🎉 Parabéns! Você completou todas as fases!';
          feedbackEl.className = 'feedback correct-feedback';
          nextBtn.disabled = true; // Desativa botão Next

          nextBtn.classList.add('hidden-button');

          complet.classList.remove('hidden-button');
          victorySound.currentTime = 0;
          victorySound.play();
        }
      }, 1500);
    } else if (allCorrect && gameState.levelCompleted) {
      feedbackEl.textContent = 'Já verificado! Avançando...';
      setTimeout(() => {
        if (gameState.level < maxLevel) {
          gameState.level++;
          feedbackEl.textContent = '';
          feedbackEl.className = 'feedback';
          gameState.levelCompleted = false;
          initGame();
        } else {
          complet.classList.remove('hidden-button');
          feedbackEl.textContent = '🎉 Você completou todas as fases!';
          nextBtn.classList.add('hidden-button');
          feedbackEl.className = 'feedback correct-feedback';
          nextBtn.disabled = true;
          victorySound.currentTime = 0;
          victorySound.play();
        }
      }, 1000);
    }
>>>>>>> 39c8a149dec38b7df2d9205624a23538b34676bc
  }

  function resetGame() {
    gameState = {
      level: 1,
      score: 0,
      problemsSolved: 0,
      problems: [],
      balls: [],
      levelCompleted: false,
    };
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

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
