export const environment = {
  name: 'DEV',
  production: false,
  identityServerUrl: 'https://id-dev.your-company.com/auth/realms/OSDR',
  apiUrl: 'https://api.dev.dataledger.io/osdr/v1/api',
  blobStorageApiUrl: 'https://api.dev.dataledger.io/blob/v1/api',
  imagingUrl: 'https://api.dev.dataledger.io/imaging/v1/api',
  signalrUrl: 'https://api.dev.dataledger.io/osdr/v1/signalr',
  metadataUrl: 'https://api.dev.dataledger.io/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 24 * 1000,
  proxyJSMOL: 'https://api.dev.dataledger.io/osdr/v1/api/proxy/jsmol',
  ketcher: 'https://osdr.dev.dataledger.io/ketcher/indigo/layout',
};
