// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'TEST',
  production: false,
  identityServerUrl: 'https://id-test.your-company.com/auth/realms/OSDR',
  apiUrl: 'https://api.test.dataledger.io/osdr/v1/api',
  blobStorageApiUrl: 'https://api.test.dataledger.io/blob/v1/api',
  imagingUrl: 'https://api.test.dataledger.io/imaging/v1/api',
  signalrUrl: 'https://api.test.dataledger.io/osdr/v1/signalr',
  metadataUrl: 'https://api.test.dataledger.io/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 1 * 1000,
  proxyJSMOL: 'https://api.test.dataledger.io/osdr/v1/api/proxy/jsmol',
  ketcher: 'https://osdr.test.dataledger.io/ketcher/indigo/layout',
};
