const express = require('express')
const cors = require('cors')
const app = express()
const ctrl = require('./controller')
const port = process.env.PORT || 4000


//middlewares
app.use(express.json())
app.use(cors())


app.get('/', ctrl.main)
app.post('/api/user', ctrl.addUser)
app.post('/api/monster', ctrl.addMons)
app.get('/api/user', ctrl.getUser)
app.get('/api/monster/:id', ctrl.getMons)
app.put('/api/user', ctrl.updateUser)
app.put('/api/monster', ctrl.updateMons)
app.delete('/api/reset', ctrl.resetGame)


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
