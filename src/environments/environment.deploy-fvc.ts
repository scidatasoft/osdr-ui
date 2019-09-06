// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'TEST',
  production: false,
  identityServerUrl: 'NOT_SET',
  apiUrl: 'I___CORE_API_URL___I',
  blobStorageApiUrl: 'NOT_SET',
  imagingUrl: 'NOT_SET',
  signalrUrl: 'NOT_SET',
  metadataUrl: 'NOT_SET',
  notificationTimeOut: 60 * 60 * 1 * 1000,
  proxyJSMOL: 'NOT_SET',
  ketcher: 'NOT_SET',
  maxBlobUploadingFileSize: 10240 * 1024,
  capabilities: {
    chemical: false,
    crystal: false,
    image: true,
    machineLearning: false,
    microscopy: false,
    office: false,
    pdf: false,
    reaction: false,
    spectrum: false,
    tabular: false,
    webPage: false,
    login: false,
    fvc: true,
    ssp: false,
    labwiz: false,
  },
};
