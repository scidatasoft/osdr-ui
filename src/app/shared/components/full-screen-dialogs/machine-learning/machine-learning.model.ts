export class TrainMachineLearningModel {
    public folderName?: string;
    public trainingParameter?: string;
    public testDataSize?: number;
    public targetFolderId?: Guid;
    public subSampleSize?: number;
    public scaler?: Scaler;
    public modelType?: string;
    public kFold?: number;
    public methods?: string[];
    public fingerprints?: [{}];
    public optimize: boolean;
    public hyperParameters?: IHyperParameters;

    getFingerprint(number: number) {
        return this.fingerprints[number];
    }

    isMethodSelected(methodName: string): boolean {
        return this.methods.includes(methodName);
    }

    getFormValue(data: TrainMachineLearningModel) {
        return [
            {
                folderName: data.folderName,
                modelType: data.modelType,
                targetFolderId: data.targetFolderId
            },
            {
                trainingParameter: data.trainingParameter,
                optimize: data.optimize,
                subSampleSize: data.subSampleSize,
                testDataSize: data.testDataSize,
                kFold: data.kFold,
                scaler: data.scaler,
                hyperParameters: data.hyperParameters
            },
            { methods: data.methods }
        ];
    }
}

export class Guid {
    private value: string = this.empty;
    public static newGuid(): Guid {
        return new Guid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }));
    }
    public static get empty(): string {
        return '00000000-0000-0000-0000-000000000000';
    }
    public get empty(): string {
        return Guid.empty;
    }
    public static isValid(str: string): boolean {
        const validRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return validRegex.test(str);
    }
    constructor(value?: string) {
        if (value) {
            if (Guid.isValid(value)) {
                this.value = value;
            }
        }
    }
    public toString() {
        return this.value;
    }

    public toJSON(): string {
        return this.value;
    }
}

export interface TrainingMode {
    name: string;
    optimize: boolean;
}

export interface TrainingParameter {
    name: string;
    value: string;
}

export interface ModelType {
    id: number;
    value: string;
}

export interface FingerprintSize {
    id: number;
    value: number;
}

export interface TrainingMethod {
    key: string;
    value: string;
    enum: number;
    type: string;
}
export interface Scaler {
    id: number;
    value: string;
    name: string;
}

export interface IHyperParameters {
    numberOfIterations: number;
    optimizationMethod: string;
}
