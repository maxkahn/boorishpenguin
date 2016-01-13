var Sequelize = require('sequelize');

var database = process.env.DATABASE || 'townhall';
var dbUser = process.env.DBUSER || 'root';
var dbPass = process.env.DBPASS;
// var database = process.env.DATABASE || 'jmuspkeyvjzsvvwp';
// var dbUser = process.env.DBUSER || 'htmaaabw4pe3k9ja';
var dbHost = 'localhost';
// var dbHost = process.env.DBHOST || 'jw0ch9vofhcajqg7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com'

var db = new Sequelize(database, dbUser, dbPass, {
  host: 'localhost',
  username: 'root'
});

var User = db.define('User', {
  username: Sequelize.STRING,
  name: Sequelize.STRING,
  name_last: Sequelize.STRING,
  name_first: Sequelize.STRING,
  isTeacher: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  pendingTeacher: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reputation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  email: Sequelize.STRING,
  picture: Sequelize.STRING
}, {
  timestamps: false
});

var Tag = db.define('Tag', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Course = db.define('Course', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Post = db.define('Post', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  //when teacher confirms answer is correct
  isAnswerType: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isQuestionType: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  votes: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  responses: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isAnswered: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isPreferred: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isClosed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
//   createdAt: {
//     type: Sequelize.DATE,
//     defaultValue: db.fn('NOW')
//   },
//   updatedAt: Sequelize.DATE
}
);

var Votes = db.define('Votes', {
  isPositive: {
   type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    }
  }, {
    timestamps: false
});

Course.belongsToMany(User, {
  through: 'CourseUser'
});
User.belongsToMany(Course, {
  through: 'CourseUser'
});

User.hasMany(Post);
Post.belongsTo(User);
Tag.hasMany(Post);
Post.belongsTo(Tag);
Course.hasMany(Post);
Post.belongsTo(Course);
Post.hasMany(Post, {as: 'Responses', foreignKey: 'QuestionId'});
Post.hasMany(Post, {as: 'Comments', foreignKey: 'ResponseId'});
Post.belongsToMany(User, {as: 'Opinions', through: 'Votes'});
User.belongsToMany(Post, {through: 'Votes'});

User.sync()
.then(function() {
  return Tag.sync();
})
.then(function() {
  return Course.sync();
})
.then(function() {
  return Post.sync();
})
.then(function() {
  return Votes.sync();
});

exports.User = User;
exports.Course = Course;
exports.Tag = Tag;
exports.Post = Post;
exports.Votes = Votes;
