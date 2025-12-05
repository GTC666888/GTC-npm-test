# GTC NPM Test 组件库

一个基于 Vue 2 的轻量级组件库，提供 TestNpmTest 组件。

## 安装

```bash
npm install gtc-npm-test
```

## 使用方法

### 全局引入

```javascript
import Vue from 'vue'
import TestNpmTest from 'gtc-npm-test'
import 'gtc-npm-test/dist/style.css'

Vue.use(TestNpmTest)
```

### 按需引入

```javascript
import { TestNpmTest } from 'gtc-npm-test'
import 'gtc-npm-test/dist/style.css'

export default {
  components: {
    TestNpmTest
  }
}
```

### 在模板中使用

```vue
<template>
  <div>
    <TestNpmTest />
  </div>
</template>
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建组件库

```bash
npm run build:lib
```

### 构建演示项目

```bash
npm run build
```

## 发布到 NPM

1. 构建组件库
```bash
npm run build:lib
```

2. 发布到 npm
```bash
npm publish
```

## 开源协议

MIT License
