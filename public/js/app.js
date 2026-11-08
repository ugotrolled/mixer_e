(function (global) {
  "use strict";
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }

  function syncHost() {
    var site = global.NORTHMIX_SITE;
    if (!site || !site.SITE_ORIGIN) return;
    var apex = String(site.SITE_ORIGIN).replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (location.hostname === "www." + apex) {
      location.replace(String(site.SITE_ORIGIN).replace(/\/+$/, "") + location.pathname + location.search + location.hash);
    }
  }

  function syncOrigin() {
    var site = global.NORTHMIX_SITE;
    if (!site || !site.SITE_ORIGIN) return;
    var base = String(site.SITE_ORIGIN).replace(/\/+$/, "");
    var path = location.pathname.replace(/^\//, "");
    var url = base + "/" + path;
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", url);
    var og = document.querySelector('meta[property="og:url"]');
    if (og) og.setAttribute("content", url);
    var ogSite = document.querySelector('meta[property="og:site_name"]');
    if (ogSite && site.siteName) ogSite.setAttribute("content", site.siteName);
  }

  function applySiteTexts() {
    var site = global.NORTHMIX_SITE;
    if (!site || !site.texts) return;
    var map = { "start-lead": site.texts.startLead };
    Object.keys(map).forEach(function (id) {
      var node = document.getElementById(id);
      if (node && map[id]) node.textContent = map[id];
    });
  }
  function assertModules() {
    var N = global.NORTHMIX;
    return N && N.assets && N.networks && N.fees && N.validation && N.validators && N.qr && N.api && N.walletAdapter && N.transactionUI && N.prices;
  }
  function runSelfTest() {
    var matrix = NORTHMIX.api.getMatrix();
    var failures = NORTHMIX.validators.selfTest(matrix);
    if (failures.length > 0) {
      var screen = document.getElementById("hard-failure");
      if (screen) {
        var list = failures.map(function (f) { return f.asset + "/" + f.network + " (" + f.type + "): " + f.address; });
        var detail = document.getElementById("hard-failure-detail");
        if (detail) detail.textContent = list.join("\n");
        screen.classList.remove("hidden");
      }
      return false;
    }
    return true;
  }
  function initStatCounters() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-count][data-static]").forEach(function (el) {
      var fixed = parseInt(el.getAttribute("data-count"), 10);
      el.textContent = (el.getAttribute("data-prefix") || "") + fixed.toLocaleString("en-US") + (el.getAttribute("data-suffix") || "");
    });
    var els = document.querySelectorAll("[data-count]:not([data-static])");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10);
        var prefix = el.getAttribute("data-prefix") || "";
        var suffix = el.getAttribute("data-suffix") || "";
        el.textContent = prefix + target.toLocaleString("en-US") + suffix;
      });
      return;
    }
    var seen = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen) {
          seen = true;
          els.forEach(function (el) {
            var target = parseInt(el.getAttribute("data-count"), 10);
            var prefix = el.getAttribute("data-prefix") || "";
            var suffix = el.getAttribute("data-suffix") || "";
            var start = 0;
            var duration = 900;
            var t0 = performance.now();
            function tick(now) {
              var p = Math.min(1, (now - t0) / duration);
              var eased = 1 - Math.pow(1 - p, 3);
              var val = Math.round(start + (target - start) * eased);
              el.textContent = prefix + val.toLocaleString("en-US") + suffix;
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = prefix + target.toLocaleString("en-US") + suffix;
            }
            requestAnimationFrame(tick);
          });
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    var strip = document.getElementById("stat-strip");
    if (strip) io.observe(strip);
  }
  function initFAQ() {
    var items = document.querySelectorAll(".faq-accordion__item");
    items.forEach(function (item, idx) {
      var btn = item.querySelector(".faq-accordion__btn");
      if (!btn) return;
      btn.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        items.forEach(function (fi) {
          fi.classList.remove("is-open");
          var fb = fi.querySelector(".faq-accordion__btn");
          if (fb) fb.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
  function initNavbar() {
    var nb = document.getElementById("navbar");
    if (!nb) return;
    function onScroll() { nb.classList.toggle("navbar--scrolled", window.scrollY > 40); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function initMobileMenu() {
    var hm = document.getElementById("hamburger");
    var mn = document.getElementById("mobile-menu");
    var cl = document.getElementById("mobile-menu-close");
    if (!hm || !mn) return;
    function open() { mn.classList.add("is-open"); hm.setAttribute("aria-expanded", "true"); }
    function close() { mn.classList.remove("is-open"); hm.setAttribute("aria-expanded", "false"); }
    hm.addEventListener("click", open);
    if (cl) cl.addEventListener("click", close);
    mn.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }
  ready(function () {
    syncHost();
    syncOrigin();
    applySiteTexts();
    if (!assertModules()) return;
    if (!runSelfTest()) return;
    NORTHMIX.transactionUI.init();
    NORTHMIX.prices.init();
    NORTHMIX.api.resendPending();
    initStatCounters();
    initFAQ();
    initNavbar();
    initMobileMenu();
  });
})(window);
