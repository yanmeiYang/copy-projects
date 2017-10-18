"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var loadScript = require('load-script');

var defaultScriptUrl = "https://cdn.ckeditor.com/4.6.2/standard/ckeditor.js";

/**
 * @author codeslayer1
 * @description CKEditor component to render a CKEditor textarea with defined configs and onChange callback handler
 */

var CKEditor = function (_React$Component) {
  _inherits(CKEditor, _React$Component);

  function CKEditor(props) {
    _classCallCheck(this, CKEditor);

    //Bindings
    var _this = _possibleConstructorReturn(this, (CKEditor.__proto__ || Object.getPrototypeOf(CKEditor)).call(this, props));

    _this.onLoad = _this.onLoad.bind(_this);

    //State initialization
    _this.state = {
      isScriptLoaded: _this.props.isScriptLoaded,
      config: _this.props.config,
    };
    return _this;
  }

  //load ckeditor script as soon as component mounts if not already loaded


  _createClass(CKEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.isScriptLoaded) {
        loadScript(this.props.scriptUrl, this.onLoad);
      } else {
        this.onLoad();
      }
    },
  }, {
    key: "onLoad",
    value: function onLoad() {
      var _this2 = this;

      this.setState({
        isScriptLoaded: true,
      });

      if (!window.CKEDITOR) {
        console.error("CKEditor not found");
        return;
      }

      this.editorInstance = window.CKEDITOR.appendTo(_reactDom2.default.findDOMNode(this),
        this.state.config, this.props.content);

      this.editorInstance.on("change", function () {
        var content = _this2.editorInstance.getData();
        //call callback if present
        if (_this2.props.onChange) {
          _this2.props.onChange(content);
        }
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.flag) {
        this.editorInstance.setData('');
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react2.default.createElement("div", { className: this.props.activeClass });
    }
  }]);

  return CKEditor;
}(_react2.default.Component);

CKEditor.defaultProps = {
  content: "",
  config: {},
  isScriptLoaded: false,
  scriptUrl: defaultScriptUrl,
  activeClass: "",
  flag: false,
};

// CKEditor.propTypes = {
//   content: _react2.default.PropTypes.any,
//   config: _react2.default.PropTypes.object,
//   onChange: _react2.default.PropTypes.func,
//   isScriptLoaded: _react2.default.PropTypes.bool,
//   scriptUrl: _react2.default.PropTypes.string,
//   activeClass: _react2.default.PropTypes.string,
//   flag: _react2.default.PropTypes.bool,
// };

exports.default = CKEditor;
