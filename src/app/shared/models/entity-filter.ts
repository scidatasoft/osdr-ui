export enum EEntityFilter {
  ALL = 'all',
  SHARED_BY_ME = 'sharedByMe',
  SHARED_WITH_ME = 'sharedWithMe',
  DOCUMENTS = 'documents',
  IMAGES = 'images',
  MODELS = 'models',
  STRUCTURES = 'structures',
  CRYSTALS = 'crystals',
  REACTIONS = 'reactions',
  SPECTRA = 'spectra',
  DATASETS = 'datasets',
  WEBPAGES = 'webpages',
  MICROSCOPY = 'microscopy',
}

export interface IFilter {
  capability: Capability;
  filterKey: EEntityFilter[];
}

export interface ICounter {
  title: string;
  key: string;
  count: number;
  hidden: boolean;
}

export enum Capability {
  CHEMICAL = 'chemical',
  CRYSTAL = 'crystal',
  IMAGE = 'image',
  MACHINELEARNING = 'machineLearning',
  MICROSCOPY = 'microscopy',
  OFFICE = 'office',
  PDF = 'pdf',
  REACTION = 'reaction',
  SPECTRUM = 'spectrum',
  TABULAR = 'tabular',
  WEBPAGE = 'webPage',
  LOGIN = 'login',
}
