export const environment = {
  name: 'PROD',
  production: true,
  identityServerUrl: 'https://id.your-company.com/auth/realms/OSDR',
  apiUrl: 'https://api.dataledger.io/osdr/v1/api',
  blobStorageApiUrl: 'https://api.dataledger.io/blob/v1/api',
  imagingUrl: 'https://api.dataledger.io/imaging/v1/api',
  signalrUrl: 'https://api.dataledger.io/osdr/v1/signalr',
  metadataUrl: 'https://api.dataledger.io/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 24 * 1000,
  proxyJSMOL: 'https://api.dataledger.io/osdr/v1/api/proxy/jsmol',
  ketcher: 'https://osdr.dataledger.io/ketcher/indigo/layout',
};

