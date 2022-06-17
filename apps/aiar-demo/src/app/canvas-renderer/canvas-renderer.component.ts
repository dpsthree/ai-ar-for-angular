import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { ImageAnnotation } from '../app.types';

@Component({
  selector: 'aiar-canvas-renderer',
  templateUrl: './canvas-renderer.component.html',
  styleUrls: ['./canvas-renderer.component.scss'],
})
export class CanvasRendererComponent implements AfterViewInit {
  @Output()
  imageFrame = new EventEmitter<ImageData>();

  @Input() set detections(detections: ImageAnnotation[] | undefined | null) {
    if (detections) {
      this.detectionList = detections;
    }
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef | undefined;
  private video = document.createElement('video');
  private detectionList: ImageAnnotation[] = [];
  private stopping = false;

  constructor() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { min: 1280, max: 1280 },
          height: { min: 720, max: 720 },
        },
      })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.play();
      });
  }

  ngAfterViewInit() {
    this.render();
  }

  render() {
    requestAnimationFrame(() => {
      const canvas = this.canvasRef?.nativeElement;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.imageFrame.emit(imgData);
      this.drawDetections(ctx);
      this.render();
    });
  }

  drawImage(ctx: CanvasRenderingContext2D, imgData: ImageData) {
    ctx.putImageData(imgData, 0, 0);
  }

  drawDetections(ctx: CanvasRenderingContext2D) {
    this.detectionList.forEach((detection) => {
      ctx.font = '15px Arial';
      ctx.rect(
        detection.box.left,
        detection.box.top,
        detection.box.width,
        detection.box.height
      );
      ctx.stroke();
      ctx.fillStyle = '#435a6b';
      ctx.fillText(detection.label, detection.box.left, detection.box.top + 10);
    });
  }
}
