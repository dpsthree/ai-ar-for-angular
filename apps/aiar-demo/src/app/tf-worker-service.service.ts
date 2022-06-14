import { Injectable } from '@angular/core';
import {
  ClientMessageTypes,
  CustomWorkerEvent,
  RequestPredictionMessage,
  WorkerMessageTypes,
} from './worker.types';

@Injectable({
  providedIn: 'root',
})
export class TfWorkerServiceService {
  worker = new Worker(new URL('./tf-predictions.worker.ts', import.meta.url));

  constructor() {
    this.worker.addEventListener(
      'message',
      (e: MessageEvent<CustomWorkerEvent>) => {
        switch (e.data.type) {
          case WorkerMessageTypes.PREDICTION_RESPONSE:
            this.handlePredictionResponse(e.data.msg);
        }
      }
    );
  }

  requestPrediction(image: string) {
    const msg: RequestPredictionMessage = {
      type: ClientMessageTypes.REQUEST_PREDICTION,
      image,
    };
    this.worker.postMessage(msg);
  }

  handlePredictionResponse(msg: string) {
    console.log('Heard from worker', msg);
  }
}
