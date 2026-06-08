
    const telaInicio = document.getElementById('tela-inicio');
    const telaQuiz = document.getElementById('tela-quiz');
    const telaResultado = document.getElementById('tela-resultado');
    const textoPergunta = document.getElementById('textoPergunta');
    const opcoes = document.getElementById('opcoes');
    const numeroPergunta = document.getElementById('numeroPergunta');
    const pontuacaoEl = document.getElementById('pontuacao');
    const barraProgresso = document.getElementById('barraProgresso');
    const textoTimer = document.getElementById('textoTimer');
    const anelTimer = document.getElementById('anelTimer');
    const perguntaBox = document.getElementById('perguntaBox');

    const TEMPO_POR_PERGUNTA = 15;

    let perguntas = [];
    let indiceAtual = 0;
    let pontos = 0;
    let intervaloTimer = null;
    let tempoRestante = TEMPO_POR_PERGUNTA;

    function embaralhar(arr) {
      return [...arr].sort(() => Math.random() - 0.5);
    }

    function decodeHTML(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

    function getRecorde() {
      return parseInt(localStorage.getItem('quiz-recorde') || '0');
    }

    function salvarRecorde(pontos, total) {
      const pct = Math.round((pontos / total) * 100);
      const recordeAtual = getRecorde();
      if (pct > recordeAtual) {
        localStorage.setItem('quiz-recorde', pct);
        return true;
      }
      return false;
    }

    function mostrarRecordeInicio() {
      const r = getRecorde();
      const el = document.getElementById('recorde-inicio');
      el.textContent = r > 0 ? `Recorde: ${r}%` : '';
    }

    async function carregarPerguntas(categoria, dificuldade) {
      let url = 'https://opentdb.com/api.php?amount=10&type=multiple';
      if (categoria) url += `&category=${categoria}`;
      if (dificuldade) url += `&difficulty=${dificuldade}`;

      try {
        const res = await fetch(url);
        const dados = await res.json();
        if (!dados.results || dados.results.length === 0) throw new Error();
        return dados.results.map(q => ({
          pergunta: decodeHTML(q.question),
          correta: decodeHTML(q.correct_answer),
          alternativas: embaralhar([q.correct_answer, ...q.incorrect_answers].map(a => decodeHTML(a))),
        }));
      } catch {
        return perguntasFallback();
      }
    }

    function perguntasFallback() {
      return [
        { pergunta: "Qual tag HTML define o título principal?", correta: "<h1>", alternativas: embaralhar(["<h1>", "<title>", "<header>", "<main>"]) },
        { pergunta: "Qual propriedade CSS cria layout flexível?", correta: "display: flex", alternativas: embaralhar(["display: flex", "float: left", "position: fixed", "display: block"]) },
        { pergunta: "Qual método JS adiciona elemento ao final de um array?", correta: "push()", alternativas: embaralhar(["push()", "pop()", "shift()", "unshift()"]) },
        { pergunta: "Qual método seleciona elemento pelo ID no DOM?", correta: "getElementById()", alternativas: embaralhar(["getElementById()", "querySelector()", "getByClass()", "findElement()"]) },
        { pergunta: "Qual é o protocolo base da web?", correta: "HTTP", alternativas: embaralhar(["HTTP", "FTP", "SMTP", "SSH"]) },
        { pergunta: "Qual operador JS checa igualdade estrita?", correta: "===", alternativas: embaralhar(["===", "==", "=", "!="]) },
        { pergunta: "CSS Grid usa qual propriedade para definir colunas?", correta: "grid-template-columns", alternativas: embaralhar(["grid-template-columns", "grid-columns", "columns", "flex-columns"]) },
        { pergunta: "Qual evento JS é disparado ao enviar um formulário?", correta: "submit", alternativas: embaralhar(["submit", "click", "change", "input"]) },
        { pergunta: "Qual método JS converte JSON em objeto?", correta: "JSON.parse()", alternativas: embaralhar(["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.toObject()"]) },
        { pergunta: "Qual tag HTML cria um link?", correta: "<a>", alternativas: embaralhar(["<a>", "<link>", "<href>", "<nav>"]) },
      ];
    }

    function iniciarTimer() {
      tempoRestante = TEMPO_POR_PERGUNTA;
      atualizarTimer();

      intervaloTimer = setInterval(() => {
        tempoRestante--;
        atualizarTimer();
        if (tempoRestante <= 0) {
          clearInterval(intervaloTimer);
          responderAutomatico();
        }
      }, 1000);
    }

    function atualizarTimer() {
      textoTimer.textContent = tempoRestante;
      const pct = (tempoRestante / TEMPO_POR_PERGUNTA) * 100;
      anelTimer.setAttribute('stroke-dasharray', `${pct}, 100`);

      if (tempoRestante <= 5) {
        anelTimer.style.stroke = '#ef4444';
        textoTimer.style.color = '#ef4444';
      } else if (tempoRestante <= 10) {
        anelTimer.style.stroke = '#f59e0b';
        textoTimer.style.color = '#f59e0b';
      } else {
        anelTimer.style.stroke = '#464646';
        textoTimer.style.color = '#464646';
      }
    }

    function pararTimer() {
      clearInterval(intervaloTimer);
    }

    function responderAutomatico() {
      const q = perguntas[indiceAtual];
      opcoes.querySelectorAll('.opcao').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.correta) btn.classList.add('correta');
      });
      setTimeout(avancar, 1000);
    }

    function mostrarPergunta() {
      const q = perguntas[indiceAtual];
      const total = perguntas.length;

      numeroPergunta.textContent = `Pergunta ${indiceAtual + 1} / ${total}`;
      pontuacaoEl.textContent = `Pontos: ${pontos}`;
      barraProgresso.style.width = `${(indiceAtual / total) * 100}%`;

      perguntaBox.classList.remove('entrar');
      void perguntaBox.offsetWidth;
      perguntaBox.classList.add('entrar');

      textoPergunta.textContent = q.pergunta;
      opcoes.innerHTML = '';
      q.alternativas.forEach(alt => {
        const btn = document.createElement('button');
        btn.className = 'opcao';
        btn.textContent = alt;
        opcoes.appendChild(btn);
      });

      iniciarTimer();
    }

    opcoes.addEventListener('click', (e) => {
      if (!e.target.classList.contains('opcao') || e.target.disabled) return;
      pararTimer();

      const q = perguntas[indiceAtual];
      const selecionada = e.target.textContent;

      opcoes.querySelectorAll('.opcao').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.correta) btn.classList.add('correta');
        else if (btn.textContent === selecionada) btn.classList.add('errada');
      });

      if (selecionada === q.correta) pontos++;

      setTimeout(avancar, 1000);
    });

    function avancar() {
      indiceAtual++;
      if (indiceAtual < perguntas.length) {
        mostrarPergunta();
      } else {
        mostrarResultado();
      }
    }

    function mostrarResultado() {
      pararTimer();
      barraProgresso.style.width = '100%';

      telaQuiz.hidden = true;
      telaResultado.hidden = false;

      const total = perguntas.length;
      const pct = Math.round((pontos / total) * 100);
      document.getElementById('placar').textContent = `${pontos} / ${total} (${pct}%)`;

      let msg = '';
      if (pct >= 80) msg = 'Excelente! Você domina o assunto!';
      else if (pct >= 60) msg = 'Bom trabalho! Continue praticando.';
      else msg = 'Continue estudando, você vai melhorar!';
      document.getElementById('mensagem').textContent = msg;

      const novoRecorde = salvarRecorde(pontos, total);
      const recordeEl = document.getElementById('recorde-resultado');
      if (novoRecorde) {
        recordeEl.textContent = `Novo recorde: ${pct}%!`;
        recordeEl.classList.add('novo-recorde');
      } else {
        recordeEl.textContent = `Recorde: ${getRecorde()}%`;
        recordeEl.classList.remove('novo-recorde');
      }
    }

    document.getElementById('btnIniciar').addEventListener('click', async () => {
      const categoria = document.getElementById('categoria').value;
      const dificuldade = document.getElementById('dificuldade').value;

      telaInicio.hidden = true;
      telaQuiz.hidden = false;
      textoPergunta.textContent = 'Carregando perguntas...';
      opcoes.innerHTML = '';
      barraProgresso.style.width = '0%';

      perguntas = await carregarPerguntas(categoria, dificuldade);
      indiceAtual = 0;
      pontos = 0;
      mostrarPergunta();
    });

    document.getElementById('btnReiniciar').addEventListener('click', () => {
      telaResultado.hidden = true;
      telaInicio.hidden = false;
      mostrarRecordeInicio();
    });

    mostrarRecordeInicio();