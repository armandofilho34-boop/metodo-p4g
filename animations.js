/* ══════════════════════════════════════════
   ANIMAÇÕES — Página Vendas PM
══════════════════════════════════════════ */

// ── PARTICLES (hero) ──────────────────────
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    return {
      x: random(0, W),
      y: random(0, H),
      r: random(0.4, 1.6),
      alpha: random(0.1, 0.6),
      speedX: random(-0.15, 0.15),
      speedY: random(-0.3, -0.05),
      gold: Math.random() > 0.6,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,162,39,${p.alpha})`
        : `rgba(255,255,255,${p.alpha * 0.5})`;
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;
      p.alpha += Math.sin(Date.now() * 0.001 + p.x) * 0.003;

      if (p.y < -5 || p.x < -5 || p.x > W + 5) Object.assign(p, createParticle(), { y: H + 5 });
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  draw();
}

// ── SCROLL REVEAL ─────────────────────────
function initScrollReveal() {
  function checkElements() {
    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
      const rect = el.getBoundingClientRect();
      // Dispara quando o elemento está 80% dentro da tela (não apenas entrando)
      const trigger = window.innerHeight * 0.85;
      if (rect.top < trigger) {
        const delay = parseInt(el.dataset.delay || 0);
        if (delay) {
          setTimeout(() => el.classList.add('revealed'), delay);
        } else {
          el.classList.add('revealed');
        }
      }
    });
  }

  window.addEventListener('scroll', checkElements, { passive: true });
  // Múltiplas verificações para garantir que tudo aparece
  checkElements();
  setTimeout(checkElements, 200);
  setTimeout(checkElements, 500);
  window.addEventListener('load', () => {
    checkElements();
    setTimeout(checkElements, 300);
  });
}

// ── STAGGER CHILDREN ──────────────────────
function initStagger() {
  document.querySelectorAll('.stagger').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.1}s`;
      child.classList.add('reveal');
    });
  });

  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          Array.from(e.target.children).forEach(c => c.classList.add('revealed'));
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.stagger').forEach(el => obs.observe(el));
}

// ── NUMBER COUNTER ────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);
    el.textContent = prefix + value.toLocaleString('pt-BR') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => observer.observe(el));
}


// ── MAGNETIC BUTTONS ──────────────────────
function initMagneticBtns() {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── SPOTLIGHT CURSOR ──────────────────────
function initSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty('--mx', `${x}px`);
    hero.style.setProperty('--my', `${y}px`);
  });
}

// ── VIDEO CARDS: pause others on play ─────
function initVideoExclusive() {
  const videos = document.querySelectorAll('video');
  videos.forEach(v => {
    v.addEventListener('play', () => {
      videos.forEach(other => { if (other !== v) other.pause(); });
    });
  });
}

// ── PLAN CARD TILT ────────────────────────
function initTilt() {
  document.querySelectorAll('.plan-card').forEach(card => {
    const isGold = card.classList.contains('plan-card--gold');

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
      if (isGold) card.style.animation = 'none';
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
      card.style.transform = '';
      if (isGold) {
        setTimeout(() => { card.style.animation = ''; }, 400);
      }
    });
  });
}

