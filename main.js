
import { createElement, Component} from './framework';
import { TimeLine, Animation } from './animation.js';
import { ease } from './ease.js';
import { enableGesture } from './gesture.js';

class Carousel extends Component {
    constructor() {
        super();
    }
    render() {
        this.delay = 500;
        this.timer = 3000;
        this.width = 500;
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
            if (t) {
                let progress = (Date.now() - t) / this.delay;
                ax = ease(progress) * this.width - this.width;
            }
        });

        this.root.addEventListener('pan', event => {
            let dx = event.clientX - event.startX - ax;

            // 计算当前位置
            // 这种计算能保证位置正确，保留dx符号正确
            // 例如 dx = 300, 300 - 300 => 0 / 500 => 0;
            // dx = 600, 600 - 600 % 500 => 500 / 500 => 1;
            // dx = -600, -600 + 600 % 500 / 500 => -1;
            let current = position - (dx - dx % this.width) / this.width;

            for (const offset of [-1, 0 ,1]) {
                let pos = current + offset;
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${ - pos * this.width + offset * this.width + dx % this.width }px)`;
            }
        });

        this.root.addEventListener('end', event => {
            timeLine.reset();
            timeLine.start();
            handler = setInterval(nextPicture, this.timer);
            if (!event.isPan) {
                t = 0;
                ax = 0;
            }
            let dx = event.clientX - event.startX - ax;
            let current = position - ((dx - dx % this.width) / this.width);

            let direction = Math.round((dx % this.width) / this.width);

            if (event.isFlick) {
                if (event.velocity > 0) {
                    direction = Math.floor((dx % this.width) / this.width);
                } else {
                    direction = Math.ceil((dx % this.width) / this.width);
                }
            }

            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                // pos need >= 0
                pos = (pos % children.length + children.length) % children.length;

                children[pos].style.transition = '';
                timeLine.add(
                    new Animation(children[pos].style,
                    'transform',
                    - pos * this.width + offset * this.width + dx % this.width,
                    - pos * this.width + offset * this.width + direction * this.width,
                    this.delay,
                    0,
                    ease,
                    v => `translateX(${v}px)`)
                );
            }

            position = position - ((dx - dx % this.width) / this.width) - direction;
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
                -position * this.width,
                -this.width - position * this.width,
                this.delay,
                0,
                ease,
                v => `translateX(${v}px)`)
            );
            timeLine.add(
                new Animation(next.style,
                'transform',
                this.width - nextIndex * this.width,
                - nextIndex * this.width,
                this.delay,
                0,
                ease,
                v => `translateX(${v}px)`)
            );
            position = nextIndex;
        }

        handler = setInterval(nextPicture, this.timer)



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