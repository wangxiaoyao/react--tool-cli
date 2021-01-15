[toc]

# react-tool-cli

依据 create-react-app 创建一个自己的脚手架，以及常见库/案例的使用。有两个分支：

- master：基本框架
- library：常用库/案例： 我按照功能性放在 page 目录下。 其中文件夹以 \_lib 结尾。案例中使用 mock 数据，均放在顶部。不使用 service。

## 主分支： 框架的修改

### 1 依据 create-react-app 脚手架创建项目

npx create-react-app Myapp

### 2 暴露 webpack

npm run eject

### 3 引用路径修改,路径简化

```
alias: {
"@src": path.resolve("src"),
"@component": path.resolve("src/component"),
"@page": path.resolve("src/page"),
"@util": path.resolve("src/util"),
"@service": path.resolve("src/service"),
"@router": path.resolve("src/router"),
}
```

### 4 使用 less, localIdentName

> 使用 less 进行 css 的解析。并配置 localIdentName 作为 class 的命名规则。 在生产环境下修改规则，生成更短的 class 名，可以提高 CSS 的压缩率。选择 base64 的 5 个字符。

1 安装： 由于仅在开发时使用： --save-dev， 发布后的生产不需要
npm install less-loader --save-dev

2 添加 less 解析规则
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

3 Less 解析配置: 注意写在在 file-loader 上面

```
{
test: lessRegex,
exclude: lessModuleRegex,
use: getStyleLoaders(
{
importLoaders: 2,
modules: {
localIdentName: "[path][name]\_\_[local]--[hash:base64:5]",
},
sourceMap: isEnvProduction && shouldUseSourceMap,
},
"less-loader"
),
sideEffects: true,
},
{
test: lessModuleRegex,
use: getStyleLoaders(
{
importLoaders: 2,
sourceMap: isEnvProduction && shouldUseSourceMap,
modules: true,
getLocalIdent: getCSSModuleLocalIdent,
},
"less-loader"
),
},
```

### 5 初始化 css

初始化 css 放入 index.css 中

### 6 配置路由：react-router-dom

1 路由配置项：RouteConfig。 该文件定义了该项目所有的路由路径

2 写一类 RouteView。分解 RouteConfig 转化为 路由。 值得注意的是将 redirect 进行提取 并添加到后面

### 7 server

> umi-request 或者 axios 库。 umi-request 的配置文件放在 util 中。

有两种 request：

1 处理了标准 API，仅返回 data 内容，供业务使用

2 requestNoSolve 目的是为了一些业务 需要通过 success（key）的 true 和 false 来进行后续的操作动作。而不是仅提取出 data 内容。这种情况就不能进行接口的统一处理。 比如 删除 API，成功后重新调用获取接口。不成功就不调用。

### 8 mock 数据

> 方案: 利用 json-server 真实的模拟后端数据和接口。

```
## 安装 concurrently
npm install json-server concurrently mockjs --save-dev

## 修改 package.json 则使用 npm run start 并发运行前, 后端
"start": "concurrently 'node scripts/start.js' 'node ./Mock/server.js'",
```

怎样模拟数据的：

- 1 页面的 service.js 中使用定义好的接口： "/api/v2/getAsyncDataRedux"
- 2 在 package.json 中使用代理 "proxy": "http://127.0.0.1:3001"。

代理的意思： 所有类似"/api/v2/getAsyncDataRedux"的 service 接口，浏览器依旧访问的是“http://localhost:3000/api/v2/getAsyncDataRedux”。 但是 creat-react-app 的 proxy 代理实现了请求转发。将其转到了："http://127.0.0.1:3001/api/v2/getAsyncDataRedux"。 因此不会触发 CORS 安全策略。

让 JsonService.js 中进行监听 3001 这个端口，当 request 访问 3001 端口（上面设置的 proxy）就会返回数据。

- 3 通过 JsonService.js(配置文件)：使用中间件，将访问的"/api/v2/getAsyncDataRedux" 接口转化为访问："getAsyncDataRedux"。 包括怎样处理 post 请求，自定义 req 和 res 行为

- 4 我们在 db.json 中 定义模拟数据：

```
"getAsyncDataRedux" :{
	XXX
}
```

相关问题：

- 1 配置路由： 若是出现 api 地址如下情况。即最后一层相同，那么我们可以设置 db.json 为 v1-query 和 v2-query。然后配置 JsonServer.js

```
/api/v1/query
/api/v2/query
```

```
"/api/v1/*": "/v1-$1",
"/api/v2/*": "/v2-$1",
```

- 2 post 请求。 在 umiRequest.js 文件中已经设置。 注意设置头部 Content-type 为 “application/json”

- 3 配置多个代理

```
"proxy":{
	"/api":{
		"target": "http://XXXXX:3001"
	},
	"/api2":{
		"target": "http://XXXXX:3002"
	}
}
```

### 9 store 的使用

> 不需要共享的数据，没必要使用 redux。

```
## redux是核心，react-redux扩展， thunk支持函数
npm install redux react-redux redux-thunk
```

## lib

- G2
- G2Plot
- 表格： 前端分页和后端分页
- 动态增减表单
- antd 表单验证以及正则
