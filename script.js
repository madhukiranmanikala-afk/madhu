/**
 * Portfolio Interactive Scripts
 * Madhu Kiran Manikala - Certified Pega System Architect & Software Engineer
 */

/* ==========================================================================
   0. SITE CONFIG
   --------------------------------------------------------------------------
   Add your profile URLs below. Any entry left as an empty string is skipped
   automatically, so no broken links ever render on the page.
   ========================================================================== */
const SITE_CONFIG = {
  email: 'Madhukiranmanikala@gmail.com',
  phone: '+919505807632',
  social: {
    linkedin: '',
    github: '',
    twitter: '',
    medium: ''
  }
};

const SOCIAL_ICONS = {
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  twitter: '<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>',
  medium: '<circle cx="7" cy="7" r="7"/><ellipse cx="17.5" cy="7" rx="5.5" ry="7"/><ellipse cx="27.5" cy="7" rx="2.5" ry="7"/>'
};

const SOCIAL_LABELS = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  twitter: 'X (Twitter)',
  medium: 'Medium'
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCanvasParticles();
  initTypewriter();
  initMobileNav();
  initSkillFilters();
  initSocialLinks();
  initContactForm();
  initClipboardButtons();
  initResumeModal();
  initHeroTilt();
  initActiveNavSpy();
  updateCurrentYear();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference, otherwise default to light
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CANVAS PARTICLES
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationFrameId = null;
  let isRunning = false;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function resize() {
    // Account for devicePixelRatio so lines stay crisp on high-DPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function getParticleColor(alpha = 0.5) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    return isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(79, 70, 229, ${alpha})`;
  }

  function getLineColor(dist, maxDist) {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const alpha = (1 - dist / maxDist) * (isDark ? 0.15 : 0.08);
    return isDark ? `rgba(6, 182, 212, ${alpha})` : `rgba(14, 165, 233, ${alpha})`;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getParticleColor(0.4);
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse collision interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const fx = (dx / dist) * force * 1.5;
          const fy = (dy / dist) * force * 1.5;
          this.x -= fx;
          this.y -= fy;
        }
      }

      this.draw();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 75);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    const maxDistance = 110;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = getLineColor(dist, maxDistance);
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function paint() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    connect();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
    animationFrameId = requestAnimationFrame(animate);
  }

  function start() {
    if (isRunning || prefersReducedMotion) return;
    isRunning = true;
    animate();
  }

  function stop() {
    isRunning = false;
    cancelAnimationFrame(animationFrameId);
  }

  window.addEventListener('resize', () => {
    resize();
    if (prefersReducedMotion) paint();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Stop burning CPU/Cycles while the tab is in the background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  resize();

  if (prefersReducedMotion) {
    paint();
  } else {
    start();
  }
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const roles = [
    'Certified Pega System Architect (CSA)',
    'Enterprise Workflow Specialist',
    'Java & Backend Developer',
    'Cyber Security & Linux Trained'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const delayBetweenWords = 1800;

  if (prefersReducedMotion) {
    target.textContent = roles[0];
    return;
  }

  function type() {
    const currentWord = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentWord.length) {
      speed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   4. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
  }

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    mobileNav.classList.toggle('open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   5. SKILLS FILTERING
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const isMatch = filterValue === 'all' || category === filterValue;

        if (isMatch) {
          card.classList.remove('is-hidden');
          card.setAttribute('aria-hidden', 'false');
        } else {
          card.classList.add('is-hidden');
          card.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });
}

/* ==========================================================================
   5b. SOCIAL LINKS (driven by SITE_CONFIG)
   ========================================================================== */
function initSocialLinks() {
  const containers = document.querySelectorAll('[data-social]');
  if (!containers.length) return;

  const entries = Object.entries(SITE_CONFIG.social)
    .filter(([, url]) => typeof url === 'string' && url.trim() !== '');

  containers.forEach(container => {
    entries.forEach(([network, url]) => {
      const icon = SOCIAL_ICONS[network];
      if (!icon) return;

      const link = document.createElement('a');
      link.className = 'social-btn';
      link.href = url.trim();
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = SOCIAL_LABELS[network] || network;
      link.setAttribute('aria-label', `${SOCIAL_LABELS[network] || network} profile (opens in new tab)`);
      link.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon}</svg>`;

      container.appendChild(link);
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Portfolio Inquiry';
    const message = form.message.value.trim();

    // Basic Validation
    if (!name || !email || !message) {
      showFeedback('Please fill out all required fields marked with *.', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    // Prepare mailto link as direct communication conduit
    const recipient = SITE_CONFIG.email;
    const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    // Success State & Trigger mail client
    showFeedback('Opening your email client to dispatch message to Madhu Kiran...', 'success');
    submitBtn.disabled = true;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      form.reset();
      submitBtn.disabled = false;
    }, 1000);
  });

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = `form-feedback ${type}`;
  }
}

/* ==========================================================================
   7. CLIPBOARD COPY WITH TOAST
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  let toastTimeout;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });
}

/* ==========================================================================
   8. RESUME MODAL & PRINT HANDLER
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const mobileOpenBtn = document.getElementById('mobile-resume-btn');
  const ctaOpenBtn = document.getElementById('cta-view-resume');
  const closeBtn = document.getElementById('close-resume-btn');
  const printBtn = document.getElementById('print-resume-btn');

  if (!modal) return;

  let lastFocusedElement = null;

  const focusableSelector = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // The dialog is still computed as visibility:hidden until the browser
    // applies the .open class, so force a reflow before moving focus into it.
    void modal.offsetWidth;
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
    setTimeout(() => {
      modal.hidden = true;
    }, 300);
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (mobileOpenBtn) mobileOpenBtn.addEventListener('click', openModal);
  if (ctaOpenBtn) ctaOpenBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key + keep Tab focus inside the dialog
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = Array.from(modal.querySelectorAll(focusableSelector))
        .filter(el => el.offsetParent !== null);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const focusIsInside = modal.contains(document.activeElement);

      if (!focusIsInside) {
        // Focus was outside the dialog (e.g. browser chrome) - pull it back in
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ==========================================================================
   9. 3D TILT EFFECT ON HERO CARD
   ========================================================================== */
function initHeroTilt() {
  const card = document.getElementById('hero-card');
  if (!card) return;

  const hologram = card.querySelector('.hologram-card');
  if (!hologram) return;

  // Pointer tilt is meaningless for touch users and for reduced-motion users
  if (prefersReducedMotion || !window.matchMedia('(hover: hover)').matches) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    hologram.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    hologram.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   10. ACTIVE NAVIGATION SCROLL SPY
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function update() {
    ticking = false;
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* ==========================================================================
   11. DYNAMIC FOOTER YEAR
   ========================================================================== */
function updateCurrentYear() {
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}
