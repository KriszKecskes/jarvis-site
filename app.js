// Letöltő: a legfrissebb kiadás fájljait a GitHub Releases-ből kéri; ha nem érhető el, a kiadások oldalára mutat.
// A fájlnevek a scripts/release.sh nevezéktanát követik: Jarvis_<verzió>_<platform>.<kiterjesztés>.
(() => {
  const REPO = "KriszKecskes/jarvis-app";
  const kinds = {
    linux: /linux-x86_64\.AppImage$/i,
    windows: /windows-x86_64\.exe$|x64-setup\.exe$/i,
    "mac-arm": /darwin-aarch64\.app\.tar\.gz$/i,
    "mac-intel": /darwin-x86_64\.app\.tar\.gz$/i,
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
