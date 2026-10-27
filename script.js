/**
 * ==========================================================================
 * PORTFÓLIO DE RAFAEL VLADEMIR PASCHOETTO
 * Funcionalidades interativas em JavaScript Puro
 * - Navegação & Menu Mobile com rolagem suave considerando altura do menu fixo
 * - Botão "Voltar ao topo" com animação fluida
 * - Alternância de Tema (Dark / Light) com persistência no localStorage
 * - Animação de revelação de elementos ao rolar a página (Scroll Reveal)
 * - Efeito de paralaxe de luz suave no mouse (Hero Section)
 * - Cards de Projetos com profundidade 3D interativa no mouse
 * - Playground de Bolhas Interativas com animação de estouro realista e partículas
 * - Respeito a prefers-reduced-motion em todas as animações
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Atualizar ano no rodapé dinamicamente
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Controle de Tema Claro / Escuro
  initThemeToggle();

  // 3. Menu Mobile, Rolagem Suave na Navegação & Voltar ao Topo
  initNavigation();

  // 4. Scroll Reveal das Seções
  initScrollReveal();

  // 5. Interação de Movimento do Mouse no Topo (Hero)
  initHeroMouseEffect();

  // 6. Efeito nos Cards da Seção "Sobre mim"
  initAboutCardsHover();

  // 7. Efeito 3D e Profundidade nos Cards de Projetos (preservado)
  initProjectCardsHover3D();

  // 8. Área de Bolhas Interativas com Estouro e Efeitos Visuais (preservado)
  initInteractiveBubbles();
});

/**
 * --------------------------------------------------------------------------
 * Controle de Tema (Dark / Light Mode) com Transição Animada e Ícone Giratório
 * --------------------------------------------------------------------------
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Ativar transição global de cores suave
      htmlRoot.classList.add('theme-transitioning');
      themeToggleBtn.classList.add('theme-animating');

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);

      setTimeout(() => {
        htmlRoot.classList.remove('theme-transitioning');
        themeToggleBtn.classList.remove('theme-animating');
      }, 500);
    });
  }
}

/**
 * --------------------------------------------------------------------------
 * Navegação, Menu Mobile, Rolagem Suave com Animação Fluida & Voltar ao Topo
 * Usa animação contínua (requestAnimationFrame) com curva cúbica para garantir
 * rolagem perceptível em qualquer navegador ou configuração de sistema.
 * --------------------------------------------------------------------------
 */
function smoothScrollTo(targetY, duration = 650) {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  let startTime = null;

  // Curva de aceleração e desaceleração elegante (easeInOutCubic)
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animationStep(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + (distance * ease));

    if (progress < 1) {
      requestAnimationFrame(animationStep);
    }
  }

  requestAnimationFrame(animationStep);
}

