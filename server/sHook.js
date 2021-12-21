
class HookFactory {//TODO 工厂类
  setup(instance, options) {
    instance._x = options.taps.map(t => t.fn);
  }
  create(options) {
    return new Function('', `return ${options.type}`)
  }
}

const factory = new HookFactory();

const COMPILE = function(options) {
  factory.setup(this, options);
  return factory.create(options);
};


const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync");
  return this.call(...args);
};

class Hook {
  constructor(props) {
    this.props = props;
    this.call = CALL_DELEGATE
  }

  compile(options) {
    throw new Error("Abstract: should be overridden");
  }
  _createCall(type) {
    return this.compile({props:this.props, type})
  }
}

class SyncHook extends Hook {
  constructor(props) {
    super(props);
    this.compile = COMPILE
  }

}
