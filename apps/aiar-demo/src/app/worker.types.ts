export enum ClientMessageTypes {
  REQUEST_PREDICTION = 'REQUEST_PREDICTION',
}

export enum WorkerMessageTypes {
  PREDICTION_RESPONSE = 'PREDICTION_RESPONSE',
}

export interface RequestPredictionMessage {
  type: ClientMessageTypes.REQUEST_PREDICTION;
  image: string;
}

export interface PredictionResponseMessage {
  type: WorkerMessageTypes.PREDICTION_RESPONSE;
  msg: string;
}

export type CustomWorkerEvent = PredictionResponseMessage;
export type CustomClientEvent = RequestPredictionMessage;

export type CustomMessageEvent =
  | CustomWorkerEvent
  | CustomClientEvent;
