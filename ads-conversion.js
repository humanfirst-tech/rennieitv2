/* Paid-search conversion hooks.
   When Google Ads/Google tag is configured, replace the placeholder IDs below
   with the conversion IDs supplied by Google Ads. The pages work without them. */
const GOOGLE_ADS_SEND_TO = '';

const toggle = document.querySelector('.toggle');
const nav = document.querySelector('.navlinks');
if (toggle && nav) {
  toggle.onclick = () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  };
  nav.querySelectorAll('a').forEach(a => a.onclick = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', e => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.querySelectorAll('.ad-conversion').forEach(link => {
  link.addEventListener('click', () => {
    const label = link.dataset.conversion || 'ad_contact';
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', { method: link.href.startsWith('tel:') ? 'phone' : 'email', lead_source: label });
      if (GOOGLE_ADS_SEND_TO) window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_SEND_TO });
    }
  });
});
