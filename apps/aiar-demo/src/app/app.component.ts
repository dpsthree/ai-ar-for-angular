import { Component } from '@angular/core';
import { TfWorkerServiceService } from './tf-worker-service.service';

@Component({
  selector: 'aiar-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'aiar-demo';

  constructor(private tfws: TfWorkerServiceService) {}

  makePrediction() {
    this.tfws.requestPrediction('test string from client');
  }
}
