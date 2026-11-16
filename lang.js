// Nyelvválasztás: a gyökér (magyar) oldalak a böngésző nyelvéhez igazodnak: magyar böngészőben maradnak, minden más
// nyelvnél az angol megfelelőre (<link rel="alternate" hreflang="en">) váltanak. A nyelvváltó linkre (a.lang[data-lang])
// kattintás megjegyzi a választást, ami felülírja az automatikát. Az /en/ oldalak sosem irányítanak át.
(() => {
  const KEY = "jarvis-lang";
  const get = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a.lang[data-lang]");
    if (a) try { localStorage.setItem(KEY, a.dataset.lang); } catch {}
  });
  if (document.documentElement.dataset.root !== "hu") return;
  const saved = get();
  const first = ((navigator.languages && navigator.languages[0]) || navigator.language || "hu").slice(0, 2).toLowerCase();
  const want = saved === "hu" || saved === "en" ? saved : first === "hu" ? "hu" : "en";
  const alt = document.querySelector('link[rel="alternate"][hreflang="en"]');
  if (want === "en" && alt) location.replace(alt.href + location.hash);
})();
