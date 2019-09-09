export class FeaturesCalculation {
}

export interface FeatureStatus {
    status: number;
    statusText?: string;
    body?: any;
}

export enum ComputationStatus {
    SUCCESS = 'SUCCESS',
    RENDERING = 'RENDERING',
    RENDERED = 'RENDERED',
    PROCESSING = 'PROCESSING',
    ABSENT = 'ABSENT',
    FAILED = 'FAILED',
}
