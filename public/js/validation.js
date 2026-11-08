(function (global) {
  "use strict";
  var NETWORK_LABELS = {
    "evm": "an EVM address (0x followed by 40 hex characters)",
    "bech32": "a Bitcoin bech32 address (starts with bc1)",
    "bech32-ltc": "a Litecoin address (starts with ltc1, L or M)",
    "sol": "a Solana address (base58, 32-44 characters)",
    "tron": "a TRON address (starts with T, 34 characters)",
    "zec-transparent": "a Zcash transparent address (starts with t1 or t3)"
  };
  function validateByType(raw, type) {
    if (!raw || !String(raw).trim()) return { ok: false, error: "Enter a payout address." };
    var s = String(raw).trim();
    var ok = NORTHMIX.validators.validateByType(s, type);
    if (!ok) {
      var label = NETWORK_LABELS[type] || "a valid address for this network";
      return { ok: false, error: "Enter " + label + "." };
    }
    return { ok: true };
  }
  function looseValidate(raw) {
    if (!raw || !String(raw).trim()) return { ok: false, error: "Enter a transaction hash or address." };
    var s = String(raw).trim();
    if (s.length < 20) return { ok: false, error: "Input is too short." };
    return { ok: true };
  }
  function looksLikeSecret(raw) {
    if (!raw) return false;
    var s = String(raw).trim();
    if (/\b(seed phrase|recovery phrase|private key|mnemonic|secret key|wallet seed)\b/i.test(s)) return true;
    var words = s.split(/\s+/);
    if ((words.length === 12 || words.length === 24) && words.every(function (w) { return /^[a-z]{2,8}$/i.test(w); })) return true;
    return false;
  }
  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.validation = {
    validateByType: validateByType,
    looseValidate: looseValidate,
    looksLikeSecret: looksLikeSecret
  };
})(window);
