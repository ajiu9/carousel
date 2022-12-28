import { TimeLine, Animation } from "./animation.js";
let tl = new TimeLine();

tl.start();
tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 3000, 0, null, v => `translateX(${v}px)`));
tl.add(new Animation(document.querySelector('#el1').style, 'transform', 0, 500, 3000, 0, null, v => `translateX(${v}px)`));

document.getElementById('pause').addEventListener('click',() => {
    tl.pause();
});
document.getElementById('resume').addEventListener('click',() => {
    tl.resume();
})