// ── SMOOTH SCROLL ─────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ── BRAZIL MAP ────────────────────────────
function initMap() {
  const wrap = document.getElementById('mapSvgWrap');
  if (!wrap) return;

  fetch('brazil.svg')
    .then(r => r.text())
    .then(svgText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svg = doc.querySelector('svg');
      if (!svg) return;

      // Preserva viewBox, remove dimensões fixas
      const vb = svg.getAttribute('viewBox') || '0 0 612.51611 639.04297';
      svg.setAttribute('viewBox', vb);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.display = 'block';

      // Estados com aprovados registrados
      const approved = ['BR-AL','BR-BA','BR-PE','BR-CE','BR-PB','BR-RN','BR-PI','BR-MA',
                        'BR-SE','BR-GO','BR-MG','BR-SP','BR-RJ','BR-ES','BR-PR','BR-SC',
                        'BR-RS','BR-MT','BR-MS','BR-PA','BR-AM','BR-DF'];

      svg.querySelectorAll('path').forEach(path => {
        const id = path.getAttribute('id');
        if (id && approved.includes(id) && id !== 'BR-AL') {
          path.classList.add('has-approved');
        }
      });

      // Insere SVG primeiro para poder usar getBBox()
      wrap.querySelector('.map-loading')?.remove();
      wrap.insertBefore(svg, wrap.querySelector('.map-tooltip'));

      // Bolinhas: calcula centro real de cada estado via getBBox
      const dotStates = ['BR-AM','BR-PA','BR-MA','BR-PI','BR-CE','BR-GO','BR-MG','BR-SP','BR-PR','BR-RS'];
      const dotsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      dotsGroup.setAttribute('class', 'map-approved-dots');

      requestAnimationFrame(() => {
        // Bolinhas nos estados
        dotStates.forEach(id => {
          const path = svg.querySelector(`#${id}`);
          if (!path) return;
          try {
            const bb = path.getBBox();
            const cx = bb.x + bb.width  / 2;
            const cy = bb.y + bb.height / 2;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', '5');
            circle.setAttribute('class', 'map-dot');
            dotsGroup.appendChild(circle);
          } catch(e) {}
        });
        svg.appendChild(dotsGroup);

        // Posiciona tooltip exatamente sobre Alagoas
        const alPath = svg.querySelector('#BR-AL');
        const tooltip = document.getElementById('mapTooltip');
        if (alPath && tooltip) {
          try {
            const bb = alPath.getBBox();
            const svgRect = svg.getBoundingClientRect();
            const wrapRect = wrap.getBoundingClientRect();
            const vb = svg.viewBox.baseVal;

            const scaleX = svgRect.width  / vb.width;
            const scaleY = svgRect.height / vb.height;

            const cx = (bb.x + bb.width  / 2) * scaleX + (svgRect.left - wrapRect.left);
            const cy = (bb.y + bb.height / 2) * scaleY + (svgRect.top  - wrapRect.top);

            // Plaquinha acima de Alagoas, centralizada horizontalmente
            tooltip.style.position = 'absolute';
            tooltip.style.left = Math.max(4, cx - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top  = (cy - tooltip.offsetHeight - 20) + 'px';
          } catch(e) {}
        }
      });

    })
    .catch(() => {
      const loading = wrap.querySelector('.map-loading');
      if (loading) loading.textContent = 'Erro ao carregar mapa.';
    });
}

// ── SCROLL PROGRESS BAR ───────────────────
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / max) * 100) + '%';
  }, { passive: true });
}

// ── TYPEWRITER ────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['Aprovado.', 'Fardado.', 'Servidor Público Federal.', 'Nota Máxima.'];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci > word.length) { delay = 1600; deleting = true; }
    else if (deleting && ci < 0) { deleting = false; ci = 0; wi = (wi + 1) % words.length; delay = 400; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1200);
}

// ── COUNTDOWN ─────────────────────────────
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const target = new Date('2026-07-19T08:00:00');
  function update() {
    const diff = target - new Date();
    if (diff <= 0) { el.textContent = 'PROVA HOJE!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.textContent = `${d}D ${h}H ${m}M PARA A PROVA`;
    setTimeout(update, 60000);
  }
  update();
}

