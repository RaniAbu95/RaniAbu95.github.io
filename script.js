(function () {
  var root = document.documentElement;
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---------- theme ----------
  if (!root.dataset.theme) {
    root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.getElementById('theme-toggle').addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    save('theme', root.dataset.theme);
  });

  // ---------- language ----------
  document.getElementById('lang-toggle').addEventListener('click', function () {
    var he = root.lang !== 'he';
    root.lang = he ? 'he' : 'en';
    root.dir = he ? 'rtl' : 'ltr';
    save('lang', root.lang);
  });

  // ---------- project filters ----------
  var chips = document.querySelectorAll('.chip');
  var projects = document.querySelectorAll('.project');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
      var f = chip.dataset.filter;
      projects.forEach(function (p) {
        p.classList.toggle('hidden', f !== 'all' && p.dataset.tags.split(' ').indexOf(f) === -1);
      });
    });
  });

  // ---------- reveal on scroll ----------
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- terminal typing ----------
  var term = document.getElementById('term');
  var script = [
    ['p', '$ ', 'c', 'whoami'],
    ['', 'rani — software engineer · AI / backend / QA'],
    ['p', '$ ', 'c', 'ls ~/projects'],
    ['', 'whatsapp-support-bot/  captain-fix/  bank/'],
    ['p', '$ ', 'c', 'cat captain-fix/stack.txt'],
    ['', 'python · flask · claude · selenium · docker'],
    ['p', '$ ', 'c', 'curl -s bot.status'],
    ['', '{ "status": "live", "confidence_threshold": 0.7 }'],
    ['p', '$ ', 'c', 'echo $NEXT_ROLE'],
    ['m', '# hopefully at your company :)']
  ];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function span(cls, text) {
    var s = document.createElement('span');
    if (cls) s.className = cls;
    s.textContent = text;
    return s;
  }
  var cursor = span('cursor', '');

  if (reduce) {
    script.forEach(function (line) {
      for (var i = 0; i < line.length; i += 2) term.appendChild(span(line[i], line[i + 1]));
      term.appendChild(document.createTextNode('\n'));
    });
    return;
  }

  var li = 0;
  term.appendChild(cursor);
  function nextLine() {
    if (li >= script.length) return;
    var line = script[li++];
    var isCmd = line[0] === 'p';
    if (!isCmd) {
      term.insertBefore(span(line[0], line[1] + '\n'), cursor);
      setTimeout(nextLine, 350);
      return;
    }
    term.insertBefore(span('p', line[1]), cursor);
    var cmd = span('c', '');
    term.insertBefore(cmd, cursor);
    var text = line[3], i = 0;
    (function type() {
      if (i < text.length) { cmd.textContent += text[i++]; setTimeout(type, 45 + Math.random() * 50); }
      else { term.insertBefore(document.createTextNode('\n'), cursor); setTimeout(nextLine, 250); }
    })();
  }
  setTimeout(nextLine, 500);
})();
