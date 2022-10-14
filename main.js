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
        if(e.key == 'd') this.x += 10
        if(e.key == 'a') this.x -= 10
        if(e.key == 'w') this.y -= 10
        if(e.key == 's') this.y += 10
    }
}

const game = new Game({
    background: '#aaa',
    mainScene: new Scene({
        gameObjects: {
            player: new Player({
                color: '#fff',
                width: 100,
                height: 100,
                image : {
                    src: './images/dino1hd.png',
                    pixelated: true
                }
            }),
            cube: new GameObject({
                color: 'red',
                width: 25,
                height: 25,
                tags: ['cubo']
            })
        },
        keyDown: e => {
            console.log(e.key);
        }
    }),
    keyDown: async e => {
        if(e.key == 'r') game.resetScene()
        else if(e.key == 'p') game.removeGameObject('player')
        else if(e.key == 'z') game.zoom -= .25
        else if(e.key == 'x') game.zoom += .25
        else if(e.key == 'o') game.setFullscreen(!game.fullScreen)
    }
})

const player = game.getGameObject('player')
console.log(game.getGameObjectByTag('cubo')[0]);

let cameraOffset = {x: player.x, y: player.y}

game.loop({
    update: dt => {
        // game.cameraSmoothTarget(player)
        game.cameraTarget(player)
    },
    render: () => {}
})