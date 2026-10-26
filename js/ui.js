/**
 * FloraMesh UI & Dialog Manager (js/ui.js)
 * Centralized, accessible dialog & drawer stack manager.
 * Handles focus trapping, focus restoration, body scroll lock, Escape key, and backdrop clicks.
 * 100% file:// compatible, zero external dependencies.
 */
(function () {
  'use strict';

  var dialogStack = [];
  var scrollbarWidth = 0;

  function getScrollbarWidth() {
    if (scrollbarWidth) return scrollbarWidth;
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    var inner = document.createElement('div');
    outer.appendChild(inner);
    scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }

  function getFocusableElements(container) {
    if (!container) return [];
    var selectors = 'button:not([disabled]), [href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(container.querySelectorAll(selectors)).filter(function (el) {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    });
  }

  function lockScroll() {
    if (document.body.classList.contains('has-modal-open')) return;
    var width = getScrollbarWidth();
    document.body.style.paddingRight = width > 0 ? width + 'px' : '';
    document.body.classList.add('has-modal-open');
  }

  function unlockScroll() {
    if (dialogStack.length > 0) return;
    document.body.classList.remove('has-modal-open');
    document.body.style.paddingRight = '';
  }

  function handleKeydown(e) {
    if (dialogStack.length === 0) return;
    var current = dialogStack[dialogStack.length - 1];

    if (e.key === 'Escape') {
      e.preventDefault();
      close(current.id);
      return;
    }

    if (e.key === 'Tab') {
      var focusables = getFocusableElements(current.element);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function open(dialogId, triggerEl) {
    var el = document.getElementById(dialogId);
    if (!el) return;

    // Check if already in stack
    for (var i = 0; i < dialogStack.length; i++) {
      if (dialogStack[i].id === dialogId) return;
    }

    var record = {
      id: dialogId,
      element: el,
      trigger: triggerEl || document.activeElement
    };

    dialogStack.push(record);
    lockScroll();

    if (typeof el.showModal === 'function' && el.tagName === 'DIALOG') {
      try {
        if (!el.open) el.showModal();
      } catch (err) {
        el.setAttribute('open', '');
      }
    } else {
      el.classList.add('is-open');
      el.setAttribute('aria-hidden', 'false');
    }

    // Backdrop element synchronization if present
    var backdrop = document.getElementById(dialogId + '-backdrop') || document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
    }

    // Focus first element or container
    var focusables = getFocusableElements(el);
    if (focusables.length > 0) {
      setTimeout(function () { focusables[0].focus(); }, 50);
    } else {
      el.setAttribute('tabindex', '-1');
      el.focus();
    }

    if (dialogStack.length === 1) {
      document.addEventListener('keydown', handleKeydown);
    }

    // Dispatch event
    if (window.FloraMeshEvents && window.FloraMeshEvents.emit) {
      window.FloraMeshEvents.emit('dialog:opened', { id: dialogId });
    }
  }

  function close(dialogId) {
    var index = -1;
    for (var i = dialogStack.length - 1; i >= 0; i--) {
      if (dialogStack[i].id === dialogId) {
        index = i;
        break;
      }
    }
    if (index === -1) {
      // Element might still need cleanup
      var fallback = document.getElementById(dialogId);
      if (fallback) {
        if (typeof fallback.close === 'function' && fallback.tagName === 'DIALOG' && fallback.open) {
          fallback.close();
        } else {
          fallback.classList.remove('is-open');
          fallback.setAttribute('aria-hidden', 'true');
        }
      }
      return;
    }

    var record = dialogStack.splice(index, 1)[0];
    var el = record.element;

    if (typeof el.close === 'function' && el.tagName === 'DIALOG' && el.open) {
      try { el.close(); } catch (err) { el.removeAttribute('open'); }
    } else {
      el.classList.remove('is-open');
      el.setAttribute('aria-hidden', 'true');
    }

    var backdrop = document.getElementById(dialogId + '-backdrop') || document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
    }

    unlockScroll();

    if (record.trigger && typeof record.trigger.focus === 'function') {
      try { record.trigger.focus(); } catch (e) {}
    }

    if (dialogStack.length === 0) {
      document.removeEventListener('keydown', handleKeydown);
    }

    // Dispatch event
    if (window.FloraMeshEvents && window.FloraMeshEvents.emit) {
      window.FloraMeshEvents.emit('dialog:closed', { id: dialogId });
    }
  }

  function closeAll() {
    while (dialogStack.length > 0) {
      close(dialogStack[dialogStack.length - 1].id);
    }
  }

  function isDialogOpen(dialogId) {
    for (var i = 0; i < dialogStack.length; i++) {
      if (dialogStack[i].id === dialogId) return true;
    }
    return false;
  }

  window.FloraMeshUI = {
    DialogManager: {
      open: open,
      close: close,
      closeAll: closeAll,
      isOpen: isDialogOpen
    }
  };
})();
