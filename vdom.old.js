const DIFF_DELETE = 0;
const DIFF_CREATE = 1;
const DIFF_UPDATE_ATTR = 2;
const DIFF_SIMULATE = 3;

const EQUAL_YES = 1;
const EQUAL_NO_ALL = 0;
const EQUAL_NO_ATTR = -1;

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

    // static dfsSetIndex(tree) {
    //     vDomDfsIndex = 0;
    //     vDomOperator._dfsSetIndex(tree);
    // }
    //
    // static _dfsSetIndex(tree) {
    //     if (!(tree.children instanceof Array)) return;
    //     for (let child of tree.children) {
    //         if (child instanceof Array) {
    //             for (let _child of child) {
    //                 _child.id = vDomDfsIndex++;
    //             }
    //         } else if (child instanceof vDom) {
    //             child.id = vDomDfsIndex++;
    //         }
    //         vDomOperator._dfsSetIndex(child);
    //     }
    // }
    // static vDomEquals(vDom1, vDom2) {
    //     if (vDom1 instanceof vDom && vDom2 instanceof vDom) {
    //         if (vDom1.tagName !== vDom2.tagName) return false;
    //         if(vDom1.props.length>0 || vDom2.props.length>0){
    //             for (let propKey in vDom1.props) {
    //                 if ((!vDom2.hasOwnProperty(propKey)) || vDom2[propKey] !== vDom1[propKey]) {
    //                     return false;
    //                 }
    //             }
    //         }
    //
    //         if( !(vDom1.children[0] instanceof Array || vDom1.children[0] instanceof vDom) && !(vDom2.children[0] instanceof Array ||  vDom2.children[0] instanceof vDom) && vDom1.children.length===1 && vDom2.children.length===1 ){
    //
    //             if(vDom1.children[0] !== vDom2.children[0]){
    //                 return false;
    //             }
    //         }
    //         return true;
    //     } else {
    //         return vDom1 === vDom2;
    //     }
    // }
    //

    static vDomSuperEquals(vDom1, vDom2) {
        if (vDom1 instanceof vDom && vDom2 instanceof vDom) {
            if (vDom1.tagName !== vDom2.tagName) return EQUAL_NO_ALL;
            if (vDom1.props.length > 0 || vDom2.props.length > 0) {
                for (let propKey in vDom1.props) {
                    if ((!vDom2.hasOwnProperty(propKey)) || vDom2[propKey] !== vDom1[propKey]) {
                        return EQUAL_NO_ATTR;
                    }
                }
            }
            return EQUAL_YES;
        } else {
            return vDom1 === vDom2 ? EQUAL_YES : EQUAL_NO_ALL;
        }
    }

    static diffSimulateArray(treeOld, treeNew) {
        if (treeOld === undefined || treeNew === undefined) return [];
        let result = [];
        for (let pt = 0, len = treeOld.children.length; pt < len; pt++) {
            let child = treeOld.children[pt];
            if (child instanceof Array) {
                let pt2 = 0;
                let treeNewChild = treeNew.children[pt];
                for (let pt1 = 0, len = child.length; pt1 < len; pt1++) {
                    let lastPt2 = pt2, flag = 1, found = 0;
                    while (lastPt2 !== pt2 || flag) {
                        flag = 0;
                        pt2++;
                        if (pt2 >= treeNewChild.length) {
                            pt2 -= treeNewChild.length;
                        }
                        if (child[pt1].id === treeNewChild[pt2].id) {
                            found = 1;
                            break;
                        }
                    }
                    if (found) {
                        let addvDom = new vPatchTree(child[pt1].tagName, child[pt1].props, DIFF_SIMULATE, null, child[pt1].id);
                        result.push(addvDom);
                    } else {
                        let deletevDom = new vPatchTree(child[pt1].tagName, child[pt1].props, DIFF_DELETE, null, child[pt1].id);
                        result.push(deletevDom);
                    }
                }
            }
            //todo:递归result查询，找准是和谁进行diff

            // else if (child instanceof vDom) {
            //     let toPush = vDomOperator.diffSimulateArray(child);
            //     if (toPush.length > 0) {
            //         result.push(toPush);
            //     }
            // }
        }
        return result;
    }

    static diff(tree1, tree2) {
        if(tree1.children.length===0 && tree2.children.length===0) return [];
        let patch = [];
        let simulateArray = vDomOperator.diffSimulateArray(tree1, tree2);
        let pt1 = 0;

        simulateArray = simulateArray.filter((item, index, array) => {
            if (item instanceof vPatchTree && item.operation === DIFF_DELETE) {
                patch.push(item);
                return false;
            } else {
                return true;
            }
        });

        for (let pt2 = 0, len = tree2.children.length; pt2 < len; pt2++) {
            let result = vDomOperator.vDomSuperEquals(simulateArray[pt1], tree2.children[pt2]);


            if (tree2.children[pt2] instanceof vDom && tree1.children[pt1].id === tree2.children[pt2].id) {
                let result = vDomOperator.diff(tree1.children[pt1], tree2.children[pt2]);
                patch.push(...result);
            }

            if (result === EQUAL_NO_ATTR) {//update attr
                let diffProp = [];
                for (let propKey in tree2.children[pt2]) {
                    if (simulateArray.props[propKey] !== tree2.children[pt2].props[propKey]) {
                        diffProp[propKey] = tree2.children[pt2].props[propKey];
                    }
                }
                let diffTree = new vPatchTree(tree2.children[pt2].tagName, diffProp, DIFF_UPDATE_ATTR, null, tree2.children[pt2].id);
                patch.push(diffTree);
            } else if (result === EQUAL_NO_ALL) {
                let diffTree = new vPatchTree(tree2.children[pt2].tagName, tree2.children[pt2].props, DIFF_CREATE, pt2, undefined);
                patch.push(diffTree);
            }
        }
        return patch;
    }

    static patch(tree, patch) {

    }

}
