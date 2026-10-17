'use strict';

// Resolve the artists' actual local files without replacing them with generated art.
// Files are kept byte-for-byte; fitting is handled by CSS, with no crop or filter.
class ArtBridgeArtwork extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return;
    this.dataset.initialized = 'true';
    const work = this.getAttribute('work');
    if (!['grace-original', 'ezekiel-original', 'collaboration-final'].includes(work)) return;
    const image = document.createElement('img');
    image.alt = this.getAttribute('label') || work;
    image.hidden = true;
    const pending = document.createElement('p');
    pending.className = 'artwork-pending';
    pending.setAttribute('data-i18n', 'artworkPending');
    pending.textContent = window.ArtBridgeI18n?.[document.documentElement.lang]?.artworkPending || 'Artwork file not included in this preview.';
    this.append(image, pending);
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG', 'JPEG', 'WEBP'];
    let index = 0;
    const next = () => {
      if (index < extensions.length) image.src = `assets/${work}.${extensions[index++]}`;
      else this.dataset.state = 'missing';
    };
    image.addEventListener('error', next);
    image.addEventListener('load', () => {
      image.hidden = false;
      pending.remove();
      this.dataset.state = 'loaded';
    });
    next();
  }
}
customElements.define('artbridge-artwork', ArtBridgeArtwork);