// ── QUIZ ──────────────────────────────────
function initQuiz() {
  const inner = document.getElementById('quizInner');
  if (!inner) return;
  let score = 0;
  const results = [
    { icon: '🚨', title: 'ATENÇÃO NECESSÁRIA',  desc: 'Sua redação está bem abaixo do que a CEBRASPE exige. Mas a boa notícia: o Método P4G foi criado exatamente para quem está no seu ponto. Com estrutura certa, você evolui em semanas.' },
    { icon: '⚡', title: 'NO CAMINHO CERTO',    desc: 'Você já tem alguma base, mas existem lacunas que podem te custar pontos decisivos. O diagnóstico personalizado da Mentoria Fênix pode ser a diferença.' },
    { icon: '🏆', title: 'BEM PREPARADO!',      desc: 'Você já tem uma boa base. A Mentoria Fênix vai potencializar sua preparação e garantir que você chegue ao dia da prova com a máxima confiança.' },
  ];

  function goTo(step) {
    inner.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    inner.querySelector(`[data-step="${step}"]`)?.classList.add('active');
    const map = { '1':[33,'Pergunta 1 de 3'], '2':[66,'Pergunta 2 de 3'], '3':[100,'Pergunta 3 de 3'], result:[100,'Resultado'] };
    if (map[step]) {
      document.getElementById('quizProgressFill').style.width = map[step][0] + '%';
      document.getElementById('quizStepLabel').textContent = map[step][1];
    }
    if (step === 'result') {
      const r = score <= 1 ? results[0] : score <= 3 ? results[1] : results[2];
      document.getElementById('quizIcon').textContent  = r.icon;
      document.getElementById('quizTitle').textContent = r.title;
      document.getElementById('quizDesc').textContent  = r.desc;
    }
  }

  inner.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      score += parseInt(btn.dataset.score || 0);
      goTo(btn.dataset.next);
    });
  });

  document.getElementById('quizRestart')?.addEventListener('click', () => {
    score = 0;
    goTo('1');
  });
}

// ── CTA COUNTDOWN ─────────────────────────
function initCtaCountdown() {
  const el = document.getElementById('ctaCountdown');
  if (!el) return;
  const target = new Date('2026-07-19T08:00:00');
  function update() {
    const diff = target - new Date();
    if (diff <= 0) { el.textContent = 'HOJE!'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    el.textContent = `${d}D ${h}H`;
    setTimeout(update, 60000);
  }
  update();
}

// ── FAQ ACCORDION ─────────────────────────
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}


// ── MICRO-ANIMAÇÕES ───────────────────────
function initMicroAnimations() {

  // 1. FAQ: highlight suave ao abrir
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      if (item.classList.contains('open')) {
        item.style.transform = 'scale(1.01)';
        setTimeout(() => item.style.transform = '', 200);
      }
    });
  });

  // 2. Section labels: brilho ao entrar na tela
  const labelObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('label-shine');
        labelObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.section-label').forEach(el => labelObs.observe(el));

  // 3. Pain items: entrada em cascata
  const painObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.pain-grid-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-16px)';
        setTimeout(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = '';
        }, i * 80);
      });
      painObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.pain-grid').forEach(el => painObs.observe(el));

  // 4. VS circle: pulso ao entrar
  const vsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vs-pop');
        vsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.versus-vs').forEach(el => vsObs.observe(el));

  // 5. Feature rows: linha dourada desliza ao entrar
  const featObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('feat-active');
        featObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.feat-row').forEach(el => featObs.observe(el));

  // 6. Shimmer contínuo no botão CTA principal
  const ctaMain = document.querySelector('.cta-btn-main');
  if (ctaMain) ctaMain.classList.add('btn-shimmer');

  // 7. Proof numbers entrada com bounce
  const proofObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.expert-stat-num, .big-num, .small-num').forEach((n, i) => {
          setTimeout(() => n.classList.add('num-bounce'), i * 150);
        });
        proofObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.expert-stats, .proof-numbers').forEach(el => proofObs.observe(el));

}

// ── HERO COUNTDOWN ────────────────────────
function initHeroCountdown() {
  const days = document.getElementById('hcdDays');
  const hours = document.getElementById('hcdHours');
  const mins = document.getElementById('hcdMins');
  if (!days) return;
  const target = new Date('2026-07-19T08:00:00');
  function update() {
    const diff = target - new Date();
    if (diff <= 0) { days.textContent = hours.textContent = mins.textContent = '00'; return; }
    days.textContent  = String(Math.floor(diff / 86400000)).padStart(2,'0');
    hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
    mins.textContent  = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
    setTimeout(update, 30000);
  }
  update();
}

