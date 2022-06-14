import * as automl from '@tensorflow/tfjs-automl';

export enum ClientMessageTypes {
  REQUEST_PREDICTION = 'REQUEST_PREDICTION',
}

export enum WorkerMessageTypes {
  PREDICTION_RESPONSE = 'PREDICTION_RESPONSE',
}

export interface RequestPredictionMessage {
  type: ClientMessageTypes.REQUEST_PREDICTION;
  image: ImageData;
}

export interface PredictionResponseMessage {
  type: WorkerMessageTypes.PREDICTION_RESPONSE;
  detections: automl.PredictedObject[];
}

export type CustomWorkerEvent = PredictionResponseMessage;
export type CustomClientEvent = RequestPredictionMessage;

export type CustomMessageEvent =
  | CustomWorkerEvent
  | CustomClientEvent;
