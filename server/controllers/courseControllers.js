var db = require('../db/index.js');

module.exports = {
  allCourses: function(req, res) {
    db.Course.findAll()
      .then(function(courses) {
        var formattedCourses = courses.map(function(course) {
          return {
            id: course.id,
            name: course.name
          };
        });

        data = {};
        data.results = formattedCourses;
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
        res.status(200).json(course);
      });
  }
};