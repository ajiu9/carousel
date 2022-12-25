const TICK = Symbol('tick');
const TICK_HANDLER = Symbol('tick-handler');
const ANIMATIONS = Symbol('animations');
const START_TIME = Symbol('add-time');
export class TimeLine {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }
    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let now = Date.now();
            for (const animation of this[ANIMATIONS]) {
                let t;
                // 如果传入时间小于当前时间
                // t 赋值当前
                if (this[START_TIME].get(animation) < startTime)
                    t = now - startTime;
                else
                    t = now - this[START_TIME].get(animation);

                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                    
                animation.receiveTime(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
    pause() {
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
       this[TICK]();
    }
    reset() {}
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }
    receiveTime(time) {
        let range = this.endValue - this.startValue;
        this.object[this.property] = this.template(this.startValue + range * time / this.duration);
        console.log(this.object[this.property])
    }
}