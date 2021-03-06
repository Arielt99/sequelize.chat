const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
var cors = require('cors')

const adminRouter = require('./routers/adminRouter').router
const authRouter = require('./routers/authRouter').router

const app = express()
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())

app.use('/admin/', adminRouter)
app.use('/auth/', authRouter)

const port = 3042
app.listen(port,() => console.log(`Serveur lancé sur http://localhost:${port}`))