// 当执行 npm run dev 的时候，调用 /build/setup-dev-server.js 启动 'webpack-dev-middleware' 开发中间件
// 通过 vue-server-renderer 调用之前编译生成的 vue-ssr-server-bundle.json 启动 node 服务
// 将 vue-ssr-client-manifest.json 注入到 createRenderer 中实现前端资源的自动注入
// 通过 express 处理 http 请求

const fs = require('fs');
const path = require('path');
const express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');
const devServer = require('./build/setup-dev-server')
const resolve = file => path.resolve(__dirname, file);

const isProd = process.env.NODE_ENV === 'production';
const app = express();

const serve = (path, cache) =>
  express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
  });
app.use('/dist', serve('./dist', true));

function createRenderer(bundle, options) {
  return createBundleRenderer( bundle, Object.assign(options, {
      basedir: resolve('./dist'),
      runInNewContext: false
    })
  );
}

function render(req, res) {
  const startTime = Date.now();
  res.setHeader('Content-Type', 'text/html');

  const context = {
    title: 'SSR 测试', // default title
    url: req.url
  };
  renderer.renderToString(context, (err, html) => {
    res.send(html);
  });
}

let renderer;
let readyPromise;
const templatePath = resolve('./src/index.template.html');

if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8');
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json') // 将js文件注入到页面中
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  });
} else {
  readyPromise = devServer( app, templatePath, (bundle, options) => {
      renderer = createRenderer(bundle, options);
    }
  );
}

app.get('*',isProd? render : (req, res) => {
        readyPromise.then(() => render(req, res));
      }
);

const port = process.env.PORT || 8088;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

