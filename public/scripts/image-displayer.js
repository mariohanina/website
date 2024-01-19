const hasPositionChanged = ({ pos, prevPos }) => pos !== prevPos;

const valueInRange = ({ minScale, maxScale, scale }) => scale <= maxScale && scale >= minScale;

const getTranslate = ({ minScale, maxScale, scale }) => ({ pos, prevPos, translate }) =>
    valueInRange({ minScale, maxScale, scale }) && hasPositionChanged({ pos, prevPos })
        ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
        : translate;

const getScale = ({ scale, minScale, maxScale, scaleSensitivity, deltaScale }) => {
    let newScale = scale + (deltaScale / (scaleSensitivity / scale));
    newScale = Math.max(minScale, Math.min(newScale, maxScale));
    return [scale, newScale];
};

const getMatrix = ({ scale, translateX, translateY }) => `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;

const pan = ({ state, originX, originY }) => {
    state.transformation.translateX += originX;
    state.transformation.translateY += originY;
    state.element.style.transform =
        getMatrix({ scale: state.transformation.scale, translateX: state.transformation.translateX, translateY: state.transformation.translateY });
};

const MakeInfo = (state) => ({
    zoomInfo: () => (state.transformation.scale),
    locationInfo: () => ({
        translateX: state.transformation.translateX,
        translateY: state.transformation.translateY
    })
});

const makePan = (state) => ({
    panBy: ({ originX, originY }) => pan({ state, originX, originY }),
    panTo: ({ originX, originY, scale }) => {
        state.transformation.scale = scale;
        pan({ state, originX: originX - state.transformation.translateX, originY: originY - state.transformation.translateY });
    },
});

const makeZoom = (state) => ({
    zoom: ({ x, y, deltaScale }) => {
        const { left, top } = state.element.getBoundingClientRect();
        const { minScale, maxScale, scaleSensitivity } = state;
        const [scale, newScale] = getScale({ scale: state.transformation.scale, deltaScale, minScale, maxScale, scaleSensitivity });
        const originX = x - left;
        const originY = y - top;
        const newOriginX = originX / scale;
        const newOriginY = originY / scale;
        const translate = getTranslate({ scale, minScale, maxScale });
        const translateX = translate({ pos: originX, prevPos: state.transformation.originX, translate: state.transformation.translateX });
        const translateY = translate({ pos: originY, prevPos: state.transformation.originY, translate: state.transformation.translateY });

        state.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
        state.element.style.transform = getMatrix({ scale: newScale, translateX, translateY });
        state.transformation = { originX: newOriginX, originY: newOriginY, translateX, translateY, scale: newScale };
    }
});

const renderer = ({ minScale, maxScale, element, scaleSensitivity = 10 }) => {
    const state = {
        element,
        minScale,
        maxScale,
        scaleSensitivity,
        transformation: {
            originX: 0,
            originY: 0,
            translateX: 0,
            translateY: 0,
            scale: 1
        },
    };
    return Object.assign({}, makeZoom(state), makePan(state), MakeInfo(state));
};



const container = document.getElementById("image-container");
const instance = renderer({ minScale: 1, maxScale: 5, element: container.children[0], scaleSensitivity: 30 });

// Zooming in and out
document.querySelector("#zoom-in").addEventListener("click", () => {
    instance.zoom({
        deltaScale: 5,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    });
});
document.querySelector("#zoom-out").addEventListener("click", () => {
    instance.zoom({
        deltaScale: -5,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    });
});
container.addEventListener("wheel", (event) => {
    event.preventDefault();
    instance.zoom({
        deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
        x: event.pageX,
        y: event.pageY
    });
});

// Default state
function restoreDefaultState(event) {
    if (instance.zoomInfo() !== 1 ||
        instance.locationInfo().translateX !== 0 ||
        instance.locationInfo().translateY !== 0) {
        instance.panTo({
            originX: 0,
            originY: 0,
            scale: 1,
        });
    } else {
        instance.zoom({
            deltaScale: 50,
            x: event.pageX,
            y: event.pageY
        });
    }
}
document.querySelector("#zoom-original").addEventListener("click", () => {
    instance.panTo({
        originX: 0,
        originY: 0,
        scale: 1,
    });
});
container.addEventListener("dblclick", (event) => { restoreDefaultState(event) });
let mylatesttap;
function doubletap(event) {
    let now = new Date().getTime();
    let timesince = now - mylatesttap;
    if ((timesince < 400) && (timesince > 0)) { restoreDefaultState(event) }

    mylatesttap = new Date().getTime();
}
container.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    doubletap(touch);
});

// Panning
container.addEventListener("mousemove", (event) => {
    if (!(event.buttons & 1 || (event.buttons === undefined && event.which == 1))) {
        return;
    }

    event.preventDefault();
    instance.panBy({
        originX: event.movementX,
        originY: event.movementY
    });
})

let previousTouch;
container.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];

    if (previousTouch && e.targetTouches.length == 1) {
        console.log("one fing: " + e.targetTouches.length);
        e.movementX = touch.pageX - previousTouch.pageX;
        e.movementY = touch.pageY - previousTouch.pageY;

        e.preventDefault();
        instance.panBy({
            originX: e.movementX,
            originY: e.movementY
        });
    };

    previousTouch = touch;
}, false);

// let firstPreviousTouch;
// let secondPreviousTouch;
// container.addEventListener('touchmove', (e) => {

//     if (e.targetTouches.length == 2) {
//         console.log("hehe");
//         const firstFinger = e.touches[0];
//         const secondFinger = e.touches[1];

//         let dist = Math.hypot(
//             firstFinger.pageX - secondFinger.pageX,
//             firstFinger.pageY - secondFinger.pageY);
//         let previousDist = Math.hypot(
//             firstPreviousTouch.pageX - secondPreviousTouch.pageX,
//             firstPreviousTouch.pageY - secondPreviousTouch.pageY);
//         let finalDist = dist - previousDist;

//         e.preventDefault();

//         instance.zoom({
//             deltaScale: Math.sign(finalDist) > 0 ? -1 : 1,
//             x: window.innerWidth / 2,
//             y: window.innerHeight / 2
//         });
//         firstPreviousTouch = firstFinger;
//         secondPreviousTouch = secondFinger;
//     };


// }, false);


container.addEventListener("touchend", (e) => {
    previousTouch = null;
});

