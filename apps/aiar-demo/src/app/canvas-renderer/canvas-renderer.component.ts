import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
} from '@angular/core';
import { ImageAnnotation } from '../app.types';

const RENDER_TIMING = 300;
const DETECTION_BOX_COLOR = '#62b8c9';
const DETECTION_TEXT_COLOR = '#62b8c9';
const SHADOW_COLOR = 'rgb(50,50,50)';

@Component({
  selector: 'aiar-canvas-renderer',
  templateUrl: './canvas-renderer.component.html',
})
export class CanvasRendererComponent implements AfterViewInit, OnDestroy {
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
  private processing = false;
  private animationFrame: number | undefined;

  windowWidth: number | undefined = 1;
  windowHeight: number | undefined = 1;

  constructor() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1920, max: 1920 }, // min: 1280, max: 1280 },
          height: { ideal: 1080, max: 1080 }, // min: 720, max: 720 },
        },
        audio: false,
      })
      .then((stream) => {
        this.setVideoWindowUpdate(stream);

        this.video.srcObject = stream;
        this.video.play();
      });
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    if (typeof this.animationFrame === 'number') {
      cancelAnimationFrame(this.animationFrame);
    }

    //TODO:: Need to remove the screen.orientation event listener here
  }

  render() {
    this.animationFrame = requestAnimationFrame(() => {
      const canvas = this.canvasRef?.nativeElement;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

      if (!this.processing) {
        this.processing = true;
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.imageFrame.emit(imgData);
        setTimeout(() => (this.processing = false), RENDER_TIMING);
      }

      this.drawDetections(ctx);
      this.render();
    });
  }

  drawDetections(ctx: CanvasRenderingContext2D) {
    this.detectionList.forEach((detection) => {
      this.drawSingleDetection(ctx, detection);
    });
  }

  drawSingleDetection(
    ctx: CanvasRenderingContext2D,
    detection: ImageAnnotation
  ) {
    ctx.font = '15px Arial';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = SHADOW_COLOR;
    ctx.shadowBlur = 4;

    ctx.strokeStyle = DETECTION_BOX_COLOR;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.rect(
      detection.box.left,
      detection.box.top,
      detection.box.width,
      detection.box.height
    );
    ctx.stroke();
    ctx.fillStyle = DETECTION_TEXT_COLOR;
    ctx.fillText(
      detection.label,
      detection.box.left + 5,
      detection.box.top + 15
    );
  }

  setVideoWindowSize(stream: MediaStream) {
    const stream_settings = stream.getVideoTracks()[0].getSettings();

    // actual width & height of the camera video
    const stream_width = stream_settings.width;
    const stream_height = stream_settings.height;

    if (stream_width) {
      this.windowWidth =
        stream_width <= screen.availWidth ? stream_width : screen.availWidth;
    }
    if (stream_height) {
      this.windowHeight =
        stream_height <= screen.availHeight
          ? stream_height
          : screen.availHeight;
    }
  }

  setVideoWindowUpdate(stream: MediaStream) {
    //Only sets this size the on init. Does not account for screen rotation.
    this.setVideoWindowSize(stream);

    //Listens for change to account for screen rotation.
    screen.orientation.addEventListener('change', () => {
      this.setVideoWindowSize(stream);
    });
  }
}
