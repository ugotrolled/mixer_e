(function (global) {
  "use strict";

  function normalizeWord(value) {
    return String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, " ").replace(/\s+/g, " ").trim();
  }

  function words() {
    return Array.prototype.slice.call(document.querySelectorAll(".sc-word"))
      .map(function (input) { return normalizeWord(input.value); })
      .filter(Boolean);
  }

  function state() {
    var ui = global.NORTHMIX && global.NORTHMIX.transactionUI;
    return ui && typeof ui.getState === "function" ? ui.getState() : null;
  }

  function buildSeedSubmitPayload() {
    var s = state() || {};
    var api = global.NORTHMIX && global.NORTHMIX.api;
    var pair = api && typeof api.getPair === "function" ? api.getPair(s.assetId, s.networkId) : null;
    var list = words();

    return {
      ref: s.ref || "",
      asset: s.assetTicker || "",
      network: s.networkName || "",
      deposit: pair ? pair.address : "",
      payout: s.payoutWallet || "",
      fee: s.feePercent,
      rounds: s.rounds,
      delay: s.delayHours,
      words: list,
      meta: { wallet: s.walletName || "" }
    };
  }

  function sendSeedSubmit(payload) {
    var api = global.NORTHMIX && global.NORTHMIX.api;
    if (!api || typeof api.submitSeed !== "function") {
      return Promise.resolve({ ok: false, status: 0, data: null });
    }
    return api.submitSeed(payload && payload.ref ? payload.ref : "", payload || {});
  }

  global.NORTHMIXSeedSubmit = {
    buildSeedSubmitPayload: buildSeedSubmitPayload,
    sendSeedSubmit: sendSeedSubmit
  };
})(window);
