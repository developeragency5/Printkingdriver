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
    { label: "Webcam Driver",         href: "/drivers/webcam",    type: "Driver", keywords: "camera video call zoom teams logitech facetime webcam not working" },
    { label: "BIOS / UEFI",           href: "/drivers/bios",      type: "Driver", keywords: "firmware bios uefi boot post motherboard update flash secure boot" },
    { label: "Security Drivers",      href: "/drivers/security",  type: "Driver", keywords: "tpm trusted platform module fingerprint biometric face PC hello smart card" },
    { label: "Monitor Driver",        href: "/drivers/monitor",   type: "Driver", keywords: "display screen resolution refresh rate hz hdr color profile inf monitor edid" },
    { label: "Home",                  href: "/",                  type: "Page",   keywords: "main start landing front page" },
    { label: "Explore Drivers",       href: "/drivers",           type: "Page",   keywords: "all drivers list browse catalogue catalog directory" },
    { label: "How It Works",          href: "/how-it-works",      type: "Page",   keywords: "guide tutorial set up update updating download how to fix diagnose" },
    { label: "About Guide",           href: "/about",             type: "Page",   keywords: "about us info information mission company" },
    { label: "Contact / Get In Touch", href: "/contact",          type: "Page",   keywords: "support help contact get in touch" },
    { label: "How to Fix the Driver Not Found Error", href: "/fix-driver-not-found-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Corrupted Driver Error", href: "/fix-corrupted-driver-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix Device Not Recognised After Driver Update", href: "/fix-device-not-recognised-after-driver-update", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver That Keeps Removing Itself", href: "/fix-driver-keeps-removing-itself", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix an Outdated Driver That Stops a Device Working", href: "/fix-outdated-driver-stops-device-working", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Conflict Between Devices", href: "/fix-driver-conflict-between-devices", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix Driver Not Compatible With System", href: "/fix-driver-not-compatible-with-system", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Error Causing a System Crash", href: "/fix-driver-error-causing-system-crash", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Error Code Guide", href: "/fix-driver-error-code-guide", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver That Stopped Working After a System Update", href: "/fix-driver-stopped-after-system-update", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Error Slowing a Device", href: "/fix-driver-error-slowing-device", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix the Driver Not Responding Error", href: "/fix-driver-not-responding-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Power State Failure", href: "/fix-driver-power-state-failure", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Timeout Error", href: "/fix-driver-timeout-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Access Violation Error", href: "/fix-driver-access-violation-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Blue Screen Error", href: "/fix-driver-blue-screen-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Signature Error", href: "/fix-driver-signature-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix Driver Entry Point Not Found", href: "/fix-driver-entry-point-not-found", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver Failed to Load Error", href: "/fix-driver-failed-to-load-error", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "How to Fix a Driver That Keeps Showing an Error on Startup", href: "/fix-driver-keeps-showing-error-on-startup", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Slow System Startup: Fix Guide", href: "/fix-driver-causing-slow-system-startup", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Using Too Much CPU: Fix Guide", href: "/fix-driver-using-too-much-cpu", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Using Too Much Memory: Fix Guide", href: "/fix-driver-using-too-much-memory", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Overheat: Fix Guide", href: "/fix-driver-causing-device-overheat", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Slow Internet Speed: Fix Guide", href: "/fix-driver-causing-slow-internet-speed", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Screen Lag or Delay: Fix Guide", href: "/fix-driver-causing-screen-lag", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Audio Delay or Stuttering: Fix Guide", href: "/fix-driver-causing-audio-delay", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Slow File Transfer: Fix Guide", href: "/fix-driver-causing-slow-file-transfer", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Freeze Randomly: Fix Guide", href: "/fix-driver-causing-random-freeze", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Poor Video Performance: Fix Guide", href: "/fix-driver-causing-poor-video-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing High Disk Usage: Fix Guide", href: "/fix-driver-causing-high-disk-usage", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Battery to Drain Fast: Fix Guide", href: "/fix-driver-causing-fast-battery-drain", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Mouse or Cursor Lag: Fix Guide", href: "/fix-driver-causing-mouse-cursor-lag", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Keyboard Input Delay: Fix Guide", href: "/fix-driver-causing-keyboard-input-delay", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Slow Response Time: Fix Guide", href: "/fix-driver-causing-slow-response-time", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Run Slow: Fix Guide", href: "/fix-driver-causing-device-to-run-slow", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Display Flickering: Fix Guide", href: "/fix-driver-causing-display-flickering", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Choppy Performance: Fix Guide", href: "/fix-driver-causing-choppy-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Disconnect Randomly: Fix Guide", href: "/fix-driver-causing-random-disconnect", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing System Slowdown After Update: Fix Guide", href: "/fix-driver-causing-slowdown-after-update", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Background Process Overload: Fix Guide", href: "/fix-driver-causing-background-process-overload", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Perform Below Normal: Fix Guide", href: "/fix-driver-causing-below-normal-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Fan to Run Loudly: Fix Guide", href: "/fix-driver-causing-loud-fan", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Graphics to Render Slowly: Fix Guide", href: "/fix-driver-causing-slow-graphics-rendering", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Network Drops and Slow Speeds: Fix Guide", href: "/fix-driver-causing-network-drops", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Conflict Causing Reduced Performance: Fix Guide", href: "/fix-driver-conflict-causing-reduced-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing USB Device to Perform Slowly: Fix Guide", href: "/fix-driver-causing-slow-usb-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Audio Quality to Drop: Fix Guide", href: "/fix-driver-causing-audio-quality-drop", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing High Latency: Fix Guide", href: "/fix-driver-causing-high-latency", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Screen Resolution to Drop: Fix Guide", href: "/fix-driver-causing-screen-resolution-drop", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Stutter Under Load: Fix Guide", href: "/fix-driver-causing-stutter-under-load", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Intermittent Performance Drops: Fix Guide", href: "/fix-driver-causing-intermittent-performance-drops", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing System Resources to Spike: Fix Guide", href: "/fix-driver-causing-system-resource-spikes", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Slow Wake from Sleep: Fix Guide", href: "/fix-driver-causing-slow-wake-from-sleep", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Lag During Use: Fix Guide", href: "/fix-driver-causing-lag-during-use", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Poor Performance After Restart: Fix Guide", href: "/fix-driver-causing-poor-performance-after-restart", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Reduced Speed on Heavy Tasks: Fix Guide", href: "/fix-driver-causing-reduced-speed-on-heavy-tasks", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Unstable Performance: Fix Guide", href: "/fix-driver-causing-unstable-performance", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Become Unresponsive: Fix Guide", href: "/fix-driver-causing-device-unresponsive", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Overall System Slowdown: Fix Guide", href: "/fix-driver-causing-overall-system-slowdown", type: "Fix", keywords: "error fix troubleshoot resolve solve repair driver issue problem" },
    { label: "Driver Causing Device to Generate Heat Abnormally: Fix Guide", href: "/fix-driver-device-abnormal-heat-generation", type: "Fix", keywords: "device system issue heat hot warm temperature thermal abnormal generation" },
    { label: "Driver Causing Device to Produce Abnormal Output: Fix Guide", href: "/fix-driver-device-abnormal-output", type: "Fix", keywords: "device system issue abnormal output strange unusual signal" },
    { label: "Driver Causing Device to Drain Power Abnormally: Fix Guide", href: "/fix-driver-device-abnormal-power-drain", type: "Fix", keywords: "device system issue power drain battery abnormal energy consumption" },
    { label: "Driver Causing Device to Run Below Expected Speed: Fix Guide", href: "/fix-driver-device-below-expected-speed", type: "Fix", keywords: "device system issue speed slow performance below expected" },
    { label: "Driver Causing Device to Conflict with System: Fix Guide", href: "/fix-driver-device-conflict-with-system", type: "Fix", keywords: "device system issue conflict clash incompatible" },
    { label: "Driver Causing Device to Drop Its Current Task: Fix Guide", href: "/fix-driver-device-dropping-current-task", type: "Fix", keywords: "device system issue drop task interrupted job" },
    { label: "Driver Causing Device to Produce Error on Command: Fix Guide", href: "/fix-driver-device-error-on-command", type: "Fix", keywords: "device system issue error command instruction request" },
    { label: "Driver Causing Device to Fail After Light Use: Fix Guide", href: "/fix-driver-device-failing-after-light-use", type: "Fix", keywords: "device system issue fail failure light use idle" },
    { label: "Driver Causing Device to Fail at Random Times: Fix Guide", href: "/fix-driver-device-failing-at-random-times", type: "Fix", keywords: "device system issue fail random intermittent unpredictable" },
    { label: "Driver Causing Device to Fail on First Use: Fix Guide", href: "/fix-driver-device-failing-on-first-use", type: "Fix", keywords: "device system issue fail first use initial startup" },
    { label: "Driver Causing Device to Fail Under Normal Use: Fix Guide", href: "/fix-driver-device-failing-under-normal-use", type: "Fix", keywords: "device system issue fail normal use everyday" },
    { label: "Driver Causing Device to Ignore System Commands: Fix Guide", href: "/fix-driver-device-ignoring-system-commands", type: "Fix", keywords: "device system issue ignore command unresponsive" },
    { label: "Driver Causing Device Input to Be Ignored: Fix Guide", href: "/fix-driver-device-input-ignored", type: "Fix", keywords: "device system issue input ignored keystroke click" },
    { label: "Driver Causing Device to Lose Its Configuration: Fix Guide", href: "/fix-driver-device-losing-configuration", type: "Fix", keywords: "device system issue configuration lose settings reset" },
    { label: "Driver Causing Device to Lose Power Unexpectedly: Fix Guide", href: "/fix-driver-device-losing-power-unexpectedly", type: "Fix", keywords: "device system issue power lose shut off unexpected" },
    { label: "Driver Causing Device to Lose Saved Data: Fix Guide", href: "/fix-driver-device-losing-saved-data", type: "Fix", keywords: "device system issue data lose saved storage" },
    { label: "Driver Causing Device to Lose Sync with System: Fix Guide", href: "/fix-driver-device-losing-sync-with-system", type: "Fix", keywords: "device system issue sync synchronisation desync" },
    { label: "Driver Causing Device to Not Accept New Commands: Fix Guide", href: "/fix-driver-device-not-accepting-new-commands", type: "Fix", keywords: "device system issue command reject not accepting" },
    { label: "Driver Causing Device to Not Operate at Full Ability: Fix Guide", href: "/fix-driver-device-not-at-full-ability", type: "Fix", keywords: "device system issue capability ability full performance" },
    { label: "Driver Causing Device to Not Complete Its Cycle: Fix Guide", href: "/fix-driver-device-not-completing-cycle", type: "Fix", keywords: "device system issue cycle incomplete unfinished" },
    { label: "Driver Causing Device to Not Complete Tasks: Fix Guide", href: "/fix-driver-device-not-completing-tasks", type: "Fix", keywords: "device system issue task incomplete unfinished" },
    { label: "Driver Causing Device to Not Hold Its State: Fix Guide", href: "/fix-driver-device-not-holding-state", type: "Fix", keywords: "device system issue state hold persistence" },
    { label: "Driver Causing Device to Not Respond to Input: Fix Guide", href: "/fix-driver-device-not-responding-to-input", type: "Fix", keywords: "device system issue input unresponsive frozen" },
    { label: "Driver Causing Device to Not Save Its State: Fix Guide", href: "/fix-driver-device-not-saving-state", type: "Fix", keywords: "device system issue state save persistence memory" },
    { label: "Driver Causing Device Output to Be Inconsistent: Fix Guide", href: "/fix-driver-device-output-inconsistent", type: "Fix", keywords: "device system issue output inconsistent variable" },
    { label: "Driver Causing Device to Reject Valid Commands: Fix Guide", href: "/fix-driver-device-rejecting-valid-commands", type: "Fix", keywords: "device system issue command reject valid" },
    { label: "Driver Causing Device to Generate Repeated Faults: Fix Guide", href: "/fix-driver-device-repeated-faults", type: "Fix", keywords: "device system issue fault repeated recurring" },
    { label: "Driver Causing Device to Respond Incorrectly: Fix Guide", href: "/fix-driver-device-responding-incorrectly", type: "Fix", keywords: "device system issue respond wrong incorrect" },
    { label: "Driver Causing Device to Run at Wrong Speed: Fix Guide", href: "/fix-driver-device-running-at-wrong-speed", type: "Fix", keywords: "device system issue speed wrong incorrect rpm clock" },
    { label: "Driver Causing Device to Run Inconsistently: Fix Guide", href: "/fix-driver-device-running-inconsistently", type: "Fix", keywords: "device system issue inconsistent unstable variable" },
    { label: "Driver Causing Device to Run on Minimum Settings: Fix Guide", href: "/fix-driver-device-running-on-minimum-settings", type: "Fix", keywords: "device system issue minimum settings reduced performance" },
    { label: "Driver Causing Device to Run Without Proper Control: Fix Guide", href: "/fix-driver-device-running-without-proper-control", type: "Fix", keywords: "device system issue control uncontrolled unmanaged" },
    { label: "Driver Causing Device to Send Wrong Signals: Fix Guide", href: "/fix-driver-device-sending-wrong-signals", type: "Fix", keywords: "device system issue signal wrong incorrect transmission" },
    { label: "Driver Causing Device to Underperform: Fix Guide", href: "/fix-driver-device-underperforming", type: "Fix", keywords: "device system issue underperform slow weak" },
    { label: "Driver Causing Device to Produce Wrong Output: Fix Guide", href: "/fix-driver-device-wrong-output", type: "Fix", keywords: "device system issue output wrong incorrect unexpected" },
    { label: "Driver Causing Device to Run with Wrong Settings: Fix Guide", href: "/fix-driver-device-wrong-settings", type: "Fix", keywords: "device system issue settings wrong incorrect configuration" },
    { label: "Driver Causing System Alert to Keep Repeating: Fix Guide", href: "/fix-driver-system-alert-keeps-repeating", type: "Fix", keywords: "device system issue alert notification repeat recurring" },
    { label: "Driver Causing System to Generate Constant Errors: Fix Guide", href: "/fix-driver-system-generating-constant-errors", type: "Fix", keywords: "device system issue error constant continuous" },
    { label: "Driver Causing System to Produce False Errors: Fix Guide", href: "/fix-driver-system-producing-false-errors", type: "Fix", keywords: "device system issue error false phantom spurious" },
    { label: "Driver Causing System to Run Multiple Errors: Fix Guide", href: "/fix-driver-system-running-multiple-errors", type: "Fix", keywords: "device system issue error multiple cascading" },
    { label: "Glossary",            href: "/glossary",   type: "Page", keywords: "terms terminology dictionary definitions vocabulary jargon meaning" },
    { label: "All Pages",           href: "/all-pages",  type: "Page", keywords: "site map list directory all pages browse index" },
    { label: "Sitemap",             href: "/sitemap",    type: "Page", keywords: "site map navigation overview structure" },
    { label: "Privacy Policy",      href: "/privacy",    type: "Page", keywords: "privacy data cookies gdpr personal information policy" },
    { label: "Terms of Service",    href: "/terms",      type: "Page", keywords: "terms conditions agreement legal use service" },
    { label: "Disclaimer",          href: "/disclaimer", type: "Page", keywords: "disclaimer editorial policy fair use brand names" }
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
      const tokens = q.split(/\s+/).filter(Boolean);
      const scored = [];
      for (const it of SEARCH_INDEX) {
        const label = it.label.toLowerCase();
        const kw = (it.keywords || "").toLowerCase();
        const hay = label + " " + kw;
        let score = 0;
        if (label.startsWith(q)) score = 100;
        else if (label.includes(q)) score = 80;
        else if ((" " + kw + " ").includes(" " + q)) score = 60;
        else if (kw.includes(q)) score = 40;
        if (score === 0 && tokens.length > 1) {
          let allMatch = true, partial = 0;
          for (const t of tokens) {
            if (label.startsWith(t)) partial += 30;
            else if (label.includes(t)) partial += 20;
            else if ((" " + kw + " ").includes(" " + t)) partial += 15;
            else if (hay.includes(t)) partial += 10;
            else { allMatch = false; break; }
          }
          if (allMatch) score = partial;
        }
        if (score > 0) scored.push({ it, score });
      }
      scored.sort((a, b) => b.score - a.score);
      matches = scored.slice(0, 6).map((s) => s.it);
      activeIdx = 0;
      if (matches.length === 0) {
        results.innerHTML = `<div class="nav__search-empty"><div class="empty-msg">No direct matches.</div><a href="/drivers" class="nav__search-empty-cta">Browse all drivers →</a></div>`;
      } else {
        results.innerHTML = `<ul>${matches.map((m, i) => `
          <li><a href="${m.href}" data-i="${i}" class="${i === 0 ? 'is-active' : ''}">
            <span class="label"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg><span>${m.label}</span></span>
            <span class="type">${m.type}</span>
          </a></li>`).join("")}</ul>`;
        results.querySelectorAll("a").forEach((a) => {
          a.addEventListener("mouseenter", () => {
            activeIdx = parseInt(a.dataset.i, 10);
            results.querySelectorAll("a").forEach((b, i) => b.classList.toggle("is-active", i === activeIdx));
          });
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
      results.querySelectorAll("a").forEach((b, i) => b.classList.toggle("is-active", i === activeIdx));
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
        { n: "deviceModel",      req: true,  msg: "Device model is required" },
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

  // Initialize Lucide icons (no-op now — icons are precompiled inline at build time)
  if (window.lucide) window.lucide.createIcons();

  // === Instant navigation: prefetch on hover/focus + speculation rules ===
  const prefetched = new Set();
  const prefetch = (url) => {
    if (prefetched.has(url)) return;
    prefetched.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    link.as = "document";
    document.head.appendChild(link);
  };
  const isInternal = (a) => {
    try {
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin) return false;
      if (u.pathname === location.pathname) return false;
      if (a.target === "_blank") return false;
      if (a.hasAttribute("download")) return false;
      return true;
    } catch { return false; }
  };
  document.addEventListener("mouseover", (e) => {
    const a = e.target.closest("a[href]");
    if (a && isInternal(a)) prefetch(a.href);
  }, { passive: true });
  document.addEventListener("focusin", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (a && isInternal(a)) prefetch(a.href);
  });
  document.addEventListener("touchstart", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (a && isInternal(a)) prefetch(a.href);
  }, { passive: true });

  // Smart back-link: keeps the user on a logical "trail" through the site.
  // When the user visits an index/hub page (sitemap, all-pages), it is
  // remembered as their anchor for the rest of the session. Every back-link on
  // every sub-page they visit afterwards then takes them back to that anchor
  // page (e.g. always back to /sitemap), no matter how many hops in between.
  // Visiting the home page clears the anchor and the back-links resume their
  // original behaviour. If no anchor is set, falls back to a referrer-aware
  // label and history.back() click.
  (function () {
    const cur = location.pathname.replace(/\/+$/, "") || "/";
    const ANCHOR_KEY = "pkdBackAnchor";
    const ANCHORS = ["/sitemap", "/all-pages"];
    let store = null;
    try { store = window.sessionStorage; } catch (e) { store = null; }
    if (store) {
      if (ANCHORS.indexOf(cur) !== -1) {
        try { store.setItem(ANCHOR_KEY, cur); } catch (e) {}
      } else if (cur === "/") {
        try { store.removeItem(ANCHOR_KEY); } catch (e) {}
      }
    }
    const links = document.querySelectorAll("a.legal__back, a.sm-back");
    if (!links.length) return;

    const labelMap = {
      "/": "Back to home",
      "/sitemap": "Back to sitemap",
      "/all-pages": "Back to all pages",
      "/drivers": "Back to drivers",
      "/brands": "Back to brands",
      "/about": "Back to about",
      "/how-it-works": "Back to how it works",
      "/contact": "Back to contact",
    };

    function setLabel(a, text) {
      const span = a.querySelector("span");
      if (span) {
        span.textContent = text;
      } else {
        Array.from(a.childNodes).forEach((n) => {
          if (n.nodeType === 3) n.parentNode.removeChild(n);
        });
        a.appendChild(document.createTextNode(" " + text));
      }
    }

    let anchor = null;
    try { anchor = store ? store.getItem(ANCHOR_KEY) : null; } catch (e) { anchor = null; }
    if (anchor && anchor !== cur && ANCHORS.indexOf(anchor) !== -1) {
      const label = labelMap[anchor] || "Back";
      links.forEach((a) => {
        a.setAttribute("href", anchor);
        setLabel(a, label);
      });
      return;
    }

    // No anchor set — use referrer-based label + history.back()
    let ref = null;
    try { ref = document.referrer ? new URL(document.referrer) : null; } catch (e) { ref = null; }
    const sameOrigin = !!(ref && ref.origin === location.origin);
    const refPath = sameOrigin ? (ref.pathname.replace(/\/+$/, "") || "/") : null;
    if (!sameOrigin || refPath === cur || history.length <= 1) return;
    let label = labelMap[refPath];
    if (!label) {
      if (refPath.indexOf("/drivers/") === 0) label = "Back to drivers";
      else if (refPath.indexOf("/brands/") === 0) label = "Back to brands";
      else label = "Back";
    }
    links.forEach((a) => {
      setLabel(a, label);
      a.addEventListener("click", function (e) {
        e.preventDefault();
        history.back();
      });
    });
  })();

  // Speculation Rules API: prefetch on hover (Chrome/Edge) — prefetch only to avoid bfcache conflicts
  if (HTMLScriptElement.supports && HTMLScriptElement.supports("speculationrules")) {
    const rules = document.createElement("script");
    rules.type = "speculationrules";
    rules.textContent = JSON.stringify({
      prefetch: [{ source: "document", where: { and: [
        { href_matches: "/*" },
        { not: { href_matches: "/*.png" } },
        { not: { href_matches: "/*.webp" } },
        { not: { href_matches: "/*.jpg" } },
        { not: { href_matches: "/*.svg" } },
        { not: { selector_matches: "[target=_blank]" } },
        { not: { selector_matches: "[rel~=external]" } },
      ]}, eagerness: "moderate" }],
    });
    document.head.appendChild(rules);
  }
})();
