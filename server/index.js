/**
 * https://zhuanlan.zhihu.com/p/79221553
 */
const {SyncHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook} = require('tapable');
const hook = new SyncHook(['name']);
hook.tap('hello', (name) => {
  console.log(`hello ${name}`);
});
hook.tap('hello again', (name) => {
  console.log(`hello ${name}, again2`);
});

hook.call('ahonn');

const hookBail = new SyncBailHook(['hello'])
hookBail.tap('bailHook', (hello) => {
  console.log('bailHook', hello)
  return 1
})
hookBail.tap('bailHook 2', (hello) => {
  console.log('bailHook 2', hello)
})
hookBail.call('cccc')

const hookWaterfall = new SyncWaterfallHook(['hello'])
hookWaterfall.tap('hookWaterfall', (hello) => {
  console.log('hookWaterfall', hello)
  return 66
})
hookWaterfall.tap('hookWaterfall 2', (hello) => {
  console.log('hookWaterfall 2', hello)
})
hookWaterfall.call('xxxx')

const hookLoop = new SyncLoopHook(['hello'])
let first = 0
hookLoop.tap('SyncLoopHook', (hello) => {
  console.log('SyncLoopHook', hello)
  if (first > 1) {
    return undefined
  }
  first++
  return true
})
hookLoop.tap('SyncLoopHook 2', (hello) => {
  console.log('SyncLoopHook 2', hello)
})
hookLoop.call('ggg')