// ── PAIN ITEMS TYPEWRITER ─────────────────
function initPainTypewriter() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.pain-grid-item span:last-child').forEach((span, i) => {
        const text = span.textContent;
        span.textContent = '';
        setTimeout(() => {
          let j = 0;
          const tick = setInterval(() => {
            span.textContent += text[j++];
            if (j >= text.length) clearInterval(tick);
          }, 22);
        }, i * 180);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pain-grid').forEach(el => obs.observe(el));
}

// ── TIMELINE DESENHANDO ───────────────────
function initTimelineDraw() {
  const line = document.querySelector('.story-line');
  if (!line) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        line.classList.add('drawing');
        obs.unobserve(line);
      }
    });
  }, { threshold: 0.1 });
  obs.observe(line.closest('.story-narrative') || line.parentElement);
}

// ── FUNDO TRANSICIONANDO POR SEÇÃO ────────
function initSectionBgTransition() {
  const sections = document.querySelectorAll('section');
  const colors = {
    'pain-section':    '7, 13, 26',
    'materials':       '10, 16, 32',
    'story-section':   '4, 6, 10',
    'versus':          '7, 13, 26',
    'testimonials':    '4, 6, 10',
    'plans':           '10, 6, 2',
    'guarantee-section': '4, 10, 6',
    'faq':             '4, 6, 10',
    'cta-final':       '11, 20, 40',
  };
  window.addEventListener('scroll', () => {
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5) {
        const cls = Array.from(sec.classList).find(c => colors[c]);
        if (cls) {
          document.body.style.transition = 'background-color 0.8s ease';
          document.body.style.backgroundColor = `rgb(${colors[cls]})`;
        }
      }
    });
  }, { passive: true });
}

// ── LOADING SCREEN ────────────────────────
function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('loader-out');
      setTimeout(() => loader.remove(), 600);
    }, 1200);
  });
}

// ── PARALLAX HERO ─────────────────────────
function initParallax() {
  const photo = document.querySelector('.hero-expert-photo');
  const bg = document.querySelector('.hero-bg');
  if (!photo) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    photo.style.transform = `translateY(${y * 0.18}px)`;
    if (bg) bg.style.transform = `translateY(${y * 0.06}px)`;
  }, { passive: true });
}

// ── RIPPLE NOS BOTÕES ─────────────────────
function initRipple() {
  const btns = document.querySelectorAll('.plan-btn, .cta-btn-main, .hero-cta, .urgency-btn, .cta-btn--gold');
  btns.forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const r = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.25);border-radius:50%;
        transform:scale(0);animation:rippleAnim 0.6s linear;
        pointer-events:none;
      `;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

// ── TEXTO DIGITANDO NOS TÍTULOS ───────────
function initTypeTitle() {
  const titles = document.querySelectorAll('.section-title');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      const el = e.target;
      // Só anima o nó de texto direto (não os spans de cor)
      el.childNodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
        const text = node.textContent;
        const span = document.createElement('span');
        span.className = 'type-target';
        span.textContent = '';
        node.replaceWith(span);
        let i = 0;
        const tick = setInterval(() => {
          span.textContent += text[i++];
          if (i >= text.length) clearInterval(tick);
        }, 28);
      });
    });
  }, { threshold: 0.5 });
  titles.forEach(t => observer.observe(t));
}

// ── TILT 3D NOS VÍDEOS ────────────────────
function initVideoTilt() {
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s';
      card.style.transform = '';
    });
  });
}

// ── NÚMEROS DO HERO ───────────────────────
function initHeroNumbers() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  setTimeout(() => {
    stats.forEach(el => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1400;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = prefix + Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }, 900);
}

// ── INIT ALL ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
  initStagger();
  initCounters();
  initMagneticBtns();
  initSpotlight();
  initVideoExclusive();
  initTilt();
  initSmoothScroll();
  initScrollProgress();
  initTypewriter();
  initCountdown();
  initCtaCountdown();
  initQuiz();
  initFaq();
  initMap();
  initLoader();
  initParallax();
  initRipple();
  initTypeTitle();
  initVideoTilt();
  initHeroNumbers();
  initMicroAnimations();
  initHeroCountdown();
  initPainTypewriter();
  initTimelineDraw();
  initSectionBgTransition();
});
