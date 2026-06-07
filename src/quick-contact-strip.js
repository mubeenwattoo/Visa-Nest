/**
 * Fixed quick contact: WhatsApp, phone call, and SMS — always visible (no toggle).
 */
const PHONE_E164 = "+447446230755";
const WA_ME = "447446230755";

function mount() {
  if (document.getElementById("visa-nest-quick-contact")) return;

  const root = document.createElement("div");
  root.id = "visa-nest-quick-contact";
  root.setAttribute("role", "group");
  root.setAttribute("aria-label", "Quick contact");
  root.className =
    "pointer-events-auto box-border fixed bottom-3 right-3 z-[80]  flex flex-col items-center gap-1.5 rounded-2xl border-2 border-solid border-primary-yellow bg-white/95 p-2.5 shadow-[0_8px_28px_-10px_rgba(15,23,42,0.28)] sm:bottom-4 sm:right-4";

  const btnBase =
    "box-border inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-0 bg-primary-blue/[0.06] p-0 transition duration-200 hover:scale-105 hover:bg-primary-yellow/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-yellow/70 focus-visible:ring-offset-1 focus-visible:ring-offset-white";

  const btnWhatsApp = `${btnBase} text-[#25D366]`;
  const btnDefault = `${btnBase} text-primary-blue`;

  root.innerHTML = `
    <a href="https://wa.me/${WA_ME}" target="_blank" rel="noopener noreferrer" class="${btnWhatsApp}" aria-label="WhatsApp Visa Nest">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.5 2 2 6.37 2 11.76c0 2.1.68 4.05 1.85 5.64L2.64 22l4.78-1.23A10.16 10.16 0 0 0 12.04 22C17.6 22 22 17.63 22 12.24 22 6.37 17.6 2 12.04 2Zm5.87 14.87c-.25.68-1.45 1.3-2 1.38-.52.08-1.17.12-1.88-.11-.43-.14-.99-.32-1.71-.62-3-.98-4.96-3.46-5.11-3.66-.15-.2-1.22-1.58-1.22-3.02 0-1.44.76-2.15 1.03-2.44.27-.28.58-.35.77-.35.2 0 .39 0 .56.01.18.01.41-.07.64.48.24.56.82 1.93.89 2.08.07.15.12.33.02.52-.1.2-.15.33-.3.5-.15.17-.31.38-.44.51-.15.15-.3.32-.13.63.17.3.75 1.21 1.61 1.96 1.1.95 2.04 1.24 2.34 1.38.3.15.47.13.65-.08.18-.2.74-.86.94-1.16.2-.3.4-.26.67-.16.28.1 1.74.8 2.04.94.3.14.5.21.57.33.08.12.08.71-.17 1.39Z"/></svg>
    </a>
    <a href="tel:${PHONE_E164}" class="${btnDefault}" aria-label="Call Visa Nest">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.2 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11l-.85.85a16 16 0 0 0 6 6l.85-.85a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/></svg>
    </a>
    <a href="sms:${PHONE_E164}" class="${btnDefault}" aria-label="Text Visa Nest (SMS)">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></svg>
    </a>
  `;

  document.body.appendChild(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount, { once: true });
} else {
  mount();
}
