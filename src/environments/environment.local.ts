// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'LOCAL',
  production: false,
  identityServerUrl: 'https://id-dev.your-company.com/auth/realms/OSDR',
  // apiUrl: 'http://localhost:28610/api',
  apiUrl: 'http://localhost:28611/api',
  // apiUrl: 'https://api.dev.dataledger.io/osdr/v1/api',
  blobStorageApiUrl: 'http://localhost:18006/api',
  imagingUrl: 'http://localhost:7972/api',
  signalrUrl: 'http://localhost:28611/signalr',
  metadataUrl: 'http://localhost:63790/api',
  notificationTimeOut: 60 * 60 * 24 * 1000,
  proxyJSMOL: 'http://localhost:28611/api/proxy/jsmol',
  ketcher: 'https://osdr.dev.dataledger.io/ketcher/indigo/layout',
};
