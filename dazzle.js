class Game{
    constructor({
        width = 500,
        height = 500,
        id = 'game',
        background = '#fff',
        cursor = true,
        fps = 60,
        disableContextMenu = true,
        fullWindow = false,
        fullScreen = false,
        activeScene = 'main',
        scenes = {main: new Scene()},
        keyUp = e => {},
        keyDown = e => {},
        mouseDown = e => {},
        mouseUp = e => {},
        mouseMove = e => {},
        touchStart = e => {},
        touchEnd = e => {},
        touchMove = e => {},
        load = () => {},
    }){

        this.keyUp = keyUp
        this.keyDown = keyDown
        this.mouseDown = mouseDown
        this.mouseUp = mouseUp
        this.mouseMove = mouseMove
        this.touchStart = touchStart
        this.touchEnd = touchEnd
        this.touchMove = touchMove

        this.cv = document.getElementById(id)
        if(!this.cv) {
            this.cv = document.createElement("canvas")
            this.cv.classList.add(id);
        }
        this.ctx = this.cv.getContext("2d");

        this.width = width;
        this.height = height;
        this.fullScreen = fullScreen;
        this.zoom = 1

        this.cv.width = width;
        this.cv.height = height;
        this.cv.style.background = background;
        this.setCursor(cursor);

        if(fullWindow) {
            this.width = window.innerWidth,
            this.height = window.innerHeight,
            this.cv.width = window.innerWidth,
            this.cv.height = window.innerHeight,
            window.addEventListener('resize', () => {
                this.setSize(window.innerWidth, window.innerHeight)
                console.log(this.width, window.innerWidth);
            })
        }

        this.scenes = scenes
        Object.entries(scenes).forEach(([key, value]) => {
            this.scenes[key].game = this
        })
        this.activeScene = activeScene

        document.body.innerHTML += `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                    box-sizing: border-box;
                }

                .pixel-art {
                    image-rendering: pixelated;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: crisp-edges;
                }
            </style>
        `

        this.fps = fps

        this.camera = {x: this.width/2, y: this.height/2}

        document.addEventListener("keydown", e => this.keyDownListener(e))
        document.addEventListener("keyup", e => this.keyUpListener(e))
        document.addEventListener("mousedown", e => this.mouseDownListener(e))
        document.addEventListener("mouseup", e => this.mouseUpListener(e))
        document.addEventListener("mousemove", e => this.mouseMoveListener(e))
        document.addEventListener("touchstart", e => this.touchStartListener(e))
        document.addEventListener("touchmove", e => this.touchMoveListener(e))
        document.addEventListener("touchend", e => this.touchEndListener(e))

        this.getMouse = {x: 0, y: 0}
        document.addEventListener("mousemove", e => this.getMousePosition(e))

		if(disableContextMenu) window.addEventListener('contextmenu', e => e.preventDefault())

        if(!document.body.contains(this.cv)) document.body.appendChild(this.cv)

        load(this)
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    loop(callback = {update: () => {}, render: () => {}}){
        this.loopCallback = callback

        let lastTick = Date.now()
        let deltaTime = 0

        const loop = () => {
            const now = Date.now();
            deltaTime = (now - lastTick)/1000;
            this.currentFPS = 1000 / (now - lastTick)
            lastTick = now

            this.scenes[this.activeScene].update(deltaTime)
            callback.update(deltaTime)

            this.clear()
            this.ctx.save()
            this.clear()

            this.ctx.translate(-this.camera.x + this.width/2, -this.camera.y + this.width/2)
            // this.ctx.scale(this.zoom, this.zoom)
            // callback.render()
            this.scenes[this.activeScene].render(this.ctx, this.camera)

            this.ctx.restore()
        }
        this.loopInterval = setInterval(loop, 1000/this.fps);
    }

    setCursor(x){
        x ? this.cv.style.cursor = "default" : this.cv.style.cursor = "none"
    }

    setSize(width, height){
        this.width = width;
        this.height = height;

        this.cv.width = width;
        this.cv.height = height;
    }

    setFPS(fps){
        clearInterval(this.loopInterval)
        this.fps = fps
        this.loop(this.loopCallback)
    }

    cameraTarget(target){
        console.log(this.zoom);
        this.camera = {
            x: target.x,
            y: target.y
        }
    }

    cameraSmoothTarget(target, delay = 15){
        this.camera = {
            x: this.camera.x + ((target.x - this.camera.x) / delay),
            y: this.camera.y + ((target.y - this.camera.y) / delay)
        }
    }

    resetScene(){
        this.scenes[this.activeScene].reset()
        this.zoom = 1
    }

    changeScene(scene){
        this.activeScene = scene
    }

    createGameObject(name, object){
        this.scenes[this.activeScene].gameObjects[name] = object
    }

    instantGameObject(object){
        this.scenes[this.activeScene].gameObjects[uuidv4()] = object
    }

    removeGameObject(key){
        delete this.scenes[this.activeScene].gameObjects[key]
    }

    getGameObject(key){
        return this.scenes[this.activeScene].gameObjects[key]
    }

    getGameObjectByTag(tag){
        let gameObjectsByTag = []
        Object.entries(this.scenes[this.activeScene].gameObjects).forEach(([key, value]) => {
            const objectInstance = this.scenes[this.activeScene].gameObjects[key]
            if(objectInstance.tags.includes(tag)) gameObjectsByTag.push(objectInstance)
        })
        return gameObjectsByTag
    }

    getMousePosition(event){
        const rect = this.cv.getBoundingClientRect();
        this.getMouse = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    setFullscreen(tmp = true){
        if(tmp === true){
            this.fullScreen = true
            if (this.cv.requestFullscreen) {
                this.cv.requestFullscreen()
            } else if (this.cv.webkitRequestFullscreen) {
                this.cv.webkitRequestFullscreen()
            } else if (this.cv.msRequestFullscreen) {
                this.cv.msRequestFullscreen()
            }
        }else{
            this.fullScreen = false
            document.exitFullscreen()
        }
    }

    mouseDownListener(e){
        this.scenes[this.activeScene].mouseDownListener(e)
        this.mouseDown(e)
    }
    mouseUpListener(e){
        this.scenes[this.activeScene].mouseUpListener(e)
        this.mouseUp(e)
    }
    mouseMoveListener(e){
        this.scenes[this.activeScene].mouseMoveListener(e)
        this.mouseMove(e)
    }
    keyDownListener(e){
        this.scenes[this.activeScene].keyDownListener(e)
        this.keyDown(e)
    }
    keyUpListener(e){
        this.scenes[this.activeScene].keyUpListener(e)
        this.keyUp(e)
    }
    touchStartListener(e){
        this.scenes[this.activeScene].touchStartListener(e)
        this.touchStart(e)
    }
    touchEndListener(e){
        this.scenes[this.activeScene].touchEndListener(e)
        this.touchEnd(e)
    }
    touchMoveListener(e){
        this.scenes[this.activeScene].touchMoveListener(e)
        this.touchMove(e)
    }
}

class Scene {
    constructor({
        gameObjects = {},
        keyUp = e => {},
        keyDown = e => {},
        mouseDown = e => {},
        mouseUp = e => {},
        mouseMove = e => {},
        touchStart = e => {},
        touchEnd = e => {},
        touchMove = e => {},
        load = () => {}
    }){
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.mouseDown = mouseDown
        this.mouseUp = mouseUp
        this.mouseMove = mouseMove
        this.touchStart = touchStart
        this.touchEnd = touchEnd
        this.touchMove = touchMove

        this.gameObjects = gameObjects
        this.lastGameObjects = cloneObject(gameObjects)

        load(this)
    }
    update(dt){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            if(current.active) current.update({delataTime: dt, game: this.game, scene: this, current});
        })
    }
    render(ctx, camera){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            if(this.gameObjects[key].active && this.gameObjects[key].visible) this.gameObjects[key].render(ctx, camera);
        })
    }
    reset(){
        console.log(this.gameObjects , this.lastGameObjects);
        this.gameObjects = cloneObject(this.lastGameObjects)
    }
    keyDownListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].keyDown({event: e, curent: this.gameObjects[key]});
        })
        this.keyDown(e)
    }
    keyUpListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].keyUp(e);
        })
        this.keyUp(e)
    }
    mouseDownListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].mouseDown(e);
        })
        this.mouseDown(e)
    }
    mouseUpListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].mouseUp(e);
        })
        this.mouseUp(e)
    }
    mouseMoveListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].mouseMove(e);
        })
        this.mouseMove(e)
    }
    touchStartListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].touchStart(e);
        })
        this.touchStart(e)
    }
    touchEndListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].touchEnd(e);
        })
        this.touchEnd(e)
    }
    touchMoveListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjects[key].touchMove(e);
        })
        this.touchMove(e)
    }
}

