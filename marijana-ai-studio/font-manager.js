(() => {
  const FALLBACK_FONTS = [
    { family: "Cormorant Garamond", category: "Serif", source: "Marijana" },
    { family: "Playfair Display", category: "Serif", source: "Marijana" },
    { family: "DM Sans", category: "Sans Serif", source: "Marijana" },
    { family: "Montserrat", category: "Sans Serif", source: "Marijana" },
    { family: "Lora", category: "Serif", source: "Marijana" },
    { family: "Libre Baskerville", category: "Serif", source: "Marijana" },
    { family: "Oswald", category: "Display", source: "Marijana" },
    { family: "Bebas Neue", category: "Display", source: "Marijana" },
    { family: "Pacifico", category: "Script", source: "Marijana" },
    { family: "Caveat", category: "Handwritten", source: "Marijana" }
  ];

  const TYPOGRAPHY_PRESETS = {
    "Luxury": { heading: "Cormorant Garamond", subheading: "Playfair Display", body: "DM Sans" },
    "Editorial": { heading: "Libre Baskerville", subheading: "Lora", body: "DM Sans" },
    "Minimal": { heading: "DM Sans", subheading: "DM Sans", body: "DM Sans" },
    "Modern": { heading: "Montserrat", subheading: "DM Sans", body: "DM Sans" },
    "Feminine": { heading: "Cormorant Garamond", subheading: "Lora", body: "Montserrat" },
    "Business": { heading: "Libre Baskerville", subheading: "Montserrat", body: "DM Sans" },
    "Social Media": { heading: "Bebas Neue", subheading: "Oswald", body: "DM Sans" },
    "Custom": JSON.parse(localStorage.getItem("marijanaTypographyCustom") || "null") || { heading: "Cormorant Garamond", subheading: "Playfair Display", body: "DM Sans" }
  };

  const state = {
    fonts: [],
    activeTarget: null,\n    activeRole: null,
    category: "Svi",
    search: "",
    favorites: JSON.parse(localStorage.getItem("marijanaFontFavorites") || "[]"),
    preset: localStorage.getItem("marijanaTypographyPreset") || "Luxury"
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[ch]));

  function normalize(font) {
    return {
      family: font.family || font.fullName || font.postscriptName || "Nepoznat font",
      fullName: font.fullName || font.family || "Nepoznat font",
      style: font.style || "Regular",
      category: font.category || guessCategory(font.family || font.fullName || ""),
      source: font.source || "Lokalni font"
    };
  }

  function guessCategory(name) {
    const n = name.toLowerCase();
    if (/script|hand|cursive|brush|calligraphy|chancery|handwriting|pacifico|caveat/.test(n)) return "Script";
    if (/mono|code|console|courier/.test(n)) return "Monospace";
    if (/display|impact|oswald|bebas|poster|condensed/.test(n)) return "Display";
    if (/sans|arial|helvetica|calibri|segoe|verdana|tahoma/.test(n)) return "Sans Serif";
    return "Serif";
  }

  async function loadFonts() {
    if ("queryLocalFonts" in window) {
      try {
        const local = await window.queryLocalFonts();
        const unique = new Map();
        local.map(normalize).forEach(font => {
          if (!unique.has(font.family)) unique.set(font.family, font);
        });
        state.fonts = [...unique.values()].sort((a,b) => a.family.localeCompare(b.family, "sr"));
        localStorage.setItem("marijanaFontCatalog", JSON.stringify(state.fonts));
        localStorage.setItem("marijanaFontCatalogSource", "local");
        localStorage.setItem("marijanaFontCatalogCount", String(state.fonts.length));
        return;
      } catch (error) {
        console.info("Marijana Font Manager: lokalni fontovi nisu odobreni.", error);
      }
    }

    try {
      const cached = JSON.parse(localStorage.getItem("marijanaFontCatalog") || "[]");
      if (Array.isArray(cached) && cached.length) {
        state.fonts = cached.map(normalize);
        return;
      }
    } catch (e) {}

    state.fonts = FALLBACK_FONTS.map(normalize);
  }

  function filteredFonts() {
    const q = state.search.trim().toLowerCase();
    return state.fonts.filter(font => {
      const categoryOk = state.category === "Svi" || font.category === state.category;
      const searchOk = !q || font.family.toLowerCase().includes(q) || font.style.toLowerCase().includes(q);
      return categoryOk && searchOk;
    });
  }

  function isFavorite(font) {
    return state.favorites.includes(font.family);
  }

  function toggleFavorite(family) {
    state.favorites = isFavorite({family}) 
      ? state.favorites.filter(x => x !== family)
      : [...state.favorites, family];
    localStorage.setItem("marijanaFontFavorites", JSON.stringify(state.favorites));
    renderFontList();
  }

  function openManager(target = null) {
    state.activeTarget = target || document.querySelector(".document-editor");
    const modal = document.getElementById("marijana-font-modal");
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    const search = document.getElementById("marijana-font-search");
    if (search) { search.value = state.search; setTimeout(() => search.focus(), 50); }
    loadFonts().then(() => {
      const source = document.getElementById("marijana-font-source");
      if (source) source.textContent = state.fonts.length + " lokalnih fontova";
      renderFontList();
    });
  }

  function closeManager() {
    const modal = document.getElementById("marijana-font-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function applyPreset(name) {
    const preset = TYPOGRAPHY_PRESETS[name];
    if (!preset) return;
    state.preset = name;
    localStorage.setItem("marijanaTypographyPreset", name);
    const target = state.activeTarget;
    if (target) {
      target.style.fontFamily = '"' + preset.heading + '", sans-serif';
      target.style.setProperty("--marijana-heading-font", '"' + preset.heading + '", sans-serif');
      target.style.setProperty("--marijana-subheading-font", '"' + preset.subheading + '", sans-serif');
      target.style.setProperty("--marijana-body-font", '"' + preset.body + '", sans-serif');
    }
    document.querySelectorAll("[data-marijana-font-label]").forEach(el => {
      el.textContent = preset.heading;
      el.style.fontFamily = '"' + preset.heading + '", sans-serif';
    });
    localStorage.setItem("marijanaTypography", JSON.stringify(preset));
    if (window.MarijanaBrandKit?.setTypography) {
      window.MarijanaBrandKit.setTypography(preset, name);
    }
    document.dispatchEvent(new CustomEvent("marijana:typography-changed", { detail: { name, ...preset } }));
    closeManager();
  }

  function applyFont(font) {
    const target = state.activeTarget;
    if (!target) return;

    const family = font.family.replace(/"/g, "");
    target.focus();

    if (target.classList.contains("document-editor")) {
      try {
        document.execCommand("fontName", false, family);
      } catch (e) {}
      target.style.setProperty("--marijana-editor-font", '"' + family + '", sans-serif');
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        target.style.fontFamily = '"' + family + '", sans-serif';
      }
    } else {
      target.style.fontFamily = '"' + family + '", sans-serif';
    }

    localStorage.setItem("marijanaLastFont", JSON.stringify(font));
    document.querySelectorAll("[data-marijana-font-label]").forEach(el => {
      el.textContent = font.family;
      el.style.fontFamily = '"' + family + '", sans-serif';
    });
    document.dispatchEvent(new CustomEvent("marijana:font-changed", { detail: font }));
    closeManager();
  }

  function renderFontList() {
    const list = document.getElementById("marijana-font-list");
    const count = document.getElementById("marijana-font-count");
    if (!list) return;

    const fonts = filteredFonts();
    if (count) count.textContent = fonts.length + " fontova";
    list.innerHTML = fonts.map(font => {
      const favorite = isFavorite(font);
      return '<button type="button" class="marijana-font-item" data-font-family="' + escapeHtml(font.family) + '">' +
        '<span class="marijana-font-preview" style="font-family:&quot;' + escapeHtml(font.family) + '&quot;,sans-serif">Aa</span>' +
        '<span class="marijana-font-info"><strong>' + escapeHtml(font.family) + '</strong><small>' + escapeHtml(font.style) + ' · ' + escapeHtml(font.category) + '</small></span>' +
        '<span class="marijana-font-star" data-favorite="' + escapeHtml(font.family) + '">' + (favorite ? "★" : "☆") + '</span>' +
      '</button>';
    }).join("") || '<div class="marijana-font-empty">Nema fontova za ovaj filter.</div>';

    list.querySelectorAll(".marijana-font-item").forEach(button => {
      button.addEventListener("click", event => {
        if (event.target.closest("[data-favorite]")) {
          event.stopPropagation();
          toggleFavorite(button.dataset.fontFamily);
          return;
        }
        const font = state.fonts.find(x => x.family === button.dataset.fontFamily);
        if (font) applyFont(font);
      });
    });
  }

  function addModal() {
    if (document.getElementById("marijana-font-modal")) return;
    const modal = document.createElement("div");
    modal.id = "marijana-font-modal";
    modal.className = "marijana-font-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="marijana-font-dialog" role="dialog" aria-modal="true" aria-labelledby="marijana-font-title">
        <div class="marijana-font-head">
          <div><span class="mini-label">MARIJANA FONT LIBRARY</span><h3 id="marijana-font-title">Izaberi font</h3></div>
          <button type="button" class="marijana-font-close" aria-label="Zatvori">×</button>
        </div>
        <div class="marijana-font-tools">
          <input id="marijana-font-search" type="search" placeholder="Pretraži font po nazivu…">
          <select id="marijana-font-category">
            <option>Svi</option><option>Serif</option><option>Sans Serif</option><option>Display</option><option>Script</option><option>Handwritten</option><option>Monospace</option>
          </select>
        </div>
        <div class="marijana-typography-presets">
          <div class="marijana-font-preset-label">Tipografski stil</div>
          <div class="marijana-font-preset-list">
            <button type="button" class="marijana-font-preset" data-preset="Luxury">Luxury</button>
            <button type="button" class="marijana-font-preset" data-preset="Editorial">Editorial</button>
            <button type="button" class="marijana-font-preset" data-preset="Minimal">Minimal</button>
            <button type="button" class="marijana-font-preset" data-preset="Modern">Modern</button>
            <button type="button" class="marijana-font-preset" data-preset="Feminine">Feminine</button>
            <button type="button" class="marijana-font-preset" data-preset="Business">Business</button>
            <button type="button" class="marijana-font-preset" data-preset="Social Media">Social Media</button>
            <button type="button" class="marijana-font-preset" data-preset="Custom">Custom</button>
          </div>
        </div>
        <div class="marijana-font-meta"><span id="marijana-font-count">0 fontova</span><span id="marijana-font-source">Lokalni fontovi računara</span></div>
        <div id="marijana-font-list" class="marijana-font-list"></div>
      </div>`;
    document.body.appendChild(modal);

    modal.addEventListener("click", event => { if (event.target === modal) closeManager(); });
    modal.querySelector(".marijana-font-close").addEventListener("click", closeManager);
    modal.querySelector("#marijana-font-search").addEventListener("input", event => {
      state.search = event.target.value;
      renderFontList();
    });
    modal.querySelector("#marijana-font-category").addEventListener("change", event => {
      state.category = event.target.value;
      renderFontList();
    });
    modal.querySelectorAll("[data-preset]").forEach(button => {
      button.addEventListener("click", () => applyPreset(button.dataset.preset));
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeManager();
    });
  }

  function wireControls() {
    addModal();

    document.getElementById("open-font-manager")?.addEventListener("click", () => openManager(document.querySelector(".document-editor")));
    document.getElementById("open-copy-font-manager")?.addEventListener("click", () => openManager(document.getElementById("copy-output")));

    document.querySelectorAll("[data-marijana-font-target]").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.marijanaFontTarget);
        openManager(target);
      });
    });

    const saved = JSON.parse(localStorage.getItem("marijanaLastFont") || "null");
    if (saved?.family) {
      document.querySelectorAll("[data-marijana-font-label]").forEach(el => {
        el.textContent = saved.family;
        el.style.fontFamily = '"' + saved.family + '", sans-serif';
      });
    }
  }

  window.MarijanaFontManager = { open: openManager, openForRole, close: closeManager, refresh: loadFonts, getFonts: () => state.fonts, getTypography: () => TYPOGRAPHY_PRESETS[state.preset], applyPreset };

  document.addEventListener("DOMContentLoaded", wireControls);
})();