
import { createElement, Component} from './framework';
import { TimeLine, Animation } from './animation.js';
import { ease } from './ease.js';
import { enableGesture } from './gesture.js';

class Carousel extends Component {
    constructor() {
        super();
    }
    render() {
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (const item of [1,2,3,4]) {
                const itemEl = document.createElement("div");
                const h = document.createElement('h1');
                h.classList.add('content');
                h.appendChild(document.createTextNode(item));
                itemEl.appendChild(h)
                this.root.appendChild(itemEl);
        }

        enableGesture(this.root);
        const timeLine = new TimeLine();
        timeLine.start();

        let position = 0;
        let children = this.root.children;

        let handler = null;
        let nextPicture;
        let t = 0;
        let ax = 0;

        this.root.addEventListener('start', () => {
            timeLine.pause();
            clearInterval(handler);

            let progress = (Date.now() - t) / 1500;
            ax = ease(progress) * 500 - 500;
        });

        this.root.addEventListener('pan', event => {
            let dx = event.clientX - event.startX - ax;

            // 计算当前位置
            // 这种计算能保证位置正确，保留dx符号正确
            // 例如 dx = 300, 300 - 300 => 0 / 500 => 0;
            // dx = 600, 600 - 600 % 500 => 500 / 500 => 1;
            // dx = -600, -600 + 600 % 500 / 500 => -1;
            let current = position - (dx - dx % 500) / 500;

            for (const offset of [-1, 0 ,1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + dx % 500 }px)`;
            }
        });

        this.root.addEventListener('end', event => {
            timeLine.reset();
            timeLine.start();
            handler = setInterval(nextPicture, 3000);

            let dx = event.clientX - event.startX - ax;
            let current = position - ((dx - dx % 500) / 500);

            let direction = Math.round((dx % 500) / 500);

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                // pos need >= 0
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                timeLine.add(
                    new Animation(children[pos].style,
                    'transform',
                    - pos * 500 + offset * 500 + dx % 500,
                    - pos * 500 + offset * 500 + direction * 500,
                    1500,
                    0,
                    ease,
                    v => `translateX(${v}px)`)
                );
            }

            position = position - ((dx - dx % 500) / 500) - direction;
            position = (position % children.length + children.length) % children.length;

        });


        nextPicture = () => {
            let nextIndex = (position + 1) % children.length;
            let current = children[position];
            let next = children[nextIndex];

            t = Date.now();

            timeLine.add(
                new Animation(current.style,
                'transform',
                -position * 500,
                -500 - position * 500,
                1500,
                0,
                ease,
                v => `translateX(${v}px)`)
            );
            timeLine.add(
                new Animation(next.style,
                'transform',
                500 - nextIndex * 500,
                - nextIndex * 500,
                1500,
                0,
                ease,
                v => `translateX(${v}px)`)
            );
            position = nextIndex;
        }

        handler = setInterval(nextPicture, 3000)



        /*
        let children = this.root.children;
        this.root.addEventListener('mousedown', event => {
            let startX = event.clientX;

            const move = event => {
                let dx = event.clientX - startX;

                // 计算当前位置
                // 这种计算能保证位置正确，保留dx符号正确
                // 例如 dx = 300, 300 - 300 => 0 / 500 => 0;
                // dx = 600, 600 - 600 % 500 => 500 / 500 => 1;
                // dx = -600, -600 + 600 % 500 / 500 => -1;
                let current = position - (dx - dx % 500) / 500;

                for (const offset of [-1, 0 ,1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500 + dx % 500 }px)`;
                }
            }
            const up = event => {
                let dx = event.clientX - startX;
                position =(position + children.length -  Math.round(dx / 500)) % children.length;

                for (const offset of [0, -Math.sign(Math.round(dx / 500) - dx + 250 * Math.sign(dx))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = '';
                    children[pos].style.transform = `translateX(${ - pos * 500 + offset * 500}px)`;
                }
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            }
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

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
        */
        return this.root;
    }
}

let element = <Carousel></Carousel>;

element.mountTo(document.body);