export interface Point {
  x: number;
  y: number;
}

export interface PlayerDraw {
  drawOptions: DrawOptions;
  roomName: string;
}

export interface DrawProps {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | undefined;
}

export interface DrawOptions extends DrawProps {
  strokeColor: string;
  strokeWidth: number[];
  dashGap: number[];
}
