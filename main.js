class Player extends GameObject{
    constructor(props){
        super(props)
    }
    update(dt){
        // console.log('update');
    }
    keyDown(e){
        if(e.key == 'd') this.x += 10
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
                    src: './images/dino1.png',
                    pixelated: true
                }
            })
        },
        keyDown: e => {
            console.log(e.key);
        }
    }),
    keyDown: e => {
        if(e.key == 'r') game.resetScene()
        if(e.key == 'p') game.removeGameObject('player')
    }
})

game.loop(dt => {
    game.ctx.fillStyle = 'red'
    game.ctx.fillRect(150, 0, 50, 50)
})