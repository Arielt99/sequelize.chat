# Créer des routeurs Express

Dans cet exemple, nous créons une API dans lesquelles nous distinguons deux parties :

1. l’administration des utilisateurs,
1. et leur authentification.

Pour cela, nous créerons deux routeurs.

## Création du projet

Nous créons un projet node :

```
$ touch server.js && npm init -y
```

Nous y installons les dépendances nécessaires :

```
$ npm install --save express helmet body-parser
```

Nous créons :

1. le dossier `controller/` dans lesquel nous créons les deux contrôleurs `adminController.js` et `authController.js`,
1. et le dossier `routers/` dans lequel nous rangerons les deux routeurs `adminRouter.js` et `authRouter.js`.

Ainsi, notre projet a cette structure :

```
controllers/
├── adminController.js
└── authController.js
node_modules/
package-lock.json
package.json
routers/
├── adminRouter.js
└── authRouter.js
server.js
```

## Création du serveur

Dans le fichier `server.js` :

1. nous importons `express` pour créer notre application,
1. nous importons `helmet` pour la protéger,
1. nous importons `body-parser` pour parser les requêtes en JSON,
1. enfin, nous lançons le serveur HTTP de l’application.

```js
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const app = express()
app.use(helmet())
app.use(bodyParser.json())

app.listen(8080, () => console.log('Serveur lancé sur le port 8080'))
```

## Création des routeurs

Nous créons le routeur de l’admin de l’API dans le fichier `routers/adminRouter.js` :

```js
const express = require('express')

exports.router = (() => {
    const adminRouter = express.Router()
    return adminRouter
})()
```

La syntaxe `(() => {...})()` ci-dessus :

1. déclare la fonction fléchée `() => {...}`,
1. et crée aussitôt une instance de cette fonction.

Nous créons le routeur de l’authentification de l’API de la même manière, mais cette fois dans le fichier `routers/authRouter.js` :

```js
const express = require('express')

exports.router = (() => {
    const authRouter = express.Router()
    return authRouter
})()
```

Nous utilisons ces deux routeurs en tant que *middlewares* qui traiteront les routes `/admin/` et `/auth/` :

```js
const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const adminRouter = require('./routers/adminRouter').router
const authRouter = require('./routers/authRouter').router

const app = express()
app.use(helmet())
app.use(bodyParser.json())

app.use('/admin/', adminRouter)
app.use('/auth/', authRouter)

app.listen(8080, () => console.log('Serveur lancé sur le port 8080'))
```

Ainsi, l’API :

1. interceptera les requêtes commençant par `http://localhost:8080/admin/` pour les diriger vers le routeur de l’admin,
1. et interceptera les requêtes commençant par `http://localhost:8080/auth/` pour les diriger vers le routeur de l’authentification.

## Création des contrôleurs

Nous rédigeons le contrôleur de la route `/admin/` dans le fichier `controllers/adminController.js` :

```js
module.exports = {
    getUsers(req, res) {
        return res.status(200).json({
            users: [ 'Loulou', 'Fifi', 'Riri' ]
        })
    },
    getUser(req, res) {
        const { params: { id } } = req
        return res.status(200).json({
            id,
            name: 'Loulou'
        })
    },
    deleteUser(req, res) {
        const { params: { id } } = req
        return res.status(200).json({
            msg: `Utilisateur ${id} supprimé.`
        })
    }
}
```

De même, nous rédigeons le contrôleur de la route `/auth/` dans le fichier `controllers/authController.js` :

```js
module.exports = {
    signup(req, res) {
        const { body: { username } } = req
        return res.status(201).json({
            msg: 'Nouvel utilisateur créé !',
            username
        })
    },
    signin(req, res) {
        const { body: { username } } = req
        return res.status(200).json({
            msg: `Bienvenue ${ username } !`
        })
    }
}
```

Il ne nous reste plus qu’à créer les routes dans les deux routeurs.

Dans le fichier `routers/adminRouter.js`, nous ajoutons les trois routes traitées par le contrôleur `controllers/adminController.js` :

```js
const express = require('express')

const adminController = require('../controllers/adminController')

exports.router = (() => {
    const adminRouter = express.Router()

    adminRouter.route('/users/').get(adminController.getUsers)
    adminRouter.route('/users/:id').get(adminController.getUser)
    adminRouter.route('/users/:id').delete(adminController.deleteUser)

    return adminRouter
})()
```

Et dans le fichier `routers/authRouter.js`, nous ajoutons les deux routes traitées par le contrôleur `controllers/authController.js` :

```js
const express = require('express')

const authController = require('../controllers/authController')

exports.router = (() => {
    const authRouter = express.Router()

    authRouter.route('/signup/').post(authController.signup)
    authRouter.route('/signin/').post(authController.signin)

    return authRouter
})()
```

