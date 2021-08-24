const base = 'http://localhost:4000/api/';
let dragons = 0;
let enemy = {}
let passThru = false
let hero = {}

// Creates a user object with id=1, name, health=1000, attack=10
const createUser = () => {
    const body = {
        id: 1,
        name: document.querySelector('.name-field').value,
        health: 50,
        attack: 10
    }
    axios.post(base + 'user', body).then(res => {
        hero = res.data
        createDragon()
    }).catch(err => console.log(err))
}
// Creates an enemy and posts it to backend
const createDragon = () => {
    const body = {
        name: 'Dragon Lord',
        health: 30,
        attack: 10
    }
    axios.post(base + 'monster', body).then(res => {
        console.log(res.data)
    }).catch (err => console.log(err))
    getMons()
}

// gets the current enemy and saves it to enemy variable
const getMons = () => {
    axios.get(base + 'monster/' + dragons).then(res => {
        enemy = res.data
        dragons++
        battlePrep()
    }).catch(err => console.log(err))
}

// Creates reset button, displays both the dragon and the hero and removes all existing images also creates the header life bars
const battlePrep = () => {
    if (!document.querySelector('.reset-button')) {
        document.querySelector('.name-div').innerHTML = ''
        let reset = document.createElement('button')
        reset.className = 'reset-button'
        reset.textContent = 'Restart'
        reset.addEventListener('click', resetGame)
        document.querySelector('.reset').appendChild(reset)
    }
    document.querySelector('.name-div').remove()
    document.querySelectorAll('img').forEach(ele => {
        ele.remove()
    })
    let hero_img = document.createElement('input')
    hero_img.className = "hero"
    hero_img.type = 'image'
    hero_img.src = './assets/knight/knight_idle.png'
    document.querySelector('.monster-imgs').appendChild(hero_img)

    let enemy_img = document.createElement('input')
    enemy_img.className = "enemy"
    enemy_img.type = 'image'
    enemy_img.src = './assets/dragon/dragon_idle.png'
    document.querySelector('.monster-imgs').appendChild(enemy_img)

    let fightHeader = document.createElement('div')
    fightHeader.className = 'fight-header'
    
    let heroName = document.createElement('h2')
    heroName.textContent = `${hero.name}`
    let heroHealth = document.createElement('div')
    heroHealth.append(heroName)
    heroHealth.className = 'hero-health'
    fightHeader.appendChild(heroHealth)

    let fightMessage = document.createElement('h1')
    fightMessage.textContent = 'FIGHT!'
    fightHeader.appendChild(fightMessage)

    let enemyName = document.createElement('h2')
    enemyName.textContent = `${enemy.name}`
    let enemyHealth = document.createElement('div')
    enemyHealth.append(enemyName)
    enemyHealth.className = 'enemy-health'
    fightHeader.append(enemyHealth)

    document.querySelector('.header').appendChild(fightHeader)
    createToken()
}

// Resets the back end to start new game and refreshes the page
const resetGame = () => {
    axios.delete(base + 'reset').then(res => {
        location.reload()
    }).catch(err => console.log(err))
}

// Takes the max and gives back a random number
const randomNumber = max => {
        let value = Math.floor(Math.random() * max)
        return value
}

// Creates clickable image on screen that will dictate who attacks who
const createToken = () => {
    passThru = false
    let delay = 3000 // 3 seconds
    setTimeout( function() {
    if (document.querySelector('.token')) {
        document.querySelector('.token').remove()
    }
    let top = randomNumber(500) + 100
    let left = randomNumber(1500)
    let token = document.createElement('input')
    token.className="token"
    token.value = randomNumber(2)
    console.log(token.value)
    token.type = "image"
    token.style = `position: absolute; top: ${top}px; left: ${left}px; width: 50px; height: 50px;`
    if (token.value == 0) {
        token.src = "./assets/attackTokens/blueAttackFilled.png"
    } else {
        token.src = "./assets/attackTokens/orangeAttack.png"
    }
    token.addEventListener('click', heroAtt)
    document.querySelector('.monster-imgs').append(token)
    moveToken()
    }, delay)
}

// Sets passThru to true
const heroAtt = () => {
    passThru = true
}

// Shows hurt and attack .src based off who is injured
const hurtAnima = injured => {
    if (injured === hero) {
        document.querySelector(`.hero`).src = './assets/knight/knight_hurt.png'
        document.querySelector(`.enemy`).src = './assets/dragon/dragon_attack.png'
    }
    else {
        document.querySelector(`.enemy`).src = './assets/dragon/dragon_hurt.png'
        document.querySelector(`.hero`).src = './assets/knight/knight_attack.png'

    }
    resetSprite()
}

// Changes the width of the health bar based of user's health
const healthBar = injured => {
    if(injured === hero) {
        document.querySelector('.hero-health').style = `width: ${hero.health * 10}px`
    } else {
        document.querySelector('.enemy-health').style = `width: ${enemy.health * 10}px`
    }
}


// applys damage based of passed in fighter
const damage = injured => {
    document.querySelector('.token').remove()
    // applys damage to whoever was injured
    if(injured === enemy) {
        injured.health -= hero.attack 
        healthBar(injured)
        hurtAnima(injured)
    } else {
        injured.health -= enemy.attack
        healthBar(injured)
        hurtAnima(injured)
    }
    console.log('Im here is the token?')
    // Checks if either fighter is dead
    if(hero.health <= 0) {
        console.log('hero dead')
        dead(hero)
    } else if (enemy.health <= 0) {
        console.log('enemy dead')
        dead(enemy)
    } else {
        createToken()
    }
}

// delay function that checks if user clicked the button in time and if it was blue or orange
const moveToken = () => {
    let delay = 1000 // 1 second
    setTimeout(function() {
        console.log(passThru)
        if (passThru === true && document.querySelector('.token').value == 0) {
            damage(enemy)
        } else if ((passThru === true && document.querySelector('.token').value == 1)|| (passThru === false && document.querySelector('.token').value == '0')) {
            damage(hero)
        } else {
            createToken()
        }
    }, delay);
}

// Switches sprite src to idle
const resetSprite = () => {
    let delay = 3000 // 3 seconds
    setTimeout(function() {
        document.querySelector('.hero').src = "./assets/knight/knight_idle.png";
        document.querySelector('.enemy').src = "./assets/dragon/dragon_idle.png"
    }, delay);
}

// Plays animation of who dies and image of who wins
const dead = corpse => {
    let delay = 3000 // 3 seconds
    setTimeout(function() {
    if (corpse === hero) {
        document.querySelector('.hero').src = './assets/knight/knight_death.png'
        document.querySelector('.enemy').src = './assets/dragon/dragon_victory.png'
        
    } else {
        document.querySelector('.enemy').src = './assets/dragon/dragon_death.png'
        document.querySelector('.hero').src = './assets/knight/knight_victory.png'
        document.querySelector('.hero').style = 'height: 400px'
    }
    }, delay)
    displayVictory(corpse)
}

// Text switched to victory message
const displayVictory = corpse => {
    if (corpse === hero) {
        document.querySelector('h1').textContent = `${enemy.name} has slain ${hero.name}`
        healthBar(corpse)
    } else {
        document.querySelector('h1').textContent = `${hero.name} is Victorious!`
        healthBar(corpse)
    }
}

document.querySelector('.name-button').addEventListener('click', createUser)