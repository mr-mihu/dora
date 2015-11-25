import http from 'http';
import koa from 'koa';
import { resolvePlugins, applyPlugins, applyMiddlewares } from './plugin';
import assign from 'object-assign';

const defaultArgs = {
  port: '8000',
  cwd: process.cwd(),
};

export default function createServer(_args) {
  const args = assign({}, defaultArgs, _args);
  const { plugins: pluginNames, port, cwd } = args;
  function _applyPlugins(name, applyArgs) {
    return applyPlugins(plugins, name, pluginArgs, applyArgs);
  }
  const pluginArgs = {
    port,
    cwd,
    applyPlugins:_applyPlugins,
  };
  const plugins = resolvePlugins(pluginNames);
  const app = koa();

  _applyPlugins('middleware.before');
  applyMiddlewares(plugins, pluginArgs, app);
  app.use(require('koa-static-with-post')(cwd));
  app.use(require('koa-serve-index')(cwd, {
    hidden: true,
    view: 'details',
  }));
  _applyPlugins('middleware.after');

  _applyPlugins('server.before');
  const server = http.createServer(app.callback());
  server.listen(port, () => {
    console.log('listened on %s', port);
    _applyPlugins('server.after');
  });
}