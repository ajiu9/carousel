
import { createElement, Component} from './framework';
class Carousel extends Component {
    constructor() {
        super();
    }
    render() {
        let element = document.createElement("div");
        element.classList.add("carousel");
        for (const item of [1,2,3,4]) {
                const itemEl = document.createElement("div");
                const h = document.createElement('h1');
                h.classList.add('content');
                h.appendChild(document.createTextNode(item));
                itemEl.appendChild(h)
                element.appendChild(itemEl);
        }

        // setInterval(() => {
        //     const children = this.root.children;
        //     for (const child of children) {
        //         child.style.transform = `translateX(${+100}%)`
        //     }
        // })
        console.log(element)
        return element;
    }
}

let element = <Carousel></Carousel>;

element.mountTo(document.body);