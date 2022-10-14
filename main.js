const game = new Game({
    backgroundColor: '#aaa',
    cameraGameObjectFollow: 'player',
    cameraGameObjectFollowDelay: 1,
    scenes: {
        main: new Scene({
            gameObjects: {
                player: new GameObject({
                    color: '#000',
                    width: 50,
                    height: 50,
                    image : {
                        src: './images/dino1.png',
                        pixelated: true
                    },
                    load: current => {
                        current.x = 25
                        console.log('object load');
                        // console.log(current.scene.game);
                    },
                    update: current => {
                        // current.y += .1
                        // console.log('object update');
                        // console.log(current.scene.game);
                    },
                    keyDown: ({event, current}) => {
                        if(event.key == 'd') current.x += 25
                        if(event.key == 'a') current.x -= 25
                        if(event.key == 'w') current.y -= 25
                        if(event.key == 's') current.y += 25
                    },
                    objectMouseDown: ({event, current}) => {
                        console.log('HAY');
                    }
                }),
                cube: new GameObject({
                    color: 'red',
                    width: 25,
                    height: 25,
                    tags: ['cubo']
                }),
            },
            load: current => {
                console.log('scene load');
                // current.game.backgroundColor = 'red'
                // console.log(current.game);
            },
            update: current => {
                // console.log('scene update');
                // console.log(current.game);
                // current.game.backgroundColor = 'red'
                const player = current.gameObjects['player']
            },
            keyDown: e => {
                // console.log(e.key);
            },
        })
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
        else if(event.key == 'p') current.removeGameObject('player')
        else if(event.key == 'z') current.zoom -= .25
        else if(event.key == 'x') current.zoom += .25
        else if(event.key == 'o') current.setFullscreen(!current.fullScreen)
    },
})