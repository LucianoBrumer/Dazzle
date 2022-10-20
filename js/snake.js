const SnakeBody = {
    color: '#111',
    load: current => {
        current.width = current.scene.grid
        current.height = current.scene.grid
    },
}

const Apple = {
    color: 'rgb(175, 25, 25)',
    load: current => {
        current.width = current.scene.grid
        current.height = current.scene.grid

        current.reset = current => {
            const x = (randomIntFromInterval(0, (current.scene.game.width/current.scene.grid)-1))
            const y = (randomIntFromInterval(0, (current.scene.game.height/current.scene.grid)-1))
            current.x =  x * current.scene.grid
            current.y = y * current.scene.grid

            //if new position are inside of snake, reset position again
            current.scene.snake.forEach(snake => {
                if(positionsMatch(snake, current)){
                    current.reset(current)
                }
            })
        }

        current.reset(current)
    }
}

const game = new Game({
    backgroundColor: 'rgb(255, 255, 255)',
    fps: 6,
    cursor: false,
    scenes: {
        main: {
            gameObjects: {
                apple: Apple
            },
            load: current => {
                current.grid = 50

                current.speedX = 0
                current.speedY = 0
                current.snake = []

                const head = current.game.instantGameObject(SnakeBody)
                current.snake.push(head)

                document.title = 'Snake - Dazzle'
            },
            update: current => {
                const snakeHead = current.snake[current.snake.length-1]
                const newHead = current.game.instantGameObject(SnakeBody)
                newHead.x = snakeHead.x + current.speedX
                newHead.y = snakeHead.y + current.speedY
                current.snake.push(newHead)

                const lastSnake = current.snake.shift()
                current.game.removeGameObject(lastSnake.keyName)

                if(current.snake.length > 1){
                    current.snake.forEach(snake => {
                        if(newHead.id !== snake.id && newHead.x === snake.x && newHead.y === snake.y){
                            current.game.resetScene()
                        }
                    })
                }

                if(newHead.x > current.game.width-current.grid ||
                    newHead.x < 0 ||
                    newHead.y > current.game.height-current.grid ||
                    newHead.y < 0
                ){
                    current.game.resetScene()
                }

                const apple = current.gameObjects['apple']
                if(positionsMatch(apple, newHead)){
                    const newSnake = current.game.instantGameObject(SnakeBody)
                    newSnake.x = newHead.x
                    newSnake.y = newHead.y
                    current.snake.push(newSnake)
                    apple.reset(apple)
                }

                // current.game.cameraTarget(newHead, 5)
            },
            keyDown: ({event, current}) => {
                if(event.key == 'd' || event.key == 'ArrowRight') {
                    current.speedY = 0
                    if(current.snake.length > 1){
                        if(current.speedX !== -50) current.speedX = 50
                    }
                    else current.speedX = 50
                }
                else if(event.key == 'a' || event.key == 'ArrowLeft') {
                    current.speedY = 0
                    if(current.snake.length > 1){
                        if(current.speedX !== 50) current.speedX = -50
                    }
                    else current.speedX = -50
                }
                else if(event.key == 'w' || event.key == 'ArrowUp') {
                    current.speedX = 0
                    if(current.snake.length > 1){
                        if(current.speedY !== 50) current.speedY = -50
                    }
                    else current.speedY = -50
                }
                else if(event.key == 's' || event.key == 'ArrowDown') {
                    current.speedX = 0
                    if(current.snake.length > 1){
                        if(current.speedY !== -50) current.speedY = 50
                    }
                    else current.speedY = 50
                }
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