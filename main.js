/*!
 * Mar.Uchi Coffee & Tea — main.js
 * Vanilla JS, IIFE, sin módulos — funciona en file://, FTP y cualquier hosting.
 */
(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* -----------------------------------------------------------
     Nav — solidify on scroll + mobile menu
     ----------------------------------------------------------- */
  function initNav() {
    var header = $("[data-masthead]");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-mobile-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("is-open");
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.documentElement.style.overflow = "";
      });
    });
  }

  /* -----------------------------------------------------------
     Reveal on scroll — IntersectionObserver + 6s safety net
     ----------------------------------------------------------- */
  function initReveals() {
    var targets = $$(".reveal");
    if (!targets.length) return;

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });

    targets.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("is-visible");
        }
      });
    }, 6000);
  }

  /* -----------------------------------------------------------
     Staggered reveal helper — adds a small delay per index
     ----------------------------------------------------------- */
  function initStagger() {
    $$("[data-stagger]").forEach(function (group) {
      $$(".reveal", group).forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 90, 360) + "ms";
      });
    });
  }

  /* -----------------------------------------------------------
     Hero aroma line — signature effect, draws once on load
     ----------------------------------------------------------- */
  function initAroma() {
    var aroma = $("[data-aroma]");
    if (!aroma) return;
    requestAnimationFrame(function () {
      setTimeout(function () { aroma.classList.add("is-drawn"); }, 500);
    });
  }

  /* -----------------------------------------------------------
     Tilt cards — subtle pointer-follow halo, desktop only
     ----------------------------------------------------------- */
  function initTilt() {
    if (!fineHover) return;
    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", mx + "%");
        card.style.setProperty("--my", my + "%");
        if (reduced) return;
        var rx = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
        var ry = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
        card.style.transform = "perspective(700px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     Gallery lightbox — <dialog>, keyboard + click friendly
     ----------------------------------------------------------- */
  function initLightbox() {
    var dialog = $("[data-lightbox]");
    if (!dialog) return;
    var img = $("[data-lightbox-img]", dialog);
    var caption = $("[data-lightbox-caption]", dialog);
    var closeBtn = $("[data-lightbox-close]", dialog);

    $$("[data-gallery-item]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var full = btn.getAttribute("data-full") || btn.querySelector("img").src;
        var alt = btn.querySelector("img").alt || "";
        img.src = full;
        img.alt = alt;
        caption.textContent = alt;
        dialog.showModal();
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  /* -----------------------------------------------------------
     Menu item detail — click/tap a dish or drink to see what's in it
     ----------------------------------------------------------- */
  function initMenuDetail() {
    var dialog = $("[data-menu-dialog]");
    var items = $$("[data-menu-detail]");
    if (!dialog || !items.length) return;

    var closeBtn = $("[data-menu-dialog-close]", dialog);
    var elCategory = $("[data-menu-dialog-category]", dialog);
    var elName = $("[data-menu-dialog-name]", dialog);
    var elPrice = $("[data-menu-dialog-price]", dialog);
    var elText = $("[data-menu-dialog-detail]", dialog);
    var elIconUse = $("[data-menu-dialog-icon] use", dialog);
    var elIconWrap = $("[data-menu-dialog-icon-wrap]", dialog);
    var elPhotoWrap = $("[data-menu-dialog-photo-wrap]", dialog);
    var elPhoto = $("[data-menu-dialog-photo]", dialog);
    var elPhotoCredit = $("[data-menu-dialog-photo-credit]", dialog);
    var elCard = $("[data-menu-dialog-card]", dialog);
    var elSpecs = $("[data-menu-dialog-specs]", dialog);
    var elSteam = $("[data-menu-dialog-steam]", dialog);
    var elBubbles = $("[data-menu-dialog-bubbles]", dialog);

    // Especificaciones: derivadas literalmente del propio texto de cada
    // producto (ya redactado con precisión) — no son afirmaciones nuevas,
    // solo se muestran como chips además del párrafo descriptivo.
    function deriveSpecs(detail, categoryTitle) {
      var lower = (detail || "").toLowerCase();
      function has(s) { return lower.indexOf(s) !== -1; }
      var tags = [];
      var noMilk = has("sin leche");
      var hasMilkWord = (has("leche") && !noMilk) || has("lácteos") || has("nata");

      if (has("sin gluten")) tags.push("Sin gluten");
      else if (has("gluten")) tags.push("Contiene gluten");

      if (has("sin lácteos")) tags.push("Sin lácteos");
      else if (hasMilkWord) tags.push("Contiene lácteos");

      if (hasMilkWord && (has("vegetal") || has("avena") || has("soja") || has("coco"))) {
        tags.push("Leche vegetal disponible");
      }
      if (has("frutos secos")) tags.push("Contiene frutos secos");
      if (has("huevo")) tags.push("Contiene huevo");
      if (has("sin teína")) tags.push("Sin teína");
      if (has("sin azúcar añadido")) tags.push("Sin azúcar añadido");
      if (has("contiene cacao")) tags.push("Contiene cacao");

      var temp = null;
      if (categoryTitle === "Bebidas frías") temp = "Bebida fría";
      else if (categoryTitle === "Cafés de especialidad" || categoryTitle === "Tés de origen") temp = "Bebida caliente";

      return { tags: tags, temp: temp };
    }

    function renderSpecs(detail, categoryTitle) {
      var specs = deriveSpecs(detail, categoryTitle);
      if (elSpecs) {
        elSpecs.innerHTML = "";
        if (specs.temp) {
          var tempEl = document.createElement("span");
          tempEl.className = "menu-spec-chip is-temp";
          tempEl.textContent = specs.temp;
          elSpecs.appendChild(tempEl);
        }
        specs.tags.forEach(function (label) {
          var chip = document.createElement("span");
          chip.className = "menu-spec-chip";
          chip.textContent = label;
          elSpecs.appendChild(chip);
        });
      }
      // Vapor sobre calientes, burbujeo sobre frías — puramente decorativo,
      // nunca sustituye la foto/icono real ni afirma nada del producto.
      if (elSteam) elSteam.hidden = specs.temp !== "Bebida caliente";
      if (elBubbles) elBubbles.hidden = specs.temp !== "Bebida fría";
    }

    // Reinicia la animación 3D de apertura cada vez (forzando reflow) y,
    // en escritorio con ratón y sin "reduced motion", deja una rotación
    // sutil y continua tipo "peana giratoria" tras la entrada.
    function playCardAnimation() {
      if (!elCard) return;
      elCard.classList.remove("is-spinning-in", "is-idle-3d");
      if (reduced) return;
      void elCard.offsetWidth; // forzar reflow para poder repetir la animación
      elCard.classList.add("is-spinning-in");
      var onEnd = function (e) {
        if (e.target !== elCard) return;
        elCard.removeEventListener("animationend", onEnd);
        if (fineHover) elCard.classList.add("is-idle-3d");
      };
      elCard.addEventListener("animationend", onEnd);
    }

    function openFrom(item) {
      var category = item.closest(".menu-category");
      var categoryTitle = category ? $("h2", category) : null;
      var categoryText = categoryTitle ? categoryTitle.textContent : "";
      var detail = item.getAttribute("data-detail") || "";
      elCategory.textContent = categoryText;
      elName.textContent = item.getAttribute("data-name") || "";
      elPrice.textContent = item.getAttribute("data-price") || "";
      elText.textContent = detail;
      renderSpecs(detail, categoryText);

      var photo = item.getAttribute("data-photo");
      if (photo && elPhotoWrap && elPhoto) {
        elPhoto.src = "assets/img/" + photo;
        elPhoto.alt = "Foto real tomada en Mar.Uchi Coffee & Tea (@maruchi.coffeeandtea)";
        elPhotoWrap.hidden = false;
        if (elPhotoCredit) elPhotoCredit.hidden = false;
        if (elIconWrap) elIconWrap.hidden = true;
      } else {
        if (elPhotoWrap) elPhotoWrap.hidden = true;
        if (elPhotoCredit) elPhotoCredit.hidden = true;
        if (elIconWrap) elIconWrap.hidden = false;
        if (elIconUse) {
          var icon = item.getAttribute("data-icon") || "espresso";
          elIconUse.setAttribute("href", "#icon-" + icon);
        }
      }
      dialog.showModal();
      playCardAnimation();
    }

    items.forEach(function (item) {
      item.addEventListener("click", function (e) {
        // Don't hijack clicks on a real link/button nested inside the row.
        if (e.target.closest("a,button")) return;
        openFrom(item);
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openFrom(item);
        }
      });
    });

    dialog.addEventListener("close", function () {
      if (elCard) elCard.classList.remove("is-spinning-in", "is-idle-3d");
    });
    if (closeBtn) closeBtn.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  /* -----------------------------------------------------------
     Horario — resalta el día actual y muestra un aviso honesto
     (solo indicamos "abierto/cerrado hoy" según el día de la
     semana confirmado; no inventamos hora exacta de cierre).
     ----------------------------------------------------------- */
  function initHours() {
    var table = $("[data-hours-table]");
    if (!table) return;
    var today = new Date().getDay(); // 0=domingo ... 6=sábado
    var todayRow = $('[data-day="' + today + '"]', table);
    if (todayRow) todayRow.classList.add("is-today");

    var status = $("[data-hours-status]");
    var statusText = $("[data-hours-status-text]", status);
    if (!status || !statusText) return;
    var isOpenDay = today >= 1 && today <= 5; // lunes-viernes, según Google
    status.hidden = false;
    status.classList.add(isOpenDay ? "status-open" : "status-closed");
    statusText.textContent = isOpenDay ? "Hoy abrimos desde las 9:00" : "Hoy cerrado";
  }

  /* -----------------------------------------------------------
     Menu category quick-nav — smooth scroll with nav offset
     ----------------------------------------------------------- */
  function initAnchorScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 88;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* -----------------------------------------------------------
     GSAP-enhanced hero parallax (progressive enhancement only)
     ----------------------------------------------------------- */
  function initHeroParallax() {
    var bg = $("[data-hero-parallax]");
    if (!bg || reduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.to(bg, {
      yPercent: 12,
      ease: "none",
      scrollTrigger: { trigger: bg, start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initStagger, "initStagger");
    safe(initReveals, "initReveals");
    safe(initAroma, "initAroma");
    safe(initTilt, "initTilt");
    safe(initLightbox, "initLightbox");
    safe(initMenuDetail, "initMenuDetail");
    safe(initHours, "initHours");
    safe(initAnchorScroll, "initAnchorScroll");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
      safe(initHeroParallax, "initHeroParallax");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
