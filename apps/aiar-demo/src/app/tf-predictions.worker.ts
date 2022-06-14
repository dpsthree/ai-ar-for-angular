/// <reference lib="webworker" />

import {
  ClientMessageTypes,
  CustomClientEvent,
  WorkerMessageTypes,
} from './worker.types';

addEventListener('message', (e: MessageEvent<CustomClientEvent>) => {
  switch (e.data.type) {
    case ClientMessageTypes.REQUEST_PREDICTION:
      predict(e.data.image);
      break;
  }
});

function predict(image: string) {
  console.log('heard from client', image)
  postMessage({ type: WorkerMessageTypes.PREDICTION_RESPONSE, msg: 'Testing' });
}
