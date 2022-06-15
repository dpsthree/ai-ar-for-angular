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
      this.emitLatestImage();
    }
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef | undefined;
  private detectionList: ImageAnnotation[] = [];
  private stopping = false;

  constructor() {}

  ngAfterViewInit() {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const img = new Image();
      img.onload = () => {
        canvas.getContext('2d').drawImage(img, 0, 0);
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.imageFrame.emit(imgData);
      };
      img.src = 'assets/lego.png';
    }
  }

  emitLatestImage() {
    if (this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      this.imageFrame.emit(imgData);
    }
  }

  render() {
    if (this.canvasRef && !this.stopping)
      requestAnimationFrame(() => {
        this.drawImageAndAnnotations();
        this.render();
      });
  }

  drawImageAndAnnotations() {
    if (this.canvasRef) {
      const canvas: HTMLCanvasElement = this.canvasRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.drawImage(ctx, imgData);
        this.drawDetections(ctx);
      }
    }
  }

  drawImage(ctx: CanvasRenderingContext2D, imgData: ImageData) {
    ctx.putImageData(imgData, 0, 0);
  }

  drawDetections(ctx: CanvasRenderingContext2D) {
    this.detectionList.forEach((detection) => {
      ctx.font = '30px Arial';
      ctx.fillText(detection.label, 0, 0);
    });
  }
}
