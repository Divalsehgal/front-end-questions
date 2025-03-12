function createElement(node, fragment) {
    if (typeof node === 'object') {
        const { type, props: { children, ...rest } } = node;
        const element = type ? document.createElement(type) : null;
        if (element) {
            for (const key in rest) {
                element.setAttribute(key, rest[key]);
            }
        }

        if (children) {
            for (const child of children) {
                createElement(child, element || fragment);
            }


        }

        if(element) {
            fragment.appendChild(element);
        }

    } else if (node) {
        const element = document.createTextNode(node);
        fragment.appendChild(element);
    } else {
        return;
    }
}

function renderToDOM(virtualNode, domNode) {
    const frag = new DocumentFragment();
    createElement(virtualNode, frag);
    domNode.appendChild(frag);
}


const virtualNode = {
    type: "div",
    props: {
        class: "heading-container",
        children: {
            0: "This is",
            1: {
                type: "h1",
                props: {
                    key: "10",
                    id: "heading",
                    children: "devtools.tech",
                },
            },
            2: {
                type: "h2",
                props: {
                    id: "heading",
                    children: "is Awesome!!",
                },
            },
            3: {
                type: "input",
                props: {
                    type: "text",
                    value: "Devtools Tech",
                },
            },
            4: {
                type: "button",
                props: {
                    children: "Click",
                },
            },
            5: 0,
            6: {
                props: {
                    children: {
                        0: {
                            type: "div",
                            props: {
                                children: "React",
                            },
                        },
                        1: {
                            type: "div",
                            props: {
                                children: "Fragment",
                            },
                        },
                    },
                },
            },
            7: "",
        },
    },
};

const domNode = document.getElementById('root');

renderToDOM(virtualNode, domNode)
