const DIFF_DELETE = 0;
const DIFF_CREATE = 1;
const DIFF_UPDATE_TXT = 2;
const DIFF_UPDATE_ATTR = 3;

const EQUAL_YES = 1;
const EQUAL_NO_ATTR = -1;
const EQUAL_NO_ALL = 0;

class vDom {
    constructor(tagName, props, ...children) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
        this.id = 0;
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
            } else {
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

let vDomDfsIndex = 0;

class vDomOperator {
    constructor() {

    }

    static createElement(tagName, props, ...children) {
        return new vDom(tagName, props, ...children);
    }

    static dfsSetIndex(tree) {
        vDomDfsIndex = 0;
        vDomOperator._dfsSetIndex(tree);
    }

    static _dfsSetIndex(tree) {
        if (!(tree.children instanceof Array)) return;
        for (let child of tree.children) {
            if (child instanceof Array) {
                for (let _child of child) {
                    _child.id = vDomDfsIndex++;
                }
            } else if (child instanceof vDom) {
                child.id = vDomDfsIndex++;
            }
            vDomOperator._dfsSetIndex(child);
        }
    }

    static vDomEquals(vDom1, vDom2) {
        if (vDom1.tagName !== vDom2.tagName) return false;
        for (let propKey in vDom1.props) {
            if ((!vDom2.hasOwnProperty(propKey)) || vDom2[propKey] !== vDom1[propKey]) {
                return false;
            }
        }
        return true;
    }

    static vDomSuperEquals(vDom1, vDom2) {
        if (vDom1.tagName !== vDom2.tagName) return EQUAL_NO_ALL;
        for (let propKey in vDom1.props) {
            if ((!vDom2.hasOwnProperty(propKey)) || vDom2[propKey] !== vDom1[propKey]) {
                return EQUAL_NO_ATTR;
            }
        }
        return EQUAL_YES;
    }

    static diffSimulateArray(treeOld, treeNew) {
        let result = [];
        let i = 0;
        for (let child of treeOld.children) {
            if (child instanceof Array) {
                let pt2 = 0;
                let treeNewChild = treeNew.children[i];
                for (let pt1 = 0, len = child.length; pt1 < len; pt1++) {
                    let lastPt2 = pt2, flag = 0, found = 0;
                    while (lastPt2 !== pt2 && flag) {
                        flag = 1;
                        let equals = vDomOperator.vDomEquals(child[pt1], treeNewChild[pt2]);
                        pt2++;
                        if (pt2 >= treeNewChild.length) {
                            pt2 -= treeNewChild.length;
                        }
                        if (equals) {
                            result.push(child[pt1]);
                            found = 1;
                            break;
                        }
                    }
                    // if (!found) {
                    //     result.push(null);
                    // }
                }
                result.push([...vDomOperator.diffSimulateArray(child.children)]);
            } else if (child instanceof vDom) {
                result.push([...vDomOperator.diffSimulateArray(child)]);
            }
            i++;
        }
        return result;
    }

    static diff(tree1, tree2) {
        vDomOperator.dfsSetIndex(tree1);
        let patch = [];
        let simulateArray = vDomOperator.diffSimulateArray(tree1).flat(Infinity);
        for (let pt2 = 0, len = tree2.length; pt2 < len; pt2++) {
            
        }

        return patch;
    }

    static patch(tree, patch) {

    }

}
