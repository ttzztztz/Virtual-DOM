const DIFF_DELETE = 0;
const DIFF_CREATE = 1;
const DIFF_UPDATE_ATTR = 2;
const DIFF_SIMULATE = 3;
const DIFF_UPDATE_TEXT = 4;
const DIFF_DELETE_ATTR = 5;

class vDom {
    constructor(tagName, props, ...children) {
        this.tagName = tagName;
        this.props = props;
        this.id = this.props.id;
        this.children = children;
        this.DOM = null;
    }

    _render() {
        let _dom = document.createElement(this.tagName);
        for (let propKey in this.props) {
            _dom[propKey] = this.props[propKey];
        }
        for (let _children of this.children) {
            if (_children instanceof vDom) {
                _children.render(_dom);
            } else if (_children instanceof Array) {
                for (let __children of _children) {
                    __children.render(_dom);
                }
            } else if (typeof _children === "string" || typeof _children === "number") {
                _dom.innerHTML += _children;
            }
        }
        return _dom;
    }

    render(root) {
        let _dom = this._render();
        this.DOM = _dom;
        root.appendChild(_dom);
    }
}

class vPatchTree {
    constructor(tagName, props, operation, diffData, id, DOM) {
        this.tagName = tagName;
        this.props = props;
        this.diffData = diffData;
        this.id = id;
        this.operation = operation;
        this.DOM = DOM;
    }
}

class vDomOperator {
    constructor() {

    }

    static createElement(tagName, props, ...children) {
        return new vDom(tagName, props, ...children);
    }

