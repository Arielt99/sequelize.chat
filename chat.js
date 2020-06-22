
const express = require('express')
const { SSL_OP_NO_TICKET } = require('constants')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
app.use(express.static('front'))

let n = 1

app.get('/',(req, res) => {
    res.sendFile(`${__dirname}/front/chat.html`)
 });

//message de bienvenue
 io.on('connection', socket =>{
     console.log(`utilisateur ${n++} est connecté`)
     socket.emit('chat',{
         from: 'Serveur',
         msg: 'Bienvenue sur le chat'
     })

    //connexion d'un user
    socket.broadcast.emit('chat',{
        from: 'Serveur',
        msg: 'un utilisateur est connecté'
    })

    //traiter le message d'un utilisateur
    socket.on('chat', data =>{
        const msg = data.msg
        const sender = data.sender
        socket.broadcast.emit('chat',{
            from : `${sender}`,
            msg
        })
        socket.emit('chat',{
            from: 'moi',
            msg
        })
    })

 })


    //message de deconnexion d'un user

const port = 3043
http.listen(port,() => console.log(`Serveur lancé sur http://localhost:${port}`))