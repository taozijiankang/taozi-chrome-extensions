import { UniappImageModeType } from "./enum";

export const UniappImageModeTypeOptions = [
  {
    label: "不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素",
    value: UniappImageModeType.ScaleToFill
  },
  {
    label: "保持纵横比缩放图片，使图片的长边能完全显示出来，可以完整地将图片显示出来",
    value: UniappImageModeType.AspectFit
  },
  {
    label: "保持纵横比缩放图片，只保证图片的短边能完全显示出来，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取",
    value: UniappImageModeType.AspectFill
  },
  {
    label: "宽度不变，高度自动变化，保持原图宽高比不变",
    value: UniappImageModeType.WidthFix
  },
  {
    label: "高度不变，宽度自动变化，保持原图宽高比不变",
    value: UniappImageModeType.HeightFix
  },
  {
    label: "不缩放图片，只显示图片的顶部区域",
    value: UniappImageModeType.Top
  },
  {
    label: "不缩放图片，只显示图片的底部区域",
    value: UniappImageModeType.Bottom
  },
  {
    label: "不缩放图片，只显示图片的中间区域",
    value: UniappImageModeType.Center
  },
  {
    label: "不缩放图片，只显示图片的左边区域",
    value: UniappImageModeType.Left
  },
  {
    label: "不缩放图片，只显示图片的右边区域",
    value: UniappImageModeType.Right
  },
  {
    label: "不缩放图片，只显示图片的左上边区域",
    value: UniappImageModeType.TopLeft
  },
  {
    label: "不缩放图片，只显示图片的右上边区域",
    value: UniappImageModeType.TopRight
  },
  {
    label: "不缩放图片，只显示图片的左下边区域",
    value: UniappImageModeType.BottomLeft
  },
  {
    label: "不缩放图片，只显示图片的右下边区域",
    value: UniappImageModeType.BottomRight
  }
];
