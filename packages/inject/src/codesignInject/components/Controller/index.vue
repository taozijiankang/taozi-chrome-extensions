<template>
  <div class="controller">
    <ElForm :model="{}" :rules="{}" label-width="auto" :show-message="false" label-suffix=":">
      <ElFormItem label-position="left" label="项目类型">
        <ElSelect v-model="objectTypeInput">
          <ElOption v-for="item in ObjectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label-position="left" label="框架类型">
        <ElSelect v-model="frameTypeInput">
          <ElOption v-for="item in FrameTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label-position="left" label="元素类型">
        <ElTag class="type-item" effect="dark" round>
          <ElIcon :size="12" v-if="elType === ElType.Div">
            <Box />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Img">
            <Picture />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Icon">
            <PictureRounded />
          </ElIcon>
          <ElIcon :size="12" v-if="elType === ElType.Text">
            <Document />
          </ElIcon>
          {{ ElTypeDesc[elType] }}
        </ElTag>
      </ElFormItem>
      <ElFormItem label-position="left" label="代码注释">
        <ElInput v-model="annotationInput" type="text" clearable placeholder="请输入" />
      </ElFormItem>
      <ElFormItem label-position="left" label="元素名称">
        <div class="form-item-content">
          <ElInput v-model="nameTranslateInput" type="text" clearable @keyup.enter="handleNameTranslate" placeholder="请输入">
            <template #append>
              <ElButton @click="handleNameTranslate" :loading="nameTranslateLoading">生成</ElButton>
            </template>
          </ElInput>
          <ElInput v-model="nameInput" type="text" clearable placeholder="请输入" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" v-if="frameTypeInput === FrameType.Vue && vueTemplateList.length > 0">
        <template #label>
          <div class="form-item-label" style="background-color: #42b883">
            <span style="color: #ffffff">vue-template</span>
          </div>
        </template>
        <div class="form-item-content">
          <template v-for="(item, index) in vueTemplateList" :key="index">
            <span class="form-item-content-title" v-if="typeof item === 'object' && item.title">{{ item.title }}</span>
            <Code :code="getAnnotation('template') + (typeof item === 'string' ? item : item.code)" :type="CodeType.Vue" />
          </template>
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" v-if="frameTypeInput === FrameType.React && reactTemplateList.length > 0">
        <template #label>
          <div class="form-item-label" style="background-color: #087ea4">
            <span style="color: #ffffff">react-template</span>
          </div>
        </template>
        <div class="form-item-content">
          <template v-for="(item, index) in reactTemplateList" :key="index">
            <span class="form-item-content-title" v-if="typeof item === 'object' && item.title">{{ item.title }}</span>
            <Code :code="getAnnotation('template') + (typeof item === 'string' ? item : item.code)" :type="CodeType.React" />
          </template>
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" v-if="jsList.length > 0">
        <template #label>
          <div class="form-item-label" style="background-color: #f7df1e">
            <span style="color: #2f2e2d">js</span>
          </div>
        </template>
        <div class="form-item-content">
          <ElInput v-if="elType === ElType.Icon" v-model="iconUrlInput" type="text">
            <template #prepend> <span>iconUrl</span> </template>
          </ElInput>
          <Code v-for="(item, index) in jsList" :key="index" :code="getAnnotation('js') + item" :type="CodeType.Js" />
        </div>
      </ElFormItem>
      <ElFormItem label-position="top" v-if="cssList.length > 0">
        <template #label>
          <div class="form-item-label" style="background-color: #bd2d30">
            <span style="color: #ffffff">css</span>
          </div>
        </template>
        <div class="form-item-content">
          <Code v-for="(item, index) in cssList" :key="index" :code="getAnnotation('css') + item" :type="CodeType.Css" />
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { sendMessage } from "@taozi-chrome-extensions/common/src/messageServer";
import { MessageType } from "@taozi-chrome-extensions/common/src/constant/messageType";
import { ElForm, ElFormItem, ElButton, ElInput, ElSelect, ElOption, ElMessage, ElIcon, ElTag } from "element-plus";
import { Box, Picture, PictureRounded, Document } from "@element-plus/icons-vue";
import { kebabToCamelCase, camelToKebabCase, toValidVariableName } from "@taozi-chrome-extensions/common/src/utils/global";
import Code from "../../../components/Code/index.vue";
import { codesignLocalStorage, type CodesignLocalStorage } from "@taozi-chrome-extensions/common/src/local/codesign";
import { getCssPropConfig, ElType, ObjectType, ObjectTypeOptions, ElTypeDesc, FrameTypeOptions, FrameType } from "./index";
import { parseCssRules, type CssProp, type CssRule } from "./parseCssRules";
import { CodeType } from "@/components/Code";

