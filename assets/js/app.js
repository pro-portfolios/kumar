/* 
  Kumar P Executive Command Center - Main Application Script
  Pure Vanilla JS Logic, DOM Rendering, & Event Handlers
  Published Location: site/assets/js/app.js
  Indent: 2 spaces
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // Initialize Modules
    initThemeToggle();
    initHeaderScrollSpy();
    initMobileNav();
    initTestimonialFilters();
    initExtensionModal();
    initImageViewerModal();
  });

  /* ----------------------------------------------------
     1. THEME SWITCHER MODULE (SUN/MOON TOGGLE)
  ---------------------------------------------------- */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    let savedTheme;
    try {
      savedTheme = localStorage.getItem('kumar_theme');
    } catch(e) {
      console.warn('localStorage not available', e);
    }
    
    if (!savedTheme) {
      savedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    setTheme(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        try {
          localStorage.setItem('kumar_theme', newTheme);
        } catch (e) {
          console.warn('localStorage not available', e);
        }
      });
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    
    // Update theme-color meta tag for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0a0c12');
    }

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      if (theme === 'light') {
        toggleBtn.innerHTML = '<span aria-hidden="true">☀️</span>';
        toggleBtn.setAttribute('title', 'Switch to Dark Theme');
        toggleBtn.setAttribute('aria-label', 'Switch to Dark Theme');
      } else {
        toggleBtn.innerHTML = '<span aria-hidden="true">🌙</span>';
        toggleBtn.setAttribute('title', 'Switch to Light Theme');
        toggleBtn.setAttribute('aria-label', 'Switch to Light Theme');
      }
    }
  }

  /* ----------------------------------------------------
     2. FIXED HEADER & SCROLL SPY MODULE
  ---------------------------------------------------- */
  function initHeaderScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-item a');

    const updateNavHighlight = () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 180;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        if (scrollPos >= top) {
          currentSectionId = sec.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', updateNavHighlight);
    window.addEventListener('load', updateNavHighlight);
    window.addEventListener('hashchange', updateNavHighlight);
    updateNavHighlight();
  }

  /* ----------------------------------------------------
     3. MOBILE NAVIGATION TOGGLE
  ---------------------------------------------------- */
  function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const bottomTier = document.getElementById('header-bottom-tier');
    const navLinks = document.querySelectorAll('.nav-link-item a');

    if (!toggleBtn || !bottomTier) return;

    toggleBtn.addEventListener('click', () => {
      bottomTier.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        bottomTier.classList.remove('mobile-open');
      });
    });
  }



  /* ----------------------------------------------------
     8. TESTIMONIAL MATRIX & FILTERS
  ---------------------------------------------------- */
  function initTestimonialFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.testimonial-card');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const category = chip.getAttribute('data-filter');
        cards.forEach(card => {
          if (category === 'All' || card.getAttribute('data-category').toLowerCase() === category.toLowerCase()) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----------------------------------------------------
     9. MODAL FOR EXTENSION DETAILS
  ---------------------------------------------------- */
  function initExtensionModal() {
    const modal = document.getElementById('ext-detail-modal');
    const closeBtn = document.getElementById('close-ext-modal');
    const modalTitle = document.getElementById('ext-modal-title');
    const modalBody = document.getElementById('ext-modal-body');

    if (!modal) return;

    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view-ext')) {
        const btn = e.target;
        const title = btn.getAttribute('data-ext-title');
        const desc = btn.getAttribute('data-ext-desc');
        const cmd = btn.getAttribute('data-ext-cmd');
        const features = JSON.parse(btn.getAttribute('data-ext-features') || '[]');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = `
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${escapeHtml(desc)}</p>
          <div class="install-cmd-box">
            <code>${escapeHtml(cmd)}</code>
          </div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin: 18px 0 8px 0;">Key Capabilities</h4>
          <ul style="padding-left: 20px; color: var(--text-secondary); font-size: 0.88rem;">
            ${features.map(f => `<li style="margin-bottom: 6px;">${escapeHtml(f)}</li>`).join('')}
          </ul>
        `;
        modal.classList.add('active');
      } else if (e.target.classList.contains('copy-btn')) {
        // Handle copy button clicks since renderExtensions is removed
        e.stopPropagation();
        const btn = e.target;
        const cmd = btn.getAttribute('data-copy-cmd');
        if (cmd) {
          navigator.clipboard.writeText(cmd).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '✓';
            setTimeout(() => { btn.textContent = originalText; }, 1500);
          });
        }
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  /* ----------------------------------------------------
     10. IMAGE VIEWER MODAL
  ---------------------------------------------------- */
  function initImageViewerModal() {
    const imageModal = document.getElementById('image-viewer-modal');
    const fullSizeImage = document.getElementById('full-size-image');
    const closeImageModal = document.getElementById('close-image-modal');

    if (!imageModal || !fullSizeImage) return;

    document.querySelectorAll('.award-thumbnail, .feedback-thumbnail').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        fullSizeImage.src = img.src;
        imageModal.classList.add('active');
      });
    });

    if (closeImageModal) {
      closeImageModal.addEventListener('click', () => {
        imageModal.classList.remove('active');
      });
    }

    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) {
        imageModal.classList.remove('active');
      }
    });
  }

  /* ----------------------------------------------------
     11. GLOBAL ESC KEY TO CLOSE MODALS
  ---------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal-backdrop.active');
      activeModals.forEach(modal => modal.classList.remove('active'));
    }
  });

  /* Helper to escape HTML */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
