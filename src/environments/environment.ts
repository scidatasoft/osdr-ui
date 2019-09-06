// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'DUMMY',
  production: true,
  identityServerUrl: 'https://id.your-company.com/auth/realms/leanda',
  apiUrl: 'https://api.dev.your-company.com/core/v1/api',
  blobStorageApiUrl: 'https://api.dev.your-company.com/blob/v1/api',
  imagingUrl: 'https://api.dev.your-company.com/imaging/v1/api',
  signalrUrl: 'https://api.dev.your-company.com/core/v1/signalr',
  metadataUrl: 'https://api.dev.your-company.com/metadata/v1/api',
  notificationTimeOut: 60 * 60 * 24 * 1000,
  proxyJSMOL: 'https://api.dev.your-company.com/core/v1/api/proxy/jsmol',
  ketcher: 'https://core.dev.your-company.com/ketcher/indigo/layout',
  maxBlobUploadingFileSize: 10240 * 1024,
  capabilities: {
    chemical: true,
    crystal: true,
    image: true,
    machineLearning: true,
    microscopy: true,
    office: true,
    pdf: true,
    reaction: true,
    spectrum: true,
    tabular: true,
    webPage: true,
    login: true,
    fvc: false,
    ssp: false,
    labwiz: false,
  },
};
