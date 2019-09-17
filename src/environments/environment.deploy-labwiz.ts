// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  name: 'TEST',
  production: false,
  identityServerUrl: 'I___IDENTITY_SERVER_URL___I',
  apiUrl: 'I___CORE_API_URL___I',
  blobStorageApiUrl: 'I___BLOB_STORAGE_API_URL___I',
  imagingUrl: 'I___IMAGING_URL___I',
  signalrUrl: 'I___SIGNALR_URL___I',
  metadataUrl: 'I___METADATA_URL___I',
  notificationTimeOut: 60 * 60 * 1 * 1000,
  proxyJSMOL: 'I___PROXY_JSMOL_URL___I',
  ketcher: 'I___KETCHER_URL___I',
  maxBlobUploadingFileSize: 10240 * 1024,
  capabilities: {
    chemical: true,
    crystal: true,
    image: true,
    machineLearning: false,
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
    labwiz: true,
  },
  distribution: [
    {
      code: 'labwiz',
      title: 'LabWiz',
    },
  ],
};
