import knowledgeItems from './home-data.js';
import wikiData from './wiki-data.js';

document.addEventListener('DOMContentLoaded', () => {

    const grid = document.getElementById('knowledge-grid');
    if (grid && typeof knowledgeItems !== 'undefined') {
      knowledgeItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'k-card';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <div class="code-block">
            <pre><code>${item.code}</code></pre>
            <button class="copy-btn">Copy</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }


    // Event Delegation for Copy Buttons (so dynamically generated buttons work immediately)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            const button = e.target;
            const codeBlock = button.parentElement.querySelector('code');
            const textToCopy = codeBlock.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.innerText;
                button.innerText = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerText = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                button.innerText = 'Error';
            });
        }
    });

    // Add some simple micro-interactions or entrance animations
    const cards = document.querySelectorAll('.k-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });

    // Wiki Modal Logic
    const wikiBtn = document.getElementById('open-wiki-btn');
    const wikiModal = document.getElementById('wiki-modal');
    if (wikiBtn && wikiModal) {
      // Populate Wiki Data First
      const wikiContainer = document.getElementById('wiki-content-container');
      if (wikiContainer && typeof wikiData !== 'undefined') {
        wikiData.forEach(item => {
          const section = document.createElement('div');
          section.className = 'wiki-section';
          let htmlContent = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          `;
          
          if (item.code) {
             const encodedCode = item.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
             htmlContent += `
               <div class="code-block" style="margin-top: 1rem;">
                 <pre><code>${encodedCode}</code></pre>
                 <button class="copy-btn">Copy</button>
               </div>
             `;
          }
          section.innerHTML = htmlContent;
          wikiContainer.appendChild(section);
        });
      }

      const closeBtn = wikiModal.querySelector('.modal-close');
      
      wikiBtn.addEventListener('click', () => {
        wikiModal.classList.add('open');
        wikiModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scrolling
      });
      
      const closeModal = () => {
        wikiModal.classList.remove('open');
        wikiModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };

      closeBtn.addEventListener('click', closeModal);

      wikiModal.addEventListener('click', (e) => {
        if (e.target === wikiModal) {
          closeModal();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wikiModal.classList.contains('open')) {
          closeModal();
        }
      });
    }
});
