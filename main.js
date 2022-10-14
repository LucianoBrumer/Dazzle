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
    keyDown: e => {
        if(e.key == 'r') game.resetScene()
        if(e.key == 'p') game.removeGameObject('player')
    }
})

const player = game.getGameObject('player')
console.log(game.getGameObjectByTag('cubo')[0]);

game.loop(dt => {
    game.cameraSmoothTarget(player)
})