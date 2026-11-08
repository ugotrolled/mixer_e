(function (global) {
  "use strict";
  const ASSETS = [
    { id: "btc", name: "Bitcoin", ticker: "BTC", logo: "assets/logos/btc.svg", decimals: 8, networks: ["bitcoin"] },
    { id: "eth", name: "Ethereum", ticker: "ETH", logo: "assets/logos/eth.svg", decimals: 18, networks: ["ethereum", "base", "optimism", "aurora"] },
    { id: "usdt", name: "Tether", ticker: "USDT", logo: "assets/logos/usdt.svg", decimals: 6, networks: ["ethereum", "bsc", "polygon", "solana", "tron"] },
    { id: "usdc", name: "USD Coin", ticker: "USDC", logo: "assets/logos/usdc.svg", decimals: 6, networks: ["ethereum", "bsc", "polygon", "avalanche", "solana"] },
    { id: "bnb", name: "BNB", ticker: "BNB", logo: "assets/logos/bnb.svg", decimals: 18, networks: ["bsc"] },
    { id: "sol", name: "Solana", ticker: "SOL", logo: "assets/logos/sol.svg", decimals: 9, networks: ["solana"] },
    { id: "ltc", name: "Litecoin", ticker: "LTC", logo: "assets/logos/ltc.svg", decimals: 8, networks: ["litecoin"] },
    { id: "zec", name: "Zcash", ticker: "ZEC", logo: "assets/logos/zec.svg", decimals: 8, networks: ["zcash"] }
  ];
  function list() { return ASSETS.slice(); }
  function byId(id) { return ASSETS.find(function (a) { return a.id === id; }) || null; }
  function networksFor(id) { const a = byId(id); return a ? a.networks.slice() : []; }
  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.assets = { list: list, byId: byId, networksFor: networksFor };
})(window);
