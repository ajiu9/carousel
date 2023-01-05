
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
        let currentIndex = 0;
        setInterval(() => {
            const children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;
            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
            next.style.transition = 'none';

            setTimeout(() => {
                next.style.transition = '';
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;
                currentIndex = nextIndex;
            }, 16);
        }, 3000)
        console.log(element)
        return element;
    }
}

let element = <Carousel></Carousel>;

element.mountTo(document.body);