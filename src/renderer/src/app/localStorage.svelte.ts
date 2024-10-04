export const storageKeys = {
  svgRightHanded: "svgRightHanded",
  svgTiling: "svgTiling",
  svgShowGrid: "svgShowGrid",
  svgShowAxes: "svgShowAxes",
  svgUIEpsilonFactor: "svgUIEpsilonFactor",
  svgSnapRadiusFactor: "svgSnapRadiusFactor",
  svgRadialSnapDegrees: "svgRadialSnapDegrees",
  svgRadialSnapOffset: "svgRadialSnapOffset",
  svgStrokeWidthFactor: "svgStrokeWidthFactor",
  svgStrokeWidthAbsoluteMin: "svgStrokeWidthAbsoluteMin",
  svgVertexRadiusFactor: "svgVertexRadiusFactor",
};

export const getStorageBoolean = (key: string, defaultValue: boolean): boolean => (
  localStorage.getItem(key) !== null
    ? localStorage.getItem(key) === "true"
    : defaultValue);

export const getStorageNumber = (key: string, defaultValue: number): number => {
  const current = localStorage.getItem(key);
  if (current == null) { return defaultValue; }
  return parseFloat(current);
};

export const getStorageString = (key: string, defaultValue: string): string => {
  return localStorage.getItem(key) || defaultValue;
};

//class LocalStorageState<T> {
//  key: string;
//  value: T = $state<T>() as T;
//
//  constructor(key: string, value: T) {
//    this.key = key;
//    this.value = value;
//
//    const current = localStorage.getItem(this.key);
//    if (current != null) { this.value = this.deserialize(current); }
//
//    $effect.root(() => {
//      $effect(() => localStorage.setItem(this.key, String(this.value)));
//      return () => { };
//    });
//  }
//
//  deserialize(input: any): T {
//    try {
//      return JSON.parse(input);
//    } catch (err) {
//      return input;
//    }
//  }
//}
//
//export const localState = <T>(key: string, value: T) => new LocalStorageState<T>(key, value);

