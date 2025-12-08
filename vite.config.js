import { createVuePlugin } from "vite-plugin-vue2";
import { resolve } from 'path';

export default {
    plugins: [createVuePlugin()],
    resolve: {
        alias: {
            'gtc-npm-test': resolve(__dirname, './src/components/index.js')
        }
    }
}