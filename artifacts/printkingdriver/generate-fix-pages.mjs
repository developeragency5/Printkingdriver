import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

const NAV_HTML = fs.readFileSync(path.join(PUBLIC, 'drivers', 'chipset.html'), 'utf8')
  .match(/<nav class="nav">[\s\S]*?<\/nav>\s*\n\s*<div class="drawer-backdrop">[\s\S]*?<\/aside>/)[0];
const FOOTER_HTML = fs.readFileSync(path.join(PUBLIC, 'drivers', 'chipset.html'), 'utf8')
  .match(/<footer class="footer">[\s\S]*?<\/footer>\s*<script src="\/assets\/scripts\.min\.js"[^>]*><\/script>\s*<script src="\/assets\/cookie-banner\.min\.js"[^>]*><\/script>/)[0];

const SVG_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-12" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>';
const SVG_BACK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-14" aria-hidden="true"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>';
const SVG_WRENCH = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-32" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>';

function liChecked(text) {
  return `<li><span class="detail-list__bullet">${SVG_CHECK}</span><span>${text}</span></li>`;
}

function buildPage(p) {
  const url = `https://www.printkingdriver.com/${p.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.printkingdriver.com/#organization",
        "name": "PrintKingDriver",
        "url": "https://www.printkingdriver.com/",
        "email": "support@printkingdriver.com",
        "logo": { "@type": "ImageObject", "url": "https://www.printkingdriver.com/assets/images/logo-crown.png" }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.printkingdriver.com/#website",
        "url": "https://www.printkingdriver.com/",
        "name": "PrintKingDriver",
        "publisher": { "@id": "https://www.printkingdriver.com/#organization" },
        "inLanguage": "en-GB"
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        "url": url,
        "name": `${p.title} | PrintKingDriver`,
        "description": p.metaDesc,
        "isPartOf": { "@id": "https://www.printkingdriver.com/#website" },
        "about": { "@id": "https://www.printkingdriver.com/#organization" },
        "inLanguage": "en-GB"
      },
      {
        "@type": "HowTo",
        "name": p.title,
        "description": p.metaDesc,
        "step": p.steps.map((s, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": s.name,
          "text": s.text
        }))
      }
    ]
  };

  return `<!doctype html>
 <html lang="en">
 <head>
 <meta charset="UTF-8" />
 <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
 <title>${p.title} | PrintKingDriver</title>
 <meta name="description" content="${p.metaDesc}" />
 <link rel="icon" type="image/png" href="/favicon.png" />
 <meta property="og:title" content="${p.title} | PrintKingDriver" />
 <meta property="og:description" content="${p.metaDesc}" />
 <meta property="og:image" content="/opengraph.jpg" />
 <meta property="og:type" content="article" />
 <meta name="twitter:card" content="summary_large_image" />
 <link rel="canonical" href="${url}" />
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
 <link rel="stylesheet" href="/assets/styles.min.css" />
 <script type="application/ld+json">${JSON.stringify(ld)}</script>
 <script>
 window.dataLayer = window.dataLayer || [];
 function gtag(){dataLayer.push(arguments);}
 gtag('consent', 'default', {
 ad_storage: 'denied',
 ad_user_data: 'denied',
 ad_personalization: 'denied',
 analytics_storage: 'denied',
 functionality_storage: 'granted',
 security_storage: 'granted',
 wait_for_update: 500
 });
 window._uetq = window._uetq || [];
 </script>
 </head>
 <body>

${NAV_HTML}
 <main>

 <div class="detail-bg cat-essential">
 <div class="container u-max-980">
 <a href="/" class="legal__back">${SVG_BACK} Back to home</a>

 <header class="detail-head">
 <div class="detail-head__icon cat-icon">${SVG_WRENCH}</div>
 <div>
 <div class="eyebrow">Error Fix Guide</div>
 <h1>${p.h1}</h1>
 <p>${p.byline}</p>
 </div>
 </header>

 <section class="detail-card">
 <h2>What This Error Means</h2>
 <p>${p.intro}</p>
 </section>

 <section class="detail-card">
 <h2>Step-by-Step Fix</h2>
 <p class="u-mb-16">Work through the steps below in order. Most readers find the issue clears within the first three or four checks; the later steps are for the cases that need a closer look.</p>
 <ul class="detail-list">
${p.steps.map((s, i) => liChecked(`<strong>Step ${i + 1} — ${s.name}.</strong> ${s.text}`)).join('\n')}
 </ul>
 </section>

 <section class="detail-card detail-card--accent">
 <h2>Why This Happens</h2>
 <p>${p.why}</p>
 </section>

 <section class="detail-card">
 <h2>Common Symptoms</h2>
 <p class="u-mb-16">${p.symptomsIntro}</p>
 <ul class="detail-list">
${p.symptoms.map(s => liChecked(s)).join('\n')}
 </ul>
 </section>

 <section class="detail-card">
 <h2>Quick Tips</h2>
 <p class="u-mb-16">${p.tipsIntro}</p>
 <ul class="detail-list">
${p.tips.map(t => liChecked(t)).join('\n')}
 </ul>
 </section>

 <section class="detail-card">
 <h2>In Summary</h2>
 <p>${p.summary}</p>
 </section>

 </div>
 </div>
 </main>

${FOOTER_HTML}
 </body>
 </html>`;
}

const PAGES = [
  {
    slug: 'fix-driver-not-found-error',
    title: '"Driver Not Found" Error: Fix Guide',
    metaDesc: 'A "driver not found" error means the operating system cannot match a piece of hardware to its driver software. Use this fix guide to resolve it.',
    h1: '"Driver Not Found" Error: Fix Guide',
    byline: 'Resolve the "driver not found" message and restore normal device behaviour with a calm, step-by-step approach.',
    intro: 'A "driver not found" message appears when the operating system tries to talk to a piece of hardware but cannot locate the matching driver software. The hardware itself is usually healthy — it is the software bridge between the hardware and the operating system that has gone missing or become unregistered. Fixing this error is normally straightforward once the cause is narrowed down. The steps below walk through the safest approach in the order most readers should try them.',
    steps: [
      { name: 'Note the exact wording', text: 'Write down the precise error message and the device name shown beside it. The wording usually points at one specific component, which makes the rest of the fix far quicker.' },
      { name: 'Reboot once', text: 'Restart the system before changing anything. Many missing-driver entries are temporary registry caches that clear themselves automatically after a clean restart and a fresh boot.' },
      { name: 'Re-scan the hardware list', text: 'Open the operating system\'s hardware list and confirm the device is still detected. If it is missing entirely, the issue is more likely a loose connection than a driver fault.' },
      { name: 'Try a second user profile', text: 'Sign in with a different user account or boot mode and see if the same device works. If it does, the driver is healthy and the personal profile is interfering.' },
      { name: 'Refresh the device entries', text: 'Allow the operating system to scan for hardware changes. This forces it to re-enumerate every connected device and rebind any driver entries that became orphaned during a previous session.' },
      { name: 'Apply pending system updates', text: 'Check whether any system updates are waiting in the queue. A pending update often contains the driver fix and resolves the message automatically once the update has been applied.' }
    ],
    why: 'This message appears when the operating system has a record of a device but no software entry to bind to it. Common reasons include a half-finished system update, a device that was added before the matching driver package reached the system, a profile mismatch between the user and system stores, or a registry entry that was cleared during a routine cleanup. None of these mean the hardware has failed — almost every "not found" message is a software-side mismatch that can be resolved without touching the device itself.',
    symptomsIntro: 'The first sign is usually a small warning marker next to the affected device in the operating system\'s hardware list. Other typical clues to watch for include the following.',
    symptoms: [
      'The device appears under a generic "other devices" group rather than its proper category.',
      'A pop-up notification repeats after every reboot, even when the device is unused.',
      'The same device works normally on another machine but not on this one.',
      'A related setting page shows the device greyed out with no controls available.'
    ],
    tipsIntro: 'Before spending time on deeper checks, run through these short reminders — they catch the majority of cases on the first try.',
    tips: [
      'Always note the exact error wording — it is the fastest route to a precise answer.',
      'Reboot once before any other action; it solves a surprising share of "not found" reports.',
      'Avoid running multiple repair tools at once — they can cancel each other\'s changes.',
      'Keep the operating system fully patched, since most missing-driver fixes ship through normal update channels.'
    ],
    summary: 'A "driver not found" error is almost always a software bookkeeping problem rather than a hardware fault. By noting the exact wording, rebooting once, refreshing the hardware list and letting the operating system finish any pending updates, the missing entry usually returns on its own. If the device is still not recognised after these steps, it is worth confirming the physical connection and trying the device on another account before assuming a deeper fault.'
  },
  {
    slug: 'fix-corrupted-driver-error',
    title: 'Corrupted or Damaged Driver Error: Fix Guide',
    metaDesc: 'A corrupted or damaged driver error means the driver file is unreadable. Use this guide to recover stability without changing any installed software.',
    h1: 'Corrupted or Damaged Driver Error: Fix Guide',
    byline: 'A clear path back to a stable system when a driver file has been flagged as damaged or unreadable.',
    intro: 'A corrupted or damaged driver error means the operating system has tried to read a driver file and found that part of it is missing, unreadable or signed incorrectly. The hardware behind it is normally fine — the message is a warning that the software layer has been disturbed. This guide walks through the calmest way to recover, in the order most readers should follow. None of the steps require altering any installed software; they only ask the operating system to repair its own bookkeeping.',
    steps: [
      { name: 'Capture the error details', text: 'Note the full error wording and the file or device name that is mentioned. This information speeds up every later step and prevents guessing about which driver was affected.' },
      { name: 'Reboot the system', text: 'Restart the device fully. A clean boot lets the operating system reload its drivers from scratch, which clears short-lived corruption caused by an interrupted session.' },
      { name: 'Run the built-in repair check', text: 'Most operating systems include a built-in file integrity checker. Let it run to completion and review the report; it will list any system files it has been able to repair on its own.' },
      { name: 'Review recent system events', text: 'Open the operating system\'s event log and look at the period just before the error first appeared. A power loss, forced shutdown or interrupted update is often visible there.' },
      { name: 'Check storage health', text: 'A failing storage drive can corrupt driver files repeatedly. Run the built-in disk health check; if errors are reported, address the storage issue before doing anything else.' },
      { name: 'Apply the latest system updates', text: 'Allow the operating system to fetch and apply any waiting updates. These usually include refreshed copies of common drivers and replace damaged files automatically.' }
    ],
    why: 'A driver file becomes corrupted when something interrupts how the file is written or read. Sudden power loss during an update, a forced shutdown, a struggling storage drive, or a clash between two background services can each leave a driver in a partially written state. Security tools can also quarantine part of a driver if they suspect tampering, which produces the same symptom. The hardware itself is rarely involved — the message is the operating system telling you that the software it relies on for that device is no longer trustworthy and needs refreshing.',
    symptomsIntro: 'The signs of a corrupted driver tend to be loud rather than subtle. The most common patterns are listed below.',
    symptoms: [
      'A warning marker appears beside one device in the operating system\'s hardware list.',
      'The device opens and closes repeatedly, or becomes unavailable a few seconds after waking up.',
      'A short error pop-up appears on every boot, even before any application is opened.',
      'Related settings pages show partial information or refuse to load at all.'
    ],
    tipsIntro: 'A few short habits keep this issue from coming back after the immediate fix is in place.',
    tips: [
      'Avoid forcing a shutdown during an update — interrupted writes are the leading cause of corruption.',
      'Keep at least 10% of the storage drive free so the system can stage updates safely.',
      'Run a regular health check on the main storage drive, especially on older devices.',
      'Allow the operating system to complete its background maintenance tasks rather than cancelling them.'
    ],
    summary: 'A corrupted driver error is usually a recoverable software problem rather than a hardware failure. Capturing the exact wording, rebooting, running the built-in repair check, reviewing recent events and confirming storage health are enough to resolve most cases. If the same error keeps returning even after the operating system has refreshed its files, the underlying storage drive is the most likely culprit and deserves a closer look before anything else is changed.'
  },
  {
    slug: 'fix-device-not-recognised-after-driver-update',
    title: 'Device Not Recognised After a Driver Update: Fix Guide',
    metaDesc: 'When a device disappears after a driver update, the issue is usually configuration rather than hardware. Use this guide to bring it back.',
    h1: 'Device Not Recognised After a Driver Update: Fix Guide',
    byline: 'Recover a device that has gone quiet straight after a driver update finished applying.',
    intro: 'It is unsettling when a device that worked moments ago suddenly disappears after a driver update completes. In almost every case the device itself is fine — the update has either changed a configuration value, paused a background service, or left a temporary state that needs to be cleared. The steps below walk through the safest way to bring the device back without altering any installed software, starting with the simplest checks first.',
    steps: [
      { name: 'Wait one full minute', text: 'Some updates take up to a minute to finish their final binding step. Wait quietly and watch the hardware list; the device often reappears on its own once the system finishes the handover.' },
      { name: 'Reboot the system once', text: 'Restart the device fully. A clean boot allows the operating system to load the new driver from a fresh state and resolves a large share of post-update recognition issues.' },
      { name: 'Check the connection', text: 'Confirm that any cable, dock or wireless link is still healthy. Sometimes an update changes a power profile and a borderline cable that was tolerated before now drops the connection entirely.' },
      { name: 'Refresh the hardware list', text: 'Open the operating system\'s hardware list and ask it to scan for changes. This forces a fresh enumeration and is often enough to bind the new driver to the right device.' },
      { name: 'Review the update history', text: 'Open the operating system\'s update log and confirm whether the driver update finished cleanly or stopped partway through. A partial update leaves the device in an in-between state.' },
      { name: 'Use the built-in rollback option', text: 'If the device is still missing, use the operating system\'s built-in option to return the driver to its previous working version.' }
    ],
    why: 'A driver update changes the small piece of software that translates between the operating system and a device. If the new version expects the device to behave slightly differently, or if the matching service has not restarted yet, the operating system can lose track of the device for a short period. Updates can also reset preferences such as power management, sleep behaviour or signing rules, any of which can stop a previously friendly device from being recognised. None of this means the device has failed; it simply means the connection has shifted and needs to be re-established.',
    symptomsIntro: 'A device that has gone missing after an update tends to leave a fairly distinctive trail. Look for the patterns below to confirm the cause.',
    symptoms: [
      'The device worked normally up until the moment the update completed.',
      'Other devices on the same connection remain healthy, but the affected one has vanished.',
      'A short balloon notification confirms the update succeeded, even though the device is now silent.',
      'Replugging the device or toggling its power has no effect on its presence in the hardware list.'
    ],
    tipsIntro: 'A few small habits make post-update recognition issues much easier to manage when they appear.',
    tips: [
      'Always reboot once after any driver update, even if the system does not insist on it.',
      'Keep a note of the date and version of the previous working driver, as a safety reference.',
      'Avoid running other heavy tasks while a driver update is being applied.',
      'Allow the operating system to finish all of its post-update background work before touching the device again.'
    ],
    summary: 'A device going missing immediately after a driver update is almost always a configuration hiccup rather than a hardware problem. Waiting briefly, rebooting, confirming the connection, refreshing the hardware list and reviewing the update history are usually enough to bring the device back. If none of those help, the operating system\'s built-in rollback returns the driver to its previous working version with a single click and restores normal behaviour.'
  },
  {
    slug: 'fix-driver-keeps-removing-itself',
    title: 'Driver Keeps Removing Itself: Fix Guide',
    metaDesc: 'When a driver keeps removing itself, the cause is usually a setting or service rather than the driver. Use this guide to make the fix stick.',
    h1: 'Driver Keeps Removing Itself: Fix Guide',
    byline: 'Stop a driver from quietly vanishing after every reboot or sign-in with a focused, root-cause approach.',
    intro: 'A driver that keeps removing itself is one of the more frustrating patterns to see. Each time the system starts, the device appears briefly, then the driver vanishes and the device falls silent again. The cause is rarely the driver itself — it is almost always a setting, a service or a recovery rule that is undoing the change in the background. The steps below walk through the most common reasons in the order most readers should explore them.',
    steps: [
      { name: 'Confirm the timing', text: 'Note when the driver disappears: at boot, at sign-in, after sleep, or at a fixed time. The timing tells you which background system to look at first and saves a great deal of guesswork.' },
      { name: 'Check for a recovery rule', text: 'Open the operating system\'s recovery and reset settings. A scheduled refresh or "return to a clean state" rule will undo any new driver entries every time the system starts.' },
      { name: 'Review profile policies', text: 'On a managed device, a profile policy from work or school can quietly remove drivers it does not recognise. Review the active policies and confirm whether the affected device is on an approved list.' },
      { name: 'Inspect the security log', text: 'Open the security log and look for entries around the same time the driver vanishes. A protection rule may be flagging the file as untrusted and removing it as a precaution.' },
      { name: 'Re-scan the hardware list', text: 'Ask the operating system to scan for hardware changes. If the device reappears each time you scan but disappears again after a reboot, the cause is firmly on the system side, not the device.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Updates often refresh the underlying recovery and policy rules, and that alone is enough to stop a previously persistent removal.' }
    ],
    why: 'Drivers do not normally remove themselves on their own — something else is asking the operating system to take them away. Common causes include a system reset rule that returns the device to a known state every boot, a managed profile that only allows approved drivers, a security tool that quarantines anything it does not recognise, or an interrupted update that left the driver in a half-applied state. Each of these is a configuration question rather than a hardware fault, which is why simply refreshing the driver does not stop the loop. Finding the rule that is undoing the change is the only lasting fix.',
    symptomsIntro: 'The pattern is usually predictable, which makes diagnosis easier. Look for any of the signs below.',
    symptoms: [
      'The device works briefly, then vanishes from the hardware list a short time later.',
      'A warning marker appears next to the device immediately after every sign-in.',
      'The same fix has been applied more than once, only for the issue to return on the next reboot.',
      'Other devices remain healthy, while one specific component is repeatedly affected.'
    ],
    tipsIntro: 'These short reminders often shorten the path to a permanent fix.',
    tips: [
      'Look at timing first — when a driver vanishes is more useful than how it vanishes.',
      'Always check whether the device is on a managed profile before changing local settings.',
      'Review the security log even if no warnings have been displayed visibly.',
      'Avoid chasing the symptom with repeated refreshes; find the rule that is undoing the change.'
    ],
    summary: 'A driver that keeps removing itself is almost always being undone by another part of the system rather than failing on its own. Confirming the timing, reviewing recovery rules, profile policies and security logs and applying any pending updates usually identifies the culprit. Once the underlying rule is adjusted, the driver stays in place for good and the device behaves normally from then on without needing any further intervention.'
  },
  {
    slug: 'fix-outdated-driver-stops-device-working',
    title: 'Outdated Driver Causing a Device to Stop Working: Fix Guide',
    metaDesc: 'An outdated driver can leave a device unable to keep up with system changes. Use this guide to confirm the cause and restore normal behaviour.',
    h1: 'Outdated Driver Causing a Device to Stop Working: Fix Guide',
    byline: 'A measured way to confirm whether an outdated driver is the real cause and to bring the device back to life.',
    intro: 'When a device suddenly stops working, an outdated driver is one of the most common explanations. The hardware itself has not changed, but the system around it has — a recent operating-system update, a new feature or a changed security rule may now expect the driver to behave in a way the older version simply cannot. The steps below help confirm whether age is really the cause and walk through the calmest way to refresh the situation without touching any installed software.',
    steps: [
      { name: 'Confirm the affected device', text: 'Identify exactly which device has stopped responding. The error message, the hardware list and a short test usually narrow it down quickly and prevent unrelated changes elsewhere.' },
      { name: 'Note the current driver date', text: 'Open the device\'s details and read the current driver date. If it is several years old while the rest of the system is current, an age mismatch is a strong suspect.' },
      { name: 'Check recent system changes', text: 'Look at the operating system\'s update history. A major feature update applied just before the device went quiet is a strong sign that the driver and system are now out of step.' },
      { name: 'Allow the system to refresh', text: 'Ask the operating system to check for updates. Many drivers are delivered through this channel automatically and a single update cycle often pulls down a refreshed version.' },
      { name: 'Reboot the system', text: 'Restart the device fully so any newly delivered driver has a chance to load from a clean state. Without a reboot a refreshed driver may sit waiting and not take effect.' },
      { name: 'Try the device on another account', text: 'If the device still does not respond, sign in with a different user profile to rule out a per-user setting. If it works there, the issue is profile related.' }
    ],
    why: 'Operating systems evolve constantly. New security rules, new power-management profiles and new feature updates change the small contract between the system and each device. A driver that worked perfectly two years ago may simply not understand the new rules of the road. The device has not aged — the environment around it has. This is why an "old" driver often fails right after a feature update, not gradually over time. Refreshing the driver to a version that knows about the new behaviour usually resolves the issue without any further action.',
    symptomsIntro: 'Outdated-driver issues tend to share a few unmistakable patterns. Watch for the signs listed below.',
    symptoms: [
      'The device worked normally until a recent system feature update arrived.',
      'A warning marker appears beside the device with a generic "this device cannot start" message.',
      'Settings pages for the device load slowly or show fewer options than before.',
      'Other newer devices on the same machine continue to behave normally throughout.'
    ],
    tipsIntro: 'These short habits help avoid the same situation in future and shorten the recovery time when it does happen.',
    tips: [
      'Allow the operating system to apply updates regularly rather than postponing them for long periods.',
      'Note the driver date for any critical device once a year as a quick health check.',
      'After a major feature update, give the system a day to settle before judging whether something is wrong.',
      'Keep the system clock correct, since signing checks rely on accurate time information.'
    ],
    summary: 'A device that has stopped working because of an outdated driver is usually a system-evolution issue rather than a hardware fault. Identifying the affected device, noting the current driver date, reviewing recent system changes, allowing a refresh and rebooting will resolve the majority of cases. If the device is still unresponsive after these steps, profile and connection checks come next; deeper hardware concerns only become relevant when every software lever has been ruled out.'
  },
  {
    slug: 'fix-driver-conflict-between-devices',
    title: 'Driver Conflict Between Two Devices: Fix Guide',
    metaDesc: 'A driver conflict between two devices means both want the same resource. Use this guide to identify the clash and restore stable operation.',
    h1: 'Driver Conflict Between Two Devices: Fix Guide',
    byline: 'How to identify a clash between two devices that share a resource and bring both back to a stable state.',
    intro: 'A driver conflict between two devices means the operating system has noticed that both devices are trying to use the same resource — an interrupt line, a memory range or a shared service. The result is unpredictable: sometimes one works and the other stays silent, sometimes both work for a moment and then both stop, sometimes the system keeps switching between them. Resolving the conflict is mostly a matter of identifying which two devices are involved and asking the operating system to renegotiate the assignment.',
    steps: [
      { name: 'Read the conflict notice', text: 'The conflict message normally lists both devices by name. Note them down before doing anything else; the rest of the guide depends on knowing exactly which two are involved.' },
      { name: 'Check connection order', text: 'Disconnect any non-essential add-on devices and reboot. Reconnect them one at a time, with a short pause after each, so the operating system can assign resources to each in turn.' },
      { name: 'Refresh the hardware list', text: 'Open the operating system\'s hardware list and ask it to scan for changes. A fresh scan often gives the second device a different resource and clears the warning automatically.' },
      { name: 'Review system events', text: 'Open the event log and look at the period when the conflict first appeared. A recent change such as a new feature update or a profile change is often visible there and points at the trigger.' },
      { name: 'Try a different port', text: 'If both devices are connected through the same port or hub, move one of them to a different connection point. Even an internal port change can be enough for the operating system to assign new resources.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Updates frequently include refreshed resource maps that resolve known conflict patterns without any further action.' }
    ],
    why: 'Modern systems have plenty of resources, but they are not infinite. Each connected device is given an interrupt, a memory window and access to certain shared services. When two devices ask for the same slot at the same time — usually after a new device has been added or a feature update has reshuffled assignments — the operating system raises a conflict so neither device receives bad data. The two devices themselves are usually fine; what they need is a fresh negotiation. Once the assignments are renegotiated, both can work side by side again.',
    symptomsIntro: 'A conflict has a fairly distinctive fingerprint. The signs below are typical.',
    symptoms: [
      'Two devices show warning markers in the hardware list at the same time.',
      'One device works only when the other is disconnected, and vice versa.',
      'A specific port behaves erratically while every other port stays normal.',
      'A short conflict notice appears at every boot, mentioning both device names.'
    ],
    tipsIntro: 'These small habits make conflict situations much easier to spot and resolve.',
    tips: [
      'Add new devices one at a time, with a reboot between, so each one is registered cleanly.',
      'Use distinct ports for high-bandwidth devices rather than chaining them through one hub.',
      'Note which devices were added last when a conflict first appears — they are often involved.',
      'Keep the operating system current; resource maps are refreshed in regular updates.'
    ],
    summary: 'A driver conflict between two devices is the operating system protecting both from bad data, not a sign that either has failed. Reading the conflict notice, reviewing connection order, refreshing the hardware list, checking the event log and trying a different port resolves the majority of cases. If the warning persists after every step, applying pending system updates usually delivers a refreshed resource map that resolves the clash on the very next reboot.'
  },
  {
    slug: 'fix-driver-not-compatible-with-system',
    title: 'Driver Not Compatible with the Current System: Fix Guide',
    metaDesc: 'A "driver not compatible" message means the driver was built for a different system version. Use this guide to confirm the cause and recover.',
    h1: 'Driver Not Compatible with the Current System: Fix Guide',
    byline: 'When the operating system rejects a driver as incompatible, the path back is calmer than it first appears.',
    intro: 'A "driver not compatible with the current system version" message means the operating system has examined the driver and decided that it was built for a different version of the system. It has refused to load the driver as a safety measure rather than risk unstable behaviour. The hardware itself is normally healthy — the situation is a version mismatch between the operating system and the driver. The steps below walk through the safest way to bring the two back into alignment without touching any installed software.',
    steps: [
      { name: 'Confirm the system version', text: 'Open the operating system\'s system information and note the exact version and build number. Many incompatibility issues come down to a version that is one or two updates ahead or behind the driver.' },
      { name: 'Read the rejection notice fully', text: 'The rejection message normally states which version the driver expects. Compare that with the version you noted in the previous step; the gap will tell you what to do next.' },
      { name: 'Apply pending system updates', text: 'Allow the operating system to apply any waiting updates. A newer system version often brings a compatible driver alongside it and resolves the mismatch in a single cycle.' },
      { name: 'Restart and re-check', text: 'Restart the system fully after the updates finish. Many compatibility checks only run on a fresh boot, so the rejection may clear on its own once the new state has had a chance to take effect.' },
      { name: 'Use built-in compatibility settings', text: 'Open the device\'s details and check whether the operating system offers a compatibility mode for the affected driver. Switching it on adjusts only configuration and asks no further action of the user.' },
      { name: 'Roll back to a known good state', text: 'If the rejection persists, use the operating system\'s built-in option to roll the driver entry back to the previous working configuration.' }
    ],
    why: 'Drivers are version-aware. A new operating-system release can change how it talks to hardware, and a driver written for the previous release may simply not understand the new conversation. The same applies in reverse: a brand-new driver may expect features the older system does not yet have. To prevent unstable behaviour, the operating system rejects the mismatch outright and surfaces the message rather than risking a crash. Aligning the two — usually by allowing the system to update — is almost always the safest route back to normal operation.',
    symptomsIntro: 'Version mismatches share a few distinctive signs. Watch for the patterns below to confirm.',
    symptoms: [
      'A clear message stating the driver is not compatible with the current system version.',
      'The affected device shows a warning marker but the rest of the hardware list is healthy.',
      'A recent feature update was applied just before the message first appeared.',
      'The same driver works on another machine that is one version behind or ahead.'
    ],
    tipsIntro: 'A few small habits keep version mismatches from becoming a regular problem.',
    tips: [
      'Allow major system updates to settle for a day before judging whether something is wrong.',
      'Keep a note of the system version that last worked smoothly with each critical device.',
      'Avoid mixing drivers from very different system generations on the same machine.',
      'Treat compatibility messages as protective — they are blocking risk, not creating it.'
    ],
    summary: 'A "driver not compatible" message is the operating system protecting the device from running on the wrong version, not a sign of failure. Confirming the version, reading the rejection notice, applying pending updates, restarting and using the built-in compatibility settings will resolve most cases. If the rejection persists, the built-in rollback option returns the driver to the previous working state and gives normal behaviour back without any further changes to the system.'
  },
  {
    slug: 'fix-driver-error-causing-system-crash',
    title: 'Driver Error Causing a System Crash or Freeze: Fix Guide',
    metaDesc: 'A driver-related crash or freeze is rarely random. Use this guide to find the pattern, confirm the cause and restore stability.',
    h1: 'Driver Error Causing a System Crash or Freeze: Fix Guide',
    byline: 'A composed approach to identifying the driver behind a crash or freeze and bringing the system back to a steady state.',
    intro: 'A crash or freeze that points at a driver is unsettling, but the situation is usually more orderly than it first feels. The operating system records what was happening at the moment things went wrong, which means the cause can almost always be narrowed down to a single driver or a clear pattern. The steps below walk through how to gather that information calmly and act on it, without altering any installed software or touching the hardware itself.',
    steps: [
      { name: 'Note the crash details', text: 'After the system recovers, write down the time, the screen message and what you were doing in the moments before. Even small details such as which device was active are surprisingly useful later.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look for the most recent error around the crash time. The driver name is usually listed clearly and removes most of the guesswork.' },
      { name: 'Check for a repeating pattern', text: 'Look back over the past week of events. A repeating pattern — same time, same trigger, same driver — is a much stronger lead than a single one-off entry on its own.' },
      { name: 'Apply pending system updates', text: 'Allow the operating system to apply any waiting updates. Many crash patterns are well known and the fix is delivered through a normal update cycle rather than any manual change.' },
      { name: 'Reboot into a clean state', text: 'Restart the system with only essential services active and use the device normally for a short period. If the crash does not return, a non-essential service is involved and can be re-enabled one at a time.' },
      { name: 'Review power and thermal logs', text: 'Open the operating system\'s power and thermal reports. Crashes that look like driver faults are sometimes caused by a device being denied power or running too hot for short bursts.' }
    ],
    why: 'A crash blamed on a driver normally means the operating system asked that driver for something and the driver responded in a way the system could not safely continue with. The trigger could be a memory range that was already in use, a request that took too long to answer, or a value the driver did not expect. The event log captures the moment, which is why a careful review usually finds the offending pattern.',
    symptomsIntro: 'Driver-related crashes have a few distinctive signs. The list below covers the most common ones.',
    symptoms: [
      'The same screen message appears more than once with a similar driver name listed.',
      'The freeze happens during a specific activity, such as connecting a device or waking from sleep.',
      'The operating system\'s event log shows a clear error entry within seconds of the crash.',
      'Restarting the system clears the issue temporarily but it returns at a similar moment later.'
    ],
    tipsIntro: 'A few simple habits make crash investigations much faster when they happen.',
    tips: [
      'Always note the time of a crash; the event log becomes far more useful with a timestamp.',
      'Look for a pattern across at least three events before drawing a conclusion.',
      'Allow the operating system to finish background updates before deciding nothing is changing.',
      'Keep at least 10% of the storage drive free, since memory pressure can mimic driver faults.'
    ],
    summary: 'A driver-related crash or freeze is rarely random and is rarely a hardware failure on its own. By noting the details, reviewing the event log, looking for a pattern, applying pending updates, rebooting into a clean state and checking power and thermal logs, the cause can almost always be identified. With the trigger known, the fix is usually small, focused and delivered through normal system maintenance rather than anything more invasive than that.'
  },
  {
    slug: 'fix-driver-error-code-guide',
    title: 'Driver Error Code: Fix Guide',
    metaDesc: 'A driver error code is the operating system\'s short way of explaining a fault. Use this guide to read the code and act on it correctly.',
    h1: 'Driver Error Code: Fix Guide',
    byline: 'Read a numeric driver error code with confidence and turn it into a clear, calm next step.',
    intro: 'A driver error code is the operating system\'s short way of explaining what has gone wrong with a device. The codes look cryptic at first, but each one points at a specific category of problem — a missing resource, a configuration mismatch, a power issue or a service that did not start. Treating the code as a clue rather than a verdict makes the rest of the work much simpler. The steps below show how to read a code, understand the category it belongs to and respond in the right order.',
    steps: [
      { name: 'Capture the full code', text: 'Note the complete code, including any prefix letters and trailing numbers. A small change in the suffix often points at a different category, so accuracy matters more than speed at this stage.' },
      { name: 'Open the device\'s details', text: 'Open the affected device in the hardware list and read the longer description that sits underneath the code. The plain-English summary usually narrows the cause within seconds.' },
      { name: 'Check related events', text: 'Open the operating system\'s event log and look for entries around the time the code first appeared. A burst of related events around the same moment is more revealing than the code alone.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Many error codes are tied to known patterns and the fix is delivered through a normal update cycle without any further intervention.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh scan often clears codes that were caused by a temporary state, such as a device that was busy when first detected.' },
      { name: 'Reboot and re-check', text: 'Restart the system fully and check the same device again. Many codes only update on the next clean boot, so a reboot is the correct way to confirm whether the issue is resolved.' }
    ],
    why: 'Error codes exist because a single number takes far less space than a paragraph of explanation. Each code is a label for a known category — for example, "device cannot start", "resource not allocated" or "service not running". The category points at where to look rather than naming the exact fault. Treating the code as a signpost rather than a diagnosis is what makes the difference between guesswork and a clean fix. Most codes resolve through normal maintenance once the right area has been identified.',
    symptomsIntro: 'Error-code situations share a few common signs. The list below makes them easier to recognise.',
    symptoms: [
      'A short code appears beside a device in the hardware list with a brief description below it.',
      'The same code returns after every reboot, even after the system has been restarted.',
      'A small balloon notification mentions the same code at sign-in.',
      'Other devices remain healthy while one specific component is repeatedly affected.'
    ],
    tipsIntro: 'A few short habits make error codes much easier to work with when they appear.',
    tips: [
      'Always capture the full code and its description before changing anything in the system.',
      'Look at related events from the same time period; one entry alone rarely tells the full story.',
      'Allow at least one full update cycle before deciding the code is stuck.',
      'Reboot once after any change so the operating system can refresh the code report cleanly.'
    ],
    summary: 'A driver error code is a clue rather than a verdict. By capturing the full code, reading the device\'s detailed description, checking related events, applying pending updates, refreshing the hardware list and rebooting, the underlying cause becomes clear in nearly every case. With the category understood, the right next step is usually small, focused and delivered through normal maintenance rather than any heavier intervention than that.'
  },
  {
    slug: 'fix-driver-stopped-after-system-update',
    title: 'Driver Stopped Working After a System Update: Fix Guide',
    metaDesc: 'A driver that stops after a system update has usually fallen out of step. Use this guide to bring it back into alignment with the new system.',
    h1: 'Driver Stopped Working After a System Update: Fix Guide',
    byline: 'A measured way to bring a driver back into line after a system update has changed the rules around it.',
    intro: 'It is common for a driver to behave perfectly until a system update arrives, and then suddenly fall silent. The hardware itself is fine — the conversation between the driver and the operating system has simply changed during the update, and the driver needs a chance to catch up. The steps below walk through the calmest way to restore normal behaviour without touching any installed software, starting with the simplest checks and working up to the operating system\'s built-in recovery features.',
    steps: [
      { name: 'Wait for the dust to settle', text: 'Allow the operating system at least a few minutes after a major update to finish its background tasks. Many drivers re-bind themselves once those tasks complete, with no further action needed.' },
      { name: 'Reboot the system', text: 'Restart the device fully. A clean boot lets the operating system re-load every driver from scratch, which is enough to resolve the majority of post-update issues.' },
      { name: 'Check the update history', text: 'Open the operating system\'s update log and confirm the recent update finished cleanly. A partial or interrupted update is the most common reason a driver appears to stop working.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration is often enough to bind the new system rules to the existing driver and restore the device.' },
      { name: 'Allow follow-up updates', text: 'Many large system updates are followed by smaller catch-up updates that include refreshed driver components. Allow the operating system to fetch and apply them in its own time.' },
      { name: 'Use the built-in rollback', text: 'If the device is still silent, use the operating system\'s built-in option to return the driver to its previous working configuration.' }
    ],
    why: 'A system update can change small but important things: the way devices are addressed, the timing of background services, the rules for accepting drivers, and the way power is distributed. A driver that worked under the old rules may simply not understand the new ones yet. The operating system is cautious by default, so rather than risk unstable behaviour it leaves the device quiet until the driver and system are aligned. Allowing follow-up updates and rebooting gives the two sides a chance to meet again, which is why so many post-update issues clear themselves with patience alone.',
    symptomsIntro: 'Post-update driver issues share a few unmistakable signs. The list below covers the typical patterns.',
    symptoms: [
      'The device worked normally up until the update completed and then went quiet immediately afterwards.',
      'A warning marker appears beside the device with a brief generic message.',
      'Other devices on the same machine continue to behave normally throughout.',
      'The update history shows the recent update finished, but no follow-up entries have arrived yet.'
    ],
    tipsIntro: 'A few short habits make post-update issues much easier to handle when they appear.',
    tips: [
      'Always reboot at least once after a major update, even if the system does not insist on it.',
      'Give the operating system a day to deliver follow-up updates before deciding anything is wrong.',
      'Note the version number of the previous working state, in case a rollback is later helpful.',
      'Allow background tasks to complete; cancelling them is a common cause of half-applied changes.'
    ],
    summary: 'A driver that stops working after a system update is almost always recovering from a temporary mismatch rather than a real fault. Waiting for background tasks to finish, rebooting, checking the update history, refreshing the hardware list and allowing follow-up updates resolve the majority of cases. If the device remains silent after these steps, the built-in rollback returns the driver to its previous working state and restores normal behaviour without any further intervention.'
  },
  {
    slug: 'fix-driver-error-slowing-device',
    title: 'Driver Error Causing Slow Device Performance: Fix Guide',
    metaDesc: 'A driver-related slowdown is rarely random. Use this guide to identify the cause and restore normal device performance with calm, ordered checks.',
    h1: 'Driver Error Causing Slow Device Performance: Fix Guide',
    byline: 'A practical guide to identifying the driver-related cause behind a sudden slowdown and restoring normal speed.',
    intro: 'A device that has become noticeably slow is often experiencing a driver-related error rather than a hardware decline. A driver that is silently retrying a failed request, falling back to a basic mode or losing its proper power profile can drag overall performance down without any obvious warning. The steps below walk through the calmest way to confirm the cause and restore normal speed, without altering any installed software or touching the hardware itself in the process.',
    steps: [
      { name: 'Confirm what changed and when', text: 'Note when the slowdown began and what changed at that time. A new device, a recent system update or a new background task often coincides with the moment performance dropped.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look for repeating warning entries. A driver that is retrying silently is usually visible there long before the user notices the slowdown.' },
      { name: 'Review the power profile', text: 'Open the system\'s power settings and check the active profile. A device on a basic or fallback profile is often slow because it is not allowed to use its full set of features.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration sometimes restores the proper profile and clears the silent retries that were dragging performance down.' },
      { name: 'Apply pending system updates', text: 'Allow the operating system to apply any waiting updates. Many driver-related slowdowns are well known and the fix is delivered through a normal update cycle rather than any manual change.' },
      { name: 'Reboot and measure', text: 'Restart the system and use it normally for a short period before judging whether the slowdown has cleared. A clean boot is the correct baseline for confirming a real change.' }
    ],
    why: 'When a driver runs into trouble it does not always announce it loudly — it often falls back to a slower, safer mode and keeps trying. That can be enough to make a fast device feel sluggish without any obvious error on screen. Causes include a power profile that has reset to a basic mode, a small mismatch with a recent system update, or a background service that is no longer responding in time. None of these point at a hardware decline; they point at a driver doing the careful thing while waiting for normal conditions to return, which is exactly when a quick check is most useful.',
    symptomsIntro: 'A driver-related slowdown has a few distinctive signs. Look for the patterns listed below.',
    symptoms: [
      'The device became noticeably slower over a short period rather than gradually over months.',
      'One specific activity is slow while everything else feels normal.',
      'The event log shows repeating warning entries from the same driver name.',
      'A reboot temporarily improves performance but the slowdown returns within a session.'
    ],
    tipsIntro: 'These small habits make driver-related slowdowns easier to spot before they become disruptive.',
    tips: [
      'Note when a slowdown began; the timing usually points at the cause faster than any other clue.',
      'Check the power profile early — a wrong profile is one of the most common causes.',
      'Allow at least one full update cycle before assuming the driver is at fault.',
      'Reboot once to establish a clean baseline before drawing conclusions about performance.'
    ],
    summary: 'A driver-related slowdown is almost always a recoverable software situation rather than a hardware decline. Confirming what changed and when, reviewing the event log, checking the power profile, refreshing the hardware list, applying pending updates and measuring after a reboot resolves the majority of cases. If performance has not returned by the end of the list, the cause is more likely outside the driver itself and other system-level checks become the natural next step.'
  },
  {
    slug: 'fix-driver-not-responding-error',
    title: '"Driver Not Responding" Error: Fix Guide',
    metaDesc: 'A "driver not responding" message means the system asked but the driver did not reply in time. Use this guide to recover and prevent repeats.',
    h1: '"Driver Not Responding" Error: Fix Guide',
    byline: 'Calm the situation when a driver stops replying and learn how to recognise the trigger before it returns.',
    intro: 'A "driver not responding" error means the operating system asked the driver for something and did not receive an answer within the time it expected. The system may recover automatically, or the user may need to give it a small nudge. Either way, the message is the operating system protecting the rest of the experience rather than a sign of permanent failure. The steps below walk through the calmest way to recover and how to recognise the underlying trigger so the same message is less likely to appear again.',
    steps: [
      { name: 'Wait briefly before acting', text: 'Give the system a few moments to recover on its own. Many "not responding" notices clear themselves once the driver finishes whatever it was doing in the background and replies again.' },
      { name: 'Note the driver name', text: 'When the message appears, note the driver name shown alongside it. Knowing exactly which driver was involved makes the rest of the fix far quicker and prevents unrelated changes elsewhere.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look at the period around the message. A burst of related entries often shows what the driver was busy with at the time it became unresponsive.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration sometimes restores a healthy connection between the system and the affected driver in seconds.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Many "not responding" patterns are well known and the fix is delivered through a normal update cycle rather than any manual intervention.' },
      { name: 'Reboot and observe', text: 'Restart the system and use the affected device normally for a short period. If the message does not return, the issue was likely temporary; if it does, the event log will hold the next clue.' }
    ],
    why: 'Drivers operate under strict time limits. If the operating system asks a driver to do something and the driver does not reply within those limits, it is treated as unresponsive even if it is still working in the background. Common reasons include a heavy background task, a temporary loss of power to a device, a slow response from a connected accessory, or a small mismatch with a recent system update. The hardware itself is rarely at fault — the driver is simply overrun for a moment and the system is being cautious by raising the message rather than waiting indefinitely.',
    symptomsIntro: 'A "not responding" pattern is usually predictable. The signs below help confirm the cause.',
    symptoms: [
      'A short notification appears mentioning the affected driver by name.',
      'The screen flickers briefly or a connected device pauses for a few seconds.',
      'The same message appears more than once over a short period.',
      'The event log shows related entries within a few seconds either side of each notice.'
    ],
    tipsIntro: 'These short habits make "not responding" messages much easier to manage when they appear.',
    tips: [
      'Wait briefly before reaching for any tool — many notices clear on their own.',
      'Note the driver name every time the message appears; patterns reveal themselves quickly.',
      'Avoid running multiple heavy background tasks at the same time.',
      'Allow the operating system to apply updates promptly rather than postponing them.'
    ],
    summary: 'A "driver not responding" error is the operating system protecting the user experience rather than reporting a permanent fault. Waiting briefly, noting the driver name, reviewing the event log, refreshing the hardware list, applying pending updates and observing after a reboot resolves most cases. If the message keeps returning even after these steps, the event log holds the underlying clue and points at the smallest possible next step to take.'
  },
  {
    slug: 'fix-driver-power-state-failure',
    title: 'Driver Power State Failure: Fix Guide',
    metaDesc: 'A driver power state failure happens when sleep or wake transitions go wrong. Use this guide to identify the cause and restore reliable power behaviour.',
    h1: 'Driver Power State Failure: Fix Guide',
    byline: 'Restore reliable sleep and wake behaviour when a driver fails to handle a power state change cleanly.',
    intro: 'A driver power state failure means the operating system tried to move the device into a different power state — for example, going to sleep or waking up — and a driver did not handle the change cleanly. The result is usually a freeze, a delay or a recovery message after the system tries to come back. The hardware itself is normally fine; the message is about timing and coordination. The steps below walk through the calmest way to restore reliable behaviour and to identify the driver that is at the centre of the situation.',
    steps: [
      { name: 'Note when the failure happens', text: 'Record whether the failure happens on sleep, on wake or during a brief idle period. The timing tells you which power transition to focus on and removes most of the guesswork from the rest of the fix.' },
      { name: 'Open the power log', text: 'Open the operating system\'s power and event logs and look for the most recent entry around the time of the failure. The driver name is normally listed clearly in the warning entry.' },
      { name: 'Review the active profile', text: 'Open the power settings and review the active profile. An aggressive profile that puts devices to sleep very quickly can trigger this kind of failure on devices that need a longer transition.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration often restores the proper power profile to a device that has fallen back to a basic mode.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Power state handling is a frequent target of normal updates and known patterns are usually corrected without any further action.' },
      { name: 'Reboot and observe', text: 'Restart the system and let it run through a normal sleep and wake cycle. If the failure does not return, the fix is in place; if it does, the power log holds the next clue.' }
    ],
    why: 'Power state changes are demanding. A device that is asked to sleep must save its current state, wind down quickly and let the operating system know it is ready. Waking back up is the same in reverse. If a driver takes too long, returns the wrong status or skips a step, the operating system raises a power state failure to keep the rest of the system safe. The cause is usually an aggressive power profile, a recent update that changed timing rules, or a temporary load that delayed the response.',
    symptomsIntro: 'Power state failures share a few unmistakable signs. The list below helps confirm the cause.',
    symptoms: [
      'The system freezes briefly when going to sleep or waking up.',
      'A recovery message appears after the system comes back from sleep.',
      'A specific device is unresponsive immediately after wake but recovers after a moment.',
      'The power log shows a clear warning entry within seconds of each failure.'
    ],
    tipsIntro: 'A few short habits make power state failures much easier to handle when they appear.',
    tips: [
      'Note whether the failure happens on sleep or on wake — they have very different causes.',
      'Avoid using the most aggressive power profile if a device repeatedly fails to wake cleanly.',
      'Allow the operating system to deliver follow-up updates before deciding nothing is changing.',
      'Restart the system at least once a week so power-related state can be refreshed cleanly.'
    ],
    summary: 'A driver power state failure is a coordination problem rather than a hardware fault. Noting when the failure happens, reviewing the power log, checking the active profile, refreshing the hardware list, applying pending updates and observing after a reboot resolves most cases. If the failure persists, the power log will hold the next clue and points at a focused, measured step rather than any sweeping change to the system.'
  },
  {
    slug: 'fix-driver-timeout-error',
    title: 'Driver Timeout Error: Fix Guide',
    metaDesc: 'A driver timeout error means the system gave up waiting for a reply. Use this guide to find what slowed the driver down and restore normal behaviour.',
    h1: 'Driver Timeout Error: Fix Guide',
    byline: 'When the system gives up waiting on a driver, the cause is rarely a single failure — it is almost always a delay.',
    intro: 'A driver timeout error means the operating system asked a driver for a result and gave up waiting before the answer arrived. Timeouts exist to protect the rest of the experience: rather than freeze indefinitely, the system raises a clear message and moves on. The hardware itself is usually healthy. The cause is almost always a delay — a device that is busy, a service that is slow to respond or a brief loss of communication. The steps below walk through the calmest way to identify what slowed the driver down.',
    steps: [
      { name: 'Note exactly when it happens', text: 'Record what the system was doing when the timeout appeared. A pattern around a specific activity is the strongest clue and points at the part of the system that is delaying the reply.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look at the period around each timeout. A burst of related entries usually shows what the driver was waiting on, which removes most of the guesswork.' },
      { name: 'Review background activity', text: 'Open the operating system\'s activity overview and look for heavy background tasks running at the time of the timeout. A noisy background often produces what looks like a sudden driver fault.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration sometimes restores a healthy connection between the driver and the rest of the system in a few seconds.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Timeout patterns are a frequent target of normal updates and known causes are usually corrected without any further action.' },
      { name: 'Reboot and observe', text: 'Restart the system and use the affected activity normally for a short period. If the timeout does not return, the fix is in place; if it does, the event log holds the next clue to follow.' }
    ],
    why: 'Drivers operate under tight deadlines. If a reply takes too long, the operating system raises a timeout rather than risking a freeze. The reasons vary: a connected accessory may be slow to respond, a background task may be hogging shared resources, a recent update may have changed expected timing, or a power profile may have starved the device of energy at the wrong moment. None of these are random. Each one leaves a trace in the event log, which is why even a brief review usually identifies the trigger and points at a focused, calm fix.',
    symptomsIntro: 'Timeout errors have a few distinctive signs. The list below helps confirm the cause.',
    symptoms: [
      'A short message appears stating the driver did not reply in time.',
      'The same activity triggers the message more than once over a short period.',
      'A connected accessory pauses for a few seconds before responding normally again.',
      'The event log shows a burst of related entries within seconds of each timeout.'
    ],
    tipsIntro: 'These short habits make timeout errors much easier to handle when they appear.',
    tips: [
      'Note the activity that triggered the timeout — repeating activities are the strongest clue.',
      'Avoid running heavy background tasks during sensitive activities such as wake from sleep.',
      'Allow the operating system to apply updates promptly rather than postponing them.',
      'Reboot weekly to clear short-lived state that can build up between sessions.'
    ],
    summary: 'A driver timeout error is the operating system protecting the rest of the experience rather than reporting a permanent fault. Noting when each timeout happens, reviewing the event log, checking background activity, refreshing the hardware list, applying pending updates and observing after a reboot resolves most cases. If the message keeps returning, the event log holds the underlying clue and points at the smallest possible next step.'
  },
  {
    slug: 'fix-driver-access-violation-error',
    title: 'Driver Access Violation Error: Fix Guide',
    metaDesc: 'A driver access violation error means a driver tried to use memory it does not own. Use this guide to identify the trigger and restore stability.',
    h1: 'Driver Access Violation Error: Fix Guide',
    byline: 'A measured approach to a driver access violation that turns a serious-looking message into a clear next step.',
    intro: 'A driver access violation error means a driver tried to read or write a memory address that it does not own, and the operating system stopped it before any damage could be done. The message looks alarming, but it is the system protecting itself rather than a sign of permanent failure. The hardware itself is normally fine — the cause is almost always a small mismatch between what the driver expected and what the system allowed. The steps below walk through the calmest way to identify the trigger and restore stability.',
    steps: [
      { name: 'Note the message details', text: 'After the system recovers, write down the time of the failure and the driver name shown in the message. Even small details such as which device was active are useful in the rest of the fix.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look for the entry that matches the time of the failure. The driver name and the address it tried to use are usually listed clearly in the entry.' },
      { name: 'Look for repeating patterns', text: 'Review at least the last week of events. A repeating pattern — same activity, same driver, similar timing — is far stronger evidence than a single isolated entry.' },
      { name: 'Apply pending system updates', text: 'Allow the operating system to apply any waiting updates. Access violation patterns are a frequent target of normal updates and known causes are corrected through that channel.' },
      { name: 'Reboot into a clean state', text: 'Restart the system with only essential services active. If the failure does not return, a non-essential service is involved and can be re-enabled one at a time to find the culprit.' },
      { name: 'Run the built-in repair check', text: 'Most operating systems include a file integrity checker. Let it run to completion; a damaged system file can cause the same access violation pattern as a faulty driver until it is repaired.' }
    ],
    why: 'Memory inside an operating system is divided into protected regions, and each driver has access to a defined area. If a driver tries to step outside that area — usually because of a small bug, a mismatch with the latest system rules, or a damaged system file pointing it at the wrong place — the system raises an access violation and stops the operation immediately. The cause is rarely the hardware; the trace left in the event log usually identifies the area to focus on.',
    symptomsIntro: 'Access violation patterns have a few distinctive signs. The list below makes them easier to recognise.',
    symptoms: [
      'A clear message states an access violation has occurred and names the driver involved.',
      'The same activity triggers a similar message more than once over a short period.',
      'The event log shows a related warning entry within seconds of each failure.',
      'Other devices remain healthy while one specific component is repeatedly affected.'
    ],
    tipsIntro: 'A few short habits make access violation errors much easier to manage when they appear.',
    tips: [
      'Note the time and driver name every time the message appears; patterns reveal themselves quickly.',
      'Look for related events from the same time period rather than relying on the message alone.',
      'Allow the operating system to apply updates promptly so known patterns are corrected.',
      'Run the built-in file integrity checker if the same activity keeps triggering the message.'
    ],
    summary: 'A driver access violation error is the operating system protecting itself, not a sign that something has been damaged beyond repair. Noting the message details, reviewing the event log, looking for patterns, applying pending updates, rebooting into a clean state and running the built-in repair check resolves the majority of cases. If the message persists, the event log holds the underlying clue and points at the smallest possible next step.'
  },
  {
    slug: 'fix-driver-blue-screen-error',
    title: 'Driver Caused Blue Screen Error: Fix Guide',
    metaDesc: 'A driver-related blue screen is rarely random. Use this guide to read the message, find the pattern and restore stable, reliable behaviour.',
    h1: 'Driver Caused Blue Screen Error: Fix Guide',
    byline: 'A composed, evidence-led approach to a blue screen that points at a driver as the cause.',
    intro: 'A blue screen that names a driver is unsettling, but the situation is more orderly than it first feels. The operating system records the moment in detail, which means the cause can almost always be narrowed down to a single driver or a clear pattern of activity. The hardware itself is usually fine — the message is the system protecting the rest of the session rather than a permanent fault. The steps below walk through the calmest way to gather the evidence and act on it without altering any installed software.',
    steps: [
      { name: 'Note the screen details', text: 'After the system recovers, write down the message text and any short code shown alongside it. The driver name is normally listed clearly and prevents any guesswork later in the fix.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and find the entry that matches the time of the blue screen. A short summary of what the driver was doing is usually included in the entry itself.' },
      { name: 'Look for a repeating pattern', text: 'Review at least the last week of events. A repeating pattern — same activity, same driver, similar timing — is much stronger evidence than a single one-off entry on its own.' },
      { name: 'Apply pending system updates', text: 'Allow the operating system to apply any waiting updates. Blue-screen patterns are a frequent target of normal updates and known causes are corrected through that channel.' },
      { name: 'Reboot into a clean state', text: 'Restart the system with only essential services active. If the blue screen does not return, a non-essential service is involved and can be re-enabled one at a time to find the trigger.' },
      { name: 'Review power and thermal logs', text: 'Open the operating system\'s power and thermal reports. Blue screens that look like driver faults are sometimes caused by a device being denied power or running too hot for short bursts.' }
    ],
    why: 'A blue screen is the operating system stopping everything immediately rather than continuing in a state it cannot trust. When a driver is named in the message, it is because the driver was the last thing the system tried to talk to before it lost confidence in the result. The cause is normally a clash with a recent system change, a temporary resource shortage, or a hardware element that briefly ran out of power.',
    symptomsIntro: 'Driver-related blue screens have a few distinctive signs. The list below helps confirm the cause.',
    symptoms: [
      'The same screen message appears more than once with a similar driver name listed.',
      'The blue screen happens during a specific activity, such as waking from sleep or connecting a device.',
      'The event log shows a clear error entry within seconds of each blue screen.',
      'Restarting the system clears the issue temporarily but it returns at a similar moment later.'
    ],
    tipsIntro: 'A few simple habits make blue-screen investigations much faster when they happen.',
    tips: [
      'Always note the time of a blue screen; the event log becomes far more useful with a timestamp.',
      'Look for a pattern across at least three events before drawing any firm conclusion.',
      'Allow the operating system to apply pending updates before deciding nothing is changing.',
      'Keep at least 10% of the storage drive free, since memory pressure can mimic driver faults.'
    ],
    summary: 'A driver-related blue screen is rarely random and is rarely a permanent fault. By noting the screen details, reviewing the event log, looking for a pattern, applying pending updates, rebooting into a clean state and checking power and thermal logs, the underlying cause can almost always be identified. With the trigger known, the fix is usually small, focused and delivered through normal maintenance rather than any sweeping change to the system.'
  },
  {
    slug: 'fix-driver-signature-error',
    title: 'Driver Signature Error: Fix Guide',
    metaDesc: 'A driver signature error means the operating system could not verify the driver. Use this guide to confirm the cause and restore safe operation.',
    h1: 'Driver Signature Error: Fix Guide',
    byline: 'When a driver fails its signature check, the path back is calmer and more measured than it first appears.',
    intro: 'A driver signature error means the operating system has examined a driver, checked who signed it and decided that the signature does not match what was expected. The driver is then refused as a safety measure rather than risking unsafe code on the device. The hardware itself is normally healthy. The cause is usually a missing certificate, an out-of-date signing rule or a system clock that is incorrect. The steps below walk through the calmest way to confirm the cause and restore safe operation without changing any installed software.',
    steps: [
      { name: 'Read the message carefully', text: 'Note the exact wording and the driver name shown in the message. Signature errors are very specific, and the precise wording usually points at one of just a handful of causes.' },
      { name: 'Confirm the system clock', text: 'Open the operating system\'s date and time settings and confirm that the clock is accurate. Many signature checks fail simply because the clock is wrong by hours or days, not because the driver is faulty.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Signing rules and certificate stores are refreshed through normal updates, and known patterns are corrected through that channel without any further action.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration often re-checks the driver against the current rules and clears the warning automatically.' },
      { name: 'Review the security log', text: 'Open the security log and look at the period when the message first appeared. A protection rule may have flagged the driver as untrusted, which appears as a signature error to the user.' },
      { name: 'Roll back to a known good state', text: 'If the message persists, use the operating system\'s built-in option to roll the driver entry back to its previous working configuration.' }
    ],
    why: 'Drivers are signed so the operating system can confirm that the file has not been altered between leaving the source and arriving on the device. If anything in that chain is off — the clock, the certificate store, the local rules or the file itself — the signature check fails and the driver is refused. The system errs on the side of caution because an unsigned or altered driver could harm the rest of the device. None of this means the hardware has failed; it simply means the trust path has been disturbed and needs to be restored before normal operation can continue.',
    symptomsIntro: 'Signature errors have a few unmistakable signs. The list below helps confirm the cause.',
    symptoms: [
      'A clear message states the driver could not be verified or that its signature is missing.',
      'The affected device shows a warning marker but the rest of the hardware list is healthy.',
      'The system clock is noticeably wrong or has drifted over recent days.',
      'The security log shows a related entry within seconds of the message appearing.'
    ],
    tipsIntro: 'A few short habits make signature errors much easier to manage when they appear.',
    tips: [
      'Always confirm the system clock first — it is the leading cause of unexpected signature failures.',
      'Allow the operating system to apply updates promptly so the certificate store stays current.',
      'Read the security log even if no warnings have been displayed visibly to the user.',
      'Treat signature messages as protective — they are blocking risk, not creating it.'
    ],
    summary: 'A driver signature error is the operating system protecting the device from running an unverified driver, not a sign of failure. Reading the message carefully, confirming the system clock, applying pending updates, refreshing the hardware list and reviewing the security log resolves the majority of cases. If the message persists, the built-in rollback returns the driver to its previous working state and restores normal behaviour without any further intervention.'
  },
  {
    slug: 'fix-driver-entry-point-not-found',
    title: 'Driver Entry Point Not Found: Fix Guide',
    metaDesc: 'A "driver entry point not found" message means a required function is missing. Use this guide to confirm the cause and restore device operation.',
    h1: 'Driver Entry Point Not Found: Fix Guide',
    byline: 'A clear-headed approach to a "missing entry point" message that turns a technical-looking error into a simple next step.',
    intro: 'A "driver entry point not found" message means the operating system asked a driver for a specific function and the function was not present. The driver may be slightly out of step with the rest of the system, or a related component may be missing or out of date. The hardware itself is normally healthy. The steps below walk through the calmest way to confirm the cause and restore normal device operation without altering any installed software or touching the hardware in the process.',
    steps: [
      { name: 'Capture the exact wording', text: 'Note the full message and the driver or file name mentioned in it. The wording usually points at one specific function, which makes the rest of the fix far quicker and more accurate.' },
      { name: 'Reboot the system', text: 'Restart the device fully. A clean boot lets the operating system reload its drivers from scratch, which is enough to clear short-lived entry-point issues caused by an interrupted session.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Missing entry-point messages are a frequent target of normal updates and known patterns are corrected through that channel without any further action.' },
      { name: 'Run the built-in repair check', text: 'Most operating systems include a file integrity checker. Let it run to completion; a damaged or partial file can produce the same message as a real entry-point mismatch until it is repaired.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration often resolves entry-point messages caused by a temporary state during the previous session.' },
      { name: 'Use the built-in rollback', text: 'If the message persists, use the operating system\'s built-in option to roll the driver entry back to its previous working configuration.' }
    ],
    why: 'Drivers and the operating system rely on a shared set of functions. When a driver is updated, when the operating system is updated, or when one part of either side is interrupted mid-update, a function the driver expected to find may simply not be there. The system raises a clear message rather than continue in an unsafe state. None of this points at hardware failure. Aligning the two sides — usually by allowing pending updates to finish and rebooting — is enough to bring the missing function back into place and let the device work normally again.',
    symptomsIntro: 'Entry-point messages have a few distinctive signs. The list below helps confirm the cause.',
    symptoms: [
      'A clear message names a specific function or entry point that could not be located.',
      'The affected device shows a warning marker while the rest of the hardware list is healthy.',
      'The same message appears at every reboot, even if no other changes have been made.',
      'The event log shows a related warning entry within seconds of each appearance.'
    ],
    tipsIntro: 'A few short habits make entry-point messages much easier to manage when they appear.',
    tips: [
      'Always capture the exact wording of the message before changing anything else in the system.',
      'Allow the operating system to apply updates promptly so missing functions are refreshed.',
      'Run the built-in file integrity checker if the message keeps returning after a reboot.',
      'Reboot once after any change so the operating system can re-check the driver cleanly.'
    ],
    summary: 'A "driver entry point not found" message is a clear sign of a small mismatch rather than a hardware fault. Capturing the exact wording, rebooting, applying pending updates, running the built-in repair check, refreshing the hardware list and using the built-in rollback resolves the majority of cases. If the message persists, the event log holds the underlying clue and points at the smallest possible next step rather than a sweeping change to the system.'
  },
  {
    slug: 'fix-driver-failed-to-load-error',
    title: 'Driver Failed to Load Error: Fix Guide',
    metaDesc: 'A "driver failed to load" error means the operating system tried but could not start the driver. Use this guide to identify the cause and recover.',
    h1: 'Driver Failed to Load Error: Fix Guide',
    byline: 'When a driver refuses to load, the cause is almost always a small, fixable mismatch rather than a hardware fault.',
    intro: 'A "driver failed to load" error means the operating system tried to start the driver during boot or sign-in and was unable to do so. The hardware itself is normally healthy — the situation is the system flagging that the software bridge to the device did not start as expected. The cause is almost always a small mismatch with another part of the system, an interrupted update, or a service that has not yet started. The steps below walk through the calmest way to identify the cause and bring the driver back into normal operation.',
    steps: [
      { name: 'Note the failure details', text: 'Write down the exact message, the driver name and the time it appeared. Even small details about what was happening just before are useful clues for the rest of the fix.' },
      { name: 'Reboot the system', text: 'Restart the device fully. A clean boot lets the operating system reload every driver from scratch, which is enough to clear short-lived load failures caused by an interrupted session.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look for entries around the time the message appeared. A related warning often shows what the driver was waiting on or what it could not find.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Load failures are a frequent target of normal updates and known patterns are corrected through that channel without any further intervention.' },
      { name: 'Refresh the hardware list', text: 'Ask the operating system to scan for hardware changes. A fresh enumeration is often enough to give the driver a second chance to start once any related dependencies are now ready.' },
      { name: 'Use the built-in rollback', text: 'If the message persists, use the operating system\'s built-in option to roll the driver entry back to its previous working configuration.' }
    ],
    why: 'Drivers depend on services and shared system components to be ready when they start. If one of those is not available — perhaps because it is still starting, has not been refreshed, or has been quietly disabled — the driver cannot load and the operating system raises a clear message rather than continue in an unsafe state. The trigger is usually small: a recent update, a changed profile, an interrupted shutdown or a brief storage hiccup. The hardware is rarely involved. Letting the system finish its background work and refresh its state is enough to resolve the majority of cases.',
    symptomsIntro: 'Load failures share a few distinctive signs. The list below helps confirm the cause.',
    symptoms: [
      'A clear message states a driver could not be loaded by the operating system.',
      'The affected device shows a warning marker while every other device behaves normally.',
      'The same message returns after every reboot, even if no other changes have been made.',
      'The event log shows a related warning entry within seconds of each appearance.'
    ],
    tipsIntro: 'A few short habits make load failures much easier to manage when they appear.',
    tips: [
      'Always note the exact wording and time of a load failure before changing anything else.',
      'Allow background services a moment to settle after sign-in before judging the result.',
      'Apply pending updates promptly so dependencies are kept current.',
      'Reboot once after any change so the operating system can re-check the driver cleanly.'
    ],
    summary: 'A "driver failed to load" error is the operating system flagging a small mismatch rather than a hardware fault. Noting the failure details, rebooting, reviewing the event log, applying pending updates, refreshing the hardware list and using the built-in rollback resolves the majority of cases. If the message persists, the event log holds the underlying clue and points at the smallest possible next step rather than any sweeping change to the system.'
  },
  {
    slug: 'fix-driver-keeps-showing-error-on-startup',
    title: 'Driver Keeps Showing an Error on Startup: Fix Guide',
    metaDesc: 'A driver error that returns at every startup is rarely random. Use this guide to find the rule that is triggering it and stop the cycle for good.',
    h1: 'Driver Keeps Showing an Error on Startup: Fix Guide',
    byline: 'Stop a driver error that returns at every startup by finding the rule that is triggering it rather than chasing the symptom.',
    intro: 'A driver error that appears at every startup is one of the most stubborn patterns to deal with. Each boot brings the same message, even after the device has worked normally during the last session. The cause is rarely the driver itself — it is almost always a recovery rule, a profile policy, a security check or an interrupted update that runs early in the startup sequence. The steps below walk through the calmest way to identify the rule that is triggering the message rather than chasing the symptom each time.',
    steps: [
      { name: 'Note exactly when it happens', text: 'Record whether the message appears before sign-in, immediately after sign-in or a moment later. The timing tells you which part of the startup sequence to look at first.' },
      { name: 'Capture the wording', text: 'Note the full message and the driver name shown in it. The wording usually points at one specific cause and removes most of the guesswork from the rest of the fix.' },
      { name: 'Open the event log', text: 'Open the operating system\'s event log and look for entries around the time of the message. A related warning often shows what the driver was waiting on or what undid the previous fix.' },
      { name: 'Check for a recovery rule', text: 'Open the operating system\'s recovery and reset settings. A scheduled refresh that returns the device to a known state can re-trigger the same message at every boot until the rule is reviewed.' },
      { name: 'Review profile policies', text: 'On a managed device, a profile policy can override local changes at every sign-in. Confirm whether the affected device is on an approved list before changing local settings.' },
      { name: 'Apply pending system updates', text: 'Allow any waiting updates to finish. Repeating startup errors are a frequent target of normal updates and known patterns are corrected through that channel.' }
    ],
    why: 'A startup error that keeps returning is almost always being put back by another part of the system rather than a driver failing on its own each time. Recovery rules, managed policies, security checks and interrupted updates each run very early in the startup sequence and can undo any change that does not sit alongside their expectations. Finding the rule that is responsible is the only lasting fix.',
    symptomsIntro: 'Startup-error patterns are usually predictable, which makes diagnosis easier. The signs below are typical.',
    symptoms: [
      'The same message appears at every startup, even if the device worked correctly the previous session.',
      'A warning marker appears beside the device immediately after every sign-in.',
      'The same fix has been applied more than once, only for the message to return on the next boot.',
      'The event log shows a related warning entry within seconds of each appearance.'
    ],
    tipsIntro: 'These short reminders often shorten the path to a permanent fix.',
    tips: [
      'Look at timing first — when a message appears is more useful than how it appears.',
      'Always check whether the device is on a managed profile before changing local settings.',
      'Review recovery rules even if no scheduled tasks are obvious in the everyday menus.',
      'Avoid chasing the symptom with repeated refreshes; find the rule that is putting it back.'
    ],
    summary: 'A driver error that returns at every startup is almost always being re-triggered by another part of the system rather than a driver failing on its own. Noting when it happens, capturing the wording, reviewing the event log, checking for recovery rules, reviewing profile policies and applying pending updates usually identifies the rule responsible. Once the underlying rule is adjusted, the message stops appearing at startup and the device behaves normally from then on without any further intervention.'
  }
];

if (PAGES.length !== 20) {
  console.error(`Expected 20 pages, have ${PAGES.length}`);
  process.exit(1);
}

const slugs = new Set();
for (const p of PAGES) {
  if (slugs.has(p.slug)) {
    console.error(`Duplicate slug: ${p.slug}`);
    process.exit(1);
  }
  slugs.add(p.slug);
}

let total = 0;
const wordCounts = [];
for (const p of PAGES) {
  const html = buildPage(p);
  const file = path.join(PUBLIC, `${p.slug}.html`);
  fs.writeFileSync(file, html, 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/);
  const text = m[0]
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text.split(' ').length;
  total += words;
  wordCounts.push({ slug: p.slug, words });
  const ok = words >= 600 && words <= 700;
  console.log(`${ok ? 'OK ' : 'XX '} ${String(words).padStart(4)} words  ${p.slug}.html`);
}
console.log('-'.repeat(60));
console.log(`Wrote ${PAGES.length} pages, average ${Math.round(total / PAGES.length)} words.`);

// Compliance audit
const FORBIDDEN_PATTERNS = [
  { name: 'troubleshooting', re: /troubleshoot/gi },
  { name: 'install/uninstall verb', re: /\b(install|uninstall|reinstall|installer|installation)\b/gi },
  { name: 'download verb', re: /\b(download|downloaded|downloading|downloads)\b/gi },
  { name: 'printer/printers', re: /\b(printer|printers)\b/gi },
  { name: 'specific brand names', re: /\b(brother|canon|hp\b|hewlett|epson|dell|lenovo|asus|acer|samsung|apple|microsoft|intel|amd|nvidia|realtek|broadcom|qualcomm)\b/gi }
];

let issues = 0;
for (const p of PAGES) {
  const html = fs.readFileSync(path.join(PUBLIC, `${p.slug}.html`), 'utf8');
  const m = html.match(/<main[\s\S]*?<\/main>/);
  const body = m[0];
  for (const f of FORBIDDEN_PATTERNS) {
    const matches = body.match(f.re);
    if (matches) {
      console.log(`COMPLIANCE: ${p.slug}.html — "${f.name}" found: ${matches.slice(0, 3).join(', ')}`);
      issues++;
    }
  }
}
console.log(`Compliance issues: ${issues}`);
