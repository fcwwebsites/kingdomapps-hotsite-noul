(function () {
  var PIN = '1304';
  var KEY = 'kingdomapps_noul_gate';

  var lockEl = document.getElementById('lock');
  var galleryEl = document.getElementById('gallery');
  var form = document.getElementById('pin-form');
  var input = document.getElementById('pin-input');
  var err = document.getElementById('pin-err');
  var cardsRoot = document.getElementById('cards');
  var logoutBtn = document.getElementById('logout');

  // Version paths/names exist ONLY in this script — not in locked DOM
  var VERSIONS = [
    {
      id: 'v1',
      path: 'v1/',
      title: 'Versão 1 — E07 Jornal de bairro',
      blurb: "E07 · Jornal de bairro — cabeçalho-manchete com seções do jornal, manchete com foto legendada e coluna lateral, matéria em colunas com capitular, notas em 4 colunas, cardápio em classificados, expediente. Refs: Fasano, Terraço Itália, Famiglia Mancini."
    },
    {
      id: 'v2',
      path: 'v2/',
      title: 'Versão 2 — E08 Arcos da vitrine',
      blurb: "E08 · Arcos da vitrine — logo central, três fotos em arco no hero, destaques num trilho horizontal de arcos, cardápio em etiquetas penduradas, selo redondo de avaliação e contato em cartão-postal. Refs: 1900, Famiglia Mancini, Fasano."
    }
  ];

  function unlocked() {
    try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function setUnlocked(on) {
    try {
      if (on) sessionStorage.setItem(KEY, '1');
      else sessionStorage.removeItem(KEY);
    } catch (e) {}
  }

  function renderCards() {
    cardsRoot.innerHTML = '';
    VERSIONS.forEach(function (v) {
      var card = document.createElement('article');
      card.className = 'card';

      var preview = document.createElement('div');
      preview.className = 'card-preview';
      var iframe = document.createElement('iframe');
      iframe.src = v.path;
      iframe.title = 'Prévia ' + v.title;
      iframe.loading = 'lazy';
      iframe.setAttribute('tabindex', '-1');
      preview.appendChild(iframe);

      var body = document.createElement('div');
      body.className = 'card-body';
      body.innerHTML =
        '<h2></h2><p></p><div class="card-actions"></div>';
      body.querySelector('h2').textContent = v.title;
      body.querySelector('p').textContent = v.blurb;
      var actions = body.querySelector('.card-actions');
      var open = document.createElement('a');
      open.className = 'open';
      open.href = v.path;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Abrir em nova aba';
      actions.appendChild(open);

      card.appendChild(preview);
      card.appendChild(body);
      cardsRoot.appendChild(card);
    });
  }

  function showGallery() {
    lockEl.classList.add('hidden');
    galleryEl.classList.remove('hidden');
    renderCards();
  }

  function showLock() {
    galleryEl.classList.add('hidden');
    lockEl.classList.remove('hidden');
    cardsRoot.innerHTML = '';
    if (input) input.value = '';
    if (err) err.textContent = '';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').replace(/\D/g, '');
      if (val === PIN) {
        setUnlocked(true);
        err.textContent = '';
        showGallery();
      } else {
        err.textContent = 'Código incorreto. Tente de novo.';
        input.focus();
        input.select();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      setUnlocked(false);
      showLock();
    });
  }

  if (unlocked()) showGallery();
  else showLock();
})();
