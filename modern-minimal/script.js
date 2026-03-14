/**
 * Modern Minimal Wedding Invitation - Script
 */

(function () {
  'use strict';

  // ── Helpers ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()];
    return { year, month, day, dayName, date: d };
  }

  function formatTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const period = h < 12 ? '오전' : '오후';
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${period} ${hour12}시${m > 0 ? ' ' + m + '분' : ''}`;
  }

  // ── Image Loading ──
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

  // ── Toast ──
  let toastTimer = null;
  function showToast(message) {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    clearTimeout(toastTimer);
    toast.classList.remove('show');
    requestAnimationFrame(() => {
      toast.classList.add('show');
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    });
  }

  // ── Copy to clipboard ──
  async function copyToClipboard(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg || '복사되었습니다');
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg || '복사되었습니다');
    }
  }

  // ── Curtain / Intro Overlay ──
  function initCurtain(c, dateInfo, timeText) {
    const overlay = $('#curtain-overlay');
    if (!overlay) return;

    if (!c.useCurtain) {
      // 커튼 사용하지 않음 - 즉시 제거
      overlay.remove();
      return;
    }

    // 커튼 표시
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 커튼 내용 채우기
    const names = $('.curtain-names', overlay);
    const date = $('.curtain-date', overlay);
    if (names) names.textContent = `${c.groom.nameEn} & ${c.bride.nameEn}`;
    if (date) date.textContent = `${dateInfo.year}. ${String(dateInfo.month).padStart(2, '0')}. ${String(dateInfo.day).padStart(2, '0')}`;

    // 열기 버튼
    const btn = $('#curtain-open-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        document.body.style.overflow = '';
        overlay.addEventListener('transitionend', () => {
          overlay.remove();
        }, { once: true });
      });
    }
  }

  // ── Build Page ──
  async function init() {
    if (typeof CONFIG === 'undefined') return;

    const c = CONFIG;
    const dateInfo = formatDate(c.wedding.date);
    const timeText = formatTime(c.wedding.time);

    // Handle curtain overlay
    initCurtain(c, dateInfo, timeText);

    // Build non-image sections immediately
    buildHero(c, dateInfo, timeText);
    buildInvitation(c, dateInfo, timeText);
    buildCountdown(c, dateInfo);
    buildStoryText(c);
    buildLocation(c);
    buildAccount(c);
    initScrollAnimations();
    initModal();

    // Show loading state for image-dependent sections
    showLoadingState();

    // Load images asynchronously
    const [storyImages, galleryImages] = await Promise.all([
      loadImagesFromFolder('story'),
      loadImagesFromFolder('gallery')
    ]);

    // Render image-dependent sections
    buildStoryImages(storyImages);
    buildGallery(galleryImages);

    // Remove loading state
    hideLoadingState();

    // Re-observe newly added elements for scroll animations
    reobserveAnimations();
  }

  // ── Loading State ──
  function showLoadingState() {
    const storyImagesEl = $('.story-images');
    const galleryGrid = $('.gallery-grid');
    if (storyImagesEl) storyImagesEl.classList.add('loading');
    if (galleryGrid) galleryGrid.classList.add('loading');
  }

  function hideLoadingState() {
    const storyImagesEl = $('.story-images');
    const galleryGrid = $('.gallery-grid');
    if (storyImagesEl) storyImagesEl.classList.remove('loading');
    if (galleryGrid) galleryGrid.classList.remove('loading');
  }

  // ── Hero ──
  function buildHero(c, dateInfo, timeText) {
    const heroImg = $('.hero-image');
    if (heroImg) {
      heroImg.src = 'images/hero/1.jpg';
      heroImg.alt = `${c.groom.name} & ${c.bride.name}`;
    }

    const heroNames = $('.hero-names');
    if (heroNames) {
      heroNames.innerHTML = `${c.groom.nameEn}<span class="ampersand">&</span>${c.bride.nameEn}`;
    }

    const heroDate = $('.hero-date');
    if (heroDate) {
      heroDate.textContent = `${dateInfo.year}. ${String(dateInfo.month).padStart(2, '0')}. ${String(dateInfo.day).padStart(2, '0')}. ${dateInfo.dayName}요일 ${timeText}`;
    }

    const heroVenue = $('.hero-venue');
    if (heroVenue) {
      heroVenue.textContent = c.wedding.venue;
    }
  }

  // ── Invitation ──
  function buildInvitation(c, dateInfo, timeText) {
    const msg = $('.invitation-message');
    if (msg) {
      msg.textContent = c.invitation.message;
    }

    const parents = $('.invitation-parents');
    if (parents) {
      function parentLine(side) {
        const fatherName = side.father;
        const motherName = side.mother;
        const fatherDec = side.fatherDeceased ? ' class="deceased"' : '';
        const motherDec = side.motherDeceased ? ' class="deceased"' : '';
        return `<span${fatherDec}>${fatherName}</span> <span class="dot"></span> <span${motherDec}>${motherName}</span><span style="color:#999;margin-left:4px">의 ${side === c.groom ? '아들' : '딸'}</span> <strong>${side.name}</strong>`;
      }
      parents.innerHTML = `
        <div class="parent-line">${parentLine(c.groom)}</div>
        <div class="parent-line">${parentLine(c.bride)}</div>
      `;
    }
  }

  // ── Countdown ──
  function buildCountdown(c, dateInfo) {
    const [h, m] = c.wedding.time.split(':').map(Number);
    const weddingDate = new Date(dateInfo.date);
    weddingDate.setHours(h, m, 0, 0);

    function update() {
      const now = new Date();
      const diff = weddingDate - now;

      const daysEl = $('#cd-days');
      const hoursEl = $('#cd-hours');
      const minsEl = $('#cd-mins');
      const secsEl = $('#cd-secs');
      const ddayEl = $('.countdown-dday');

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minsEl) minsEl.textContent = '0';
        if (secsEl) secsEl.textContent = '0';
        if (ddayEl) ddayEl.textContent = '결혼식 당일입니다';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = hours;
      if (minsEl) minsEl.textContent = mins;
      if (secsEl) secsEl.textContent = secs;

      if (ddayEl) {
        ddayEl.textContent = `결혼식까지 D-${days}`;
      }
    }

    update();
    setInterval(update, 1000);

    // Calendar buttons
    const gcalBtn = $('#btn-gcal');
    const icalBtn = $('#btn-ical');

    if (gcalBtn) {
      gcalBtn.addEventListener('click', () => {
        const start = formatGoogleDate(weddingDate);
        const end = formatGoogleDate(new Date(weddingDate.getTime() + 2 * 60 * 60 * 1000));
        const title = encodeURIComponent(`${c.groom.name} ♥ ${c.bride.name} 결혼식`);
        const location = encodeURIComponent(`${c.wedding.venue} ${c.wedding.address}`);
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${location}`;
        window.open(url, '_blank');
      });
    }

    if (icalBtn) {
      icalBtn.addEventListener('click', () => {
        const start = formatICSDate(weddingDate);
        const end = formatICSDate(new Date(weddingDate.getTime() + 2 * 60 * 60 * 1000));
        const ics = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Wedding//Invitation//KO',
          'BEGIN:VEVENT',
          `DTSTART:${start}`,
          `DTEND:${end}`,
          `SUMMARY:${c.groom.name} ♥ ${c.bride.name} 결혼식`,
          `LOCATION:${c.wedding.venue} ${c.wedding.address}`,
          'END:VEVENT',
          'END:VCALENDAR'
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

  function formatGoogleDate(d) {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function formatICSDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  }

  // ── Story (text only, rendered immediately) ──
  function buildStoryText(c) {
    const title = $('#story-title');
    if (title) title.textContent = c.story.title;

    const content = $('.story-content');
    if (content) content.textContent = c.story.content;
  }

  // ── Story Images (rendered after auto-detection) ──
  function buildStoryImages(storyImages) {
    const container = $('.story-images');
    if (!container) return;

    if (storyImages.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = storyImages.map((src, i) =>
      `<div class="story-image-item">
        <img src="${src}" alt="Our story ${i + 1}" loading="lazy">
      </div>`
    ).join('');
  }

  // ── Gallery (rendered after auto-detection) ──
  let galleryAllImages = [];

  function buildGallery(images) {
    const grid = $('.gallery-grid');
    if (!grid) return;

    galleryAllImages = images;

    if (images.length === 0) {
      // Hide entire gallery section if no images found
      const gallerySection = grid.closest('.gallery');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    const initialCount = 6;

    function renderImages(count) {
      grid.innerHTML = images.slice(0, count).map((src, i) =>
        `<div class="gallery-item" data-index="${i}">
          <img src="${src}" alt="Gallery photo ${i + 1}" loading="lazy">
        </div>`
      ).join('');

      $$('.gallery-item', grid).forEach(item => {
        item.addEventListener('click', () => {
          openModal(images, parseInt(item.dataset.index));
        });
      });
    }

    renderImages(Math.min(initialCount, images.length));

    const moreBtn = $('.btn-gallery-more');
    if (moreBtn) {
      if (images.length <= initialCount) {
        moreBtn.parentElement.style.display = 'none';
      } else {
        let expanded = false;
        moreBtn.addEventListener('click', () => {
          if (!expanded) {
            renderImages(images.length);
            moreBtn.textContent = '접기';
            expanded = true;
          } else {
            renderImages(initialCount);
            moreBtn.textContent = '더보기';
            expanded = false;
            grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }
    }
  }

  // ── Photo Modal ──
  let currentModalImages = [];
  let currentModalIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function initModal() {
    const overlay = $('.modal-overlay');
    if (!overlay) return;

    const closeBtn = $('.modal-close');
    const prevBtn = $('.modal-prev');
    const nextBtn = $('.modal-next');
    const swipeArea = $('.modal-swipe-area');

    closeBtn?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', () => navigateModal(-1));
    nextBtn?.addEventListener('click', () => navigateModal(1));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === swipeArea) closeModal();
    });

    // Swipe
    swipeArea?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    swipeArea?.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateModal(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal(-1);
      if (e.key === 'ArrowRight') navigateModal(1);
    });
  }

  function openModal(images, index) {
    currentModalImages = images;
    currentModalIndex = index;

    const overlay = $('.modal-overlay');
    if (!overlay) return;

    updateModalImage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = $('.modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateModal(dir) {
    currentModalIndex += dir;
    if (currentModalIndex < 0) currentModalIndex = currentModalImages.length - 1;
    if (currentModalIndex >= currentModalImages.length) currentModalIndex = 0;
    updateModalImage();
  }

  function updateModalImage() {
    const img = $('.modal-image');
    const counter = $('.modal-counter');
    if (img) {
      img.src = currentModalImages[currentModalIndex];
      img.alt = `Photo ${currentModalIndex + 1}`;
    }
    if (counter) {
      counter.textContent = `${currentModalIndex + 1} / ${currentModalImages.length}`;
    }
  }

  // ── Location ──
  function buildLocation(c) {
    const venueName = $('.location-venue-name');
    const venueHall = $('.location-venue-hall');
    const address = $('.location-address');
    const tel = $('.location-tel');
    const mapImg = $('.location-map-image img');

    if (venueName) venueName.textContent = c.wedding.venue;
    if (venueHall) venueHall.textContent = c.wedding.hall;
    if (address) address.textContent = c.wedding.address;
    if (tel && c.wedding.tel) {
      tel.innerHTML = `<a href="tel:${c.wedding.tel}">${c.wedding.tel}</a>`;
    }
    if (mapImg) {
      mapImg.src = 'images/location/1.jpg';
      mapImg.alt = `${c.wedding.venue} 약도`;
    }

    // Copy address
    const copyBtn = $('#btn-copy-address');
    copyBtn?.addEventListener('click', () => {
      copyToClipboard(c.wedding.address, '주소가 복사되었습니다');
    });

    // Map links
    const kakaoLink = $('#link-kakao-map');
    const naverLink = $('#link-naver-map');
    if (kakaoLink && c.wedding.mapLinks.kakao) {
      kakaoLink.href = c.wedding.mapLinks.kakao;
    }
    if (naverLink && c.wedding.mapLinks.naver) {
      naverLink.href = c.wedding.mapLinks.naver;
    }
  }

  // ── Account ──
  function buildAccount(c) {
    buildAccountGroup('groom', c.accounts.groom, `신랑측 계좌번호`);
    buildAccountGroup('bride', c.accounts.bride, `신부측 계좌번호`);
  }

  function buildAccountGroup(side, accounts, label) {
    const group = $(`#account-${side}`);
    if (!group) return;

    const toggle = $('.account-group-toggle', group);
    const list = $('.account-list', group);

    if (toggle) {
      const labelEl = toggle.querySelector('.toggle-label');
      if (labelEl) labelEl.textContent = label;

      toggle.addEventListener('click', () => {
        group.classList.toggle('open');
      });
    }

    if (list) {
      list.innerHTML = accounts.map(acc =>
        `<div class="account-item">
          <div class="account-info">
            <div class="account-role">${acc.role}</div>
            <div class="account-detail">
              <span class="account-name">${acc.name}</span>
              ${acc.bank} ${acc.number}
            </div>
          </div>
          <button class="btn-copy-account" data-copy="${acc.bank} ${acc.number} ${acc.name}">복사</button>
        </div>`
      ).join('');

      $$('.btn-copy-account', list).forEach(btn => {
        btn.addEventListener('click', () => {
          copyToClipboard(btn.dataset.copy, '계좌번호가 복사되었습니다');
        });
      });
    }
  }

  // ── Scroll Animations ──
  let scrollObserver = null;

  function initScrollAnimations() {
    scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.fade-in').forEach(el => scrollObserver.observe(el));
  }

  function reobserveAnimations() {
    if (!scrollObserver) return;
    $$('.fade-in:not(.visible)').forEach(el => scrollObserver.observe(el));
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
