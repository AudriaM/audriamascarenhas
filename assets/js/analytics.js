(() => {
  'use strict';

  const measurementId = 'G-T80ZBQDXWH';
  const siteRoot = new URL('../../', document.currentScript.src);
  const storageKey = 'audria.analytics.consent';
  const disableKey = 'ga-disable-' + measurementId;
  let consent = readConsent();
  let tagStarted = false;

  function readConsent() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function gtag() {
    window.dataLayer.push(arguments);
  }

  function startAnalytics() {
    window[disableKey] = false;

    if (tagStarted) {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }

    tagStarted = true;
    window.dataLayer = window.dataLayer || [];
    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_domain: 'none',
      cookie_path: siteRoot.pathname
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(tag);
  }

  function applyConsent() {
    if (consent === 'granted') {
      startAnalytics();
      return;
    }

    window[disableKey] = true;
    if (tagStarted) {
      gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    for (const name of ['_ga', '_ga_' + measurementId.slice(2)]) {
      document.cookie = name + '=; Max-Age=0; Path=' + siteRoot.pathname + '; SameSite=Lax';
    }
  }

  const controls = document.createElement('div');
  controls.className = 'analytics-consent';
  controls.innerHTML = `
    <button class="analytics-consent__settings" type="button"
      aria-controls="analytics-consent-panel" aria-expanded="false">Preferências de medição</button>
    <section id="analytics-consent-panel" aria-labelledby="analytics-consent-title" hidden>
      <h2 id="analytics-consent-title">Medição de visitas</h2>
      <p>Com sua permissão, o Google Analytics usa cookies para medir visitas,
        cliques e engajamento, incluindo origem do acesso, dispositivo e região aproximada.
        Você pode mudar sua escolha em Preferências de medição.
        <a href="https://policies.google.com/technologies/partner-sites?hl=pt-BR"
           target="_blank" rel="noopener noreferrer">Como o Google usa esses dados</a>.</p>
      <div class="analytics-consent__actions">
        <button type="button" data-choice="denied">Recusar</button>
        <button type="button" data-choice="granted">Aceitar</button>
      </div>
    </section>`;
  document.body.append(controls);

  const panel = controls.querySelector('section');
  const settings = controls.querySelector('.analytics-consent__settings');

  function showPanel(show) {
    panel.hidden = !show;
    settings.setAttribute('aria-expanded', String(show));
  }

  settings.addEventListener('click', () => showPanel(panel.hidden));
  controls.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
      showPanel(false);
      settings.focus();
    }
  });
  controls.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      consent = button.dataset.choice;
      try {
        localStorage.setItem(storageKey, consent);
      } catch {
        // Apply the choice for the current page if browser storage is unavailable.
      }
      applyConsent();
      showPanel(false);
      settings.focus();
    });
  });

  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      consent = readConsent();
      applyConsent();
      showPanel(consent === null);
    }
  });

  function trackLink(event) {
    if (consent !== 'granted' || !tagStarted || !(event.target instanceof Element)) return;

    const link = event.target.closest('a[href]');
    if (!link || controls.contains(link)) return;

    const url = new URL(link.href, document.baseURI);
    if (url.href.split(/[?#]/, 1)[0] === new URL('contato.html', siteRoot).href) {
      gtag('event', 'contact_click');
    } else if (url.hostname === 'www.linkedin.com' || url.hostname === 'linkedin.com') {
      gtag('event', 'linkedin_click');
    }
  }

  document.addEventListener('click', trackLink, { capture: true });
  document.addEventListener('auxclick', (event) => {
    if (event.button === 1) trackLink(event);
  }, { capture: true });

  showPanel(consent === null);
  applyConsent();
})();
