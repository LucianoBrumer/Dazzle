const Ball = {
    color: '#f5f5f5',
    width: 20,
    height: 20,
    load: current => {
        current.reset = current => {
            current.x = current.scene.game.width/2-current.width/2
            current.y = current.scene.game.height/2-current.height/2

            current.speedX = 0
            current.speedY = 0

            const players = current.scene.getGameObjectByTag('player')
            players.forEach(player => player.reset(player))
        }
        current.reset(current)
    },
    update: current => {
        current.x += current.speedX
        current.y += current.speedY

        if(current.y < 0) current.speedY = Math.abs(current.speedY)
        else if((current.y + current.height/2) > current.scene.game.height) current.speedY = -Math.abs(current.speedY)

        if(current.x > current.scene.game.width || current.x < 0) current.reset(current)
    },
    onCollide: ({current, target}) => {
        if(target.tags.includes('player')) {
            if(target.keyName === 'player1') current.speedX = (Math.abs(current.speedX) + randomFloatFromInterval(.1, .5))
            else if(target.keyName === 'player2') current.speedX = -(Math.abs(current.speedX) + randomFloatFromInterval(.1, .5))

            if(target.speedY > 0) current.speedY = Math.abs(current.speedY)
            else if(target.speedY < 0) current.speedY = -Math.abs(current.speedY)
        }
    },
    keyDown: ({event, current}) => {
        if(current.speedX === 0){
            current.speedX = randomItemFromArray([-5, 5])
            current.speedY = randomItemFromArray([-2.5, 2.5])
        }
    }
}

const Player = {
    color: '#f5f5f5',
    width: 20,
    height: 100,
    tags: ['player'],
    load: current => {
        current.speed = 12.5
        current.speedY = 0

        current.reset = current => {
            current.y = current.scene.game.height/2-current.height/2
        }
    },
    update: current => {
        current.y += current.speedY

        if(current.y < 0) current.y = 0
        else if(current.y > current.scene.game.height-current.height) current.y = current.scene.game.height-current.height
    },
}

const Player1 = {
    ...Player,
    x: (888/8)-(20/2),
    keyDown: ({event, current}) => {
        if(event.key == 'w') current.speedY = -current.speed
        else if(event.key == 's') current.speedY = current.speed
    },
    keyUp: ({event, current}) => {
        if(event.key == 'w' && current.speedY < 0) current.speedY = 0
        else if(event.key == 's' && current.speedY > 0) current.speedY = 0
    },
}

const Player2 = {
    ...Player,
    x: (888-(888/8))-(20/2),
    keyDown: ({event, current}) => {
        if(event.key == 'ArrowUp') current.speedY = -current.speed
        else if(event.key == 'ArrowDown') current.speedY = current.speed
    },
    keyUp: ({event, current}) => {
        if(event.key == 'ArrowUp' && current.speedY < 0) current.speedY = 0
        else if(event.key == 'ArrowDown' && current.speedY > 0) current.speedY = 0
    },
}

const game = new Game({
    backgroundColor: '#333',
    fps: 60,
    cursor: false,
    width: 888,
    scenes: {
        main: {
            gameObjects: {
                player1: Player1,
                player2: Player2,
                ball: Ball
            },
            load: current => {
                document.title = 'Pong - Dazzle'
            },
        }
    },
    keyDown: ({event, current}) => {
        if(event.key == 'p') current.togglePause()
        if(event.key == 'r') current.resetScene()
        else if(event.key == 'o') current.setFullscreen(!current.fullScreen)
    },
    onPause: current => {
        current.setCursor(true)
    },
    onUnpause: current => {
        current.setCursor(false)
    },
})