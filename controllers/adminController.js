const {User} = require('../models')
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const usernameRegex =/^([a-zA-Z0-9-_]{4,16})$/
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
const bcrypt = require('bcrypt')
const user = require('../models/user')




module.exports = {
    async getUser (req, res){

        var { id } = req.token
        const TokenId = id
        var { params: { id } } = req

        if(TokenId == id){
        const user = await User.findOne({
            where: {id: TokenId}
            });
            if (user) {
                    return res.status(201).json({
                    success:true,
                    username : user.username,
                    id : user.id,
                    email : user.email,
                    isAdmin : user.isAdmin
                    })
            }
            else{
                return res.status(400).json({
                    succes:false,
                    msg: 'utilisateur inconnu'})  
            }

        }
        else{
            return res.status(400).json({
                succes:false,
                msg: 'utilisateur ne correspond pas'})  
        }

        

    },

    async changeUser(req, res){
        var { id } = req.token
        const TokenId = id

        var { params: { id }, body: { password, username } } = req
        //verification si champs vide ou non
        if (!password || !username){
            if(!password){            
                return res.status(400).json({
                succes:false,
                msg: `Password manquant`
            })}
            else if(!username){            
                return res.status(400).json({
                succes:false,
                msg: `username manquant`
            })}
            else{
                return res.status(400).json({
                    succes:false,
                    msg: `erreur inconnue`
                })
            }
        }
        //verification si champs corrects ou non
        else if(!usernameRegex.test(username) || !passwordRegex.test(password)){
            if (!usernameRegex.test(username)){
                return res.status(400).json({
                    succes:false,
                    msg: `username incorrecte`, username
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
                    msg: `erreur incconue`, username, password
                })
            }
        }
        if(TokenId == id){
        const user = await User.findOne({
            where: {id: TokenId}
            });
            if (user) {
                user.username = username
                user.password = bcrypt.hashSync(password, 10)
                user.save()
                return res.status(201).json({
                success:true,
                msg: 'Utilisateur modifié !'
                })
            }
            else{
                return res.status(400).json({
                    succes:false,
                    msg: 'utilisateur inconnu'})  
            }
        }
        else{
            return res.status(400).json({
                succes:false,
                msg: 'utilisateur ne correspond pas'})  
        }
    }
    
}