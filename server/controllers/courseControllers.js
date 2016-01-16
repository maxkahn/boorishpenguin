var db = require('../db/index.js');

module.exports = {
  allCourses: function(req, res) {
    db.Course.findAll()
      .then(function(courses) {
        var active = [];
        var inactive = [];
        var formattedCourses = courses.forEach(function(course) {
          if(course.isActive){
            active.push({
            id: course.id,
            name: course.name,
            isActive : course.isActive
          });
          } else {
            inactive.push({
            id: course.id,
            name: course.name,
            isActive : course.isActive
          });
          }
        });

        data = {};
        data.active = active;
        data.inactive = inactive
        res.json(data);
      });
  },
  addCourse: function(req, res) {
    db.Course.findOrCreate({
        where: {
          name : req.body.name
        }
      })
      .then(function(course) {
        res.status(200).json(req.body);
      });
  },
  updateCourse : function(req, res) {
    db.Course.update({
      isActive : req.body.isActive
    },
    {
      where : {
        name : req.body.name
      }
    })
    .then(function(result){
      res.status(201).json(result);
    });
  }
};