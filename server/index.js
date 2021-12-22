// const {SyncHook} = require('tapable');
// const hook = new SyncHook(['name']);
// hook.tap('hello', (name) => {
//   console.log(`hello ${name}`);
// });
// hook.tap('hello again', (name) => {
//   console.log(`hello ${name}, again2`);
// });
//
// hook.call('ahonn');

const SyncHook = require('./sHook')

const hooks = new SyncHook(['name'])

hooks.tap('hello', (name) => {
  console.log(`hello ${name}`)
})

hooks.tap('hello', (name) => {
  console.log(`hello11 ${name}`)
})
hooks.call('测试')

