// request.js - Handles request form generation and email output

(function() {
  'use strict';
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', init);
  
  function init() {
    loadSelectedTapes();
    setupFormHandlers();
  }
  
  // ========================================
  // Local Storage Helpers
  // ========================================
  
  function getSelectedTapesFromStorage() {
    try {
      const data = localStorage.getItem('mixtape_selected_tapes');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading selected tapes:', e);
      return [];
    }
  }
  
  function saveSelectedTapesToStorage(tapes) {
    try {
      localStorage.setItem('mixtape_selected_tapes', JSON.stringify(tapes));
    } catch (e) {
      console.error('Error saving selected tapes:', e);
    }
  }
  
  // ========================================
  // Load Selected Tapes
  // ========================================
  
  function loadSelectedTapes() {
    const selectedTapes = getSelectedTapesFromStorage();
    
    const container = document.getElementById('selected-tapes-list');
    if (!container) return;
    
    if (selectedTapes.length === 0) {
      const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
      container.innerHTML = `<p class="empty-message">No tapes selected. <a href="${baseUrl}/">Browse the catalog</a> to add tapes to your request.</p>`;
      return;
    }
    
    container.innerHTML = selectedTapes.map(tape => `
      <div class="selected-tape-item" data-slug="${tape.slug}">
        <div class="tape-title-row">
          <span><strong>${tape.title}</strong></span>
          <button type="button" class="remove-tape" data-slug="${tape.slug}" title="Remove">×</button>
        </div>
      </div>
    `).join('');
    
    // Setup remove buttons
    container.querySelectorAll('.remove-tape').forEach(btn => {
      btn.addEventListener('click', handleRemoveTape);
    });
  }
  
  function handleRemoveTape(event) {
    const slug = event.target.dataset.slug;
    
    let selectedTapes = getSelectedTapesFromStorage();
    selectedTapes = selectedTapes.filter(tape => tape.slug !== slug);
    saveSelectedTapesToStorage(selectedTapes);
    
    loadSelectedTapes();
  }
  
  // ========================================
  // Form Handlers
  // ========================================
  
  function setupFormHandlers() {
    const generateBtn = document.getElementById('generate-request');
    const copyBtn = document.getElementById('copy-output');
    const editBtn = document.getElementById('edit-request');
    
    if (generateBtn) {
      generateBtn.addEventListener('click', generateRequest);
    }
    
    if (copyBtn) {
      copyBtn.addEventListener('click', copyToClipboard);
    }
    
    if (editBtn) {
      editBtn.addEventListener('click', editRequest);
    }
  }
  
  function generateRequest() {
    // Validate required fields
    const name = document.getElementById('requester-name').value.trim();
    const email = document.getElementById('requester-email').value.trim();
    const address = document.getElementById('return-address').value.trim();
    
    if (!name || !email || !address) {
      alert('Please fill in all required fields (Name, Email, and Return Address).');
      return;
    }
    
    // Build the request text
    const requestText = buildRequestText();
    
    // Display output
    const outputSection = document.getElementById('output-section');
    const outputText = document.getElementById('output-text');
    const formContainer = document.querySelector('.request-form-container');
    const openEmailBtn = document.getElementById('open-email');
    
    // Hide only the form, not the entire container
    const form = document.getElementById('request-form');
    if (form) {
      form.style.display = 'none';
    }
    
    // Set the output text
    if (outputText) {
      outputText.textContent = requestText;
    }
    
    // Show output section
    if (outputSection) {
      outputSection.style.display = 'block';
      // Scroll after brief delay to ensure layout is updated
      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
    
    // Update mailto link
    if (openEmailBtn) {
      const subject = encodeURIComponent('Mixtape Request from ' + name);
      const body = encodeURIComponent(requestText);
      const ownerEmail = openEmailBtn.href.match(/mailto:([^?]+)/)?.[1] || '';
      openEmailBtn.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    }
  }
  
  function buildRequestText() {
    const selectedTapes = getSelectedTapesFromStorage();
    
    // Get form values
    const name = document.getElementById('requester-name').value.trim();
    const email = document.getElementById('requester-email').value.trim();
    const address = document.getElementById('return-address').value.trim();
    const notes = document.getElementById('additional-notes').value.trim();
    const requesterSkills = document.getElementById('requester-skills')?.value.trim() || '';

    const requestTapeTypeSelect = document.getElementById('request-tape-type');
    const requestDolbySelect = document.getElementById('request-dolby');
    const requestTapeType = requestTapeTypeSelect?.value || '';
    const requestDolby = requestDolbySelect?.value || '';
    
    // Custom tape request
    const customLength = document.getElementById('custom-length').value;
    const customGenres = Array.from(document.querySelectorAll('input[name="custom-genre"]:checked'))
      .map(cb => cb.value);
    const customInspiration = document.getElementById('custom-inspiration').value.trim();
    
    // Build the email text
    let text = '='.repeat(60) + '\n';
    text += 'MIXTAPE REQUEST\n';
    text += '='.repeat(60) + '\n\n';
    
    text += 'FROM:\n';
    text += `  Name: ${name}\n`;
    text += `  Email: ${email}\n\n`;
    
    text += 'RETURN ADDRESS:\n';
    text += address.split('\n').map(line => `  ${line}`).join('\n') + '\n\n';
    
    text += '-'.repeat(60) + '\n\n';
    
    // Selected tapes from catalog
    if (selectedTapes.length > 0) {
      text += 'REQUESTED TAPES FROM CATALOG:\n\n';
      selectedTapes.forEach((tape, index) => {
        text += `  ${index + 1}. ${tape.title}\n`;
      });
      text += '\n' + '-'.repeat(60) + '\n\n';
    }
    
    // Custom tape request
    if (customLength || customGenres.length > 0 || customInspiration) {
      text += 'CUSTOM TAPE REQUEST:\n\n';
      
      if (customLength) {
        text += `  Preferred Length: ${customLength}\n`;
      }
      
      if (customGenres.length > 0) {
        text += `  Genres: ${customGenres.join(', ')}\n`;
      }
      
      if (customInspiration) {
        text += `  Inspiration/Notes:\n`;
        text += customInspiration.split('\n').map(line => `    ${line}`).join('\n') + '\n';
      }
      
      text += '\n' + '-'.repeat(60) + '\n\n';
    }
    
    // Global format preferences
    text += 'FORMAT PREFERENCES (APPLIES TO ALL REQUESTS):\n\n';
    text += `  Preferred Format: ${requestTapeType ? requestTapeTypeSelect.options[requestTapeTypeSelect.selectedIndex].text : 'No preference'}\n`;
    text += `  Dolby NR: ${requestDolby ? requestDolbySelect.options[requestDolbySelect.selectedIndex].text : 'No preference'}\n`;
    text += '\n' + '-'.repeat(60) + '\n\n';

    if (requesterSkills) {
      text += 'YOUR GENRES / SPECIALIZATIONS:\n\n';
      text += requesterSkills.split('\n').map(line => `  ${line}`).join('\n') + '\n\n';
      text += '-'.repeat(60) + '\n\n';
    }
    
    // Additional notes
    if (notes) {
      text += 'ADDITIONAL NOTES:\n\n';
      text += notes.split('\n').map(line => `  ${line}`).join('\n') + '\n\n';
      text += '='.repeat(60) + '\n';
    } else {
      text += '='.repeat(60) + '\n';
    }
    
    return text;
  }
  
  function copyToClipboard() {
    const outputText = document.getElementById('output-text');
    if (!outputText) return;
    
    const text = outputText.textContent;
    
    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showCopyFeedback();
      }).catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }
  
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showCopyFeedback();
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('Failed to copy. Please select and copy the text manually.');
    }
    
    document.body.removeChild(textarea);
  }
  
  function showCopyFeedback() {
    const copyBtn = document.getElementById('copy-output');
    if (!copyBtn) return;
    
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.backgroundColor = '#2ecc71';
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = '';
    }, 2000);
  }
  
  function editRequest() {
    const outputSection = document.getElementById('output-section');
    const form = document.getElementById('request-form');
    
    if (outputSection) {
      outputSection.style.display = 'none';
    }
    
    if (form) {
      form.style.display = 'block';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
})();
