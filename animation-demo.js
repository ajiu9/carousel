import { TimeLine, Animation } from "./animation.js";
import { ease, easeIn } from './ease.js';

let tl = new TimeLine();
tl.start();

tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, ease, v => `translateX(${v}px)`));
// tl.add(new Animation(document.querySelector('#el1').style, 'transform', 0, 500, 2000, 0, ease, v => `translateX(${v}px)`));
document.querySelector('#el1').style.transition = `transform ease 2s`;
document.querySelector('#el1').style.transform = `translateX(500px)`;


document.getElementById('pause').addEventListener('click',() => tl.pause());
document.getElementById('resume').addEventListener('click',() => tl.resume())
