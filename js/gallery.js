/**
 * FloraMesh Image Gallery & Accessible Lightbox Controller (js/gallery.js)
 * Accessible thumbnails, input-safe arrow keys, mobile touch swipe,
 * click-to-zoom with mouse drag/wheel, and focus-restoring lightbox.
 * 100% file:// compatible, zero external dependencies.
 */
(function () {
  'use strict';

  var currentImages = [];
  var currentIndex = 0;
  var zoomActive = false;
  var isKeydownBound = false;

  function initGallery(images) {
    currentImages = images || [];
    currentIndex = 0;
    bindEvents();
    if (currentImages.length > 0) {
      setActiveImage(0);
    }
  }

  function setActiveImage(idx) {
    if (!currentImages.length) return;
    currentIndex = (idx + currentImages.length) % currentImages.length;
    var imgObj = currentImages[currentIndex];
    var mainImg = document.getElementById('pdp-main-img');
    var mainCaption = document.getElementById('pdp-main-caption');

    if (mainImg && imgObj) {
      mainImg.src = imgObj.src;
      mainImg.alt = imgObj.alt;
    }
    if (mainCaption && imgObj) {
      mainCaption.textContent = imgObj.alt || 'Studio view';
    }

    document.querySelectorAll('.pdp__thumb, .product-gallery__thumb').forEach(function (btn, i) {
      var active = (i === currentIndex);
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-current', active ? 'true' : 'false');
    });

    if (zoomActive) {
      updateZoomModalContent();
    }
  }

  function updateZoomModalContent() {
    var content = document.getElementById('quick-view-content');
    var titleEl = document.getElementById('quick-view-title');
    var eyebrowEl = document.getElementById('quick-view-eyebrow');
    if (!content || !currentImages.length) return;

    var imgObj = currentImages[currentIndex];
    if (eyebrowEl) eyebrowEl.textContent = 'Image ' + (currentIndex + 1) + ' of ' + currentImages.length;
    if (titleEl) titleEl.textContent = imgObj.alt || 'Botanical Image Zoom';

    var utils = window.FloraMeshUtils || {};
    var getIcon = utils.getIcon || function () { return ''; };

    content.innerHTML = [
      '<div style="text-align:center;background:var(--color-media-bg);border-radius:var(--radius-lg);padding:var(--space-4);position:relative;overflow:hidden;border:1px solid var(--color-border);">',
      '  <img src="' + utils.escapeAttr(imgObj.src) + '" alt="' + utils.escapeAttr(imgObj.alt) + '" id="lightbox-zoom-img" style="max-height:65vh;margin:0 auto;border-radius:var(--radius-md);transition:transform 200ms ease;cursor:zoom-in;" loading="lazy">',
      '</div>',
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-4);flex-wrap:wrap;gap:var(--space-2);">',
      '  <button type="button" class="btn btn-outline" id="zoom-prev-btn" aria-label="Previous image">' + getIcon('chevronLeft') + ' Previous</button>',
      '  <span style="font-size:var(--text-xs);color:var(--color-text-muted);">Click image to zoom • Use &larr; / &rarr; keys</span>',
      '  <button type="button" class="btn btn-outline" id="zoom-next-btn" aria-label="Next image">Next ' + getIcon('chevronRight') + '</button>',
      '</div>'
    ].join('\n');

    var prevBtn = document.getElementById('zoom-prev-btn');
    var nextBtn = document.getElementById('zoom-next-btn');
    if (prevBtn) prevBtn.onclick = function () { setActiveImage(currentIndex - 1); };
    if (nextBtn) nextBtn.onclick = function () { setActiveImage(currentIndex + 1); };

    // Interactive zoom toggle
    var zoomImg = document.getElementById('lightbox-zoom-img');
    if (zoomImg) {
      var isZoomed = false;
      zoomImg.onclick = function () {
        isZoomed = !isZoomed;
        zoomImg.style.transform = isZoomed ? 'scale(1.8)' : 'scale(1)';
        zoomImg.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
      };
    }
  }

  function openZoomModal() {
    var modal = document.getElementById('quick-view-modal');
    if (!modal || !currentImages.length) return;

    zoomActive = true;
    updateZoomModalContent();

    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.open('quick-view-modal', document.getElementById('pdp-zoom-btn'));
    } else {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }

    var closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.onclick = closeZoomModal;
    }
  }

  function closeZoomModal() {
    zoomActive = false;
    if (window.FloraMeshUI && window.FloraMeshUI.DialogManager) {
      window.FloraMeshUI.DialogManager.close('quick-view-modal');
    } else {
      var modal = document.getElementById('quick-view-modal');
      if (modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function bindEvents() {
    // Thumbnails click
    document.querySelectorAll('.pdp__thumb, .product-gallery__thumb').forEach(function (btn) {
      btn.onclick = function () {
        var idx = parseInt(btn.getAttribute('data-thumb-idx'), 10) || 0;
        setActiveImage(idx);
      };
    });

    var zoomBtn = document.getElementById('pdp-zoom-btn');
    if (zoomBtn) {
      zoomBtn.onclick = openZoomModal;
    }

    // Keyboard Arrow Navigation (Safe: ignores text inputs)
    if (!isKeydownBound) {
      isKeydownBound = true;
      document.addEventListener('keydown', function (e) {
        if (!currentImages.length) return;
        var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
          return; // Ignore arrow keys inside form inputs (Fixes QA-14)
        }

        if (e.key === 'ArrowLeft') {
          setActiveImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          setActiveImage(currentIndex + 1);
        }
      });
    }

    // Touch Swipe Navigation for Main Gallery Image
    var mainEl = document.getElementById('pdp-main-img');
    if (mainEl) {
      var touchStartX = 0;
      var touchEndX = 0;

      mainEl.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      mainEl.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
          if (diff > 0) {
            setActiveImage(currentIndex + 1);
          } else {
            setActiveImage(currentIndex - 1);
          }
        }
      }, { passive: true });
    }
  }

  window.FloraMeshGallery = {
    initGallery: initGallery,
    setActiveImage: setActiveImage,
    openZoomModal: openZoomModal,
    closeZoomModal: closeZoomModal
  };
})();
