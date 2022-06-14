/// <reference lib="webworker" />

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as automl from '@tensorflow/tfjs-automl';

import {
  ClientMessageTypes,
  CustomClientEvent,
  PredictionResponseMessage,
  WorkerMessageTypes,
} from './worker.types';

let model: automl.ObjectDetectionModel;

automl.loadObjectDetection('/assets/model.json').then((m) => (model = m));

addEventListener('message', (e: MessageEvent<CustomClientEvent>) => {
  switch (e.data.type) {
    case ClientMessageTypes.REQUEST_PREDICTION:
      predict(e.data.image);
      break;
  }
});

async function predict(image: ImageData) {
  const detections = await model.detect(image);
  const msg: PredictionResponseMessage = {
    type: WorkerMessageTypes.PREDICTION_RESPONSE,
    detections,
  };
  postMessage(msg);
}
