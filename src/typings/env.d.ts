declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "nprogress";
declare module "qs";

declare type Interval = NodeJS.Timer | number;
declare type Timeout = NodeJS.Timeout | number;

interface Window {}
