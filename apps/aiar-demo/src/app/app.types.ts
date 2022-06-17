export interface ImageAnnotation {
  label: string;
  box: {
    height: number;
    left: number;
    top: number;
    width: number;
  };
  score: number;
}
