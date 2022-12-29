import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "@/styles/index.css";

const app = createApp(App);
const pinia = createPinia();
import directives from "@/utils/directives";

app.use(pinia).use(directives);
app.use(router);

app.mount("#app");
