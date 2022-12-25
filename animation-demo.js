import { TimeLine, Animation } from "./animation.js";
let tl = new TimeLine();

tl.start();
tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 100, 1000, 0, null, v => `translateX(${v}px)`));