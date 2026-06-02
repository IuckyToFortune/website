/* ============================================
   LUCKY EWURUM — Portfolio JS
   ============================================ */

// ── Canvas particle / molecule background ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, animId;
  const NODE_COUNT = 55;
  const MAX_DIST = 160;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.18, 0.18), vy: rand(-0.18, 0.18),
      r: rand(1, 2.4)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(49,92,75,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214,195,165,0.25)';
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  initNodes();
  draw();
  window.addEventListener('resize', () => {
    resize();
    cancelAnimationFrame(animId);
    initNodes();
    draw();
  });
})();


// ── Nav scroll behaviour ──
(function () {
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


// ── Hamburger / mobile menu ──
(function () {
  const burger = document.querySelector('.hamburger');
  const menu   = document.querySelector('.mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


// ── Scroll reveal ──
(function () {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();


// ── Active nav link highlighting ──
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.style.color = 'var(--highlight)';
        else links.forEach(l => l.style.color = '');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => io.observe(s));
})();
