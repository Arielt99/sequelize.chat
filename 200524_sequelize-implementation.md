# Implémenter Sequelize

## Principes de Sequelize

Sequelize est ORM (object-relational mapping) SQL, c’est-à-dire qu’il nous permet de représenter les tables d’une base de données SQL sous la forme d’objets JS et de leur adjoindre des méthodes pour les modifier ou y accéder.s

Les base de données SQL utilisées avec Sequelize peuvent être aussi bien du MySQL, que du SQLite, du Postgres, SQLite et Microsoft SQL Server. Sequelize permet de changer d’avis et de migrer des données d’un de ces formats à un autre.

Il permet aussi d’utiliser plusieurs bases en fonction de l’environnement d’exécution de l’application (développement, production, tests, etc.).

## Objectifs du projet

Nous allons implémenter deux tables :

1. la tables des `Users` qui comportera les champs `email`, `username` et `password`,
1. et la table des `Messages` qui comportera les champs `userId` et `content`,
1. le champ `userId` de la table des `Messages` sera relié à l’`id` d’un utilisateur de la table des `Users`.

Nous configurerons Sequelize pour qu’il puisse utiliser trois bases de données MySQL qu’il faut créer au préalable :

1. `node_sequelize_development`
1. `node_sequelize_test`
1. `node_sequelize_production`

## Création des bases de données en lignes de commande

Si nous le souhaitons, nous pouvons créer les bases de données avec phpMyAdmin, mais voici comment créer les bases de données sans passer par phpMyAdmin.

### Configuration préalable de Mamp

Si nous utilisons Mamp :

1. nous ouvrons les préférences de Mamp,
1. puis dans l’onglet `Ports` nous cliquons sur le bouton `Set Web & MySQL ports to 80 & 3306`.

Nous pouvons éventuellement modifier le mot de passe de la base MySQL de Mamp, en tapant :

```
$ /Applications/MAMP/Library/bin/mysqladmin -u root -p password <nouveau-mot-de-passe>
```

Le Terminal nous demande alors de taper le mot de passe actuel avant de le modifier.

### Création des bases de données

1. Nous nous connectons à MySQL :
```
$ /Applications/MAMP/Library/bin/mysql -u root -p
```
1. le Terminal nous demande de taper notre mot de passe qui est `root` si nous ne l’avons pas modifié,
1. l’invite de commande `mysql` est lancée :
```
mysql>
```

Nous pouvons taper les commandes SQL de notre choix :
1. derrière le chevron `>`,
1. puis en validant ces commandes avec la touche `Entrée`.

Pour créeer les trois bases de données en tapant les lignes de commande `create database <nom-de-la-nouvelle-base>;` après l’invite `mysql>` et en validant chaque ligne de commande avec la touche `Entrée` :

1. `mysql> create database node_sequelize_development;`
1. `mysql> create database node_sequelize_test;`
1. `mysql> create database node_sequelize_production;`

Le Terminal nous répond `Query OK, 1 row affected (0,00 sec)` après chacune de ces entrées, cela signifie que les bases de données ont bien été créées.

Enfin, nous tapons `CTRL-D` pour quitter l’invite de commande `mysql`.

## Mise en place du projet et de Sequelize

### Création du projet

Nous créons un projet dont le point d’entrée sera le fichier `server.js` :

```
$ touch server.js && npm init -y
```

### Installation des dépendances

Quand notre application sera exécutée, elle aura besoin de `sequelize` et de `mysql2` :

```
$ npm install --save sequelize mysql2
```

Pour configurer Sequelize dans notre projet, nous installons aussi `sequelize-cli` :

```
$ npm install --save-dev sequelize-cli
```

### Initialisation de Sequelize

```
$ npx sequelize init
```

Sequelize a créé les fichiers et dossiers :
1. `config/config.json`,
1. `migrations/`,
1. `models/index.js`,
1. `seeders/`.

Notre projet est maintenant structuré comme ceci :

```
config/
└── config.json
migrations/
models/
└── index.js
node_modules/
seeders/
package-lock.json
package.json
server.js
```

### Configuration de Sequelize

Nous définissons les accès aux bases de données dans le fichier `config/config.json` :

```js
{
  "development": {
    "username": "root",
    "password": "root",
    "database": "node_sequelize_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": "root",
    "database": "node_sequelize_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "root",
    "password": "root",
    "database": "node_sequelize_production",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
```

Puis nous créons le modèle `User` en tapant dans le Terminal :

