export type Dictionary = {
  title: string;
  heroTitle: string;
  heroDescription: string;
  conversionTitle: string;
  conversionDescription: string;
  theme: string;
  themeAuto: string;
  themeLight: string;
  themeDark: string;
  pixels: string;
  rootEm: string;
  points: string;
  enter: string;
  addRow: string;
  referenceTitle: string;
  referenceDescription: string;
  resetDefault: string;
  remEquals: string;
  pxEquals: string;
  calculated: string;
  language: string;
};

export const dictionaries: Record<"en" | "zh", Dictionary> = {
  en: {
    title: "Text Size Converter",
    heroTitle: "Design-friendly conversions",
    heroDescription: "Convert pixels, rem, and points instantly. Configure multiple rows to compare styles and update the base reference that powers the calculations.",
    conversionTitle: "Conversion Calculator",
    conversionDescription: "Enter a value in any unit to update the rest automatically.",
    theme: "Theme",
    themeAuto: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    pixels: "Pixels",
    rootEm: "Root Em",
    points: "Points",
    enter: "Enter",
    addRow: "+ Add Conversion Row",
    referenceTitle: "Conversion Reference",
    referenceDescription: "Adjust the root values to match your project guidelines.",
    resetDefault: "Reset to Default",
    remEquals: "1 rem equals (in px)",
    pxEquals: "1 px equals (in pt)",
    calculated: "Calculated",
    language: "Language",
  },
  zh: {
    title: "文本尺寸转换器",
    heroTitle: "设计友好的单位转换",
    heroDescription: "即时转换像素、rem 和点。配置多行以比较样式，并更新计算的基础参考值。",
    conversionTitle: "转换计算器",
    conversionDescription: "在任何单位中输入数值，其他单位将自动更新。",
    theme: "主题",
    themeAuto: "自动",
    themeLight: "浅色",
    themeDark: "深色",
    pixels: "像素",
    rootEm: "Root Em",
    points: "点",
    enter: "输入",
    addRow: "+ 添加转换行",
    referenceTitle: "转换参考",
    referenceDescription: "调整根值以匹配您的项目规范。",
    resetDefault: "重置为默认",
    remEquals: "1 rem 等于 (px)",
    pxEquals: "1 px 等于 (pt)",
    calculated: "计算结果",
    language: "语言",
  },
};
