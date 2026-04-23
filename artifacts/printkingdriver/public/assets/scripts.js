/* PrintKingDriver — interactivity */

(function () {
  // Set active nav based on current path
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  document.querySelectorAll("[data-nav-link]").forEach((el) => {
    const target = el.getAttribute("data-nav-link");
    let active = false;
    if (target === "/" && path === "/") active = true;
    else if (target !== "/" && (path === target || path.startsWith(target + "/"))) active = true;
    if (active) el.classList.add("is-active");
  });

  // === Mobile drawer ===
  const drawer = document.querySelector(".drawer");
  const backdrop = document.querySelector(".drawer-backdrop");
  const drawerOpen = document.querySelector(".nav__menu-trigger");
  const drawerClose = document.querySelector(".drawer__close");
  const closeDrawer = () => {
    drawer?.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
  };
  drawerOpen?.addEventListener("click", () => {
    drawer?.classList.add("is-open");
    backdrop?.classList.add("is-open");
  });
  drawerClose?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  // Mobile explore toggle
  document.querySelector("[data-mobile-explore]")?.addEventListener("click", function () {
    document.querySelector(".drawer__sub")?.classList.toggle("is-open");
    this.classList.toggle("is-open");
  });

  // === Mega menu ===
  const megaWrap = document.querySelector(".mega-wrap");
  const megaTrigger = document.querySelector(".mega-trigger");
  const mega = document.querySelector(".mega");
  let megaTimer = null;
  const openMega = () => {
    if (megaTimer) clearTimeout(megaTimer);
    mega?.classList.add("is-open");
    megaTrigger?.classList.add("is-open");
  };
  const scheduleClose = () => {
    if (megaTimer) clearTimeout(megaTimer);
    megaTimer = setTimeout(() => {
      mega?.classList.remove("is-open");
      megaTrigger?.classList.remove("is-open");
    }, 120);
  };
  megaWrap?.addEventListener("mouseenter", openMega);
  megaWrap?.addEventListener("mouseleave", scheduleClose);
  mega?.addEventListener("mouseenter", openMega);
  mega?.addEventListener("mouseleave", scheduleClose);
  megaTrigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mega?.classList.contains("is-open")) {
      mega.classList.remove("is-open");
      megaTrigger.classList.remove("is-open");
    } else openMega();
  });
  document.addEventListener("click", (e) => {
    if (!megaWrap?.contains(e.target) && !mega?.contains(e.target)) {
      mega?.classList.remove("is-open");
      megaTrigger?.classList.remove("is-open");
    }
  });

  // === Search ===
  const SEARCH_INDEX = [
    { label: "Chipset Driver",        href: "/drivers/chipset",   type: "Driver", keywords: "motherboard mainboard intel amd platform pch southbridge northbridge" },
    { label: "Graphics Driver",       href: "/drivers/graphics",  type: "Driver", keywords: "gpu video card display nvidia amd radeon intel arc geforce rtx gtx vga screen resolution" },
    { label: "Audio Driver",          href: "/drivers/audio",     type: "Driver", keywords: "sound speaker speakers headphone headphones microphone mic realtek hda no sound mute volume music" },
    { label: "Network Driver",        href: "/drivers/network",   type: "Driver", keywords: "wifi wi-fi wireless ethernet lan internet adapter nic connection no internet wireless card" },
    { label: "Storage Controller",    href: "/drivers/storage",   type: "Driver", keywords: "ssd hdd hard drive nvme sata raid disk ahci" },
    { label: "USB Support",           href: "/drivers/usb",       type: "Driver", keywords: "usb port flash drive thumb drive type-c type c usb-c usb3 usb2 not recognized" },
    { label: "Bluetooth Driver",      href: "/drivers/bluetooth", type: "Driver", keywords: "bt wireless airpods earbuds pair pairing bluetooth headset speaker connection" },
    { label: "Input Drivers",         href: "/drivers/input",     type: "Driver", keywords: "keyboard mouse trackpad touchpad gamepad controller hid pointer typing" },
    { label: "Printer Driver",        href: "/drivers/printer",   type: "Driver", keywords: "printing print hp canon epson brother laserjet inkjet deskjet pixma not printing offline queue spooler" },
    { label: "Scanner Support",       href: "/drivers/scanner",   type: "Driver", keywords: "scan scanning twain wia document scanner flatbed hp epson canon all-in-one mfp" },
    { label: "Webcam Driver",         href: "/drivers/webcam",    type: "Driver", keywords: "camera video call zoom teams logitech facetime webcam not working" },
    { label: "BIOS / UEFI",           href: "/drivers/bios",      type: "Driver", keywords: "firmware bios uefi boot post motherboard update flash secure boot" },
    { label: "Security Drivers",      href: "/drivers/security",  type: "Driver", keywords: "tpm trusted platform module fingerprint biometric face windows hello smart card" },
    { label: "Monitor Driver",        href: "/drivers/monitor",   type: "Driver", keywords: "display screen resolution refresh rate hz hdr color profile inf monitor edid" },
    { label: "Home",                  href: "/",                  type: "Page",   keywords: "main start landing front page" },
    { label: "Explore Drivers",       href: "/drivers",           type: "Page",   keywords: "all drivers list browse catalogue catalog directory" },
    { label: "How It Works",          href: "/how-it-works",      type: "Page",   keywords: "guide tutorial install installing update updating download how to fix troubleshoot" },
    { label: "About Guide",           href: "/about",             type: "Page",   keywords: "about us info information mission company" },
    { label: "Contact / Get In Touch", href: "/contact",          type: "Page",   keywords: "support help email phone live chat contact get in touch" },
  ];

  const searchInputs = document.querySelectorAll(".nav__search input");
  searchInputs.forEach((input) => {
    const root = input.closest(".nav__search");
    const results = root.querySelector(".nav__search-results");
    const clear = root.querySelector(".nav__search-clear");
    let activeIdx = 0;
    let matches = [];

    const render = () => {
      const q = input.value.trim().toLowerCase();
      clear?.classList.toggle("is-visible", !!q);
      if (!q) { results.classList.remove("is-open"); results.innerHTML = ""; return; }
      const scored = [];
      for (const it of SEARCH_INDEX) {
        const label = it.label.toLowerCase();
        const kw = (it.keywords || "").toLowerCase();
        let score = 0;
        if (label.startsWith(q)) score = 100;
        else if (label.includes(q)) score = 80;
        else if ((" " + kw + " ").includes(" " + q)) score = 60;
        else if (kw.includes(q)) score = 40;
        if (score > 0) scored.push({ it, score });
      }
      scored.sort((a, b) => b.score - a.score);
      matches = scored.slice(0, 6).map((s) => s.it);
      activeIdx = 0;
      if (matches.length === 0) {
        results.innerHTML = `<div class="nav__search-empty"><div class="empty-msg">No direct matches.</div><button onclick="location.href='/drivers'">Browse all drivers →</button></div>`;
      } else {
        results.innerHTML = `<ul>${matches.map((m, i) => `
          <li><button data-i="${i}" data-href="${m.href}" class="${i === 0 ? 'is-active' : ''}">
            <span class="label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><span>${m.label}</span></span>
            <span class="type">${m.type}</span>
          </button></li>`).join("")}</ul>`;
        results.querySelectorAll("button").forEach((btn) => {
          btn.addEventListener("mouseenter", () => {
            activeIdx = parseInt(btn.dataset.i, 10);
            results.querySelectorAll("button").forEach((b, i) => b.classList.toggle("is-active", i === activeIdx));
          });
          btn.addEventListener("click", () => { window.location.href = btn.dataset.href; });
        });
      }
      results.classList.add("is-open");
    };

    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("keydown", (e) => {
      if (!matches.length) {
        if (e.key === "Enter" && input.value.trim()) { e.preventDefault(); window.location.href = "/drivers"; }
        return;
      }
      if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(matches.length - 1, activeIdx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(0, activeIdx - 1); }
      else if (e.key === "Enter") { e.preventDefault(); window.location.href = matches[activeIdx].href; return; }
      else if (e.key === "Escape") { results.classList.remove("is-open"); return; }
      results.querySelectorAll("button").forEach((b, i) => b.classList.toggle("is-active", i === activeIdx));
    });
    clear?.addEventListener("click", () => { input.value = ""; render(); input.focus(); });
    document.addEventListener("mousedown", (e) => { if (!root.contains(e.target)) results.classList.remove("is-open"); });
  });

  // === Slider (Explore) ===
  const slider = document.querySelector(".slider");
  if (slider) {
    const track = slider.querySelector(".slider__track");
    const dots = slider.querySelectorAll(".slider__dot");
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");
    const cards = track.children;
    let activeIdx = 0;

    const isMobile = () => window.matchMedia("(max-width: 1023px)").matches;
    const scrollToIdx = (i) => {
      if (!isMobile()) return;
      const card = cards[i];
      if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    };
    const updateActive = () => {
      if (!isMobile()) return;
      let nearest = 0, min = Infinity;
      Array.from(cards).forEach((c, i) => {
        const d = Math.abs(c.offsetLeft - track.offsetLeft - track.scrollLeft);
        if (d < min) { min = d; nearest = i; }
      });
      activeIdx = nearest;
      dots.forEach((d, i) => d.classList.toggle("is-active", i === activeIdx));
      if (prev) prev.disabled = activeIdx === 0;
      if (next) next.disabled = activeIdx === cards.length - 1;
    };
    track.addEventListener("scroll", updateActive, { passive: true });
    prev?.addEventListener("click", () => scrollToIdx(Math.max(0, activeIdx - 1)));
    next?.addEventListener("click", () => scrollToIdx(Math.min(cards.length - 1, activeIdx + 1)));
    dots.forEach((dot, i) => dot.addEventListener("click", () => scrollToIdx(i)));
    updateActive();
  }

  // === FAQ accordion ===
  document.querySelectorAll(".faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("is-open");
    });
  });

  // === Contact form ===
  const cf = document.querySelector("form.contact-form");
  if (cf) {
    const setError = (name, msg) => {
      const inp = cf.querySelector(`[name="${name}"]`);
      const errEl = cf.querySelector(`[data-error-for="${name}"]`);
      if (inp) inp.classList.toggle("has-error", !!msg);
      if (errEl) errEl.textContent = msg || "";
    };
    cf.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => setError(el.name, ""));
      el.addEventListener("change", () => setError(el.name, ""));
    });
    cf.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {};
      let ok = true;
      const checks = [
        { n: "fullName",         req: true,  msg: "Full name is required" },
        { n: "email",            req: true,  msg: "Email address is required",
          extra: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Invalid email address" },
        { n: "phone",            req: false },
        { n: "printerModel",     req: true,  msg: "Printer model is required" },
        { n: "operatingSystem",  req: true,  msg: "Please select an operating system" },
        { n: "issueDescription", req: true,  msg: "Description is required",
          extra: (v) => v.length >= 10 ? "" : "Description must be at least 10 characters" },
      ];
      checks.forEach((c) => {
        const inp = cf.querySelector(`[name="${c.n}"]`);
        const val = (inp?.value || "").trim();
        let err = "";
        if (c.req && !val) err = c.msg;
        else if (val && c.extra) err = c.extra(val);
        setError(c.n, err);
        if (err) ok = false;
        data[c.n] = val;
      });
      if (!ok) return;
      console.log("Contact form submission:", data);
      cf.hidden = true;
      const success = document.querySelector(".contact-success");
      if (success) success.hidden = false;
    });
  }

  // Initialize Lucide icons
  if (window.lucide) window.lucide.createIcons();
})();
