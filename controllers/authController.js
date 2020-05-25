const {User} = require('../models')
const { Op } = require("sequelize")
const bcrypt = require('bcrypt')

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const usernameRegex =/^([a-zA-Z0-9-_]{4,16})$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/

module.exports = {
    async signup (req, res) {
        const { body: { username, password, email } } = req
        //verification si champs vide ou non
        if (!username || !password || !email){
            if(!username){            
                return res.status(400).json({
                succes:false,
                msg: `Username manquant`
            })}
            else if(!password){            
                return res.status(400).json({
                succes:false,
                msg: `Password manquant`
            })}
            else if(!email){            
                return res.status(400).json({
                succes:false,
                msg: `Email manquant`
            })}
            else{
                return res.status(400).json({
                    succes:false,
                    msg: `erreur inconnue`
                })
            }
        }
        //verification si champs corrects ou non
        else if(!emailRegex.test(email) || !usernameRegex.test(username) || !passwordRegex.test(password)){
            if (!emailRegex.test(email)){
                return res.status(400).json({
                    succes:false,
                    msg: `Email incorrecte`, email
                })
            }
            else if (!usernameRegex.test(username)){
                return res.status(400).json({
                    succes:false,
                    msg: `Username incorrect`, username
                })
            }
            else if (!passwordRegex.test(password)){
                return res.status(400).json({
                    succes:false,
                    msg: `Password incorrect`, password
                })
            }
            else{
                return res.status(400).json({
                    succes:false,
                    msg: `erreur incconue`, email,username, password
                })
            }
        }
        const [user, created] = await User.findOrCreate({
            where: {[Op.or]: [ { username: username}, {email: email} ]},
            defaults: {
                password: bcrypt.hashSync(password, 10),
                username:username,
                email: email,
                isAdmin: false
            }
            });
            if (created) {
            return res.status(201).json({
            succes:true,
            msg: 'Nouvel utilisateur créé !',
            username})
            }
            else{
                if(username == user.username){
                    return res.status(400).json({
                    succes:false,
                    msg: 'Username déjà pris',
                    user:user,
                    username, email})       
                }  
                else if (email == user.email){
                    return res.status(400).json({
                    succes:false,
                    msg: 'Email déjà pris',
                    user:user,
                    username, email})       
                }
                else{
                    return res.status(400).json({
                        succes:false,
                        msg: 'Erreur serveur',
                        user:user,
                        username, email})  
                }
            }
    },
    signin(req, res) {
        const { body: { username } } = req
        return res.status(200).json({
            msg: `Bienvenue ${ username } !`
        })
    }
}