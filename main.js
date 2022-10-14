class Player extends GameObject{
    constructor(props){
        super(props)
    }
    update(dt){
        // console.log('update');
        // game.camera = {x: this.x, y: this.y}
        // console.log(game.camera);
    }
    keyDown(e){
        if(e.key == 'd') this.x += 25
        if(e.key == 'a') this.x -= 25
        if(e.key == 'w') this.y -= 25
        if(e.key == 's') this.y += 25
    }
}

const game = new Game({
    background: '#aaa',
    load: game => {
        console.log(game);
    },
    scenes: {
        main: new Scene({
            gameObjects: {
                player: new Player({
                    color: '#fff',
                    width: 50,
                    height: 50,
                    image : {
                        src: './images/dino1.png',
                        pixelated: true
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