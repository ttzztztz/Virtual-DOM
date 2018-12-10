const DIFF_DELETE = 0;
const DIFF_CREATE = 1;
const DIFF_UPDATE_TXT = 2;
const DIFF_UPDATE_ATTR = 3;

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

class vDiffTree {
    constructor(tagName, props, operation, diffData, id, ...children) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
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
        if (! (tree.children instanceof Array)) return;
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

    static diff(tree1, tree2) {

    }

    static patch(tree, diff) {

    }

}