const props = defineProps<{
  identification: string;
  elType: ElType;
  textContent: string;
  cssCode: string;
}>();

// State
const nameTranslateInput = ref("");
const nameInput = ref("");
const nameTranslateLoading = ref(false);
const iconUrlInput = ref("");
const objectTypeInput = ref<ObjectType>(ObjectType.Pc);
const frameTypeInput = ref<FrameType>(FrameType.Vue);
const annotationInput = ref("");

const config = ref<CodesignLocalStorage["config"]>({
  ignoreCssFontFamily: false,
  boxSizing: false,
  reactCssModuleName: "",
});

watch([nameInput, nameTranslateInput, objectTypeInput, frameTypeInput, iconUrlInput, annotationInput], () => {
  codesignLocalStorage.edit((v) => {
    v.objectType = objectTypeInput.value;
    v.frameType = frameTypeInput.value;
    if (!v.names) v.names = {};
    v.names[props.identification] = nameInput.value;
    if (!v.nameTranslates) v.nameTranslates = {};
    v.nameTranslates[props.identification] = nameTranslateInput.value;
    if (!v.iconUrls) v.iconUrls = {};
    v.iconUrls[props.identification] = iconUrlInput.value;
    if (!v.annotations) v.annotations = {};
    v.annotations[props.identification] = annotationInput.value;
  });
});

const handleNameTranslate = async () => {
  if (!nameTranslateInput.value || nameTranslateLoading.value) return;

  nameTranslateLoading.value = true;
  try {
    const res = await sendMessage<string>({
      type: MessageType.BaiduTranslate,
      value: nameTranslateInput.value,
    });
    if (res) {
      nameInput.value = toValidVariableName(res);
    }
  } catch (err) {
    console.error(err);
    ElMessage({
      message: String(err),
      type: "error",
    });
  } finally {
    nameTranslateLoading.value = false;
  }
};

const getCssRules = () => {
  const cssPropConfig = getCssPropConfig(objectTypeInput.value, {
    ignoreCssFontFamily: config.value?.ignoreCssFontFamily,
  });
  return parseCssRules({
    cssCode: props.cssCode,
    includePropNames: cssPropConfig.includePropNames[props.elType],
    excludeProps: cssPropConfig.excludeProps[props.elType],
    supplementProps: cssPropConfig.supplementProps[props.elType],
    options: {
      boxSizing: config.value?.boxSizing,
    },
  });
};

const getValidVariableName = (type: ElType, index: number = 0, isCamelCase: boolean = false) => {
  switch (type) {
    case ElType.Text: {
      return kebabToCamelCase(toValidVariableName(`${nameInput.value}-text${index == 0 ? "" : `-${index}`}`), isCamelCase);
    }
    case ElType.Img: {
      return kebabToCamelCase(toValidVariableName(`${nameInput.value}-img${index == 0 ? "" : `-${index}`}`), isCamelCase);
    }
    case ElType.Icon: {
      return kebabToCamelCase(toValidVariableName(`${nameInput.value}-icon${index == 0 ? "" : `-${index}`}`), isCamelCase);
    }
    case ElType.Div: {
      return kebabToCamelCase(toValidVariableName(`${nameInput.value}${index == 0 ? "" : `-${index}`}`), isCamelCase);
    }
  }
};

