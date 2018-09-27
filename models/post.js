const PostData = require('./post-data').PostsData
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
sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

var DataTypes = Sequelize
const Posts = sequelize.define('Posts', {
    _id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    Id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: false
    },
    PostTypeId: {
        type: DataTypes.INTEGER(4),
        allowNull: false
    },
    AcceptedAnswerId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    ParentId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    CreationDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DeletionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Score: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    ViewCount: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    Body: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    OwnerUserId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    OwnerDisplayName: {
        type: DataTypes.STRING(256),
        allowNull: true
    },
    LastEditorUserId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    LastEditorDisplayName: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    LastEditDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    LastActivityDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Title: {
        type: DataTypes.STRING(256),
        allowNull: true
    },
    Tags: {
        type: DataTypes.STRING(256),
        allowNull: true
    },
    AnswerCount: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: '0'
    },
    CommentCount: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: '0'
    },
    FavoriteCount: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: '0'
    },
    ClosedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    CommunityOwnedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Topic: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'posts'
});
exports.Posts = Posts;
exports.findAnswersOfQuestion = function (req, res) {
    Posts.findOne({
        where: {PostTypeId: 1, _id: req.body.QuestionId}
    }).then(question => {
        Posts.findAll(
            {

                where: {PostTypeId: 2, ParentId: question.Id, Topic: req.body.Topic  }
            }
        ).then(posts => {
            res.send(posts);
        }).catch(error => {
            console.log(error);
            res.send(error);
        })
    }).catch(error => {
        console.log(error);
        res.send(error);
    })

};
Posts.hasOne(PostData);
exports.findAllQuestions = function (req, res) {
    whereparams = {}
    if(req.body.topic && req.body.topic != 'All') {

        whereparams = {PostTypeId: 1, Body :{$like: '%'+ (req.body.searchtext|| ' ')+'%'} , Topic: (req.body.topic) }
    } else {
        whereparams  = {PostTypeId: 1, Body :{$like: '%'+ (req.body.searchtext|| ' ')+'%'}  }
    }
    if(req.body.annotation == 'true'){
        Posts.findAll(
            {
                attributes: [[sequelize.fn('LEFT', sequelize.col('Body'),100), 'Body'], 'Id', 'topic', '_id','Title','PostTypeId'],
                where: whereparams,
                offset: req.body.offset, limit: req.body.limit,
                include: [{model: PostData ,where: {Abstractive:{$ne: null}}, required: true}],
            }
        ).then(posts => {
            console.log(posts[0])
            res.send(posts);
        }).catch(error => {
            console.log(error);
            res.send(error);
        })
    }
    if(req.body.pickedBy) {
        Posts.findAll(
            {
                attributes: [[sequelize.fn('LEFT', sequelize.col('Body'),100), 'Body'], 'Id', 'topic', '_id','Title','PostTypeId'],
                where: whereparams,
                offset: req.body.offset, limit: req.body.limit,
                include: [{model: PostData ,where: {pickedBy: req.body.pickedBy}, required: true}],
            }
        ).then(posts => {
            console.log(posts[0])
            res.send(posts);
        }).catch(error => {
            console.log(error);
            res.send(error);
        })
    }
    else {
        Posts.findAll(
            {
                attributes: [[sequelize.fn('LEFT', sequelize.col('Body'),100), 'Body'], 'Id', 'topic', '_id','Title', 'PostTypeId'],
                where: whereparams,
                offset: req.body.offset, limit: req.body.limit,
                include: [{model: PostData , required: false}],
            }
        ).then(posts => {
            res.send(posts);
        }).catch(error => {
            console.log(error);
            res.send(error);
        })
    }

};
exports.findAnswerstoQuestions = function (req, res) {
    Posts.findOne(
        {
            attributes: ['Body', 'Id', 'Topic', '_id', 'Title', 'PostTypeId'],
            where: {_id: req.body.questionid },
            include: [{model: PostData , required: false}],
        }
    ).then(posts => {
        Posts.findAll(
            {
                attributes: ['Body', 'Id', '_id', 'PostTypeId'],
                where: {ParentId: posts.Id, Topic: posts.Topic  },
                include: [{model: PostData, as:'PostsDatum', required: false}],
            }
        ).then(Answers => {
            res.send({Question:posts, Answers: Answers})
        }).catch(error => {
            console.log(error);
            res.send(error);
        })
    }).catch(error => {
        console.log(error);
        res.send(error);
    })
};
