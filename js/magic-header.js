const header = document.querySelector('header')
const topButton = document.querySelector('#top')

const animationDuration = 250
const revealOnStopDelay = 500

topButton.state = 'hidden'
header.state = 'visible'

topButton.addEventListener('click', e => {
    window.scrollTo({top: 0, behavior: 'smooth'});
})

window.addEventListener('scroll', e => {

    clearTimeout(header.timer)
    header.timer = setTimeout(() => {
        //stop scrolling
        if(header.state == 'hidden'){
            header.animate([
                {transform: "translateY(-100%)"},
                {transform: "translateY(0)"}
            ],{
                duration: animationDuration,
                fill: 'forwards'
            })
            header.state = 'visible'
        }
    }, revealOnStopDelay);

    if(window.oldScroll > window.scrollY){
        //scrolling up
        if(header.state == 'hidden'){
            header.animate([
                {transform: "translateY(-100%)"},
                {transform: "translateY(0)"}
            ],{
                duration: animationDuration,
                fill: 'forwards'
            })
            header.state = 'visible'
        }
    }else{
        //scrolling down
        if(header.state == 'visible'){
            header.animate([
                {transform: "translateY(0)"},
                {transform: "translateY(-100%)"}
            ],{
                duration: animationDuration,
                fill: 'forwards'
            })
            header.state = 'hidden'
        }
    }

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if(topButton.state == 'hidden'){
            topButton.animate([
                {transform: "translateY(100%)"},
                {transform: "translateY(0)"}
            ],{
                duration: animationDuration,
                fill: 'forwards'
            })
            topButton.state = 'visible'
        }
    }else{
        if(topButton.state == 'visible'){
            topButton.animate([
                {transform: "translateY(0)"},
                {transform: "translateY(100%)"}
            ],{
                duration: animationDuration,
                fill: 'forwards'
            })
            topButton.state = 'hidden'
        }
    }

    window.oldScroll = window.scrollY
})