const getAnnotation = (type: "template" | "js" | "css") => {
  if (!annotationInput.value) return "";
  switch (type) {
    case "template": {
      return `<!-- ${annotationInput.value} -->\n`;
    }
    case "js": {
      return `/** ${annotationInput.value} */\n`;
    }
    case "css": {
      return `// ${annotationInput.value}\n`;
    }
    default: {
      return "";
    }
  }
};

const vueTemplateList = computed(() => {
  switch (props.elType) {
    /** 文本 */
    case ElType.Text: {
      return getCssRules()
        .map((item, i) => {
          const className = camelToKebabCase(getValidVariableName(ElType.Text, i));
          const text = (item.query || "").trim();
          if (objectTypeInput.value === ObjectType.Pc) {
            return [
              {
                title: `文本形式${i ? `-${i}` : ""}`,
                code: `<span class="${className}">${text}</span>`,
              },
              {
                title: `变量形式${i ? `-${i}` : ""}`,
                code: `<span class="${className}"> {{ "${text}" }} </span>`,
              },
            ];
          }
          return [
            {
              title: `文本形式${i ? `-${i}` : ""}`,
              code: `<text class="${className}">${text}</text>`,
            },
            {
              title: `变量形式${i ? `-${i}` : ""}`,
              code: `<text class="${className}"> {{ "${text}" }} </text>`,
            },
          ];
        })
        .flat();
    }
    /** 图片 */
    case ElType.Img: {
      const getSize = (name: string) => {
        return (
          getCssRules()
            .reduce<CssProp[]>((a, b) => {
              a.push(...b.props);
              return a;
            }, [])
            .find((item) => item.name === name)?.value || "500"
        );
      };
      const className = camelToKebabCase(getValidVariableName(ElType.Img));
      const imageSrc = `https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}`;
      if (objectTypeInput.value === ObjectType.Pc) {
        return ["img", "CustomImage"].map((elType) => `<${elType} src="${imageSrc}" class="${className}" />`);
      }
      return ["img", "CustomImage"].map((elType) => `<${elType} src="${imageSrc}" class="${className}" mode="aspectFill" />`);
    }
    /** 切图 */
    case ElType.Icon: {
      const className = camelToKebabCase(getValidVariableName(ElType.Icon));
      const srcVarName = kebabToCamelCase(className, true);
      if (objectTypeInput.value === ObjectType.Pc) {
        return [`<img :src="${srcVarName}" class="${className}" />`];
      }
      return [`<image :src="${srcVarName}" class="${className}" mode="scaleToFill" />`];
    }
    /** 盒子 */
    case ElType.Div: {
      const className = camelToKebabCase(getValidVariableName(ElType.Div));
      if (objectTypeInput.value === ObjectType.Pc) {
        return [`<div class="${className}"></div>`];
      }
      return [`<view class="${className}"></view>`];
    }
  }
});

