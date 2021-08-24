const path = require('path')
const { send } = require('process')
let monsterId = 0
let hero = {}
let monsters = []



module.exports = {
    //sends main html file
    main: (req,res) => {
        res.sendFile(path.join(__dirname, '../client/index.html'))
    },

    //posts user sprite and obj
    addUser: (req, res) => {
        hero = req.body
        res.status(200).send(hero)
    },

    //posts monster to array of monsters as an obj
    addMons: (req, res) => {
        let mon = req.body
        mon.id = monsterId
        monsters.push(mon)
        // console.log(mon)
        monsterId++
        res.status(200).send("Monster Accepted")
    },
    
    //get user obj
    getUser: (req, res) => {
        res.status(200).send(hero)
    },

    //get monster obj by id
    getMons: (req, res) => {
        let { id } = req.params
        //console.log(id)
        //console.log(monsters)
        console.log(monsters[id])
        res.status(200).send(monsters[id])
    },

    //update user health by subtracting damage return hero obj
    updateUser: (req, res) => {
        let damage = +req.body.damage
        monsters[index].health -= +damage
        hero.health -= damage
        res.status(200).send(hero)
    },
    
    //update monster by id and subtract damage from health, return monster obj
    updateMons: (req, res) => {
        let { damage, deleteId } = req.body
        deleteId = +deleteId
        let index = monsters.findIndex(mons => {
            return mons.id === deleteId
        })
        monsters[index].health -= +damage
        res.status(200).send(monsters[index])
    },

    // Resets the game by clearing the backend
    resetGame: (req, res) => {
        let monsterId = 0
        let hero = {}
        let monsters = []
        res.status(200).send("Game Restarted")
    }
}