/**
 * PopupEditor Plugin - Vanilla JS / jQuery compatible
 * Minimalist, smart positioning, and Bootstrap 4 compatible.
 */
class PopupEditor {
  constructor(element, options) {
    if (!element) return;
    this.element = element;
    this.options = Object.assign({
      render: (val, close, el) => `<input type="text" value="${val}" class="form-control">`,
      onSave: (el, api) => { api.close(); },
      onCancel: (el) => {},
      saveLabel: 'Salvar',
      cancelLabel: 'Cancelar',
      zIndex: 1060, // Higher than Bootstrap modal (1050)
      emptyIcon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
      emptyContent: null, // Custom HTML for empty state
      noStyle: false // If true, removes default blue/dashed styling
    }, options);

    this.popup = null;
    this.isOpen = false;
    this.injectStyles();
    this.init();
  }

  injectStyles() {
    if (document.getElementById('popup-editor-styles')) return;
    const style = document.createElement('style');
    style.id = 'popup-editor-styles';
    style.innerHTML = `
      .pe-editable { 
        color: #007bff; 
        cursor: pointer; 
        border-bottom: 1px dashed #007bff;
        display: inline-block;
        transition: all 0.2s;
      }
      .pe-editable:hover { color: #0056b3; border-bottom-style: solid; }
      .pe-active { outline: 2px solid #007bff; outline-offset: 4px; border-radius: 2px; }
      .popup-editor-empty-placeholder { opacity: 0.6; display: inline-flex; align-items: center; gap: 4px; font-style: italic; font-size: 0.9em; }
      
      @keyframes pe-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
      .pe-pulse { animation: pe-pulse 0.3s ease-in-out; }
      .pe-btn-success { background-color: #28a745 !important; border-color: #28a745 !important; color: white !important; }
    `;
    document.head.appendChild(style);
  }

  init() {
    if (!this.options.noStyle) {
      this.element.classList.add('pe-editable');
    }
    this.checkEmpty();
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Close on click outside
    document.addEventListener('mousedown', (e) => {
      if (this.isOpen && this.popup && !this.popup.contains(e.target) && !this.element.contains(e.target)) {
        this.close();
      }
    });

    // Reposition on resize/scroll
    window.addEventListener('resize', () => this.isOpen && this.updatePosition());
    window.addEventListener('scroll', () => this.isOpen && this.updatePosition(), true);
  }

  checkEmpty() {
    const text = this.element.innerText.trim();
    // If element is empty or only contains our icon placeholder
    if (text === '' || this.element.querySelector('.popup-editor-empty-placeholder')) {
      let content = this.options.emptyContent;
      
      // Default template if no custom content is provided
      if (!content) {
        content = `${this.options.emptyIcon} Vazio`;
      }

      this.element.innerHTML = `<span class="popup-editor-empty-placeholder">${content}</span>`;
      this.element.setAttribute('data-is-empty', 'true');
    } else {
      this.element.removeAttribute('data-is-empty');
    }
  }

  getValue() {
    if (this.element.getAttribute('data-is-empty') === 'true') {
      return '';
    }
    return this.element.innerText.trim();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.element.classList.add('pe-active');

    // Create popup element
    this.popup = document.createElement('div');
    this.popup.className = 'popup-editor-container';
    this.popup.style.cssText = `
      position: fixed;
      z-index: ${this.options.zIndex};
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      padding: 1rem;
      min-width: 250px;
      opacity: 0;
      transform: scale(0.95);
      transition: opacity 0.15s ease-out, transform 0.15s ease-out;
      pointer-events: auto;
    `;

    const content = this.options.render(this.getValue(), () => this.close(), this.element);
    
    this.popup.innerHTML = `
      <div class="popup-editor-error alert alert-danger d-none py-1 px-2 mb-2 small" style="font-size: 0.75rem;"></div>
      <div class="popup-editor-content">${content}</div>
      <div class="popup-editor-actions d-flex justify-content-end mt-3 pt-2 border-top">
        <button type="button" class="btn btn-sm btn-light mr-2 btn-cancel">${this.options.cancelLabel}</button>
        <button type="button" class="btn btn-sm btn-primary btn-save">
          <span class="spinner-border spinner-border-sm d-none mr-1" role="status" aria-hidden="true"></span>
          <span class="btn-text">${this.options.saveLabel}</span>
        </button>
      </div>
      <div class="popup-editor-arrow" style="
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border-top: 1px solid #dee2e6;
        border-left: 1px solid #dee2e6;
        transform: rotate(45deg);
      "></div>
    `;

    document.body.appendChild(this.popup);

    // Prevent Bootstrap modal from stealing focus
    this.popup.addEventListener('focusin', (e) => e.stopPropagation());

    // Event listeners for buttons
    this.popup.querySelector('.btn-cancel').addEventListener('click', () => {
      this.options.onCancel(this.element);
      this.close();
    });

    this.popup.querySelector('.btn-save').addEventListener('click', () => {
      // Pass the element and a helper object for AJAX control
      this.options.onSave(this.element, {
        close: () => this.close(),
        success: () => this.showSuccess(),
        showError: (msg) => this.showError(msg),
        hideError: () => this.hideError(),
        setLoading: (state) => this.setLoading(state)
      });
    });

    // Show with animation
    requestAnimationFrame(() => {
      this.updatePosition();
      this.popup.style.opacity = '1';
      this.popup.style.transform = 'scale(1)';
      
      // Auto-focus first input so user can type immediately
      const firstInput = this.popup.querySelector('input, textarea, select');
      if (firstInput) firstInput.focus();
    });
  }