class GameObject {
    constructor({
        x = 0,
        y = 0,
        width = 10,
        height = 10,
        color = '#fff',
        image,
        active = true,
        visible = true,
        tags = [],
        keyUp = e => {},
        keyDown = e => {},
        mouseDown = e => {},
        mouseUp = e => {},
        mouseMove = e => {},
        touchStart = e => {},
        touchEnd = e => {},
        touchMove = e => {},
        load = () => {},
        update = () => {},
    }){
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.mouseDown = mouseDown
        this.mouseUp = mouseUp
        this.mouseMove = mouseMove
        this.touchStart = touchStart
        this.touchEnd = touchEnd
        this.touchMove = touchMove

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.visible = visible
        this.active = active
        this.tags = tags
        if(image){
            const img = document.createElement('img')
            img.src = image.src
            document.body.appendChild(img)
            if(image.pixelated) img.style.cssText = `
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            `
            img.style.width = '100px'
            this.image = {...image, element: img}
        }

        load(this)
        this.load = load
        this.update = update
    }
    render(ctx){
        if(this.visible){
            ctx.fillStyle = this.color

            this.image
                ? ctx.drawImage(this.image.element, this.x, this.y, this.width, this.height)
                : ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class TileMap {
    constructor(props){
        console.log(props);
    }
    render(ctx, camera){

    }
    update(dt){

    }
    reset(){

    }
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    )
}

function getDistance(a, b){
    let y = b.x - a.x;
    let x = b.y - a.y;
    return Math.sqrt(x * x + y * y)
}

const randomFloatFromInterval = (min, max) => Math.random() * (max - min) + min

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const randomItemFromArray = array => array[Math.floor(Math.random() * array.length)]

const uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))

const getDifference = (a, b) => Math.abs(a - b)

const cloneObject = objectInstance => {
    let clone = {}
    Object.entries(objectInstance).forEach(([key, value]) => {
        clone[key] = Object.assign(Object.create(Object.getPrototypeOf(objectInstance[key])), objectInstance[key])
    })
    return clone
}