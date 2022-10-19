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
    // light: {
    //     color: 'transparent',
    //     radius: 75,
    //     inner: 50,
    // },
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
    // darkness: {
    //     global: .9
    // },
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
                    tags: ['cubo'],
                    light: {
                        color: 'rgba(255, 0, 0, .25)'
                    }
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