  showSuccess() {
    if (!this.popup) return;
    const btn = this.popup.querySelector('.btn-save');
    const btnText = btn.querySelector('.btn-text');
    
    this.setLoading(false);
    btn.classList.add('pe-btn-success');
    btnText.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><polyline points="20 6 9 17 4 12"></polyline></svg> Salvo!';
    this.popup.classList.add('pe-pulse');
    
    setTimeout(() => {
      this.close();
    }, 600);
  }

  showError(message) {
    if (!this.popup) return;
    const errorDiv = this.popup.querySelector('.popup-editor-error');
    errorDiv.innerText = message;
    errorDiv.classList.remove('d-none');
    this.updatePosition(); // Re-calculate position as height changed
  }

  hideError() {
    if (!this.popup) return;
    const errorDiv = this.popup.querySelector('.popup-editor-error');
    errorDiv.classList.add('d-none');
    this.updatePosition();
  }

  setLoading(isLoading) {
    if (!this.popup) return;
    const btn = this.popup.querySelector('.btn-save');
    const spinner = btn.querySelector('.spinner-border');
    const cancelBtn = this.popup.querySelector('.btn-cancel');
    
    if (isLoading) {
      btn.disabled = true;
      cancelBtn.disabled = true;
      spinner.classList.remove('d-none');
    } else {
      btn.disabled = false;
      cancelBtn.disabled = false;
      spinner.classList.add('d-none');
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.element.classList.remove('pe-active');
    
    if (this.popup) {
      this.popup.style.opacity = '0';
      this.popup.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (this.popup && this.popup.parentNode) {
          this.popup.parentNode.removeChild(this.popup);
        }
        this.popup = null;
        this.checkEmpty(); // Check if empty after closing
      }, 150);
    }
  }

  updatePosition() {
    if (!this.popup || !this.isOpen) return;

    const rect = this.element.getBoundingClientRect();
    const popupRect = this.popup.getBoundingClientRect();
    const arrow = this.popup.querySelector('.popup-editor-arrow');
    const margin = 12;

    let top, left, placement;

    // Default: Bottom
    placement = 'bottom';
    top = rect.bottom + margin;
    left = rect.left + (rect.width / 2) - (popupRect.width / 2);

    // Smart Positioning Logic
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Check if bottom is out of bounds
    if (top + popupRect.height > viewportHeight) {
      // Try Top
      if (rect.top - popupRect.height - margin > 0) {
        placement = 'top';
        top = rect.top - popupRect.height - margin;
      } else {
        // Try Right
        if (rect.right + popupRect.width + margin < viewportWidth) {
          placement = 'right';
          top = rect.top + (rect.height / 2) - (popupRect.height / 2);
          left = rect.right + margin;
        } else if (rect.left - popupRect.width - margin > 0) {
          // Try Left
          placement = 'left';
          top = rect.top + (rect.height / 2) - (popupRect.height / 2);
          left = rect.left - popupRect.width - margin;
        }
      }
    }

    // Boundary checks for left/right
    if (placement === 'bottom' || placement === 'top') {
      left = Math.max(10, Math.min(left, viewportWidth - popupRect.width - 10));
    } else {
      top = Math.max(10, Math.min(top, viewportHeight - popupRect.height - 10));
    }

    this.popup.style.top = `${top}px`;
    this.popup.style.left = `${left}px`;

    // Arrow positioning
    arrow.style.display = 'block';
    arrow.style.top = '';
    arrow.style.bottom = '';
    arrow.style.left = '';
    arrow.style.right = '';
    arrow.style.border = 'none';
    arrow.style.borderTop = '1px solid #dee2e6';
    arrow.style.borderLeft = '1px solid #dee2e6';

    if (placement === 'bottom') {
      arrow.style.top = '-6px';
      arrow.style.left = `${rect.left - left + (rect.width / 2) - 5}px`;
    } else if (placement === 'top') {
      arrow.style.bottom = '-6px';
      arrow.style.left = `${rect.left - left + (rect.width / 2) - 5}px`;
      arrow.style.transform = 'rotate(225deg)';
    } else if (placement === 'right') {
      arrow.style.left = '-6px';
      arrow.style.top = `${rect.top - top + (rect.height / 2) - 5}px`;
      arrow.style.transform = 'rotate(-45deg)';
    } else if (placement === 'left') {
      arrow.style.right = '-6px';
      arrow.style.top = `${rect.top - top + (rect.height / 2) - 5}px`;
      arrow.style.transform = 'rotate(135deg)';
    }
  }
}

// Global export
window.PopupEditor = PopupEditor;

// jQuery Plugin Wrapper
if (window.jQuery) {
  (function($) {
    $.fn.popupEditor = function(options) {
      return this.each(function() {
        if (!$.data(this, 'popupEditor')) {
          $.data(this, 'popupEditor', new PopupEditor(this, options));
        }
      });
    };
  })(window.jQuery);
}
