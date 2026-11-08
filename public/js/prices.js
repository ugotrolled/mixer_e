(function (global) {
  "use strict";
  var CACHE_KEY = "northmix_prices";
  var CACHE_TTL = 60 * 1000;
  var CG_URL = "https://api.coingecko.com/api/v3/simple/price";
  var requestCount = 0;
  var MAX_REQUESTS = 2;
  var memoryCache = null;
  var COIN_IDS = {
    btc: "bitcoin", eth: "ethereum", sol: "solana", zec: "zcash",
    ltc: "litecoin", usdt: "tether", usdc: "usd-coin", bnb: "binancecoin"
  };
  var FALLBACK = {
    bitcoin: { usd: 96500, usd_24h_change: 0 },
    ethereum: { usd: 3380, usd_24h_change: 0 },
    solana: { usd: 178, usd_24h_change: 0 },
    zcash: { usd: 42.5, usd_24h_change: 0 },
    litecoin: { usd: 82, usd_24h_change: 0 },
    tether: { usd: 1.0, usd_24h_change: 0 },
    "usd-coin": { usd: 1.0, usd_24h_change: 0 },
    binancecoin: { usd: 620, usd_24h_change: 0 }
  };

  function getCached() {
    if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) return memoryCache.data;
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      if (Date.now() - p.ts > CACHE_TTL) return null;
      memoryCache = p;
      return p.data;
    } catch (e) { return null; }
  }
  function setCached(data) {
    memoryCache = { ts: Date.now(), data: data };
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache)); } catch (e) {}
  }

  function fetchWithTimeout(url, ms) {
    return new Promise(function (resolve, reject) {
      var ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); reject(new Error("timeout")); }, ms);
      fetch(url, { headers: { "Accept": "application/json" }, referrerPolicy: "no-referrer", signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { clearTimeout(timer); if (!r.ok) reject(new Error("http " + r.status)); else r.json().then(resolve); })
        .catch(function (e) { clearTimeout(timer); reject(e); });
    });
  }

  async function fetchPrices() {
    var cached = getCached();
    if (cached) return cached;
    if (requestCount >= MAX_REQUESTS) return getCached() || FALLBACK;
    requestCount++;
    var ids = Object.values(COIN_IDS).join(",");
    var url = CG_URL + "?ids=" + ids + "&vs_currencies=usd&include_24hr_change=true";
    try {
      var data = await fetchWithTimeout(url, 4000);
      setCached(data);
      return data;
    } catch (e) {
      var last = getCached();
      if (last) return last;
      setCached(FALLBACK);
      return FALLBACK;
    }
  }

  function fmt(v) {
    if (v >= 1000) return "$" + v.toLocaleString("en-US", { maximumFractionDigits: 0 });
    if (v >= 1) return "$" + v.toFixed(2);
    return "$" + v.toFixed(4);
  }

  function updateTiles(prices) {
    Object.keys(COIN_IDS).forEach(function (ticker) {
      var coinId = COIN_IDS[ticker];
      var pd = prices[coinId] || { usd: 0, usd_24h_change: 0 };
      var els = document.querySelectorAll('[data-price-ticker="' + ticker + '"]');
      els.forEach(function (el) {
        el.textContent = fmt(pd.usd);
        var change = pd.usd_24h_change || 0;
        el.classList.remove("asset-tile__price--up", "asset-tile__price--down", "asset-tile__price--flat");
        if (change > 0.01) el.classList.add("asset-tile__price--up");
        else if (change < -0.01) el.classList.add("asset-tile__price--down");
        else el.classList.add("asset-tile__price--flat");
      });
    });
  }

  function renderSkeleton() {
    Object.keys(COIN_IDS).forEach(function (ticker) {
      var els = document.querySelectorAll('[data-price-ticker="' + ticker + '"]');
      els.forEach(function (el) {
        el.textContent = "—";
        el.classList.remove("asset-tile__price--up", "asset-tile__price--down");
        el.classList.add("asset-tile__price--flat");
      });
    });
  }

  async function init() {
    renderSkeleton();
    var prices = await fetchPrices();
    updateTiles(prices);
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.prices = { init: init, fetchPrices: fetchPrices, updateTiles: updateTiles };
})(window);
