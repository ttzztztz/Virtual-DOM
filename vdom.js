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
    }

    render(root) {
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
            } else if (_children instanceof String) {
                _dom.innerHTML += _children;
            }
        }
        root.appendChild(_dom);
    }
}

class vPatchTree {
    constructor(tagName, props, operation, diffData, id) {
        this.tagName = tagName;
        this.props = props;
        this.diffData = diffData;
        this.id = id;
        this.operation = operation;
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
                        let simulateDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_SIMULATE, undefined, obj1.id);
                        simulateArray.push(simulateDiff);
                        found = 1;
                        break;
                    }
                    pt2++;
                    if (pt2 >= len2) pt2 -= len2;
                }
                if (!found) {
                    let notFoundDiff = new vPatchTree(obj1.tagName, obj1.props, DIFF_DELETE, undefined, obj1.id);
                    patch.push(notFoundDiff);
                }
            }
        }
        // step2 -> compare simulate Array with Array2
        {
            let pt1 = 0;
            for (let pt2 = 0; pt2 < len2; pt2++) {
                let obj1 = simulateArray[pt1], obj2 = arr2[pt2] , obj1_raw = arr1[pt1];
                // todo: diff text node

                // if (vDomOperator.isTextNode(obj1) || vDomOperator.isTextNode(obj2)) {
                //     if (obj1 !== obj2) {
                //         let diffPatch = new vPatchTree(undefined, undefined, DIFF_UPDATE_TEXT, [obj2, parent], parent);
                //         patch.push(diffPatch);
                //     }
                //     continue;
                // }
                if (obj1.id !== obj2.id) {//no Exist -> add
                    let newDiff = new vPatchTree(obj2.tagName, obj2.props, DIFF_CREATE, [pt2, obj2.children], obj2.id);
                    patch.push(newDiff);
                } else {//already Exist -> diff
                    pt1 ++ ;
                    let attrPatch = [], deletePatch = [];
                    if (obj1.props.length > 0 || obj2.props.length > 0) {
                        for (let propKey in obj2.props) {
                            if ((!obj1.props.hasOwnProperty(propKey)) || obj2.props[propKey] !== obj1.props[propKey]) {
                                attrPatch[propKey] = obj2.props[propKey];
                            }
                        }
                        for (let propKey in obj1.props) {
                            if (!obj2.props.hasOwnProperty(propKey)) {
                                deletePatch[propKey] = obj2.props[propKey];
                            }
                        }
                    }
                    if (attrPatch.length > 0) {
                        let patchData = vDomOperator.isTextNode(obj2.children) ? obj2.children : undefined;
                        let diffAttr = new vPatchTree(obj2.tagName, attrPatch, DIFF_UPDATE_ATTR, patchData, obj2.id);
                        patch.push(diffAttr);
                    }
                    if (deletePatch.length > 0) {
                        let deleteAttr = new vPatchTree(obj2.tagName, deletePatch, DIFF_DELETE_ATTR, undefined, obj2.id);
                        patch.push(deleteAttr);
                    }

                    if (
                        (obj1_raw.children.length > 0 || obj2.children.length > 0)
                        && obj1_raw.children instanceof vDom
                        && obj2.children instanceof vDom
                    ) {
                        let diffPatch = vDomOperator.diff(obj1_raw.children, obj2.children);
                        patch.push(...diffPatch);
                    }


                }
            }
        }
        return patch;
    }

    static isTextNode(tree) {
        return tree instanceof Number || tree instanceof String;
    }

    static diff(tree1, tree2) {
        if (
            tree1.children instanceof Array
            && tree2.children instanceof Array
            && tree1.children.length !== tree2.children.length
        ) return [];

        if (tree1 instanceof Array || tree2 instanceof Array) {
            return [];
        }

        if (
            vDomOperator.isTextNode(tree1.children)
            && vDomOperator.isTextNode(tree2.children)
            && tree1.children !== tree2.children
        ) {
            let textPatchDiff = new vPatchTree(undefined, undefined, DIFF_UPDATE_TEXT, tree2.children, tree2.id);
            return [textPatchDiff];
        }

        let patch = [];
        for (let pt = 0, len = tree1.children.length; pt < len; pt++) {
            let child_tree1 = tree1.children[pt], child_tree2 = tree2.children[pt];
            if (child_tree1 instanceof Array) {
                patch.push(...vDomOperator.listDiff(child_tree1, child_tree2));
            } else if (child_tree1 instanceof vDom) {
                let attrPatch = [], deletePatch = [];
                if (child_tree1.props.length > 0 || child_tree2.props.length > 0) {
                    for (let propKey in child_tree2.props) {
                        if (
                            (!child_tree1.props.hasOwnProperty(propKey))
                            || child_tree2.props[propKey] !== child_tree1.props[propKey]
                        ) {
                            attrPatch[propKey] = child_tree2.props[propKey];
                        }
                    }
                    for (let propKey in child_tree1.props) {
                        if (!child_tree2.props.hasOwnProperty(propKey)) {
                            deletePatch[propKey] = child_tree2.props[propKey];
                        }
                    }
                }
                if (attrPatch.length > 0) {
                    let diffAttr = new vPatchTree(child_tree2.tagName, attrPatch, DIFF_UPDATE_ATTR, undefined.id);
                    patch.push(diffAttr);
                }
                if (deletePatch.length > 0) {
                    let deleteAttr = new vPatchTree(child_tree2.tagName, deletePatch, DIFF_DELETE_ATTR, undefined, child_tree2.id);
                    patch.push(deleteAttr);
                }

                if (child_tree1.children instanceof vDom && child_tree2.children instanceof vDom) {
                    let patchChildren = vDomOperator.diff(child_tree1.children, child_tree2.children);
                    if (patchChildren.length > 0) {
                        patch.push(...patchChildren);
                    }
                }
            } else if (vDomOperator.isTextNode(child_tree1)) {
                if (child_tree1 !== child_tree2) {
                    let diffTree = new vPatchTree(undefined, undefined, DIFF_UPDATE_TEXT, child_tree2, child_tree2.id);
                    patch.push(diffTree);
                }
            }
        }
        return patch;
    }

    static patch(tree, patch) {

    }

}
