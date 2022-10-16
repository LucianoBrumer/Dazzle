const TileMapTest = {
    x: 100,
    y: 100,
    size: 50,
    rows: 4,
    cols: 3,
    X: {color: 'red'},
    O: {color: 'blue'},
    map: `
        XXX
        XOX
        OXO
        OOO
    `
}

const Player = {
    color: '#000',
    width: 50,
    height: 50,
    z: 1,
    image : {
        src: './images/dino1.png',
        pixelated: true
    },
    load: current => {
        current.speed = 50
        console.log('object load');

        current.shot = () => {
            console.log('shot');
        }
    },
    keyDown: ({event, current}) => {
        if(event.key == 'd') current.x += current.speed
        if(event.key == 'a') current.x -= current.speed
        if(event.key == 'w') current.y -= current.speed
        if(event.key == 's') current.y += current.speed
        if(event.key == 'l') current.shot()
    },
    objectMouseDown: ({event, current}) => {
        console.log('HAY');
    }
}

const game = new Game({
    backgroundColor: '#aaa',
    // fullWindow: true,
    camera: {
        target: 'player',
        delay: 15
    },
    scenes: {
        main: {
            gameObjects: {
                player: Player,
                cube: {
                    color: 'rgb(255, 0, 0, 0.5)',
                    width: 25,
                    height: 25,
                    z: 2,
                    tags: ['cubo']
                },
            },
            tileMaps: [TileMapTest],
            load: current => {
                console.log('scene load');
            },
        }
    },
    load: current => {
        console.log('game load');
    },
    keyDown: ({event, current}) => {
        if(event.key == 'r') current.resetScene()
        else if(event.key == 'p') current.removeGameObject('cube')
        else if(event.key == 'o') current.setFullscreen(!current.fullScreen)
    },
})

window.addEventListener('resize', () => {
    console.log('game: ', game.width, game.height);
    console.log('ctx: ', game.cv.width, game.cv.height);
    console.log('window: ', window.innerWidth, window.innerHeight);
    console.log('document: ', document.body.clientWidth, document.body.clientHeight);
})

window.addEventListener('mousedown', event => {
    console.log('mouse: ', event.clientX, event.clientY);
})