    static listDiff(arr1, arr2) {
        let patch = [];
        // step1 -> Generate Simulate Array
        let len1 = arr1.length, len2 = arr2.length;
        let simulateArray = [];
        {
            let pt2 = 0;
            for (let pt1 = 0; pt1 < len1; pt1++) {
                let init = 1, lastPt2 = pt2, found = 0;
                let obj1 = arr1[pt1];
                while (init || lastPt2 !== pt2) {
                    let obj2 = arr2[pt2];
                    init = 0;
                    if (obj1.id === obj2.id) {
                        //founded
                        let simulateDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_SIMULATE, pt1, obj1.id , obj1.DOM);
                        simulateArray.push(simulateDiff);
                        found = 1;
                        break;
                    }
                    pt2++;
                    if (pt2 >= len2) pt2 -= len2;
                }
                if (!found) {
                    let notFoundDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_DELETE, pt1, obj1.id , obj1.DOM);
                    patch.push(notFoundDiff);
                }
            }
        }
        // step2 -> compare simulate Array with Array2
        {
            let pt1 = 0;
            for (let pt2 = 0; pt2 < len2; pt2++) {
                let obj1 = simulateArray[pt1], obj2 = arr2[pt2];
                if (pt1 >= simulateArray.length || obj1.id !== obj2.id) {//no Exist -> add
                    let newDiff = new vPatchTree(obj2.tagName, obj2.props, DIFF_CREATE, [pt1 >= simulateArray.length ? simulateArray[simulateArray.length - 1].DOM : obj1.DOM, obj2.children, pt1 >= simulateArray.length], obj2.id , undefined);
                    patch.push(newDiff);
                } else {//already Exist -> diff
                    pt1++;
                    let attrPatch = {}, deletePatch = {};
                    let hasAttrPatch = 0, hasDeletePatch = 0;
                    if (obj1.props.hasOwnProperty("id") || obj2.props.hasOwnProperty("id")) {
                        for (let propKey in obj2.props) {
                            if ((!obj1.props.hasOwnProperty(propKey)) || obj2.props[propKey] !== obj1.props[propKey]) {
                                attrPatch[propKey] = obj2.props[propKey];
                                hasAttrPatch = 1;
                            }
                        }
                        for (let propKey in obj1.props) {
                            if (!obj2.props.hasOwnProperty(propKey)) {
                                deletePatch[propKey] = obj2.props[propKey];
                                hasDeletePatch = 1;
                            }
                        }
                    }
                    if (hasAttrPatch) {
                        let patchData = this.isTextNode(obj2.children) ? obj2.children : undefined;
                        let diffAttr = new vPatchTree(obj2.tagName, attrPatch, DIFF_UPDATE_ATTR, patchData, obj2.id , obj1.DOM);
                        patch.push(diffAttr);
                    }
                    if (hasDeletePatch) {
                        let deleteAttr = new vPatchTree(obj2.tagName, deletePatch, DIFF_DELETE_ATTR, undefined, obj2.id , obj1.DOM);
                        patch.push(deleteAttr);
                    }
                }
            }
        }
        return patch;
    }

    static isTextNode(tree) {
        return typeof tree === "number" || typeof tree === "string" || (tree instanceof Array && tree.length === 1 && (typeof tree[0] === "number" || typeof tree[0] === "string"));
    }

    static diff(tree1, tree2) {
        let patch = [];
        if (
            tree1.children instanceof Array
            && tree2.children instanceof Array
            && tree1.children.length !== tree2.children.length
        ) return [];

        if (tree1 instanceof Array || tree2 instanceof Array) {
            return [];
        }

        if (
            this.isTextNode(tree1.children)
            && this.isTextNode(tree2.children)
            && tree1.children !== tree2.children
        ) {
            let textPatchDiff = new vPatchTree(undefined, undefined, DIFF_UPDATE_TEXT, tree2.children, tree2.id , obj1.DOM);
            return [textPatchDiff];
        }

        for (let pt = 0, len = tree1.children.length; pt < len; pt++) {
            let child_tree1 = tree1.children[pt], child_tree2 = tree2.children[pt];
            if (child_tree1 instanceof Array) {
                patch.push(...this.listDiff(child_tree1, child_tree2));
            } else if (child_tree1 instanceof vDom) {
                let attrPatch = {}, deletePatch = {};
                let hasAttrPatch = 0, hasDeletePatch = 0;
                if (child_tree1.props.hasOwnProperty("id") || child_tree2.props.hasOwnProperty("id")) {
                    for (let propKey in child_tree2.props) {
                        if (
                            !child_tree1.props.hasOwnProperty(propKey)
                            || child_tree2.props[propKey] !== child_tree1.props[propKey]
                        ) {
                            hasAttrPatch = 1;
                            attrPatch[propKey] = child_tree2.props[propKey];
                        }
                    }
                    for (let propKey in child_tree1.props) {
                        if (!child_tree2.props.hasOwnProperty(propKey)) {
                            hasDeletePatch = 1;
                            deletePatch[propKey] = child_tree2.props[propKey];
                        }
                    }
                }

                if (hasAttrPatch) {
                    let diffAttr = new vPatchTree(child_tree2.tagName, attrPatch, DIFF_UPDATE_ATTR, attrPatch, child_tree2.id , child_tree1.DOM);
                    patch.push(diffAttr);
                }
                if (hasDeletePatch) {
                    let deleteAttr = new vPatchTree(child_tree2.tagName, deletePatch, DIFF_DELETE_ATTR, deletePatch, child_tree2.id , child_tree1.DOM);
                    patch.push(deleteAttr);
                }

                if (child_tree1.children instanceof vDom && child_tree2.children instanceof vDom) {
                    let patchChildren = this.diff(child_tree1.children, child_tree2.children);
                    if (patchChildren.length > 0) {
                        patch.push(...patchChildren);
                    }
                } else if (!this.isTextNode(child_tree1.children) && !this.isTextNode(child_tree2.children)) {
                    let result = this.diff(child_tree1, child_tree2);
                    patch.push(...result);
                } else if (this.isTextNode(child_tree1.children) && this.isTextNode(child_tree2.children)) {
                    if (child_tree1.children[0] !== child_tree2.children[0]) {
                        let diffTree = new vPatchTree(undefined, child_tree2.props, DIFF_UPDATE_TEXT, child_tree2.children[0], child_tree2.id , child_tree1.DOM);
                        patch.push(diffTree);
                    }
                }
            }
        }
        return patch;
    }

    static createPatch(patch) {
        let [relative, child, appendMode] = patch.diffData;
        let parentElement = relative.parentElement;
        let vdom = new vDom(patch.tagName, patch.props, ...child);
        let newElement = vdom._render();
        if (appendMode) {
            parentElement.appendChild(newElement);
        } else {
            parentElement.insertBefore(newElement, relative);
        }
    }

    static deletePatch(patch) {
        let dom = patch.DOM;
        dom.remove();
    }

    static updateAttrPatch(patch) {
        let dom = patch.DOM;
        let diffData = patch.diffData;
        for (let propKey in diffData) {
            dom[propKey] = diffData[propKey];
        }
    }

    static updateTextPatch(patch) {
        let dom = patch.DOM;
        dom.innerHTML = patch.diffData;
    }

    static deleteAttrPatch(patch) {
        let dom = patch.DOM;
        let diffData = patch.diffData;
        for (let propKey in diffData) {
            dom[propKey] = "";
        }
    }

    static dfsPatch(tree, patch) {
        for (let _patch of patch) {
            switch (_patch.operation) {
                case DIFF_CREATE:
                    this.createPatch(_patch);
                    break;
                case DIFF_DELETE:
                    this.deletePatch(_patch);
                    break;
                case DIFF_UPDATE_ATTR:
                    this.updateAttrPatch(_patch);
                    break;
                case DIFF_UPDATE_TEXT:
                    this.updateTextPatch(_patch);
                    break;
                case DIFF_DELETE_ATTR:
                    this.deleteAttrPatch(_patch);
                    break;
            }
        }
    }

}