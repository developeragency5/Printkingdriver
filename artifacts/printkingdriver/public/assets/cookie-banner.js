(function () {
  'use strict';

  var STORAGE_KEY = 'pkd_cookie_consent_v1';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });

  function applyConsent(state) {
    var update = {
      ad_storage: state === 'all' ? 'granted' : 'denied',
      ad_user_data: state === 'all' ? 'granted' : 'denied',
      ad_personalization: state === 'all' ? 'granted' : 'denied',
      analytics_storage: state === 'all' ? 'granted' : 'denied'
    };
    gtag('consent', 'update', update);
  }

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function writeStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function buildBanner() {
    var wrap = document.createElement('div');
    wrap.className = 'pkd-cookie';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-live', 'polite');
    wrap.setAttribute('aria-label', 'Cookie consent');
    wrap.innerHTML =
      '<div class="pkd-cookie__inner">' +
        '<div class="pkd-cookie__copy">' +
          '<strong class="pkd-cookie__title">Your privacy choices</strong>' +
          '<p class="pkd-cookie__text">We use cookies to keep this site secure and understand how visitors use it. With your consent, our advertising partners may also set cookies. You can accept or reject these at any time. Read our <a href="/privacy">Privacy Policy</a> for full details.</p>' +
        '</div>' +
        '<div class="pkd-cookie__actions">' +
          '<button type="button" class="pkd-cookie__btn pkd-cookie__btn--reject" data-pkd-consent="essential">Reject all</button>' +
          '<button type="button" class="pkd-cookie__btn pkd-cookie__btn--primary" data-pkd-consent="all">Accept all</button>' +
        '</div>' +
      '</div>';

    wrap.addEventListener('click', function (event) {
      var target = event.target.closest('[data-pkd-consent]');
      if (!target) return;
      var choice = target.getAttribute('data-pkd-consent');
      writeStored(choice);
      applyConsent(choice);
      wrap.classList.add('pkd-cookie--leaving');
      setTimeout(function () { wrap.remove(); }, 220);
    });

    return wrap;
  }

  function showPreferences() {
    if (document.querySelector('.pkd-cookie')) return;
    document.body.appendChild(buildBanner());
    requestAnimationFrame(function () {
      var el = document.querySelector('.pkd-cookie');
      if (el) el.classList.add('pkd-cookie--visible');
    });
  }

  function init() {
    var stored = readStored();
    if (stored === 'all' || stored === 'essential') {
      applyConsent(stored);
    } else {
      showPreferences();
    }

    var triggers = document.querySelectorAll('[data-pkd-cookie-open]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function (event) {
        event.preventDefault();
        // Immediately revoke advertising/analytics consent (CCPA "Do Not Sell" semantics)
        // before re-opening the banner so the user can confirm or change.
        applyConsent('essential');
        writeStored('essential');
        showPreferences();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
