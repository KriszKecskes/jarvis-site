// Letöltő: a legfrissebb kiadás fájljait a GitHub Releases-ből kéri; ha nem érhető el, a kiadások oldalára mutat.
// A fájlnevek a scripts/release.sh nevezéktanát követik: Jarvis_<verzió>_<platform>.<kiterjesztés>.
(() => {
  const REPO = "KriszKecskes/jarvis-app";
  const kinds = {
    linux: /linux-x86_64\.AppImage$/i,
    windows: /windows-x86_64\.exe$|x64-setup\.exe$/i,
    "mac-arm": /darwin-aarch64\.app\.tar\.gz$/i,
  };
  const ua = navigator.userAgent;
  const mine = /Windows/.test(ua) ? "windows" : /Mac/.test(ua) ? "mac-arm" : /Linux/.test(ua) && !/Android/.test(ua) ? "linux" : "";
  document.querySelectorAll("[data-os]").forEach((card) => {
    if (card.dataset.os === mine || (mine === "mac-arm" && card.dataset.os === "mac")) card.classList.add("me");
  });
  const size = (n) => (n >= 1e8 ? Math.round(n / 1e6) + " MB" : (n / 1e6).toFixed(1) + " MB");
  fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rel) => {
      document.querySelectorAll("[data-version]").forEach((e) => (e.textContent = rel.tag_name.replace(/^v/, "")));
      document.querySelectorAll("[data-kind]").forEach((a) => {
        const asset = rel.assets.find((x) => kinds[a.dataset.kind].test(x.name));
        if (!asset) return;
        a.href = asset.browser_download_url;
        const info = a.parentElement.querySelector("[data-size]");
        if (info) info.textContent = `${asset.name} · ${size(asset.size)}`;
      });
    })
    .catch(() => {}); // marad a kiadások oldalára mutató alaplink
})();

// A figura tétlen animációja (az app saját rendererének felvétele, oda-vissza ismétlődik, így nincs ugrás a hurok végén).
// Átlátszó WebM-et használunk (kicsi); a WebKit (Safari, iOS) viszont nem kezeli a WebM átlátszóságát, ott animált WebP megy.
// Csökkentett mozgásnál, vagy ha a betöltés nem sikerül, az állókép marad.
(() => {
  const img = document.querySelector("img.mascot[data-anim]");
  if (!img || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const base = img.dataset.anim;
  const webkit = /AppleWebKit/.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR/.test(navigator.userAgent);
  if (webkit) {
    const anim = new Image();
    anim.onload = () => { img.src = anim.src; };
    anim.src = `${base}.webp`;
    return;
  }
  const video = document.createElement("video");
  video.className = img.className;
  video.width = img.width || 198;
  video.height = img.height || 190;
  video.muted = true; video.loop = true; video.autoplay = true; video.playsInline = true;
  video.setAttribute("aria-hidden", "true");
  video.poster = img.src;
  video.src = `${base}.webm`;
  video.addEventListener("playing", () => img.replaceWith(video), { once: true });
  video.play().catch(() => {});
})();
