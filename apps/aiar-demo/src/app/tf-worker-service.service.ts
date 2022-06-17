import { Injectable } from '@angular/core';
import * as automl from '@tensorflow/tfjs-automl';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

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
  detectionSource = new BehaviorSubject<automl.PredictedObject[]>([]);
  readonly detections = this.detectionSource.asObservable();

  private imageSourceSub: Subscription | undefined;

  constructor() {
    this.worker.addEventListener(
      'message',
      (e: MessageEvent<CustomWorkerEvent>) => {
        switch (e.data.type) {
          case WorkerMessageTypes.PREDICTION_RESPONSE:
            this.handlePredictionResponse(e.data.detections);
        }
      }
    );
  }

  requestPredictions(imageSource: Observable<ImageData | undefined>) {
    if (this.imageSourceSub) {
      this.imageSourceSub.unsubscribe();
    }
    this.imageSourceSub = imageSource.subscribe((image) => {
      if (image) {
        const msg: RequestPredictionMessage = {
          type: ClientMessageTypes.REQUEST_PREDICTION,
          image,
        };
        this.worker.postMessage(msg);
      }
    });
  }

  handlePredictionResponse(detections: automl.PredictedObject[]) {
    this.detectionSource.next(detections);
  }

  stopPredictions() {
    this.imageSourceSub?.unsubscribe();
  }
}
