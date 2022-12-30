const element = document.documentElement;

element.addEventListener("mousedown", event => {
    const context = Object.create(null);
    // 移位做为key
    contexts.set(`mouse${1 << event.button}`, context);

    start(event, context);

    const mouseMove = event => {
        // mousemove中event.button 不一定有
        // 取event.buttons 0b00001
        let button = 1;
        while (button <= event.buttons) {
            if (button & event.buttons) {
                // order of buttons & button property is not same
                let key;
                if (button === 2)
                    key = 4;
                else if (button === 4)
                    key = 2;
                else
                    key = button;
                const context = contexts.get(`mouse${key}`);
                move(event, context);
            }
            button = button << 1;
        }
    }

    const mouseup = event => {
        const context = contexts.get(`mouse${1 << event.button}`);
        end(event, context);
        contexts.delete(`mouse${1 << event.button}`);
        element.removeEventListener("mousemove", mouseMove);
        element.removeEventListener("mouseup", mouseup);
    }

    element.addEventListener("mousemove", mouseMove);
    element.addEventListener("mouseup", mouseup);
});

const contexts = new Map();

// touchstart touchmove 在一个元素上
element.addEventListener("touchstart", event => {
    for (const touch of event.changedTouches) {
        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        start(touch, context);
    }
});

element.addEventListener("touchmove", event => {
    for (const touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        move(touch, context);
    }
});

element.addEventListener("touchend", event => {
    for (const touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }
});

element.addEventListener("touchcancel", event => {
    for (const touch of event.changedTouches) {
        const context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }
});

const start = (point, context) => {
    // console.log('start', point.clientX, point.clientY);
    context.startX = point.clientX;
    context.startY = point.clientY;
    context. isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        context.handler = null;
        console.log('press');
    }, 500);
}

const move = (point, context) => {
    const dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
        context.isPan = true;
        context.isTap = false;
        context.isPress = false;
        clearTimeout(context.handler);
        console.log("panStart");
    }
    // console.log('move', point.clientX, point.clientY);

    if (context.isPan) {
        console.log(dx, dy);
        console.log('Pan');
    }

}

const end = (point, context) => {    
    if (context.isTap) {
        console.log('tap');
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log('panEnd');
    }
    if (context.isPress) {
        console.log('pressEnd');
    }
    // console.log('end', point.clientX, point.clientY);
}


const cancel = (point, context) => {
    clearTimeout(context.handler);
    console.log('cancel', point.clientX, point.clientY);
}