```
$ npx sequelize --name User model:create --attributes "email:string username:string \
password:string isAdmin:boolean"
```

De même, nous tapons ceci dans le Terminal pour créer le modèle `Message` :

```
$ npx sequelize --name Message model:create --attributes "userId:integer content:string"
```

Les configurations des modèles `User` et `Message` ne sont pas parfaites, nous allons devoir les finaliser

### Configuration du modèle User

Nous modifions la migration de `User` dans le dossier `migrations/` en ajoutant la propriété `allowNull` aux propriétés `email`, `username`, `password` et `isAdmin` pour indiquer leur obligation ou non  :

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
```

Ensuite, nous modifions le modèle `User` dans le dossier `models/` pour y ajouter l’association avec le modèle `Message`, juste en dessous du commentaire `// associations can be defined here` :

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    models.User.hasMany(models.Message)
  };
  return User;
};
```

### Configuration du modèle Message

Tout comme nous l’avons fait avait avec la migration de `User`, nous définissons avec la propriété `allowNull` la présence obligatoire ou non des propriétés `userId` et `content`.

Mais en plus, nous ajoutons à `userId` la propriété `references` qui prend en valeur un objet aux propriétés :

1. `model`, qui prend en valeur `'Users'` avec un `s` pour signifier la relation d’`userId` avec le modèle `User`,
1. `key`, qui prend en valeur `'id'`, la propriété de `User` qui le relie à `userId`.

```js
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages');
  }
};
```

Nous terminons l’association entre `Message` et `User` dans le modèle `Message`, après le commentaire `// associations can be defined here` :

```js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    idUSERS: DataTypes.INTEGER,
    content: DataTypes.STRING,
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    models.Message.belongsTo(models.User, {
      foreignKey: { 
        allowNull: false
      }
    })
  };
  return Message;
};
```

### Lancer la migration de Sequelize

La migration de Sequelize permet d’intégrer nos modèles dans les bases de données.

Cette migration se lance avec la commande :

```
$ npx sequelize db:migrate
```

Pour vérfifier que tout s’est bien passé :

1. nous nous connectons à MySQL :
```
    $ /Applications/MAMP/Library/bin/mysql -u root -p
    Enter password: 
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 191
    Server version: 5.7.26 MySQL Community Server (GPL)

    Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
```
1. nous nous plaçons dans la base de données `node_sequelize_development` avec la commande `use` :
```
    mysql> use node_sequelize_development;
    Reading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A

    Database changed
```
1. nous vérifions que les tables `Users` et `Messages` ont bien été créées dans la base de données `node_sequelize_development` :
```
    mysql> show tables;
    +--------------------------------------+
    | Tables_in_node_sequelize_development |
    +--------------------------------------+
    | Messages                             |
    | SequelizeMeta                        |
    | Users                                |
    +--------------------------------------+
    3 rows in set (0,00 sec)
```
1. nous vérifions la structure de la table `Users` :
```
    mysql> describe Users;
    +-----------+--------------+------+-----+---------+----------------+
    | Field     | Type         | Null | Key | Default | Extra          |
    +-----------+--------------+------+-----+---------+----------------+
    | id        | int(11)      | NO   | PRI | NULL    | auto_increment |
    | email     | varchar(255) | NO   |     | NULL    |                |
    | username  | varchar(255) | NO   |     | NULL    |                |
    | password  | varchar(255) | NO   |     | NULL    |                |
    | isAdmin   | tinyint(1)   | NO   |     | NULL    |                |
    | createdAt | datetime     | NO   |     | NULL    |                |
    | updatedAt | datetime     | NO   |     | NULL    |                |
    +-----------+--------------+------+-----+---------+----------------+
    8 rows in set (0,01 sec)
```
1. et pour finir, nous vérifions la structure de la table `Messages` :
```
    mysql> describe Messages;
    +------------+--------------+------+-----+---------+----------------+
    | Field      | Type         | Null | Key | Default | Extra          |
    +------------+--------------+------+-----+---------+----------------+
    | id         | int(11)      | NO   | PRI | NULL    | auto_increment |
    | userId     | int(11)      | NO   | MUL | NULL    |                |
    | content    | varchar(255) | NO   |     | NULL    |                |
    | createdAt  | datetime     | NO   |     | NULL    |                |
    | updatedAt  | datetime     | NO   |     | NULL    |                |
    +------------+--------------+------+-----+---------+----------------+
    8 rows in set (0,00 sec)
```
1. nous tapons `CTRL-D` pour quitter MySQL :
```
    mysql> ^DBye
```
