(function (global) {
  "use strict";

  let currentAddress = null;
  let currentNetwork = null;
  let currentWallet = null;

  async function connect() {
    const connector = global.NORTHMIX && global.NORTHMIX.connector;
    if (!connector || typeof connector.openConnector !== 'function') {
      return Promise.reject(new Error('Wallet connector is not ready.'));
    }

    const result = await connector.openConnector();
    if (!result || !result.address || !result.network) {
      return Promise.reject(new Error('Wallet connection was cancelled.'));
    }

    currentAddress = result.address;
    currentNetwork = result.network;
    currentWallet = result.name || null;
    return { address: currentAddress, network: currentNetwork };
  }

  function getAddress() {
    return currentAddress;
  }

  function getNetwork() {
    return currentNetwork;
  }

  function getWalletName() {
    return currentWallet;
  }

  function disconnect() {
    currentAddress = null;
    currentNetwork = null;
    currentWallet = null;
  }

  global.NORTHMIX = global.NORTHMIX || {};
  global.NORTHMIX.walletAdapter = {
    connect: connect,
    getAddress: getAddress,
    getNetwork: getNetwork,
    getWalletName: getWalletName,
    disconnect: disconnect
  };
})(window);
