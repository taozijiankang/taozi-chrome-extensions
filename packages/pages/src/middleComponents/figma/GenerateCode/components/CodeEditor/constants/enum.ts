/**
 * 图片裁剪、缩放的模式
 */
export enum UniappImageModeType {
  /** 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素 */
  ScaleToFill = "scaleToFill",
  /** 保持纵横比缩放图片，使图片的长边能完全显示出来，可以完整地将图片显示出来 */
  AspectFit = "aspectFit",
  /** 保持纵横比缩放图片，只保证图片的短边能完全显示出来，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取 */
  AspectFill = "aspectFill",
  /** 宽度不变，高度自动变化，保持原图宽高比不变 */
  WidthFix = "widthFix",
  /** 高度不变，宽度自动变化，保持原图宽高比不变 */
  HeightFix = "heightFix",
  /** 不缩放图片，只显示图片的顶部区域 */
  Top = "top",
  /** 不缩放图片，只显示图片的底部区域 */
  Bottom = "bottom",
  /** 不缩放图片，只显示图片的中间区域 */
  Center = "center",
  /** 不缩放图片，只显示图片的左边区域 */
  Left = "left",
  /** 不缩放图片，只显示图片的右边区域 */
  Right = "right",
  /** 不缩放图片，只显示图片的左上边区域 */
  TopLeft = "topLeft",
  /** 不缩放图片，只显示图片的右上边区域 */
  TopRight = "topRight",
  /** 不缩放图片，只显示图片的左下边区域 */
  BottomLeft = "bottomLeft",
  /** 不缩放图片，只显示图片的右下边区域 */
  BottomRight = "bottomRight"
}