function initNavigation() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');

  // Adicionar classe 'scrolled' quando rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Toggle do menu hambúrguer para mobile
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Rolagem suave animada para todos os links internos (#hero, #sobre, #projetos, #contato)
  internalAnchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Calcular posição de destino com offset do cabeçalho fixo
        let targetPosition = 0;
        if (targetId !== '#hero') {
          const headerHeight = header ? header.offsetHeight : 70;
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          targetPosition = Math.max(0, rect.top + scrollTop - headerHeight - 16);
        }

        // Executar deslizamento contínuo e suave
        smoothScrollTo(targetPosition, 650);

        // Fechar menu mobile caso esteja aberto
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (menuToggle) {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Scroll Reveal: Revelação suave de blocos ao rolar a página
 * --------------------------------------------------------------------------
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/**
 * --------------------------------------------------------------------------
 * Efeito visual sutil no topo respondendo ao mouse (Hero)
 * --------------------------------------------------------------------------
 */
function initHeroMouseEffect() {
  const heroSection = document.getElementById('hero');
  const orbPrimary = document.querySelector('.orb-primary');
  const orbSecondary = document.querySelector('.orb-secondary');

  if (!heroSection || !orbPrimary || !orbSecondary) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);

    const xRatio = x / rect.width;
    const yRatio = y / rect.height;

    orbPrimary.style.transform = `translate(${xRatio * 35}px, ${yRatio * 35}px)`;
    orbSecondary.style.transform = `translate(${-xRatio * 45}px, ${-yRatio * 45}px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    orbPrimary.style.transform = 'translate(0, 0)';
    orbSecondary.style.transform = 'translate(0, 0)';
  });
}

/**
 * --------------------------------------------------------------------------
 * Efeito visual nos Cards da Seção "Sobre mim"
 * Elevação suave, profundidade e inclinação discreta ao passar o mouse
 * --------------------------------------------------------------------------
 */
function initAboutCardsHover() {
  const aboutCards = document.querySelectorAll('.about-text-card, .about-characteristics-card');

  aboutCards.forEach(card => {
    let isHovering = false;

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Inclinação muito sutil (máximo 3.5 graus) para manter elegância discreta
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(800px) translateY(-7px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.012, 1.012, 1.012)`;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), border-color 0.35s ease';
      card.style.transform = 'perspective(800px) translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Efeito 3D sutil e sofisticado nos Cards de Projetos
 * Inclinação que acompanha o mouse e retorno fluido ao sair
 * --------------------------------------------------------------------------
 */
function initProjectCardsHover3D() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    let isHovering = false;

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      card.style.transition = 'transform 0.12s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (!isHovering) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Inclinação suave em graus (máximo 7.5 graus) e elevação perceptível
      const rotateX = ((y - centerY) / centerY) * -7.5;
      const rotateY = ((x - centerX) / centerX) * 7.5;

      card.style.transform = `perspective(1000px) translateY(-10px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.5s cubic-bezier(0.2, 0.9, 0.3, 1), border-color 0.4s ease';
      card.style.transform = 'perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * Área de Bolhas Interativas com Estouro Visual Satisfatório
 * Animação de deformação, anel de expansão circular e partículas espalhadas
 * --------------------------------------------------------------------------
 */
function initInteractiveBubbles() {
  const container = document.getElementById('bubbles-container');
  const resetBtn = document.getElementById('reset-bubbles-btn');

  if (!container) return;

  const bubbleLabels = [
    'Python', 'HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js',
    'SQL', 'Redes', 'Hardware', 'Windows', 'Git', 'Proatividade'
  ];

  const colors = [
    { bg: 'rgba(199, 255, 74, 0.85)', text: '#101114', accent: '#C7FF4A' },   // Verde-lima
    { bg: 'rgba(167, 139, 250, 0.85)', text: '#101114', accent: '#A78BFA' },  // Violeta
    { bg: 'rgba(243, 243, 239, 0.85)', text: '#101114', accent: '#F3F3EF' }   // Branco suave
  ];

  function createBubbles() {
    container.innerHTML = '';
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const count = window.innerWidth < 600 ? 7 : 12;

    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('div');
      bubble.classList.add('interactive-bubble');

      const label = bubbleLabels[i % bubbleLabels.length];
      const colorScheme = colors[i % colors.length];

      bubble.textContent = label;
      bubble.style.backgroundColor = colorScheme.bg;
      bubble.style.color = colorScheme.text;

      // Dimensões dinâmicas
      const size = Math.floor(Math.random() * 25) + 65; // entre 65px e 90px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Posicionamento aleatório inicial dentro dos limites do container
      const maxX = Math.max(0, containerWidth - size);
      const maxY = Math.max(0, containerHeight - size);
      const posX = Math.floor(Math.random() * maxX);
      const posY = Math.floor(Math.random() * maxY);

      bubble.style.left = `${posX}px`;
      bubble.style.top = `${posY}px`;

      // Velocidade para flutuação sutil
      let vx = (Math.random() - 0.5) * 0.8;
      let vy = (Math.random() - 0.5) * 0.8;
      let currentX = posX;
      let currentY = posY;
      let isAlive = true;

      // Ação de estourar a bolha com clique ou touch
      const popBubble = (e) => {
        if (!isAlive || bubble.classList.contains('popping')) return;
        isAlive = false;
        bubble.classList.add('popping');

        const bubbleRect = bubble.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Ponto central da bolha relativo ao container
        const centerX = (bubbleRect.left + bubbleRect.width / 2) - containerRect.left;
        const centerY = (bubbleRect.top + bubbleRect.height / 2) - containerRect.top;

        // 1. Criar efeito de anel de expansão circular (onda de choque)
        const ripple = document.createElement('div');
        ripple.classList.add('bubble-ripple');
        ripple.style.left = `${centerX}px`;
        ripple.style.top = `${centerY}px`;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.color = colorScheme.accent;
        container.appendChild(ripple);

        // 2. Criar partículas de estouro
        const particleCount = 10;
        for (let p = 0; p < particleCount; p++) {
          const particle = document.createElement('div');
          particle.classList.add('bubble-particle');
          const pSize = Math.floor(Math.random() * 4) + 4; // 4px a 7px
          particle.style.width = `${pSize}px`;
          particle.style.height = `${pSize}px`;
          particle.style.backgroundColor = colorScheme.accent;
          particle.style.left = `${centerX}px`;
          particle.style.top = `${centerY}px`;

          // Ângulo e distância aleatórios
          const angle = (p / particleCount) * (2 * Math.PI) + (Math.random() * 0.4 - 0.2);
          const distance = Math.floor(Math.random() * 30) + 35; // 35px a 65px
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;

          particle.style.setProperty('--dx', `${dx.toFixed(1)}px`);
          particle.style.setProperty('--dy', `${dy.toFixed(1)}px`);

          container.appendChild(particle);

          // Remover partícula após animação
          setTimeout(() => {
            if (particle.parentElement) particle.remove();
          }, 450);
        }

        // Remover o ripple após término da animação
        setTimeout(() => {
          if (ripple.parentElement) ripple.remove();
        }, 400);

        // Remover elemento da bolha após a animação de pop
        setTimeout(() => {
          if (bubble.parentElement) bubble.remove();
        }, 320);
      };

      bubble.addEventListener('click', popBubble);
      bubble.addEventListener('touchstart', (e) => {
        popBubble(e);
      }, { passive: true });

      // Animação contínua e suave de flutuação
      function animateFloat() {
        if (!isAlive || !bubble.parentElement) return;

        currentX += vx;
        currentY += vy;

        const boundsWidth = container.clientWidth - size;
        const boundsHeight = container.clientHeight - size;

        if (currentX <= 0 || currentX >= boundsWidth) {
          vx *= -1;
          currentX = Math.max(0, Math.min(boundsWidth, currentX));
        }
        if (currentY <= 0 || currentY >= boundsHeight) {
          vy *= -1;
          currentY = Math.max(0, Math.min(boundsHeight, currentY));
        }

        bubble.style.left = `${currentX}px`;
        bubble.style.top = `${currentY}px`;

        requestAnimationFrame(animateFloat);
      }

      requestAnimationFrame(animateFloat);

      container.appendChild(bubble);
    }
  }

  createBubbles();

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      createBubbles();
    });
  }

  // Recalcular bolhas em redimensionamento de janela (com debounce)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (container.children.length === 0) {
        createBubbles();
      }
    }, 250);
  });
}
