document.body.innerHTML += `
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    </style>
`

class Game{
    constructor({
        width = 500,
        height = 500,
        id = 'game',
        backgroundColor = '#fff',
        cursor = true,
        fps = 60,
        disableContextMenu = true,
        camera = {x: 0, y: 0, delay: 1},
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
        render = () => {},
        update = () => {}
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

        this.setSize(width, height)

        this.fullScreen = fullScreen
        if(fullScreen === true) this.setFullscreen(fullScreen)

        this.setBackgroundColor(backgroundColor);
        this.setCursor(cursor);

        if(fullWindow) {
            this.setSize(window.innerWidth, window.innerHeight)
            window.addEventListener('resize', () => {
                this.setSize(window.innerWidth, window.innerHeight)
            })
        }

        this.fps = fps

        this.camera = {x: camera.x ? camera.x : 0, y: camera.y ? camera.y : 0, target: camera.target, delay: camera.delay}

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

        this.scenes = {}
        this.scenesProps = {}
        Object.entries(scenes).forEach(([key, value]) => {
            this.scenesProps[key] = value
        })
        this.activeScene = activeScene

        load(this)
        this.load = load
        this.update = update
        this.render = render

        this.resetScene()

        this.updateListener()

        this.safeObject = cloneObject(this)
    }

    setBackgroundColor(backgroundColor){
        this.backgroundColor = backgroundColor
        this.cv.style.backgroundColor = backgroundColor
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    updateListener(){
        this.lastTick = Date.now()
        this.deltaTime = 0

        const loop = () => {
            const now = Date.now();
            this.deltaTime = (now - this.lastTick)/1000;
            this.currentFPS = 1000 / (now - this.lastTick)
            this.lastTick = now

            try {
                if(this.camera.target) this.cameraTarget(this.getGameObject(this.camera.target), this.camera.delay)
            } catch (error) {
                console.error('Camera target GameObject undefined');
            }

            this.scenes[this.activeScene].updateListener()
            this.update(this)

            this.clear()
            this.ctx.save()
            this.clear()

            this.ctx.translate(-this.camera.x + this.width/2, -this.camera.y + this.width/2)
            // this.ctx.scale(this.zoom, this.zoom)

            this.render(this)
            this.scenes[this.activeScene].renderListener(this.ctx, this.camera)

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
        this.updateListener()
    }

    cameraTarget(target, delay = 1){
        this.camera.x += (target.x - this.camera.x) / delay
        this.camera.y += (target.y - this.camera.y) / delay
    }

    resetScene(){
        const scene = new Scene(this.scenesProps[this.activeScene])
        scene.game = this
        scene.load()
        Object.entries(scene.gameObjects).forEach(([key, value]) => {
            const object = value
            object.scene = scene
            object.load(object)
        })
        this.scenes[this.activeScene] = scene
        // this.zoom = 1
    }

    changeScene(scene){
        this.activeScene = scene
        this.resetScene()
    }

    createGameObject(name, props){
        this.scenes[this.activeScene].gameObjects[name] = new GameObject(props)
    }

    instantGameObject(props){
        this.scenes[this.activeScene].gameObjects[uuidv4()] = new GameObject(props)
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
            x: (event.clientX - rect.left) - (-this.camera.x + this.width/2),
            y: (event.clientY - rect.top) - (-this.camera.y + this.height/2)
        }
    }

    setFullscreen(tmp = true){
        if(tmp === true){
            this.fullScreen = true
            try {
                if (this.cv.requestFullscreen) {
                    this.cv.requestFullscreen()
                } else if (this.cv.webkitRequestFullscreen) {
                    this.cv.webkitRequestFullscreen()
                } else if (this.cv.msRequestFullscreen) {
                    this.cv.msRequestFullscreen()
                }
            } catch (error) {}
        }else{
            this.fullScreen = false
            try {
                document.exitFullscreen()
            } catch (error) {;}
        }
    }

    mouseDownListener(e){
        this.scenes[this.activeScene].mouseDownListener(e)
        this.mouseDown({event: e, current: this})
    }
    mouseUpListener(e){
        this.scenes[this.activeScene].mouseUpListener(e)
        this.mouseUp({event: e, current: this})
    }
    mouseMoveListener(e){
        this.scenes[this.activeScene].mouseMoveListener(e)
        this.mouseMove({event: e, current: this})
    }
    keyDownListener(e){
        this.scenes[this.activeScene].keyDownListener(e)
        this.keyDown({event: e, current: this})
    }
    keyUpListener(e){
        this.scenes[this.activeScene].keyUpListener(e)
        this.keyUp({event: e, current: this})
    }
    touchStartListener(e){
        this.scenes[this.activeScene].touchStartListener(e)
        this.touchStart({event: e, current: this})
    }
    touchEndListener(e){
        this.scenes[this.activeScene].touchEndListener(e)
        this.touchEnd({event: e, current: this})
    }
    touchMoveListener(e){
        this.scenes[this.activeScene].touchMoveListener(e)
        this.touchMove({event: e, current: this})
    }
}

class Scene {
    constructor({
        gameObjects = {},
        tileMaps = [],
        keyUp = e => {},
        keyDown = e => {},
        mouseDown = e => {},
        mouseUp = e => {},
        mouseMove = e => {},
        touchStart = e => {},
        touchEnd = e => {},
        touchMove = e => {},
        load = () => {},
        render = () => {},
        update = () => {}
    }){
        this.keyUp = keyUp
        this.keyDown = keyDown
        this.mouseDown = mouseDown
        this.mouseUp = mouseUp
        this.mouseMove = mouseMove
        this.touchStart = touchStart
        this.touchEnd = touchEnd
        this.touchMove = touchMove

        this.gameObjects = {}

        tileMaps.forEach(tileMapProps => {
            const tileMap = new TileMap(tileMapProps)
            this.gameObjects = {...this.gameObjects, ...tileMap.gameObjects}
        })

        Object.entries(gameObjects).forEach(([key, value]) => {
            this.gameObjects[key] = new GameObject(value)
        })

        this.gameObjectsProps = {}
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            this.gameObjectsProps[key] = {}
            Object.entries(value).forEach(([key2, value2]) => {
                this.gameObjectsProps[key][key2] = value2
            })
        })

        this.load = load
        this.update = update
        this.render = render

        this.safeObject = cloneObject(this)
    }
    updateListener(){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            if(current.active) current.update(this);
        })
        this.update(this)
    }
    renderListener(){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            if(current.active && current.visible) current.render();
        })
    }
    reset(){
        // console.log(this.gameObjects , this.lastGameObjects);
        let resetedGameObjects = {}
        Object.entries(this.gameObjectsProps).forEach(([key, value]) => {
            resetedGameObjects[key] = new GameObject(value)
            resetedGameObjects[key].scene = this
        })
        this.gameObjects = resetedGameObjects
    }
    keyDownListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.keyDown({event: e, current: current});
        })
        this.keyDown({event: e, current: this});
    }
    keyUpListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.keyUp({event: e, current});
        })
        this.keyUp({event: e, current: this});
    }
    mouseDownListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.mouseDown({event: e, current});
            if(isInside(this.game.getMouse, current)) {
                current.objectMouseDown({event: e, current});
            }
        })
        this.mouseDown({event: e, current: this});
    }
    mouseUpListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.mouseUp({event: e, current});
            if(isInside(this.game.getMouse, current)) current.objectMouseUp({event: e, current});
        })
        this.mouseUp({event: e, current: this});
    }
    mouseMoveListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.mouseMove({event: e, current});
            if(isInside(this.game.getMouse, current)) current.objectMouseMove({event: e, current});
        })
        this.mouseMove({event: e, current: this});
    }
    touchStartListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.touchStart({event: e, current});
            // current.objectTouchStart({event: e, current});
        })
        this.touchStart({event: e, current: this});
    }
    touchEndListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.touchEnd({event: e, current});
            // current.objectTouchEnd({event: e, current});
        })
        this.touchEnd({event: e, current: this});
    }
    touchMoveListener(e){
        Object.entries(this.gameObjects).forEach(([key, value]) => {
            const current = this.gameObjects[key]
            current.touchMove({event: e, current});
            // current.objectTouchMove({event: e, current});
        })
        this.touchMove({event: e, current: this});
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
        objectMouseDown = e => {},
        objectMouseUp = e => {},
        objectMouseMove = e => {},
        objectTouchStart = e => {},
        objectTouchEnd = e => {},
        objectTouchMove = e => {},
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

        this.objectMouseDown = objectMouseDown
        this.objectMouseUp = objectMouseUp
        this.objectMouseMove = objectMouseMove
        this.objectTouchStart = objectTouchStart
        this.objectTouchEnd = objectTouchEnd
        this.objectTouchMove = objectTouchMove

        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.visible = visible
        this.active = active
        this.tags = tags
        if(image){
            const img = new Image()
            img.src = image.src
            this.image = {...image, element: img}
        }

        this.load = load
        this.update = update
    }
    render(){
        this.scene.game.ctx.fillStyle = this.color

        this.scene.game.ctx.fillRect(this.x, this.y, this.width, this.height)
        if(this.image){
            if(this.image.pixelated) this.scene.game.ctx.imageSmoothingEnabled = false;
            this.scene.game.ctx.drawImage(this.image.element, this.x, this.y, this.width, this.height)
        }
    }
}

class TileMap {
    constructor(props){
        this.x = props.x
        this.y = props.y

        const str = props.map.replaceAll(' ', '').trim().split()[0].replaceAll('\n', '')

        this.map = []
        this.gameObjects = {}

        for (let i = 0; i < props.rows; i++) {
            this.map[i] = []
        }

        let row = 0
        for (let i = 0; i < str.length; i++) {
            const object = cloneObject(props[str[i]])
            // object.
            // object.
            this.map[row].push(object)
            // this.gameObjects[uuidv4()] = object
            // this.gameObjects[uuidv4()] = props[str[i]]
            this.gameObjects[uuidv4()] = new GameObject({
                ...props[str[i]],
                x: props.x + (props.size * (this.map[row].length - 1)),
                y: props.y + (props.size * row)
            })
            if(this.map[row].length === props.cols) row++
        }

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

function isInside(a, b){
    return (
        (a.x > b.x && a.x < b.x + b.width) &&
        (a.y > b.y && a.y < b.y + b.height)
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