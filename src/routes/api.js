//src/routes/database.js
/*/////////
* SETUP////
*//////////
//setup express router
const router = require('express').Router();
//setup sequelize
const user = 'postgres';
const pass = '0Zinkforb!'
const database = 'maker_map'
const host = 'localhost';
const port = 5432;
// const { TEXT } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(database, user, pass, {
    host: host,
    dialect: 'postgres',
    storage: './database.postgres'
})
// login to SQL server and auth
sequelize.authenticate()
    .then(() => {
        clog('Connection has been established successfully.');
        clog(`location: ${user}@${host}:${port}`);
        clog(`database: ${database}`);
    })
    .catch(err => {
        clog(`Unable to connect to the database: ${err}`);
    });
    
//create TABLE by synchronizing the defined model to the database
//force:true means if table exists it will DROP and CREATE a new one
// sequelize.sync({ force: true })
//     .then(() => {
//         clog('DATABASE and TABLEs accessed!')
        
//         Note.bulkCreate([
//             { note: 'pick up some bread after work', tag: 'shopping' },
//             { note: 'remember to write up meeting notes', tag: 'work' },
//             { note: 'learn how to use node orm', tag: 'work' }
//         ])
//         .then(() => {
//             return Note.findAll();
//         })
//         .then((notes) => {
//             // sclog('NEW TABLE NOTES!', notes);
//         })
//     });
// sequelize.sync({
//     logging: console.log,
//     force: true })
//     .then(function() {
//         return User.findAll();
//     });

// INVESTIGATE HSTORE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/*////////
* MODELS//
*/////////
//define Model of DB "objects"
const User = sequelize.define('users', {
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    salt: Sequelize.TEXT,
    firstname: Sequelize.TEXT,
    lastname: Sequelize.TEXT,
    phone: Sequelize.TEXT,
    email: Sequelize.TEXT,
    user_type: Sequelize.INTEGER,
    user_lock: Sequelize.BOOLEAN
});
// const Note = sequelize.define('notes', {
//     note: Sequelize.TEXT,
//     tag: Sequelize.STRING
// });

/*////////
* ROUTES//
*/////////
router.route('/login')
    .post((req, res, next) => {
        User.findAll({ where: { 
            username: req.body.username,
            password: req.body.password
        } })
        .then((user) => {
            if(user && user.length > 0){
                sclog(`POST: read entry on TABLE users\nLOGGED IN AS: ${req.body.username}`, user, res);
            }else{
                clog(`username: ${req.body.username} - returned ERROR 404 - Not Found`);
                res.status(404).send();
            }
        })
    });

router.route('/users')
    //to create new user
    .post((req, res, next) => {
        //return request body and status 200(OK)
        User.create({
             username: req.body.username,
             password: req.body.password,
             salt: req.body.salt,
             firstname: req.body.firstname,
             lastname: req.body.lastname,
             phone: req.body.phone,
             email: req.body.email,
             user_type: req.body.user_type,
             user_lock: req.body.user_lock
        })
        .then((user) => {
            sclog(`POST: created new entry on TABLE users @id:${user.id}!!!`, user, res);
        });
    })
    //to retrieve user
    .get((req, res, next) => {
        //respond with data from findAll() and then() respond status 200(OK)
        User.findAll()
        .then((user) => {
            sclog('GET: read users TABLE!!!', user, res);
        });
        //ADD PROMISE REJECTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
});

router.route('/users/:userId')
    //to retrieve a single user
    .get((req, res, next) => {
        User.findAll({ where: { id: req.params.userId } })
        .then((user) => {
            if(user && user.length > 0){
                sclog(`GET: read entry on TABLE users @id: ${req.params.userId}!!!`, user, res);
            }else{
                clog(`userId: ${req.params.userId} - returned ERROR 404 - Not Found`)
                res.status(404).send();
            }
        })
        //ADD PROMISE REJECTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    })
    .put((req, res, next) => {
        //findByPk = find by Primary Key
        User.findByPk(req.params.userId)
        .then((user) => {
            user.update({
                username: req.body.username,
                password: req.body.password,
                salt: req.body.salt,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                email: req.body.email,
                user_type: req.body.user_type,
                user_lock: req.body.user_lock
            })
            .then((user) => {
                sclog(`PUT: updated entry on TABLE users @id: ${req.params.userId}!!!`, user, res);
            });
        });
    })
    .delete((req, res, next) => {
        // User.findByPk(req.params.id)
        User.findAll({ where: { id: req.params.userId } })
        .then((user) => {
            if(user && user.length > 0){
                sclog(`DELETE: removed entry on TABLE users @id: ${req.params.userId}!!!`, user, res);
                User.destroy({where: {id: req.params.userId}});
            }else{
                clog(`userId: ${req.params.userId} - returned ERROR 404 - Not Found`)
                res.status(404).send();
            }
        })
});

/*////////
* METHODS/
*/////////
//console.log in easy to read/identify format
function clog(str){
    console.log(`\n---[${str}]---\n`);
}
function sclog(str, object, res){
    if(res){
        res.json(object, 200);
        // res.status(200).send();
    }
    
    clog(str);
    console.log(JSON.stringify(object, null, 2)+'\n');
}

module.exports = router;