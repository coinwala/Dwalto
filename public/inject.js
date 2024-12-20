(function() {
    // Prevent multiple injections
    if (window.hyperWalletInjected) return;
    window.hyperWalletInjected = true;
  
    // Types for TypeScript (will be stripped in production)
    /** @typedef {Object} PaymentDetails
     * @property {string} amount
     * @property {string} recipient
     */
  
    /** @type {(details: PaymentDetails) => void} */
    function showPaymentModal(details) {
      const modal = document.createElement('div');
      modal.className = 'coinwala-modal';
      modal.innerHTML = `
        <div class="coinwala-modal-content">
          <h3>Send Payment</h3>
          <p>Amount: ${details.amount}</p>
          <p>To: ${details.recipient}</p>
          <button class="coinwala-pay-button">Confirm Payment</button>
        </div>
      `;
  
      document.body.appendChild(modal);
  
      // Handle payment confirmation
      modal.querySelector('.coinwala-pay-button').addEventListener('click', () => {
        // Implement payment logic
        modal.remove();
      });
    }
  
    function enhancePaymentLinks() {
      // Find payment links
      const links = document.querySelectorAll('a[href*="coinwala.cash/pay"]');
      
      links.forEach(link => {
        // Skip if already enhanced
        if (link.dataset.enhanced) return;
        link.dataset.enhanced = 'true';
  
        // Create payment button
        const button = document.createElement('button');
        button.className = 'coinwala-pay-button';
        button.textContent = 'Pay with Coinwala';
        
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Extract payment details from URL
          const url = new URL(link.href);
          const params = new URLSearchParams(url.search);
          
          showPaymentModal({
            amount: params.get('amount') || '0',
            recipient: params.get('recipient') || ''
          });
        });
        
        // Add button after link
        link.parentNode.insertBefore(button, link.nextSibling);
      });
    }
  
    // Watch for new content
    const observer = new MutationObserver((mutations) => {
      enhancePaymentLinks();
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .coinwala-pay-button {
        background: #0066ff;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 4px 8px;
        margin-left: 8px;
        cursor: pointer;
        font-size: 14px;
      }
  
      .coinwala-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
      }
  
      .coinwala-modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        min-width: 300px;
      }
    `;
    document.head.appendChild(styles);
  
    // Initial enhancement
    enhancePaymentLinks();
  })();