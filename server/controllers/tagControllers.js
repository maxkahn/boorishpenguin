var db = require('../db/index.js');

module.exports = {
  allTags: function(req, res) {
    db.Tag.findAll()
    .then(function(tags) {
      var formmatedTags = tags.map(function(tag) {
        return {
          id: tag.id,
          name: tag.name
        };
      });

      data = {};
      data.results = formmatedTags;
      res.json(data);
    });
  }
};
