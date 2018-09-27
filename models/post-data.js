const Sequelize = require('sequelize');
const sequelize = new Sequelize('stackexchange', 'root', '99121Padma', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

});
Posts = require('./post').Posts;
user = require('./user').addUser;
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

var DataTypes = Sequelize
const PostsData = sequelize.define('PostsData', {
    Id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
    },
    PostId: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        references: {
            model: Posts,
            key: '_id',
        },

    },
    PostTypeId: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
    },
    PostType: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },

    Abstractive: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Extractive: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    writtenBy: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    pickedBy: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    picked: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'postsdata'
});
PostsData.sync({force: false}).then(function (err) { if(err) { console.log(err); } else{ console.log('Item table created successfully'); } });

exports.PostsData = PostsData
exports.updatePostsData = function(req, res){

    PostsData.upsert(req.body.answer.PostsDatum).then(function (data) {
        console.log(data);
        if(req.body.answer.PostsDatum.pickedjustnow) {
            user.findOne({username:req.body.answer.PostsDatum.pickedBy},function(err,user){
                if(err) throw err;
                if(user){
                    user.picked +=1
                    user.save(function (err) {
                        if(err){
                            console.log(err)
                        }
                    })
                }
            })
        }
        if(req.body.answer.PostsDatum.unpickedjustnow) {
            console.log(req.body.answer.PostsDatum.unpickedjustnow);
            user.findOne({username:req.body.answer.PostsDatum.unpickedjustnow},function(err,user){
                if(err) throw err;
                if(user){
                    user.picked -=1
                    user.save(function (err) {
                        if(err){
                            console.log(err)
                        }
                    })
                }
            })
        }
        if(req.body.answer.PostsDatum.Extractive && req.body.answer.PostTypeId == 1 && req.body.answer.PostsDatum.extractivejustnow) {
            user.findOne({username:req.body.answer.PostsDatum.writtenBy},function(err,user){
                if(err) throw err;
                if(user){
                    user.ExtractiveCompleted +=1
                    user.save(function (err) {
                        if(err){
                            console.log(err)
                        }
                    })
                }
            });
        }
        if(req.body.answer.PostsDatum.Abstractive && req.body.answer.PostTypeId == 1 && req.body.answer.PostsDatum.abstractivejustnow) {
            user.findOne({username:req.body.answer.PostsDatum.writtenBy},function(err,user){
                if(err) throw err;
                if(user){
                    user.AbstractiveCompleted +=1
                    user.save(function (err) {
                        if(err){
                            console.log(err)
                        }
                    })
                }
            });
        }

        res.send(data);
    });
};



