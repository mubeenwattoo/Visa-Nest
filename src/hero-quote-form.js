import { WEB3FORMS_ACCESS_KEY } from "./contact-form-config.js";

const form = document.getElementById("hero-quote-form");
if (!form) {
  /* no hero form on this page */
} else {
  const errEl = document.getElementById("hero-quote-error");
  const okEl = document.getElementById("hero-quote-success");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setBusy = (busy) => {
    if (submitBtn) {
      submitBtn.disabled = busy;
      submitBtn.setAttribute("aria-busy", String(busy));
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!WEB3FORMS_ACCESS_KEY?.trim()) {
      errEl?.removeAttribute("hidden");
      if (errEl) errEl.textContent = "Form is not configured. Add your Web3Forms access key in src/contact-form-config.js.";
      return;
    }

    errEl?.setAttribute("hidden", "");
    okEl?.setAttribute("hidden", "");
    setBusy(true);

    const fd = new FormData(form);
    const fullName = String(fd.get("full_name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const destination = String(fd.get("destination") || "").trim();
    const nationality = String(fd.get("nationality") || "").trim();
    const currentCity = String(fd.get("current_city") || "").trim();

    const message = [
      "Free quote request (hero form)",
      "",
      `Full name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Destination: ${destination}`,
      `Nationality: ${nationality}`,
      `Current city: ${currentCity}`,
    ].join("\n");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: "Visa Nest — Hero quote request",
          name: fullName,
          email,
          phone,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success !== true) {
        throw new Error(
          typeof data.message === "string" ? data.message : "Something went wrong. Please try again."
        );
      }
      okEl?.removeAttribute("hidden");
      form.reset();
    } catch (err) {
      if (errEl) {
        errEl.textContent = err instanceof Error ? err.message : "Submission failed.";
        errEl.removeAttribute("hidden");
      }
    } finally {
      setBusy(false);
    }
  });
}
