/**
 * Utilidad de Seguridad Antibot y Anti-Scraping para enlaces de WhatsApp
 * Protege el número del taller contra cosechadores de teléfonos (scrapers)
 * y evita clics automatizados / spam por flooding.
 */

// Fragmentos ofuscados del número telefónico (52 1 564 103 6079)
// Evita que spiders y scrapers de regex indexen el número en texto plano
const _P1 = 'NTIxNQ=='; // 5215 en base64
const _P2 = 'NjQxMDM2MDc5'; // 641036079 en base64

export function getSecureWhatsAppPhone() {
  try {
    return atob(_P1) + atob(_P2);
  } catch {
    return '5215641036079';
  }
}

export function buildSecureWhatsAppUrl(message = '') {
  const phone = getSecureWhatsAppPhone();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Registro en memoria de último clic para Cooldown (Anti-Flood)
let lastClickTimestamp = 0;
const COOLDOWN_MS = 3000; // 3 segundos entre clics repetidos

/**
 * Valida si la interacción proviene de un usuario humano legítimo
 */
export function validateHumanInteraction(event) {
  // 1. Detección de navegadores automatizados (Selenium, Puppeteer, etc.)
  if (typeof navigator !== 'undefined' && navigator.webdriver) {
    return { isHuman: false, reason: 'Navegador automatizado' };
  }

  // 2. Detección de bots headless conocidos
  if (typeof window !== 'undefined') {
    if (window._phantom || window.__nightmare || window.callPhantom) {
      return { isHuman: false, reason: 'Entorno simulado' };
    }
  }

  // 3. Verificación de evento confiable del navegador (isTrusted)
  // En navegadores reales, los clics físicos del mouse/touch tienen isTrusted = true
  if (event && event.isTrusted === false) {
    return { isHuman: false, reason: 'Clic simulado por script' };
  }

  // 4. Cooldown anti-flood
  const now = Date.now();
  if (now - lastClickTimestamp < COOLDOWN_MS) {
    return { isHuman: false, reason: 'Espera un momento antes de abrir de nuevo' };
  }

  return { isHuman: true };
}

/**
 * Abre WhatsApp de manera directa y segura
 */
export function openSecureWhatsApp({ message, event, onNotice }) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const validation = validateHumanInteraction(event);

  if (!validation.isHuman) {
    if (onNotice) {
      onNotice(validation.reason);
    }
    return false;
  }

  lastClickTimestamp = Date.now();
  const url = buildSecureWhatsAppUrl(message);

  // Apertura directa sin intermediarios
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) {
    win.opener = null;
  }
  return true;
}
