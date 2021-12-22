class HookFactory {//TODO 工厂类
  setup(instance, options) {
    instance._qF = options.queue.map(q => q.fn);
  }

  create(options) {
    //        use strict;
    return new Function(options.args, `
        "use strict;"
        ${options.queue.map((item, index) => `this.queue[${index}].fn(${options.args.join(',')})`).join(';\n')}
     `)
  }
}

const factory = new HookFactory();

const COMPILE = function (options) {
  factory.setup(this, options);
  return factory.create(options);
};


const CALL_DELEGATE = function (...args) {
  this.call = this._createCall();
  return this.call(...args);
}

class Hook {
  constructor(args) {
    this.args = args;
    this.queue = []
    this.call = CALL_DELEGATE
  }

  compile(options) {
    throw new Error("Abstract: should be overridden");
  }

  _createCall(type) {
    return this.compile({args: this.args, type, queue: this.queue})
  }

  tap(key, fn) {
    this.queue.push({key, fn});
  }
}


class SyncHook extends Hook {
  constructor(args) {
    super(args);
    this.compile = COMPILE
  }
}

module.exports = SyncHook
