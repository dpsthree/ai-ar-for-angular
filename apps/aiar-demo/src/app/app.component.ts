import {
  Component,
  TemplateRef,
  ViewChild,
  ViewRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { TfWorkerServiceService } from './tf-worker-service.service';

@Component({
  selector: 'aiar-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvasRef: ElementRef | undefined;

  constructor(private tfws: TfWorkerServiceService) {}

  ngAfterViewInit() {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const img = new Image();
      img.onload = () => {
        canvas.getContext('2d').drawImage(img, 0, 0);
      };
      img.src = 'assets/lego.png';
    }
  }

  makePrediction() {
    // get image data from canvas
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.tfws.requestPrediction(imgData);
    }
  }
}
