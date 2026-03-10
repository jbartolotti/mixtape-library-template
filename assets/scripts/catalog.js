// catalog.js - Handles view toggling and checkbox state management

(function() {
  'use strict';
  
  // Constants
  const STORAGE_KEY = 'mixtape_selected_tapes';
  const VIEW_STORAGE_KEY = 'mixtape_view_preference';
  const TAG_FILTER_STORAGE_KEY = 'mixtape_tag_filters';
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    setupGridImageOrientation();
    setupViewToggle();
    setupTagFilters();
    setupCheckboxes();
    loadSelectedTapes();
    updateRequestCount();
    restoreViewPreference();
    restoreTagFilters();
    applyTagFilters();
  }

  function setupGridImageOrientation() {
    const gridImages = document.querySelectorAll('.js-grid-image');

    if (!gridImages.length) return;

    gridImages.forEach(image => {
      if (image.complete) {
        updateGridImageOrientation(image);
      } else {
        image.addEventListener('load', () => updateGridImageOrientation(image), { once: true });
      }
    });

    window.addEventListener('resize', debounce(() => {
      gridImages.forEach(updateGridImageOrientation);
    }, 100));
  }

  function updateGridImageOrientation(image) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return;

    const wrapper = image.closest('.tape-image-wrapper');
    if (!wrapper) return;

    image.classList.remove('is-landscape-rotated');
    image.style.width = '';
    image.style.height = '';
    image.style.transform = '';

    if (image.naturalWidth <= image.naturalHeight) {
      return;
    }

    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    if (!wrapperWidth || !wrapperHeight) return;

    const ratio = image.naturalWidth / image.naturalHeight;
    const baseHeight = Math.max(wrapperWidth, wrapperHeight / ratio);
    const baseWidth = baseHeight * ratio;

    image.classList.add('is-landscape-rotated');
    image.style.width = `${baseWidth}px`;
    image.style.height = `${baseHeight}px`;
    image.style.transform = 'rotate(90deg)';
  }

  function debounce(fn, delay) {
    let timeoutId;

    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  
  // ========================================
  // View Toggle Functionality
  // ========================================
  
  function setupViewToggle() {
    const catalogBtn = document.getElementById('catalog-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    
    if (!catalogBtn || !listBtn) return;
    
    catalogBtn.addEventListener('click', () => switchView('catalog'));
    listBtn.addEventListener('click', () => switchView('list'));
  }
  
  function switchView(view) {
    const catalogView = document.getElementById('catalog-view');
    const listView = document.getElementById('list-view');
    const catalogBtn = document.getElementById('catalog-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    
    if (!catalogView || !listView) return;
    
    if (view === 'catalog') {
      catalogView.classList.add('active');
      listView.classList.remove('active');
      catalogBtn.classList.add('active');
      listBtn.classList.remove('active');
    } else {
      listView.classList.add('active');
      catalogView.classList.remove('active');
      listBtn.classList.add('active');
      catalogBtn.classList.remove('active');
    }
    
    // Save preference
    localStorage.setItem(VIEW_STORAGE_KEY, view);
    
    // Sync checkbox states between views
    syncCheckboxStates();

    // Keep filters in sync when changing views
    applyTagFilters();
  }
  
  function restoreViewPreference() {
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);
    if (savedView === 'list') {
      switchView('list');
    }
  }
  
  // ========================================
  // Checkbox Management
  // ========================================
  
  function setupCheckboxes() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });
  }
  
  function handleCheckboxChange(event) {
    const checkbox = event.target;
    const slug = checkbox.dataset.tapeSlug;
    const title = checkbox.dataset.tapeTitle;
    
    let selectedTapes = getSelectedTapes();
    
    if (checkbox.checked) {
      // Add tape to selection
      if (!selectedTapes.some(tape => tape.slug === slug)) {
        selectedTapes.push({ slug, title });
      }
    } else {
      // Remove tape from selection
      selectedTapes = selectedTapes.filter(tape => tape.slug !== slug);
    }
    
    saveSelectedTapes(selectedTapes);
    syncCheckboxStates();
    updateRequestCount();
  }
  
  function syncCheckboxStates() {
    const selectedTapes = getSelectedTapes();
    const selectedSlugs = selectedTapes.map(tape => tape.slug);
    
    const checkboxes = document.querySelectorAll('.request-checkbox');
    checkboxes.forEach(checkbox => {
      const slug = checkbox.dataset.tapeSlug;
      checkbox.checked = selectedSlugs.includes(slug);
    });
  }
  
  function loadSelectedTapes() {
    syncCheckboxStates();
  }

  // ========================================
  // Tag Filters
  // ========================================

  function setupTagFilters() {
    const filterCheckboxes = document.querySelectorAll('.tag-filter-checkbox');
    const clearButton = document.getElementById('clear-tag-filters');

    if (!filterCheckboxes.length) return;

    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const selectedTags = getSelectedTags();
        saveTagFilters(selectedTags);
        applyTagFilters();
      });
    });

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
        saveTagFilters([]);
        applyTagFilters();
      });
    }
  }

  function getSelectedTags() {
    const filterCheckboxes = document.querySelectorAll('.tag-filter-checkbox:checked');
    return Array.from(filterCheckboxes).map(checkbox => checkbox.value);
  }

  function restoreTagFilters() {
    const filterCheckboxes = document.querySelectorAll('.tag-filter-checkbox');
    if (!filterCheckboxes.length) return;

    try {
      const saved = localStorage.getItem(TAG_FILTER_STORAGE_KEY);
      const selectedTags = saved ? JSON.parse(saved) : [];

      if (!Array.isArray(selectedTags)) return;

      filterCheckboxes.forEach(checkbox => {
        checkbox.checked = selectedTags.includes(checkbox.value);
      });
    } catch (e) {
      console.error('Error restoring tag filters:', e);
    }
  }

  function saveTagFilters(tags) {
    try {
      localStorage.setItem(TAG_FILTER_STORAGE_KEY, JSON.stringify(tags));
    } catch (e) {
      console.error('Error saving tag filters:', e);
    }
  }

  function applyTagFilters() {
    const selectedTags = getSelectedTags().map(tag => tag.toLowerCase().trim());
    const items = document.querySelectorAll('.tape-card, .tape-list-item');

    items.forEach(item => {
      const itemTags = (item.dataset.tags || '')
        .split('|')
        .map(tag => tag.toLowerCase().trim())
        .filter(Boolean);

      const isVisible = selectedTags.length === 0 || selectedTags.some(tag => itemTags.includes(tag));
      item.style.display = isVisible ? '' : 'none';
    });

    toggleNoResults('.catalog-view.active .tape-card', '.catalog-no-results');
    toggleNoResults('.list-view.active .tape-list-item', '.list-no-results');
    updateTagCount(selectedTags.length);
  }

  function toggleNoResults(visibleItemSelector, messageSelector) {
    const message = document.querySelector(messageSelector);
    if (!message) return;

    const allItems = document.querySelectorAll(visibleItemSelector);
    const visibleItems = Array.from(allItems).filter(item => item.style.display !== 'none');

    if (visibleItems.length === 0) {
      message.classList.remove('is-hidden');
    } else {
      message.classList.add('is-hidden');
    }
  }

  function updateTagCount(selectedCount) {
    const countElement = document.getElementById('selected-tag-count');
    if (!countElement) return;

    countElement.textContent = selectedCount > 0
      ? `(${selectedCount} selected)`
      : '(All)';
  }
  
  // ========================================
  // Local Storage Helpers
  // ========================================
  
  function getSelectedTapes() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading selected tapes:', e);
      return [];
    }
  }
  
  function saveSelectedTapes(tapes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tapes));
    } catch (e) {
      console.error('Error saving selected tapes:', e);
    }
  }
  
  // ========================================
  // Request Count Display
  // ========================================
  
  function updateRequestCount() {
    const selectedTapes = getSelectedTapes();
    const countElement = document.getElementById('request-count');
    
    if (countElement) {
      countElement.textContent = selectedTapes.length;
    }
  }
  
  // Export for use in request.js
  window.MixtapeLibrary = {
    getSelectedTapes,
    saveSelectedTapes
  };
})();
