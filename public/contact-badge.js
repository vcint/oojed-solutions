// Simple web component for a floating contact badge
class ContactBadge extends HTMLElement {
  connectedCallback() {
    const email = this.getAttribute('email') || 'sales@example.com';
    const phone = this.getAttribute('phone') || '';
    this.innerHTML = `
      <a href="mailto:${email}" class="cbadge">✉️ Email us</a>
      ${phone ? `<a href="tel:${phone}" class="cbadge">📞 Call ${phone}</a>` : ''}
    `;
    const style = document.createElement('style');
    style.textContent = `
      :host { position: fixed; bottom: 16px; right: 16px; display: grid; gap: 8px; z-index: 60; }
      .cbadge { font: 500 14px/1 system-ui, sans-serif; background: #3a66db; color: #fff; padding: 10px 12px; border-radius: 12px; text-decoration: none; box-shadow: 0 6px 20px rgba(0,0,0,.15); }
      .cbadge:hover { transform: translateY(-1px); }
    `;
    this.appendChild(style);
  }
}
customElements.define('contact-badge', ContactBadge);
