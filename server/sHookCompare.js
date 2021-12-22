/**
 * https://github.com/webpack/tapable/issues/62
 */

const { SyncHook } = require("./");
class MySyncHook {
  constructor(argNames) {
    this.argNames = argNames;
    this.tasks = [];
  }

  tap(plugin, callback) {
    this.tasks.push(callback);
  }

  call(...args) {
    this.tasks.forEach(task => task(...args));
  }
}

const CALL_DELEGATE = function(...args) {
  this.call = this._createCall(); // The function is dynamically generated when it is called for the first time
  return this.call(...args);
};

class OtherSyncHook {
  constructor(argNames) {
    this.argNames = argNames;
    this.tasks = [];
    // this._call = CALL_DELEGATE;
    this.call = CALL_DELEGATE;
  }

  tap(plugin, callback) {
    // This.call must be reset every time a new plugin is added
    this.call = CALL_DELEGATE;
    this.tasks.push(callback);
  }

  _createCall() {
    const params = this.argNames.join(",");
    return new Function(
      params,
      "for(var i = 0; i < this.tasks.length; i++) this.tasks[i](" +
      params +
      ");"
    );
  }
}

class EagerSyncHook {
  constructor(argNames) {
    this.argNames = argNames;
    this.tasks = [];
    // this._call = CALL_DELEGATE;
    this.call = this._createCall();
  }

  tap(plugin, callback) {
    this.tasks.push(callback);
  }

  _createCall() {
    const params = this.argNames.join(",");
    return new Function(
      params,
      "for(var i = 0; i < this.tasks.length; i++) this.tasks[i](" +
      params +
      ");"
    );
  }
}

class UnrollSyncHook {
  constructor(argNames) {
    this.argNames = argNames;
    this.tasks = [];
    // this._call = CALL_DELEGATE;
    const params = this.argNames.join(",");
    this.call = this.CALL_DELEGATE = new Function(
      params,
      `this.call = this._createCall(); return this.call(${params});`
    );
  }

  tap(plugin, callback) {
    // This.call must be reset every time a new plugin is added
    this.call = this.CALL_DELEGATE;
    this.tasks.push(callback);
  }

  _createCall() {
    const params = this.argNames.join(",");
    const count = this.tasks.length;
    return new Function(
      params,
      this.tasks.map((t, i) => `this.tasks[${i}](${params});`).join(" ")
    );
  }
}

class UnrollDeoptSyncHook {
  constructor(argNames) {
    this.argNames = argNames;
    this.tasks = [];
    this.call = this._createCall();
    this._update = false;
  }

  tap(plugin, callback) {
    this._update = true;
    this.tasks.push(callback);
  }

  _createCall() {
    const params = this.argNames.join(",");
    const count = this.tasks.length;
    return new Function(
      params,
      `if(this._update) { this._update = false; this.call = this._createCall(); return this.call(${params}); }` +
      this.tasks.map((t, i) => `this.tasks[${i}](${params});`).join(" ")
    );
  }
}

const timeMap = new Map();
let startTime = 0;
const time = name => {
  startTime = process.hrtime.bigint();
};
/**
 *
 * @param {string} name
 */
const timeEnd = name => {
  const duration = process.hrtime.bigint() - startTime;
  const ms = Number(duration / 1000n) / 1000;
  let entry = timeMap.get(name);
  if (entry === undefined) {
    timeMap.set(name, (entry = { total: 0, count: 0 }));
  }
  entry.total += ms;
  entry.count++;
  console.log(
    `${name}: `.padStart(17, " ") +
    `${ms}ms`.padEnd(8, " ") +
    ` (avg: ${Math.round((entry.total / entry.count) * 1000) /
    1000}ms,`.padEnd(16, " ") +
    ` count: ${entry.count})`
  );
};

const WARMUP_CALLS = 0;
const CALLS = 1000;
const PLUGINS = 10;
const SPEED = 10;

function test() {
  const hook1 = new SyncHook(["compilation"]);
  const hook2 = new SyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`tapable-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`tapable-warmup`);
  }
  time(`tapable`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`tapable`);

  setTimeout(myTest, SPEED);
}

function myTest() {
  const hook1 = new MySyncHook(["compilation"]);
  const hook2 = new MySyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`my-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`my-warmup`);
  }
  time(`my`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`my`);

  setTimeout(otherTest, SPEED);
}

function otherTest() {
  const hook1 = new OtherSyncHook(["compilation"]);
  const hook2 = new OtherSyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`other-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`other-warmup`);
  }
  time(`other`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`other`);

  setTimeout(eagerTest, SPEED);
}

function eagerTest() {
  const hook1 = new EagerSyncHook(["compilation"]);
  const hook2 = new EagerSyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`eager-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`eager-warmup`);
  }
  time(`eager`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`eager`);

  setTimeout(unrollTest, SPEED);
}

function unrollTest() {
  const hook1 = new UnrollSyncHook(["compilation"]);
  const hook2 = new UnrollSyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`unroll-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`unroll-warmup`);
  }
  time(`unroll`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`unroll`);

  setTimeout(unrollDeoptTest, SPEED);
}

function unrollDeoptTest() {
  const hook1 = new UnrollDeoptSyncHook(["compilation"]);
  const hook2 = new UnrollDeoptSyncHook(["parser"]);

  const compilation = { sum: 0 };
  const parser1 = { sum2: 0 };
  const parser2 = { sum2: 0 };

  for (let i = 0; i < PLUGINS; i++) {
    hook1.tap(`plugin${i}a`, function pluginA(compilation) {
      compilation.sum = compilation.sum + i;
    });
    hook1.tap(`plugin${i}b`, compilation => {
      compilation.sum = compilation.sum - i;
    });
    hook2.tap(`plugin${i}c`, parser => {
      parser.sum = parser.sum + i + i;
    });
    hook2.tap(`plugin${i}d`, parser => {
      parser.sum = parser.sum - i;
    });
    hook2.tap(`plugin${i}e`, parser => {
      parser.sum = parser.sum - i;
    });
  }

  if (WARMUP_CALLS > 0) {
    time(`urollde-warmup`);
    for (let i = 0; i < WARMUP_CALLS; i++) {
      hook1.call(compilation);
      hook2.call(parser1);
      hook1.call(compilation);
      hook2.call(parser2);
    }
    timeEnd(`urollde-warmup`);
  }
  time(`urollde`);
  for (let i = 0; i < CALLS; i++) {
    hook1.call(compilation);
    hook2.call(parser1);
    hook1.call(compilation);
    hook2.call(parser2);
  }
  timeEnd(`urollde`);

  setTimeout(test, SPEED);
}

test();