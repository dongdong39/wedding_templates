/* ============================================
   Romantic Flower - Mobile Wedding Invitation
   script.js
   ============================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function padZero(n) {
    return String(n).padStart(2, '0');
  }

  /* ── Image Auto-Detection ── */
  // Discovered images stored here for use across functions
  let galleryImages = [];

  function loadImagesFromFolder(folder, maxAttempts = 50) {
    return new Promise(resolve => {
      const images = [];
      let current = 1;

      function tryNext() {
        if (current > maxAttempts) {
          resolve(images);
          return;
        }
        const img = new Image();
        const path = `images/${folder}/${current}.jpg`;
        img.onload = function() {
          images.push(path);
          current++;
          tryNext();
        };
        img.onerror = function() {
          resolve(images);
        };
        img.src = path;
      }

      tryNext();
    });
  }

  /* ── Meta Tags ── */
  function initMeta() {
    document.title = CONFIG.meta.title;
    const t = $('#og-title');
    const d = $('#og-description');
    const i = $('#og-image');
    if (t) t.setAttribute('content', CONFIG.meta.title);
    if (d) d.setAttribute('content', CONFIG.meta.description);
    if (i) i.setAttribute('content', 'images/og/1.jpg');
    const pt = $('#page-title');
    if (pt) pt.textContent = CONFIG.meta.title;
  }

  /* ── Curtain ── */
  function initCurtain() {
    const curtain = $('#curtain');

    // If useCurtain is false, skip the curtain entirely
    if (CONFIG.useCurtain === false) {
      if (curtain) {
        curtain.style.display = 'none';
      }
      // Start petals immediately since there's no curtain to open
      initPetals();
      return;
    }

    // Default behaviour (useCurtain is true or undefined for backwards compat)
    const names = $('#curtain-names');
    const btn = $('#curtain-open');
    if (names) {
      names.textContent =
        CONFIG.groom.fullName + ' & ' + CONFIG.bride.fullName;
    }
    if (btn) {
      btn.addEventListener('click', () => {
        curtain.classList.add('is-open');
        document.body.style.overflow = '';
        setTimeout(() => curtain.classList.add('is-hidden'), 1400);
        initPetals();
      });
    }
    document.body.style.overflow = 'hidden';
  }

  /* ── Hero ── */
  function initHero() {
    const img = $('#hero-img');
    if (img) img.src = 'images/hero/1.jpg';

    const names = $('#hero-names');
    if (names) {
      names.innerHTML =
        CONFIG.groom.fullName +
        ' <span class="ampersand">&amp;</span> ' +
        CONFIG.bride.fullName;
    }

    const w = CONFIG.wedding;
    const [y, m, d] = w.date.split('-');
    const [hh, mm] = w.time.split(':');
    const ampm = +hh < 12 ? '오전' : '오후';
    const h12 = +hh % 12 || 12;

    const dateEl = $('#hero-date');
    if (dateEl) {
      dateEl.textContent = `${y}년 ${+m}월 ${+d}일 ${w.dayOfWeek} ${ampm} ${h12}시${+mm ? ' ' + +mm + '분' : ''}`;
    }

    const venue = $('#hero-venue');
    if (venue) venue.textContent = w.venue;
  }

  /* ── Countdown ── */
  function initCountdown() {
    const w = CONFIG.wedding;
    const [y, m, d] = w.date.split('-');
    const [hh, mm] = w.time.split(':');
    const target = new Date(+y, +m - 1, +d, +hh, +mm, 0).getTime();

    function update() {
      const now = Date.now();
      let diff = target - now;
      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const dEl = $('#cd-days');
      const hEl = $('#cd-hours');
      const mEl = $('#cd-minutes');
      const sEl = $('#cd-seconds');
      if (dEl) dEl.textContent = days;
      if (hEl) hEl.textContent = padZero(hours);
      if (mEl) mEl.textContent = padZero(minutes);
      if (sEl) sEl.textContent = padZero(seconds);
    }

    update();
    setInterval(update, 1000);
  }

  /* ── Greeting ── */
  function initGreeting() {
    const title = $('#greeting-title');
    const text = $('#greeting-text');
    const parents = $('#greeting-parents');

    if (title) title.textContent = CONFIG.greeting.title;
    if (text) text.textContent = CONFIG.greeting.content;

    if (parents) {
      const g = CONFIG.groom;
      const b = CONFIG.bride;

      const makeName = (cfg, isDeceased) => {
        return isDeceased
          ? `<span class="deceased">${cfg}</span>`
          : cfg;
      };

      parents.innerHTML = `
        <span class="parent-line">
          ${makeName(g.father, g.fatherDeceased)} &middot; ${makeName(g.mother, g.motherDeceased)}
          <em>의 ${g.lastName === g.father?.charAt(0) ? '아들' : '아들'}</em> <strong>${g.name}</strong>
        </span>
        <span class="parent-dot">&amp;</span>
        <span class="parent-line">
          ${makeName(b.father, b.fatherDeceased)} &middot; ${makeName(b.mother, b.motherDeceased)}
          <em>의 딸</em> <strong>${b.name}</strong>
        </span>
      `;
    }
  }

  /* ── Calendar ── */
  function initCalendar() {
    const el = $('#calendar');
    if (!el) return;

    const [y, m, d] = CONFIG.wedding.date.split('-').map(Number);
    const first = new Date(y, m - 1, 1);
    const lastDay = new Date(y, m, 0).getDate();
    const startDow = first.getDay();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    let html = `<div class="calendar__header">${monthNames[m - 1]} ${y}</div>`;
    html += '<div class="calendar__weekdays">';
    ['일', '월', '화', '수', '목', '금', '토'].forEach((wd) => {
      html += `<span class="calendar__weekday">${wd}</span>`;
    });
    html += '</div><div class="calendar__days">';

    for (let i = 0; i < startDow; i++) {
      html += '<span class="calendar__day is-empty"></span>';
    }
    for (let day = 1; day <= lastDay; day++) {
      const cls = day === d ? ' is-today' : '';
      html += `<span class="calendar__day${cls}">${day}</span>`;
    }
    html += '</div>';
    el.innerHTML = html;

    // Google Calendar
    const gBtn = $('#btn-google-cal');
    if (gBtn) {
      gBtn.addEventListener('click', () => {
        const w = CONFIG.wedding;
        const [yy, mm2, dd] = w.date.split('-');
        const [th, tm] = w.time.split(':');
        const start = `${yy}${mm2}${dd}T${th}${tm}00`;
        const endH = padZero(+th + 2);
        const end = `${yy}${mm2}${dd}T${endH}${tm}00`;
        const url =
          `https://calendar.google.com/calendar/render?action=TEMPLATE` +
          `&text=${encodeURIComponent(CONFIG.meta.title)}` +
          `&dates=${start}/${end}` +
          `&location=${encodeURIComponent(w.venue + ' ' + w.address)}` +
          `&details=${encodeURIComponent(CONFIG.meta.description)}`;
        window.open(url, '_blank');
      });
    }

    // Apple Calendar (.ics)
    const iBtn = $('#btn-ics-cal');
    if (iBtn) {
      iBtn.addEventListener('click', () => {
        const w = CONFIG.wedding;
        const [yy, mm2, dd] = w.date.split('-');
        const [th, tm] = w.time.split(':');
        const start = `${yy}${mm2}${dd}T${th}${tm}00`;
        const endH = padZero(+th + 2);
        const end = `${yy}${mm2}${dd}T${endH}${tm}00`;
        const ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//WeddingInvitation//EN',
          'BEGIN:VEVENT',
          `DTSTART:${start}`,
          `DTEND:${end}`,
          `SUMMARY:${CONFIG.meta.title}`,
          `LOCATION:${w.venue} ${w.address}`,
          `DESCRIPTION:${CONFIG.meta.description}`,
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\r\n');

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wedding.ics';
        link.click();
        URL.revokeObjectURL(link.href);
      });
    }
  }

  /* ── Story (async — waits for image discovery) ── */
  async function initStory() {
    const title = $('#story-title');
    const text = $('#story-text');
    const container = $('#story-images');

    if (title) title.textContent = CONFIG.story.title;
    if (text) text.textContent = CONFIG.story.content;

    if (!container) return;

    // Show loading placeholder
    container.innerHTML = '<div class="section-loading"><span class="section-loading__dot"></span><span class="section-loading__dot"></span><span class="section-loading__dot"></span></div>';

    const storyImages = await loadImagesFromFolder('story');

    if (storyImages.length > 0) {
      container.innerHTML = storyImages
        .map(
          (src) => `
        <div class="story__img-card anim-scale-target">
          <img src="${src}" alt="우리의 이야기" loading="lazy" />
        </div>
      `
        )
        .join('');
      // Re-observe new elements for scroll animations
      observeNewElements(container);
    } else {
      container.innerHTML = '';
    }
  }

  /* ── Gallery (async — waits for image discovery) ── */
  async function initGallery() {
    const grid = $('#gallery-grid');
    const section = $('#gallery');
    if (!grid) return;

    // Show loading placeholder
    grid.innerHTML = '<div class="section-loading"><span class="section-loading__dot"></span><span class="section-loading__dot"></span><span class="section-loading__dot"></span></div>';

    galleryImages = await loadImagesFromFolder('gallery');

    if (galleryImages.length === 0) {
      // Hide entire gallery section if no images found
      if (section) section.style.display = 'none';
      return;
    }

    grid.innerHTML = galleryImages
      .map(
        (src, i) => `
      <div class="gallery__item" data-index="${i}">
        <img src="${src}" alt="갤러리 사진 ${i + 1}" loading="lazy" />
      </div>
    `
      )
      .join('');

    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery__item');
      if (item) {
        openViewer(+item.dataset.index);
      }
    });

    // Re-observe new elements for scroll animations
    observeNewElements(grid);
  }

  /* ── Photo Viewer ── */
  let viewerIdx = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  function openViewer(index) {
    viewerIdx = index;
    const viewer = $('#viewer');
    const track = $('#viewer-track');
    if (!viewer || !track || galleryImages.length === 0) return;

    track.innerHTML = galleryImages
      .map(
        (src) => `
      <div class="viewer__slide">
        <img src="${src}" alt="" loading="lazy" />
      </div>
    `
      )
      .join('');

    viewer.classList.add('is-active');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    goToSlide(viewerIdx, false);
  }

  function closeViewer() {
    const viewer = $('#viewer');
    if (!viewer) return;
    viewer.classList.remove('is-active');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function goToSlide(idx, animate = true) {
    const track = $('#viewer-track');
    const counter = $('#viewer-counter');
    const total = galleryImages.length;
    if (total === 0) return;
    if (idx < 0) idx = 0;
    if (idx >= total) idx = total - 1;
    viewerIdx = idx;

    if (track) {
      track.style.transition = animate ? 'transform 0.3s ease' : 'none';
      track.style.transform = `translateX(-${idx * 100}%)`;
    }
    if (counter) {
      counter.textContent = `${idx + 1} / ${total}`;
    }
  }

  function initViewer() {
    const viewer = $('#viewer');
    if (!viewer) return;

    $('#viewer-close')?.addEventListener('click', closeViewer);
    viewer.querySelector('.viewer__backdrop')?.addEventListener('click', closeViewer);
    $('#viewer-prev')?.addEventListener('click', () => goToSlide(viewerIdx - 1));
    $('#viewer-next')?.addEventListener('click', () => goToSlide(viewerIdx + 1));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!viewer.classList.contains('is-active')) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowLeft') goToSlide(viewerIdx - 1);
      if (e.key === 'ArrowRight') goToSlide(viewerIdx + 1);
    });

    // Touch/Swipe
    const track = $('#viewer-track');
    if (!track) return;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      isSwiping = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      touchDeltaX = e.touches[0].clientX - touchStartX;
      const offset = -(viewerIdx * window.innerWidth) + touchDeltaX;
      track.style.transform = `translateX(${offset}px)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const threshold = window.innerWidth * 0.2;
      if (touchDeltaX < -threshold) {
        goToSlide(viewerIdx + 1);
      } else if (touchDeltaX > threshold) {
        goToSlide(viewerIdx - 1);
      } else {
        goToSlide(viewerIdx);
      }
    });
  }

  /* ── Location ── */
  function initLocation() {
    const w = CONFIG.wedding;
    const venue = $('#loc-venue');
    const hall = $('#loc-hall');
    const addr = $('#loc-address');
    const tel = $('#loc-tel');
    const mapImg = $('#loc-map-img');

    if (venue) venue.textContent = w.venue;
    if (hall) hall.textContent = w.hall;
    if (addr) addr.textContent = w.address;
    if (tel) tel.textContent = `Tel. ${w.tel}`;
    if (mapImg) mapImg.src = 'images/location/1.jpg';

    const kakao = $('#btn-kakao-map');
    const naver = $('#btn-naver-map');
    if (kakao) kakao.href = w.mapLinks.kakao;
    if (naver) naver.href = w.mapLinks.naver;

    const copyBtn = $('#btn-copy-address');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyToClipboard(w.address, '주소가 복사되었습니다');
      });
    }
  }

  /* ── Account ── */
  function initAccount() {
    const groomBody = $('#acc-groom-body');
    const brideBody = $('#acc-bride-body');

    if (groomBody) {
      groomBody.innerHTML = renderAccounts(CONFIG.accounts.groom);
    }
    if (brideBody) {
      brideBody.innerHTML = renderAccounts(CONFIG.accounts.bride);
    }

    // Accordion toggle
    $$('.accordion__toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const acc = btn.closest('.accordion');
        acc.classList.toggle('is-open');
      });
    });

    // Copy account
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('.account-item__copy');
      if (copyBtn) {
        const account = copyBtn.dataset.account;
        copyToClipboard(account, '계좌번호가 복사되었습니다');
      }
    });
  }

  function renderAccounts(accounts) {
    return accounts
      .map(
        (acc) => `
      <div class="account-item">
        <div class="account-item__info">
          <p class="account-item__role">${acc.role}</p>
          <p class="account-item__detail">
            <span class="account-item__name">${acc.name}</span>
            ${acc.bank} ${acc.number}
          </p>
        </div>
        <button class="account-item__copy" data-account="${acc.bank} ${acc.number} ${acc.name}">복사</button>
      </div>
    `
      )
      .join('');
  }

  /* ── Toast ── */
  let toastTimer = null;
  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  /* ── Clipboard ── */
  function copyToClipboard(text, toastMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(toastMsg);
      }).catch(() => {
        fallbackCopy(text, toastMsg);
      });
    } else {
      fallbackCopy(text, toastMsg);
    }
  }

  function fallbackCopy(text, toastMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(toastMsg);
    } catch (e) {
      showToast('복사에 실패했습니다');
    }
    document.body.removeChild(ta);
  }

  /* ── Scroll Animations (IntersectionObserver) ── */
  let scrollObserver = null;

  function initScrollAnimations() {
    const targets = $$('.anim-target, .gallery__item, .story__img-card');
    if (!targets.length) return;

    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => scrollObserver.observe(el));
  }

  // Re-observe dynamically added elements after async image loading
  function observeNewElements(container) {
    if (!scrollObserver) return;
    const targets = $$('.gallery__item, .story__img-card', container);
    targets.forEach((el) => scrollObserver.observe(el));
  }

  /* ── Falling Petals ── */
  function initPetals() {
    const canvas = $('#petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const petals = [];
    const PETAL_COUNT = 25;

    const petalColors = [
      'rgba(183, 110, 121, 0.5)',
      'rgba(212, 160, 168, 0.45)',
      'rgba(245, 190, 195, 0.4)',
      'rgba(240, 180, 170, 0.35)',
      'rgba(200, 140, 150, 0.4)',
    ];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createPetal() {
      return {
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.3,
        size: 6 + Math.random() * 10,
        speedY: 0.4 + Math.random() * 0.8,
        speedX: -0.3 + Math.random() * 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.3 + Math.random() * 0.4,
      };
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Petal shape
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.3, -s * 0.4, s * 0.8, -s * 0.3, s * 0.5, 0);
      ctx.bezierCurveTo(s * 0.8, s * 0.3, s * 0.3, s * 0.4, 0, 0);
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      petals.forEach((p) => {
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.y > H + 20) {
          p.y = -20;
          p.x = Math.random() * W;
        }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;

        drawPetal(p);
      });
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(createPetal());
    }
    animate();
  }

  /* ── Init ── */
  async function init() {
    // Synchronous inits (no image dependency)
    initMeta();
    initCurtain();
    initHero();
    initCountdown();
    initGreeting();
    initCalendar();
    initViewer();
    initLocation();
    initAccount();

    // Delay scroll animations so they don't fire during curtain
    setTimeout(initScrollAnimations, 200);

    // Async inits (discover images, then render)
    await Promise.all([
      initStory(),
      initGallery(),
    ]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
