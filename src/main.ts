import { enableVueBindings } from '@syncedstore/core';
import { createApp } from 'vue';
import * as Vue from 'vue';
import App from './App.vue';

enableVueBindings(Vue);
createApp(App).mount('#app');
