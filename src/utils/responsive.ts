// utils/responsive.ts
import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// scale for width (based on 375 design width like iPhone X)
const guidelineBaseWidth = 375;

export function scale(size: number) {
  return (width / guidelineBaseWidth) * size;
}

export function moderateScale(size: number, factor = 0.5) {
  return size + (scale(size) - size) * factor;
}

export function fontSize(size: number) {
  return PixelRatio.getFontScale() * moderateScale(size);
}
