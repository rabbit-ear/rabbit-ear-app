export type ViewportUIEvent = {
  point: [number, number];
};

export type ViewportMouseEvent = MouseEvent & ViewportUIEvent;
export type ViewportTouchEvent = TouchEvent & ViewportUIEvent;
export type ViewportWheelEvent = WheelEvent & ViewportUIEvent;

export interface ViewportEvents {
  // mouse events
  onmousemove?: (event: ViewportMouseEvent) => void;
  onmousedown?: (event: ViewportMouseEvent) => void;
  onmouseup?: (event: ViewportMouseEvent) => void;
  onmouseleave?: (event: ViewportMouseEvent) => void;
  onwheel?: (event: ViewportWheelEvent) => void;
  // touch screen events
  touchstart?: (event: ViewportTouchEvent) => void;
  touchend?: (event: ViewportTouchEvent) => void;
  touchmove?: (event: ViewportTouchEvent) => void;
  touchcancel?: (event: ViewportTouchEvent) => void;
  // keyboard events
  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
}