const reactTemplateList = computed(() => {
  const reactCssModuleName = config.value?.reactCssModuleName;
  const getClassNameCode = (className: string) => {
    if (reactCssModuleName) {
      return `className={${reactCssModuleName}.${kebabToCamelCase(className)}}`;
    }
    return `className="${className}"`;
  };
  switch (props.elType) {
    /** 文本 */
    case ElType.Text: {
      return getCssRules()
        .map((item, i) => {
          const className = camelToKebabCase(getValidVariableName(ElType.Text, i));
          const classNameCode = getClassNameCode(className);
          const text = (item.query || "").trim();
          if (objectTypeInput.value === ObjectType.Pc) {
            return [
              {
                title: `文本形式${i ? `-${i}` : ""}`,
                code: `<span ${classNameCode}>${text}</span>`,
              },
              {
                title: `变量形式${i ? `-${i}` : ""}`,
                code: `<span ${classNameCode}> {"${text}"} </span>`,
              },
            ];
          }
          return [
            {
              title: `文本形式${i ? `-${i}` : ""}`,
              code: `<text ${classNameCode}>${text}</text>`,
            },
            {
              title: `变量形式${i ? `-${i}` : ""}`,
              code: `<text ${classNameCode}> {"${text}"} </text>`,
            },
          ];
        })
        .flat();
    }
    /** 图片 */
    case ElType.Img: {
      const getSize = (name: string) => {
        return (
          getCssRules()
            .reduce<CssProp[]>((a, b) => {
              a.push(...b.props);
              return a;
            }, [])
            .find((item) => item.name === name)?.value || "500"
        );
      };
      const className = camelToKebabCase(getValidVariableName(ElType.Img));
      const classNameCode = getClassNameCode(className);
      const imageSrc = `https://picsum.photos/${parseInt(getSize("width"))}/${parseInt(getSize("height"))}`;
      if (objectTypeInput.value === ObjectType.Pc) {
        return ["img", "CustomImage"].map((elType) => `<${elType} src={"${imageSrc}"} ${classNameCode} />`);
      }
      return ["img", "CustomImage"].map((elType) => `<${elType} src={"${imageSrc}"} ${classNameCode} mode="aspectFill" />`);
    }
    /** 切图 */
    case ElType.Icon: {
      const className = camelToKebabCase(getValidVariableName(ElType.Icon));
      const classNameCode = getClassNameCode(className);
      const srcVarName = kebabToCamelCase(className, true);
      if (objectTypeInput.value === ObjectType.Pc) {
        return [`<img src={${srcVarName}} ${classNameCode} />`];
      }
      return [`<image src={${srcVarName}} ${classNameCode} mode="scaleToFill" />`];
    }
    /** 盒子 */
    case ElType.Div: {
      const className = camelToKebabCase(getValidVariableName(ElType.Div));
      const classNameCode = getClassNameCode(className);
      if (objectTypeInput.value === ObjectType.Pc) {
        return [`<div ${classNameCode}></div>`];
      }
      return [`<view ${classNameCode}></view>`];
    }
  }
});

const jsList = computed(() => {
  switch (props.elType) {
    case ElType.Icon: {
      return [`const ${kebabToCamelCase(getValidVariableName(ElType.Icon), true)} = \`${iconUrlInput.value}\`;`];
    }
  }
  return [];
});

const cssList = computed(() => {
  const getCssProps = (item: CssRule) => {
    return "\n" + item.props.map((prop) => `  ${prop.name}: ${prop.value};`).join("\n") + "\n";
  };
  switch (props.elType) {
    case ElType.Text: {
      return getCssRules().map((item, i) => {
        const className = camelToKebabCase(getValidVariableName(props.elType, i));
        return `.${className} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Img: {
      return getCssRules().map((item) => {
        const className = camelToKebabCase(getValidVariableName(props.elType));
        return `.${className} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Icon: {
      return getCssRules().map((item) => {
        const className = camelToKebabCase(getValidVariableName(props.elType));
        return `.${className} {${getCssProps(item)}}`.trim();
      });
    }
    case ElType.Div: {
      return getCssRules().map((item) => {
        const className = camelToKebabCase(getValidVariableName(props.elType));
        return `.${className} {${getCssProps(item)}}`.trim();
      });
    }
  }
});

onMounted(async () => {
  const {
    objectType = "",
    frameType = "",
    nameTranslates = {},
    names = {},
    iconUrls = {},
    annotations = {},
    config: config2 = {},
  } = (await codesignLocalStorage.get()) || {};
  nameInput.value = names[props.identification] || "item";
  nameTranslateInput.value = nameTranslates[props.identification] || props.textContent;
  objectTypeInput.value = (objectType as ObjectType) || ObjectType.Pc;
  frameTypeInput.value = (frameType as FrameType) || FrameType.Vue;
  iconUrlInput.value = iconUrls[props.identification] || "";
  annotationInput.value = annotations[props.identification] || "";
  config.value = config2 || {
    ignoreCssFontFamily: false,
    boxSizing: false,
    cssModuleName: "",
  };
});
</script>

<style lang="scss" scoped>
@use "./index";
</style>
