var mongoose = require('mongoose');

let models = {};

main().catch(err => console.log(err));
async function main() {
  console.log('Connecting to MongoDB');
  await mongoose.connect(`mongodb+srv://xyou:Ez4gaTtv0BxNssev@team12.tyshshi.mongodb.net/PathPals`);
  console.log('Success!')

  const PathSchema = new mongoose.Schema({
    username: String,
    path_name: String,
    description: String,
    places: [String], // an array of place ids
    date_created: { type: Date, default: Date.now },
    num_views: { type: Number, default: 0 },
    likes: { type: [String], default: [] }, // an array of usernames that liked this path
    shared: { type: [String], default: [] } // an array of usernames that are allowed to edit this path
  });

  const CommentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    date_created: { type: Date, default: Date.now },
    path: { type: mongoose.Schema.Types.ObjectId, ref: 'Path' }
  });

  const PlaceSchema = new mongoose.Schema({
    place_name: String
  });

  models.Path = mongoose.model('Path', PathSchema);
  models.Comment = mongoose.model('Comment', CommentSchema);
  models.Place = mongoose.model('Place', PlaceSchema);

  console.log('mongoose models created');
}

module.exports = models;