const game = new Game({
    background: '#aaa',
    load: game => {
        console.log(game);
    },
    scenes: {
        main: new Scene({
            gameObjects: {
                player: new GameObject({
                    color: '#fff',
                    width: 50,
                    height: 50,
                    image : {
                        src: './images/dino1.png',
                        pixelated: true
                    },
                    load: current => {
                        current.x = 25
                    },
                    keyDown: ({event, curent}) => {
                        if(event.key == 'd') curent.x += 25
                        if(event.key == 'a') curent.x -= 25
                        if(event.key == 'w') curent.y -= 25
                        if(event.key == 's') curent.y += 25
                    },
                    update: ({deltaTime, current, game, scene}) => {
                        // current.y += .1
                    }
                }),
                cube: new GameObject({
                    color: 'red',
                    width: 25,
                    height: 25,
                    tags: ['cubo']
                }),
            },
            keyDown: e => {
                // console.log(e.key);
            }
        })
    },
    keyDown: async e => {
        if(e.key == 'r') game.resetScene()
        else if(e.key == 'p') game.removeGameObject('player')
        else if(e.key == 'z') game.zoom -= .25
        else if(e.key == 'x') game.zoom += .25
        else if(e.key == 'o') game.setFullscreen(!game.fullScreen)
    }
})

game.loop({
    update: dt => {
        const player = game.getGameObject('player')
        game.cameraSmoothTarget(player, 50)
        // game.cameraTarget(player)
    },
    render: () => {}
})