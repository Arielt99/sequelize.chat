const express = require('express')
const jwt = require('jsonwebtoken')
const jwtSecret = 'lefootcunsportdemerdeattarde'
const checkJwt = (req, res, next) =>{
    try {
        if (!req.header('Authorization')){
            throw 'Il y as pas de header Authorization dans la requete'
        }
        const authorizationPart = req.header('Authorization').split(' ')
        let token = authorizationPart[1]
        jwt.verify(token, jwtSecret, (error, decodeToken)=>{
            if(error){
                throw error
            }
            req.token =decodeToken
            next()
        })
    }catch(error){
        console.log(error)
        res.status(401).json({msg:'Accès refusé'})
    }
}
const adminController = require('../controllers/adminController')

exports.router = (() => {
    const adminRouter = express.Router()

    adminRouter.route('/:id').all(checkJwt).get(adminController.getUser)
    adminRouter.route('/:id').all(checkJwt).post(adminController.changeUser)

    return adminRouter
})()