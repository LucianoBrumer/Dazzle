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
        // console.log(current.scene.game);
    },
    update: current => {
        // current.y += .1
        // console.log('object update');
        // console.log(current.scene.game);
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
    camera: {
        target: 'player',
        delay: 15
    },
    scenes: {
        main: {
            gameObjects: {
                player: Player,
                cube: {
                    color: 'red',
                    width: 25,
                    height: 25,
                    tags: ['cubo']
                },
            },
            tileMaps: [TileMapTest],
            load: current => {
                console.log('scene load');
                // current.game.backgroundColor = 'red'
                // console.log(current.game);
            },
            update: current => {
                // console.log('scene update');
                // console.log(current.game);
                // current.game.backgroundColor = 'red'
                // const player = current.gameObjects['player']
                // console.log(player);
            },
            keyDown: e => {
                // console.log(e.key);
            },
        }
    },
    load: current => {
        console.log('game load');
        // current.backgroundColor = 'blue'
    },
    update: current => {
        // console.log('game update');
    },
    keyDown: ({event, current}) => {
        if(event.key == 'r') current.resetScene()
        else if(event.key == 'p') current.removeGameObject('cube')
        else if(event.key == 'z') current.zoom -= .25
        else if(event.key == 'x') current.zoom += .25
        else if(event.key == 'o') current.setFullscreen(!current.fullScreen)
    },
})