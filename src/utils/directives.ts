import type { DirectiveBinding, App } from "vue";

/* 自动获取焦点 */
const focus = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.focus();
  },
};

const directives: Record<string, any> = {
  focus,
};

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};
