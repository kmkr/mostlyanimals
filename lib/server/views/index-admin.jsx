'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _default = require('./layouts/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Index = function Index(_ref) {
    var data = _ref.data,
        keywords = _ref.keywords;
    return _react2.default.createElement(
        _default2.default,
        { data: data, keywords: keywords },
        _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { id: 'app' },
                _react2.default.createElement('div', { className: 'spinner' })
            ),
            _react2.default.createElement('script', { type: 'text/javascript', dangerouslySetInnerHTML: { __html: '\n                window.sn = {\n                    data: ' + JSON.stringify(data) + '\n                };\n            ' } }),
            _react2.default.createElement('script', {
                type: 'text/javascript',
                src: '/static/scripts/admin-bundle.js',
                async: true,
                charSet: 'utf-8' })
        )
    );
};

exports.default = Index;