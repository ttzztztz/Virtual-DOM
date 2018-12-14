"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DIFF_DELETE = 0;
var DIFF_CREATE = 1;
var DIFF_UPDATE_ATTR = 2;
var DIFF_SIMULATE = 3;
var DIFF_UPDATE_TEXT = 4;
var DIFF_DELETE_ATTR = 5;

var vDom = function () {
    function vDom(tagName, props) {
        _classCallCheck(this, vDom);

        this.tagName = tagName;
        this.props = props;
        this.id = this.props.id;

        for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            children[_key - 2] = arguments[_key];
        }

        this.children = children;
        this.DOM = null;
        this.parent = null;
        this.parentvDom = null;
        vDom.setParentvDom(this, this.children);
    }

    _createClass(vDom, [{
        key: "_render",
        value: function _render() {
            var _dom = document.createElement(this.tagName);
            for (var propKey in this.props) {
                _dom[propKey] = this.props[propKey];
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _children = _step.value;

                    if (_children instanceof vDom) {
                        _children.render(_dom);
                    } else if (_children instanceof Array) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = _children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var __children = _step2.value;

                                __children.render(_dom);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    } else if (typeof _children === "string" || typeof _children === "number") {
                        _dom.innerHTML += _children;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return _dom;
        }
    }, {
        key: "render",
        value: function render(root) {
            var _dom = this._render();
            this.DOM = _dom;
            root.appendChild(_dom);
        }
    }], [{
        key: "setParentvDom",
        value: function setParentvDom(parentvDom, list) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = list[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _child = _step3.value;

                    if (_child instanceof vDom) {
                        _child.parent = parentvDom;
                        _child.parentvDom = parentvDom;
                        this.setParentvDom(_child, _child.children);
                    } else if (_child instanceof Array) {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = _child[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var __child = _step4.value;

                                if (__child instanceof vDom) {
                                    __child.parent = _child;
                                    __child.parentvDom = parentvDom;
                                    this.setParentvDom(__child, __child.children);
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }]);

    return vDom;
}();

var vPatchTree = function vPatchTree(tagName, props, operation, diffData, id, vDOM) {
    _classCallCheck(this, vPatchTree);

    this.tagName = tagName;
    this.props = props;
    this.diffData = diffData;
    this.id = id;
    this.operation = operation;
    this.DOM = vDOM === undefined ? undefined : vDOM.DOM;
    this.vDOM = vDOM;
};

var vDomOperator = function () {
    function vDomOperator() {
        _classCallCheck(this, vDomOperator);
    }

    _createClass(vDomOperator, null, [{
        key: "createElement",
        value: function createElement(tagName, props) {
            for (var _len2 = arguments.length, children = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                children[_key2 - 2] = arguments[_key2];
            }

            return new (Function.prototype.bind.apply(vDom, [null].concat([tagName, props], children)))();
        }
    }, {
        key: "listDiff",
        value: function listDiff(arr1, arr2) {
            var patch = [];
            // step1 -> Generate Simulate Array
            var len1 = arr1.length,
                len2 = arr2.length;
            var simulateArray = [];
            {
                var pt2 = 0;
                for (var pt1 = 0; pt1 < len1; pt1++) {
                    var init = 1,
                        lastPt2 = pt2,
                        found = 0;
                    var obj1 = arr1[pt1];
                    while ((init || lastPt2 !== pt2) && arr2[pt2] !== undefined) {
                        var obj2 = arr2[pt2];
                        init = 0;
                        if (obj1 !== undefined && obj2 !== undefined && obj1.id === obj2.id) {
                            //founded
                            var simulateDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_SIMULATE, pt1, obj1.id, obj1);
                            simulateArray.push(simulateDiff);
                            found = 1;
                            break;
                        }
                        pt2++;
                        if (pt2 >= len2) pt2 -= len2;
                    }
                    if (!found) {
                        var notFoundDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_DELETE, arr1, obj1.id, obj1);
                        patch.push(notFoundDiff);
                    }
                }
            }
            // step2 -> compare simulate Array with Array2
            {
                var _pt = 0;
                for (var _pt2 = 0; _pt2 < len2; _pt2++) {
                    var _obj = simulateArray[_pt],
                        _obj3 = arr2[_pt2];
                    if (_pt >= simulateArray.length || _obj.id !== _obj3.id) {
                        //no Exist -> add

                        if (simulateArray.length > 0) {
                            var newDiff = new vPatchTree(_obj3.tagName, _obj3.props, DIFF_CREATE, [_pt >= simulateArray.length ? simulateArray[simulateArray.length - 1] : _obj, _obj3.children, _pt >= simulateArray.length, arr1], _obj3.id, _pt >= simulateArray.length ? simulateArray[simulateArray.length - 1].vDOM : _obj.vDOM);
                            patch.push(newDiff);
                        } else {
                            var _newDiff = new vPatchTree(_obj3.tagName, _obj3.props, DIFF_CREATE, [undefined, _obj3, 1, arr1], _obj3.id, _obj3.parentvDom);
                            patch.push(_newDiff);
                        }
                    } else {
                        //already Exist -> diff
                        _pt++;
                        var attrPatch = {},
                            deletePatch = {};
                        var hasAttrPatch = 0,
                            hasDeletePatch = 0;
                        if (_obj.props.hasOwnProperty("id") || _obj3.props.hasOwnProperty("id")) {
                            for (var propKey in _obj3.props) {
                                if (!_obj.props.hasOwnProperty(propKey) || _obj3.props[propKey] !== _obj.props[propKey]) {
                                    attrPatch[propKey] = _obj3.props[propKey];
                                    hasAttrPatch = 1;
                                }
                            }
                            for (var _propKey in _obj.props) {
                                if (!_obj3.props.hasOwnProperty(_propKey)) {
                                    deletePatch[_propKey] = _obj3.props[_propKey];
                                    hasDeletePatch = 1;
                                }
                            }
                        }
                        if (hasAttrPatch) {
                            var patchData = this.isTextNode(_obj3.children) ? _obj3.children : undefined;
                            var diffAttr = new vPatchTree(_obj3.tagName, attrPatch, DIFF_UPDATE_ATTR, patchData, _obj3.id, _obj);
                            patch.push(diffAttr);
                        }
                        if (hasDeletePatch) {
                            var deleteAttr = new vPatchTree(_obj3.tagName, deletePatch, DIFF_DELETE_ATTR, undefined, _obj3.id, _obj);
                            patch.push(deleteAttr);
                        }
                        if (_obj.vDOM.children.length > 0 && _obj3.children.length > 0 && _obj.vDOM.children.length === _obj3.children.length && !this.isTextNode(_obj.vDOM.children) && !this.isTextNode(_obj3.children)) {
                            var patch2 = [];
                            for (var i = 0, len = _obj.vDOM.children.length; i < len; i++) {
                                var _obj1 = _obj.vDOM.children[i],
                                    _obj2 = _obj3.children[i];
                                if (_obj1 instanceof vDom && _obj2 instanceof vDom) {
                                    var _patch = this.diff(_obj1, _obj2);
                                    patch2.push.apply(patch2, _toConsumableArray(_patch));
                                } else if (_obj1 instanceof Array && _obj2 instanceof Array) {
                                    var _patch3 = this.listDiff(_obj1, _obj2);
                                    patch2.push.apply(patch2, _toConsumableArray(_patch3));
                                }
                            }
                            patch.push.apply(patch, patch2);
                        }
                    }
                }
            }
            return patch;
        }
    }, {
        key: "diff",
        value: function diff(tree1, tree2) {
            var patch = [];
            if (tree1.children instanceof Array && tree2.children instanceof Array && tree1.children.length !== tree2.children.length) return [];

            if (tree1 instanceof Array && tree2 instanceof Array) {
                return this.listDiff(tree1, tree2);
            }

            if (this.isTextNode(tree1.children) && this.isTextNode(tree2.children) && !this.textNodeEquals(tree1.children, tree2.children)) {
                var textPatchDiff = new vPatchTree(undefined, undefined, DIFF_UPDATE_TEXT, tree2.children, tree2.id, tree1);
                return [textPatchDiff];
            }

            if (tree1 instanceof vDom && tree2 instanceof vDom) {
                var attrPatch = {},
                    deletePatch = {};
                var hasAttrPatch = 0,
                    hasDeletePatch = 0;
                if (tree1.props.hasOwnProperty("id") || tree2.props.hasOwnProperty("id")) {
                    for (var propKey in tree2.props) {
                        if (!tree1.props.hasOwnProperty(propKey) || tree2.props[propKey] !== tree1.props[propKey]) {
                            hasAttrPatch = 1;
                            attrPatch[propKey] = tree2.props[propKey];
                        }
                    }
                    for (var _propKey2 in tree1.props) {
                        if (!tree2.props.hasOwnProperty(_propKey2)) {
                            hasDeletePatch = 1;
                            deletePatch[_propKey2] = tree2.props[_propKey2];
                        }
                    }
                }
                if (hasAttrPatch) {
                    var diffAttr = new vPatchTree(tree2.tagName, attrPatch, DIFF_UPDATE_ATTR, attrPatch, tree2.id, tree1);
                    patch.push(diffAttr);
                }
                if (hasDeletePatch) {
                    var deleteAttr = new vPatchTree(tree2.tagName, deletePatch, DIFF_DELETE_ATTR, deletePatch, tree2.id, tree1);
                    patch.push(deleteAttr);
                }
            }

            for (var pt = 0, len = tree1.children.length; pt < len; pt++) {
                var child_tree1 = tree1.children[pt],
                    child_tree2 = tree2.children[pt];
                if (child_tree1 instanceof Array) {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = child_tree2[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var _child_child_tree2 = _step5.value;

                            _child_child_tree2.parentvDom = tree1;
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    patch.push.apply(patch, _toConsumableArray(this.listDiff(child_tree1, child_tree2)));
                } else if (child_tree1 instanceof vDom) {
                    if (child_tree1.children instanceof vDom && child_tree2.children instanceof vDom) {
                        var patchChildren = this.diff(child_tree1.children, child_tree2.children);
                        if (patchChildren.length > 0) {
                            patch.push.apply(patch, _toConsumableArray(patchChildren));
                        }
                    } else if (!this.isTextNode(child_tree1) && !this.isTextNode(child_tree2)) {
                        var result = this.diff(child_tree1, child_tree2);
                        patch.push.apply(patch, _toConsumableArray(result));
                    } else if (this.isTextNode(child_tree1.children) && this.isTextNode(child_tree2.children) && !this.textNodeEquals(child_tree1.children, child_tree2.children)) {
                        var diffTree = new vPatchTree(undefined, child_tree2.props, DIFF_UPDATE_TEXT, child_tree2.children[0], child_tree2.id, child_tree1);
                        patch.push(diffTree);
                    }
                }
            }
            return patch;
        }
    }, {
        key: "textNodeEquals",
        value: function textNodeEquals(tree1, tree2) {
            return !(tree1[0] instanceof Array) && !(tree2[0] instanceof Array) && tree1[0] === tree2[0] || tree1[0] instanceof Array && tree2[0] instanceof Array && tree1[0][0] === tree2[0][0];
        }
    }, {
        key: "isTextNode",
        value: function isTextNode(tree) {
            return typeof tree === "number" || typeof tree === "string" || tree instanceof Array && tree.length === 1 && (typeof tree[0] === "number" || typeof tree[0] === "string") || tree instanceof Array && tree.length === 0;
        }
    }, {
        key: "createPatch",
        value: function createPatch(patch) {
            var applyToRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var _patch$diffData = _slicedToArray(patch.diffData, 4),
                relative = _patch$diffData[0],
                child = _patch$diffData[1],
                appendMode = _patch$diffData[2],
                arr = _patch$diffData[3];

            var parentvDom = relative === undefined ? arr : patch.vDOM.parent;
            var parentElement = relative === undefined ? child.parentvDom.DOM : relative.DOM.parentElement;
            var vdom = new (Function.prototype.bind.apply(vDom, [null].concat([patch.tagName, patch.props], _toConsumableArray(relative === undefined ? child.children : child))))();
            vdom.parent = relative === undefined ? child.parentvDom.children : parentvDom;
            vdom.parentvDom = relative === undefined ? patch.vDOM : patch.vDOM.parentvDom;
            var index = 0;
            if (relative !== undefined) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = arr[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var _child = _step6.value;

                        if (_child === relative.vDOM) {
                            if (appendMode) index += 1;
                            arr.splice(index, 0, vdom);
                            break;
                        }
                        index++;
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            } else {
                arr.push(vdom);
            }
            if (applyToRealDom) {
                var newElement = vdom._render();
                vdom.DOM = newElement;
                if (appendMode) {
                    parentElement.appendChild(newElement);
                } else {
                    parentElement.insertBefore(newElement, relative);
                }
            }
        }
    }, {
        key: "deletePatch",
        value: function deletePatch(patch) {
            var applyToRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var dom = patch.DOM;
            if (applyToRealDom) {
                dom.remove();
            }
            var operator = patch.diffData;
            var index = 0;
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = operator[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _child = _step7.value;

                    if (_child === patch.vDOM) {
                        operator.splice(index, 1);
                        break;
                    }
                    index++;
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
    }, {
        key: "updateAttrPatch",
        value: function updateAttrPatch(patch) {
            var updateRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var dom = patch.DOM;
            var diffData = patch.diffData;
            for (var propKey in diffData) {
                if (updateRealDom) {
                    dom[propKey] = diffData[propKey];
                }
                patch.vDOM.props[propKey] = diffData[propKey];
            }
        }
    }, {
        key: "updateTextPatch",
        value: function updateTextPatch(patch) {
            var updateRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (updateRealDom) {
                var dom = patch.DOM;
                dom.innerHTML = patch.diffData;
            }
            patch.vDOM.children = [patch.diffData];
        }
    }, {
        key: "deleteAttrPatch",
        value: function deleteAttrPatch(patch) {
            var updateRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var dom = patch.DOM;
            var diffData = patch.diffData;
            for (var propKey in diffData) {
                if (updateRealDom) {
                    dom[propKey] = "";
                }
                patch.vDOM.props[propKey] = "";
            }
        }
    }, {
        key: "patch",
        value: function patch(_patch2) {
            var applyToRealDom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = _patch2[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var _patch = _step8.value;

                    switch (_patch.operation) {
                        case DIFF_CREATE:
                            this.createPatch(_patch, applyToRealDom);
                            break;
                        case DIFF_DELETE:
                            this.deletePatch(_patch, applyToRealDom);
                            break;
                        case DIFF_UPDATE_ATTR:
                            this.updateAttrPatch(_patch, applyToRealDom);
                            break;
                        case DIFF_UPDATE_TEXT:
                            this.updateTextPatch(_patch, applyToRealDom);
                            break;
                        case DIFF_DELETE_ATTR:
                            this.deleteAttrPatch(_patch, applyToRealDom);
                            break;
                    }
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }
        }
    }]);

    return vDomOperator;
}();
