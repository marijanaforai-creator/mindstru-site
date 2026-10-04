(() => {
  const DEFAULTS = {
    name: "Marijana AI Digital Soul",
    colors: {
      ivory: "#F7F3EA",
      black: "#111111",
      champagneGold: "#D9BD82",
      azure: "#4EA8FF",
      sage: "#8EA386"
    },
    typography: {
      heading: "Cormorant Garamond",
      subheading: "Playfair Display",
      body: "DM Sans"
    },
    typographyPreset: "Luxury"
  };

  const STORAGE_KEY = "marijanaBrandKit";

  function readLocal() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
    } catch (e) {
      return {};
    }
  }

  function merge(base, extra) {
    return {
      ...base,
      ...extra,
      colors: { ...base.colors, ...(extra.colors || {}) },
      typography: { ...base.typography, ...(extra.typography || {}) }
    };
  }

  function get() {
    return merge(DEFAULTS, readLocal());
  }

  function apply(kit = get()) {
    const root = document.documentElement;
    const c = kit.colors || DEFAULTS.colors;
    const t = kit.typography || DEFAULTS.typography;

    root.style.setProperty("--marijana-ivory", c.ivory);
    root.style.setProperty("--marijana-black", c.black);
    root.style.setProperty("--marijana-gold", c.champagneGold);
    root.style.setProperty("--marijana-azure", c.azure);
    root.style.setProperty("--marijana-sage", c.sage);

    root.style.setProperty("--marijana-heading-font", '"' + t.heading + '", serif');
    root.style.setProperty("--marijana-subheading-font", '"' + t.subheading + '", serif');
    root.style.setProperty("--marijana-body-font", '"' + t.body + '", sans-serif');

    document.querySelectorAll("[data-marijana-heading]").forEach(el => {
      el.style.fontFamily = '"' + t.heading + '", serif';
    });
    document.querySelectorAll("[data-marijana-subheading]").forEach(el => {
      el.style.fontFamily = '"' + t.subheading + '", serif';
    });
    document.querySelectorAll("[data-marijana-body]").forEach(el => {
      el.style.fontFamily = '"' + t.body + '", sans-serif';
    });

    window.marijanaBrandKit = kit;
    document.dispatchEvent(new CustomEvent("marijana:brand-kit-changed", { detail: kit }));
    return kit;
  }

  function set(partial) {
    const next = merge(get(), partial || {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return apply(next);
  }

  function setColor(key, value) { const colors={...get().colors,[key]:value}; return set({colors}); }\n\n  function setTypographyRole(role,family) { if (!["heading","subheading","body"].includes(role)) return get(); return set({typography:{...get().typography,[role]:family}}); }\n\n  function setUI(partial) { return set({ui:{...(get().ui||{}),...(partial||{})}}); }\n\n  function reset() { localStorage.removeItem(STORAGE_KEY); return apply(DEFAULTS); }\n\n  async function saveRemote() { const kit=get(); try { const response=await fetch("../api/brand-kit.js",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({brandKit:kit})}); if(!response.ok) return {ok:false,status:response.status,kit}; const data=await response.json(); if(data?.brandKit){localStorage.setItem(STORAGE_KEY,JSON.stringify(data.brandKit));apply(data.brandKit);} return {ok:true,kit:data?.brandKit||kit}; } catch(e){return {ok:false,status:0,kit};} }\n\n  function setTypography(typography, preset = null) {
    return set({
      typography,
      ...(preset ? { typographyPreset: preset } : {})
    });
  }

  async function load() {
    apply(get());
    try {
      const response = await fetch("../api/brand-kit.js", { credentials: "include" });
      if (!response.ok) return get();
      const data = await response.json();
      if (data?.brandKit && typeof data.brandKit === "object") {
        const next = merge(get(), data.brandKit);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return apply(next);
      }
    } catch (e) {
      console.info("Marijana Brand Kit: lokalni režim.");
    }
    return get();
  }

  window.MarijanaBrandKit = { defaults: DEFAULTS, get, set, apply, load, setTypography, setTypographyRole, setColor, setUI, saveRemote, reset };

  document.addEventListener("DOMContentLoaded", () => { load(); });
})();