import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import * as automl from '@tensorflow/tfjs-automl';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TfWorkerServiceService } from './tf-worker-service.service';

@Component({
  selector: 'aiar-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvasRef: ElementRef | undefined;

  updatedDetections: Observable<automl.PredictedObject[]> =
    this.tfws.detections;

  private predictionTrigger = new BehaviorSubject<ImageData | undefined>(
    undefined
  );

  constructor(private tfws: TfWorkerServiceService) {}

  ngAfterViewInit() {
    this.tfws.requestPredictions(this.predictionTrigger);
  }

  makePrediction(image: ImageData) {
    this.predictionTrigger.next(image);
  }
}
