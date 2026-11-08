(function (global) {
  "use strict";
  const NETWORKS = [
    { id: "bitcoin", name: "Bitcoin", short: "BTC", explorerBase: "https://blockstream.info", addressPath: "/address/" },
    { id: "ethereum", name: "Ethereum", short: "ETH", explorerBase: "https://etherscan.io", addressPath: "/address/" },
    { id: "base", name: "Base", short: "BASE", explorerBase: "https://basescan.org", addressPath: "/address/" },
    { id: "optimism", name: "Optimism", short: "OP", explorerBase: "https://optimistic.etherscan.io", addressPath: "/address/" },
    { id: "aurora", name: "Aurora", short: "AURORA", explorerBase: "https://aurorascan.dev", addressPath: "/address/" },
    { id: "bsc", name: "BNB Chain", short: "BSC", explorerBase: "https://bscscan.com", addressPath: "/address/" },
    { id: "polygon", name: "Polygon", short: "POLY", explorerBase: "https://polygonscan.com", addressPath: "/address/" },
    { id: "avalanche", name: "Avalanche", short: "AVA", explorerBase: "https://snowtrace.io", addressPath: "/address/" },
    { id: "solana", name: "Solana", short: "SOL", explorerBase: "https://explorer.solana.com", addressPath: "/address/" },
    { id: "tron", name: "TRON", short: "TRX", explorerBase: "https://tronscan.org", addressPath: "/#" },
    { id: "litecoin", name: "Litecoin", short: "LTC", explorerBase: "https://blockchair.com", addressPath: "/litecoin/address/" },
    { id: "zcash", name: "Zcash", short: "ZEC", explorerBase: "https://blockchair.com", addressPath: "/zcash/address/" }
  ];
  function list() { return NETWORKS.slice(); }
  function byId(id) { return NETWORKS.find(function (n) { return n.id === id; }) || null; }
  function name(id) { const n = byId(id); return n ? n.name : id; }
  function short(id) { const n = byId(id); return n ? n.short : id; }
  function explorerUrl(networkId, address) {
    const n = byId(networkId);
    if (!n) return null;
    return n.explorerBase + n.addressPath + address;
  }
  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.networks = { list: list, byId: byId, name: name, short: short, explorerUrl: explorerUrl };
})(window);
