(function (global) {
  "use strict";
  var state = {
    screen: "start",
    assetId: "eth",
    networkId: "ethereum",
    payoutWallet: "",
    feePercent: 1.0,
    rounds: 2,
    delayHours: 24,
    session: null,
    countdownHandle: null,
    verifyHandle: null
  };

  function el(id) { return document.getElementById(id); }
  function setText(id, t) { var n = typeof id === "string" ? el(id) : id; if (n) n.textContent = t == null ? "" : String(t); }
  function clearChildren(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
  function qsa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function showScreen(name) {
    state.screen = name;
    qsa(".screen").forEach(function (s) { s.classList.toggle("is-active", s.id === "screen-" + name); });
    var order = ["start", "deposit", "confirm", "verifying", "wallet", "result"];
    var idx = order.indexOf(name);
    qsa(".stepper__step").forEach(function (step, i) {
      step.setAttribute("data-state", i < idx ? "done" : i === idx ? "current" : "upcoming");
    });
    var appEl = document.getElementById("app");
    if (appEl) window.scrollTo({ top: appEl.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    if (name === "deposit") onEnterDeposit();
    if (name === "confirm") onEnterConfirm();
    if (name === "verifying") onEnterVerifying();
    if (name === "wallet") onEnterWallet();
    if (name === "result") onEnterResult();
  }
  function go(n) { showScreen(n); }
  function back() {
    var prev = { deposit: "start", confirm: "deposit", verifying: "confirm", wallet: "verifying", result: "start" };
    cleanupTimers();
    showScreen(prev[state.screen] || "start");
  }
  function cleanupTimers() {
    if (state.countdownHandle) { clearInterval(state.countdownHandle); state.countdownHandle = null; }
    if (state.verifyHandle) { clearTimeout(state.verifyHandle); state.verifyHandle = null; }
  }

  function getPair() {
    return NORTHMIX.api.getPair(state.assetId, state.networkId);
  }

  function renderAssetList() {
    var wrap = el("asset-list");
    if (!wrap) return;
    clearChildren(wrap);
    NORTHMIX.assets.list().forEach(function (asset) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "asset-tile";
      btn.setAttribute("aria-pressed", state.assetId === asset.id ? "true" : "false");
      btn.setAttribute("data-asset", asset.id);
      btn.setAttribute("role", "listitem");
      var logo = document.createElement("img");
      logo.src = asset.logo;
      logo.alt = asset.name;
      logo.className = "asset-tile__logo";
      logo.width = 24; logo.height = 24;
      logo.loading = "lazy";
      btn.appendChild(logo);
      var ticker = document.createElement("span");
      ticker.className = "asset-tile__ticker";
      ticker.textContent = asset.ticker;
      btn.appendChild(ticker);
      var price = document.createElement("span");
      price.className = "asset-tile__price asset-tile__price--flat";
      price.setAttribute("data-price-ticker", asset.id);
      price.textContent = "—";
      btn.appendChild(price);
      btn.addEventListener("click", function () { selectAsset(asset.id); });
      wrap.appendChild(btn);
    });
  }

  function selectAsset(assetId) {
    var asset = NORTHMIX.assets.byId(assetId);
    if (!asset) return;
    state.assetId = assetId;
    state.networkId = asset.networks[0];
    qsa(".asset-tile").forEach(function (t) {
      t.setAttribute("aria-pressed", t.getAttribute("data-asset") === assetId ? "true" : "false");
    });
    renderNetworkSelector();
    validatePayout();
    updateWarningLine();
  }

  function renderNetworkSelector() {
    var wrap = el("network-grid");
    if (!wrap) return;
    clearChildren(wrap);
    var asset = NORTHMIX.assets.byId(state.assetId);
    if (!asset) return;
    asset.networks.forEach(function (netId) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "network-chip";
      chip.setAttribute("aria-pressed", state.networkId === netId ? "true" : "false");
      chip.textContent = NORTHMIX.networks.name(netId);
      chip.addEventListener("click", function () {
        state.networkId = netId;
        renderNetworkSelector();
        validatePayout();
        updateWarningLine();
      });
      wrap.appendChild(chip);
    });
  }

  function updateWarningLine() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    if (!asset || !net) return;
    setText("warning-ticker", asset.ticker);
    setText("warning-network", net.name.toUpperCase());
  }

  function onPayoutInput(value) {
    state.payoutWallet = value;
    validatePayout();
  }

  function validatePayout() {
    var inp = el("payout-wallet");
    var errEl = el("payout-wallet-error");
    var btn = el("btn-start");
    if (!inp) return;
    var value = inp.value.trim();
    var pair = getPair();
    if (!pair) { btn.disabled = true; return; }
    if (!value) { errEl.classList.add("hidden"); btn.disabled = true; return; }
    if (NORTHMIX.validation.looksLikeSecret(value)) {
      errEl.classList.remove("hidden");
      setText(errEl, "This looks like a seed phrase or private key. Do not paste it here.");
      btn.disabled = true;
      return;
    }
    var v = NORTHMIX.validation.validateByType(value, pair.type);
    if (!v.ok) {
      errEl.classList.remove("hidden");
      setText(errEl, v.error);
      btn.disabled = true;
      return;
    }
    errEl.classList.add("hidden");
    btn.disabled = false;
  }

  function onFeeSlider(value) {
    state.feePercent = parseFloat(value);
    setText("fee-value", state.feePercent.toFixed(1) + "%");
  }
  function onRoundsChange(value) { state.rounds = parseInt(value, 10); setText("rounds-value", String(state.rounds)); }
  function onDelayChange(value) {
    state.delayHours = parseInt(value, 10);
    setText("delay-value", state.delayHours === 0 ? "0h" : state.delayHours + "h");
  }

  function computeSamplePayout() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    if (!asset) return "";
    var sample = asset.ticker === "BTC" ? "1" : asset.ticker === "ETH" ? "10" : "1000";
    var calc = NORTHMIX.fees.calculate(sample, asset, "0");
    if (!calc.ok) return "";
    return calc.display.gross + " " + asset.ticker + " → " + calc.display.serviceFee + " " + asset.ticker + " fee → " + calc.display.net + " " + asset.ticker;
  }

  async function startMixing() {
    var btn = el("btn-start");
    var inp = el("payout-wallet");
    if (btn && btn.disabled) {
      if (inp) { inp.classList.remove("field--flash"); void inp.offsetWidth; inp.classList.add("field--flash"); }
      return;
    }
    if (btn) btn.disabled = true;
    try {
      var res = await NORTHMIX.api.createDeposit({
        asset: state.assetId,
        network: state.networkId,
        payout: state.payoutWallet,
        fee: state.feePercent,
        rounds: state.rounds,
        delay: state.delayHours
      });
      if (res && res.ok) {
        state.session = res;
        ["deposit", "confirm", "verify", "wallet", "result"].forEach(function (s) {
          setText(s + "-ref", res.ref);
        });
        go("deposit");
      } else {
        showStartError(res && res.error ? res.error : "Deposit address unavailable. Try another network.");
      }
    } finally {
      validatePayout();
    }
  }

  function showStartError(text) {
    var errEl = el("payout-wallet-error");
    var btn = el("btn-start");
    if (errEl) { errEl.classList.remove("hidden"); setText(errEl, text); }
    if (btn) btn.disabled = false;
  }

  function onEnterDeposit() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    var pair = getPair();
    if (!asset || !net || !state.session) { go("start"); return; }
    updateWarningLine();
    setText("deposit-address", pair ? pair.address : "—");
    var badge = el("deposit-network-badge");
    if (badge) { setText(badge, net.name.toUpperCase()); badge.classList.remove("badge--fade"); void badge.offsetWidth; badge.classList.add("badge--fade"); }
    var uri = buildUri(pair, state.networkId);
    renderQR(uri);
    startCountdown(state.session.expiresAt);
    var addr = el("deposit-address");
    if (addr) { addr.style.opacity = "0"; requestAnimationFrame(function () { addr.style.opacity = "1"; }); }
    var warn = el("deposit-warning");
    if (warn) { warn.classList.remove("warning-line--pulse"); void warn.offsetWidth; warn.classList.add("warning-line--pulse"); }
  }

  function buildUri(pair, networkId) {
    if (!pair) return "";
    var addr = pair.address;
    if (networkId === "bitcoin") return "bitcoin:" + addr;
    if (networkId === "ethereum" || networkId === "bsc" || networkId === "base" || networkId === "optimism" || networkId === "aurora" || networkId === "polygon" || networkId === "avalanche") return "ethereum:" + addr;
    if (networkId === "litecoin") return "litecoin:" + addr;
    if (networkId === "solana") return "solana:" + addr;
    if (networkId === "tron") return "tron:" + addr;
    if (networkId === "zcash") return "zcash:" + addr;
    return addr;
  }

  function renderQR(data) {
    var target = el("qr-render-target");
    if (!target) return;
    clearChildren(target);
    try {
      var svg = NORTHMIX.qr.renderSVG(data, { cellSize: 5, margin: 2 });
      if (svg) target.innerHTML = svg;
    } catch (e) {
      target.textContent = "QR unavailable.";
    }
  }

  function startCountdown(expiresAt) {
    var box = el("countdown-box");
    var timeEl = el("countdown-time");
    var expiredText = el("countdown-expired-text");
    if (!timeEl) return;
    var end = expiresAt || (Date.now() + 3600000);
    var bar = el("countdown-bar");
    if (!bar) { bar = document.createElement("div"); bar.id = "countdown-bar"; bar.className = "countdown__bar"; box.appendChild(bar); }
    var total = 3600000;
    function tick() {
      var remaining = end - Date.now();
      var pct = Math.max(0, Math.min(100, (remaining / total) * 100));
      if (bar) bar.style.width = pct + "%";
      if (remaining <= 0) {
        timeEl.textContent = "00:00";
        box.classList.add("countdown--expired");
        if (expiredText) expiredText.style.display = "block";
        if (bar) bar.style.width = "0%";
        clearInterval(state.countdownHandle);
        state.countdownHandle = null;
        return;
      }
      var mins = Math.floor(remaining / 60000);
      var secs = Math.floor((remaining % 60000) / 1000);
      timeEl.textContent = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    }
    tick();
    state.countdownHandle = setInterval(tick, 1000);
  }

  async function copyAddress() {
    var pair = getPair();
    if (!pair) return;
    try { await navigator.clipboard.writeText(pair.address); flashButton("btn-copy-address", "COPIED"); } catch (e) {}
  }
  async function copyNetwork() {
    try { await navigator.clipboard.writeText(NORTHMIX.networks.name(state.networkId)); flashButton("btn-copy-network", "COPIED"); } catch (e) {}
  }
  function flashButton(id, text) {
    var btn = el(id);
    if (!btn) return;
    var orig = btn.textContent;
    btn.textContent = text;
    btn.classList.remove("copy-btn--copied");
    void btn.offsetWidth;
    btn.classList.add("copy-btn--copied");
    setTimeout(function () { btn.textContent = orig; btn.classList.remove("copy-btn--copied"); }, 1200);
  }

  function confirmPayment() { go("confirm"); }

  function onEnterConfirm() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    setText("confirm-summary-asset", asset ? asset.name + " (" + asset.ticker + ")" : "—");
    setText("confirm-summary-network", net ? net.name : "—");
    setText("confirm-summary-fee", state.feePercent.toFixed(1) + "%");
    setText("confirm-summary-sample", computeSamplePayout());
    setText("confirm-summary-rounds", String(state.rounds));
    setText("confirm-summary-delay", state.delayHours === 0 ? "immediate" : state.delayHours + "h");
    setText("confirm-network-badge", net ? net.name.toUpperCase() : "—");
    var inp = el("confirm-input");
    if (inp) inp.value = "";
    var errEl = el("confirm-input-error");
    if (errEl) errEl.classList.add("hidden");
    refreshVerifyButton();
  }

  function onConfirmInput(value) {
    var errEl = el("confirm-input-error");
    var v = NORTHMIX.validation.looseValidate(value, state.networkId);
    if (!value || !value.trim()) { errEl.classList.add("hidden"); }
    else if (NORTHMIX.validation.looksLikeSecret(value)) {
      errEl.classList.remove("hidden");
      setText(errEl, "This looks like a seed phrase or private key.");
    } else if (!v.ok) {
      errEl.classList.remove("hidden");
      setText(errEl, v.error);
    } else { errEl.classList.add("hidden"); }
    refreshVerifyButton();
  }
  function refreshVerifyButton() {
    var btn = el("btn-verify");
    var inp = el("confirm-input");
    if (!btn || !inp) return;
    var value = inp.value.trim();
    var v = NORTHMIX.validation.looseValidate(value, state.networkId);
    btn.disabled = !(v.ok && !NORTHMIX.validation.looksLikeSecret(value));
  }
  async function pasteConfirm() {
    try {
      var text = await navigator.clipboard.readText();
      var inp = el("confirm-input");
      if (inp) { inp.value = text || ""; onConfirmInput(inp.value); }
    } catch (e) {}
  }
  function startVerify() { go("verifying"); }

  function onEnterVerifying() {
    var bar = el("verify-bar");
    var text = el("verify-bar-text");
    var stateEl = el("verify-state");
    if (bar) bar.style.width = "0%";
    if (text) text.textContent = "0%";
    if (stateEl) setText(stateEl, "Checking transaction…");
    var states = [
      { pct: 0, label: "Checking transaction…" },
      { pct: 35, label: "Confirming…" },
      { pct: 70, label: "Confirming…" },
      { pct: 100, label: "Confirmed" }
    ];
    var i = 0;
    function advance() {
      if (i >= states.length) return;
      var s = states[i];
      if (bar) bar.style.width = s.pct + "%";
      if (text) text.textContent = s.pct + "%";
      if (stateEl) setText(stateEl, s.label);
      i++;
      if (i < states.length) { state.verifyHandle = setTimeout(advance, 1200); }
      else { state.verifyHandle = setTimeout(function () { go("wallet"); }, 1000); }
    }
    advance();
  }

  function setWalletButtonState(mode, address, networkName) {
    var btn = el("btn-connect-wallet");
    var continueBtn = el("btn-continue-wallet");
    var hint = document.getElementById("wallet-continue-hint");
    var connectedAddress = address || (NORTHMIX.walletAdapter && typeof NORTHMIX.walletAdapter.getAddress === "function" ? NORTHMIX.walletAdapter.getAddress() : null);
    var connectedNetwork = networkName || (NORTHMIX.walletAdapter && typeof NORTHMIX.walletAdapter.getNetwork === "function" ? NORTHMIX.walletAdapter.getNetwork() : null);

    if (!btn) return;
    btn.disabled = mode === "connecting" || mode === "connected";
    btn.classList.toggle("is-connected", mode === "connected");

    if (mode === "connecting") {
      btn.innerHTML = '<span class="wallet-connect-btn__label">CONNECTING</span>';
    } else if (mode === "connected" && connectedAddress) {
      var shortAddress = connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4);
      btn.innerHTML = '<span class="wallet-connect-btn__label"><span>✓</span><span>CONNECTED</span></span><span class="wallet-connect-btn__meta">' + shortAddress + '</span>';
    } else {
      btn.innerHTML = '<span class="wallet-connect-btn__label">CONNECT WALLET</span>';
    }

    if (continueBtn) {
      continueBtn.disabled = !(mode === "connected" && connectedAddress);
    }
    if (hint) {
      hint.textContent = mode === "connected" && connectedAddress ? "Connected: " + connectedAddress.slice(0, 6) + "..." + connectedAddress.slice(-4) + (connectedNetwork ? " • " + connectedNetwork : "") : "Connect a wallet to continue.";
    }
  }

  async function handleWalletConnect() {
    var adapter = global.NORTHMIX && global.NORTHMIX.walletAdapter;
    if (!adapter || typeof adapter.connect !== "function") return;
    setWalletButtonState("connecting");
    try {
      var result = await adapter.connect();
      if (!result || !result.address) {
        setWalletButtonState("idle");
        return;
      }
      if (!state.payoutWallet || !state.payoutWallet.trim()) {
        state.payoutWallet = result.address;
        var payoutInput = el("payout-wallet");
        if (payoutInput) {
          payoutInput.value = result.address;
        }
      }
      setWalletButtonState("connected", result.address, result.network);
      validatePayout();
    } catch (error) {
      setWalletButtonState("idle");
    }
  }

  function onEnterWallet() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    setText("wallet-summary-asset", asset ? asset.name + " (" + asset.ticker + ")" : "—");
    setText("wallet-summary-network", net ? net.name : "—");
    setText("wallet-summary-fee", state.feePercent.toFixed(1) + "%");
    setText("wallet-summary-rounds", String(state.rounds));
    setText("wallet-summary-delay", state.delayHours === 0 ? "immediate" : state.delayHours + "h");
    var connectedAddress = NORTHMIX.walletAdapter && typeof NORTHMIX.walletAdapter.getAddress === "function" ? NORTHMIX.walletAdapter.getAddress() : null;
    if (connectedAddress) {
      setWalletButtonState("connected", connectedAddress, NORTHMIX.walletAdapter.getNetwork && NORTHMIX.walletAdapter.getNetwork());
    } else {
      setWalletButtonState("idle");
    }
  }
  function continueFromWallet() {
    var connectedAddress = NORTHMIX.walletAdapter && typeof NORTHMIX.walletAdapter.getAddress === "function" ? NORTHMIX.walletAdapter.getAddress() : null;
    if (!connectedAddress) {
      return;
    }
    go("result");
  }

  function onEnterResult() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    if (!asset || !net || !state.session) { go("start"); return; }
    setText("result-reference", state.session.ref);
    setText("result-asset", asset.name + " (" + asset.ticker + ")");
    setText("result-network", net.name);
    setText("result-fee", state.feePercent.toFixed(1) + "%");
    setText("result-rounds", String(state.rounds));
    setText("result-delay", state.delayHours === 0 ? "immediate" : state.delayHours + "h");
    setText("result-payout-wallet", state.payoutWallet);
    setText("result-queue-summary", state.rounds + " rounds · " + (state.delayHours === 0 ? "immediate" : state.delayHours + "h delay"));
    setText("result-network-badge", net.name.toUpperCase());
    var linkEl = el("result-explorer-link");
    var pair = getPair();
    if (pair) {
      var url = NORTHMIX.networks.explorerUrl(net.id, pair.address);
      if (url) { linkEl.href = url; linkEl.classList.remove("hidden"); }
      else { linkEl.classList.add("hidden"); }
    }
  }

  function restart() {
    cleanupTimers();
    NORTHMIX.api.clearSession();
    if (NORTHMIX.walletAdapter && typeof NORTHMIX.walletAdapter.disconnect === "function") {
      NORTHMIX.walletAdapter.disconnect();
    }
    state.payoutWallet = "";
    state.feePercent = 1.0;
    state.rounds = 2;
    state.delayHours = 24;
    state.session = null;
    state.assetId = "eth";
    state.networkId = "ethereum";
    var inp = el("payout-wallet");
    if (inp) {
      inp.value = "";
      inp.removeAttribute("readonly");
      inp.setAttribute("aria-readonly", "false");
    }
    var slider = el("fee-slider");
    if (slider) slider.value = "1";
    var rs = el("rounds-select");
    if (rs) rs.value = "2";
    var ds = el("delay-select");
    if (ds) ds.value = "24";
    setText("fee-value", "1%");
    setText("rounds-value", "2");
    setText("delay-value", "24h");
    setWalletButtonState("idle");
    renderAssetList();
    renderNetworkSelector();
    validatePayout();
    updateWarningLine();
    showScreen("start");
  }

  function init() {
    renderAssetList();
    renderNetworkSelector();
    updateWarningLine();
    var payoutInp = el("payout-wallet");
    if (payoutInp) {
      payoutInp.addEventListener("input", function (e) { onPayoutInput(e.target.value); });
      payoutInp.addEventListener("blur", function () { validatePayout(); });
      payoutInp.addEventListener("paste", function () { setTimeout(function () { onPayoutInput(payoutInp.value); }, 0); });
    }
    var feeSlider = el("fee-slider");
    if (feeSlider) feeSlider.addEventListener("input", function (e) { onFeeSlider(e.target.value); });
    var rs = el("rounds-select");
    if (rs) rs.addEventListener("change", function (e) { onRoundsChange(e.target.value); });
    var ds = el("delay-select");
    if (ds) ds.addEventListener("change", function (e) { onDelayChange(e.target.value); });
    var ci = el("confirm-input");
    if (ci) ci.addEventListener("input", function (e) { onConfirmInput(e.target.value); });
    var binds = {
      "btn-start": startMixing, "btn-copy-address": copyAddress, "btn-copy-network": copyNetwork,
      "btn-confirm-payment": confirmPayment, "btn-confirm-paste": pasteConfirm, "btn-verify": startVerify,
      "btn-continue-wallet": continueFromWallet, "btn-start-another": restart,
      "btn-back-deposit": back, "btn-back-confirm": back, "btn-back-wallet": back
    };
    var connectBtn = el("btn-connect-wallet");
    if (connectBtn) connectBtn.addEventListener("click", handleWalletConnect);
    Object.keys(binds).forEach(function (id) {
      var n = el(id);
      if (n) n.addEventListener("click", binds[id]);
    });
    showScreen("start");
    validatePayout();
  }

  function getState() {
    var asset = NORTHMIX.assets.byId(state.assetId);
    var net = NORTHMIX.networks.byId(state.networkId);
    var adapter = NORTHMIX.walletAdapter;
    return {
      ref: state.session ? state.session.ref : "",
      assetId: state.assetId,
      networkId: state.networkId,
      assetTicker: asset ? asset.ticker : "",
      networkName: net ? net.name : "",
      payoutWallet: state.payoutWallet,
      feePercent: state.feePercent,
      rounds: state.rounds,
      delayHours: state.delayHours,
      walletName: adapter && typeof adapter.getWalletName === "function" ? adapter.getWalletName() : ""
    };
  }

  function setNetwork(networkName) {
    var target = null;
    NORTHMIX.networks.list().forEach(function (net) {
      if (net.name.toLowerCase() === String(networkName || "").toLowerCase()) target = net;
    });
    if (!target) return;
    var asset = NORTHMIX.assets.byId(state.assetId);
    if (!asset || asset.networks.indexOf(target.id) === -1) {
      var host = null;
      NORTHMIX.assets.list().forEach(function (item) {
        if (item.networks.indexOf(target.id) !== -1) host = item;
      });
      if (!host) return;
      state.assetId = host.id;
      renderAssetList();
    }
    state.networkId = target.id;
    renderNetworkSelector();
    updateWarningLine();
    validatePayout();
    if (state.screen === "deposit" && state.session) {
      var pair = getPair();
      setText("deposit-address", pair ? pair.address : "—");
      setText("warning-ticker", NORTHMIX.assets.byId(state.assetId).ticker);
      setText("warning-network", target.name.toUpperCase());
      renderQR(buildUri(pair, state.networkId));
    }
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.transactionUI = {
    init: init, go: go, back: back, restart: restart, getState: getState, setNetwork: setNetwork
  };
})(window);
