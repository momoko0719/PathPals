var mongoose = require('mongoose');

let models = {};

main().catch(err => console.log(err));
async function main() {
  console.log('Connecting to MongoDB');
  await mongoose.connect(`mongodb+srv://xyou:${process.env.MONGO_PW}@team12.tyshshi.mongodb.net/PathPals`);
  console.log('Success!')

  const ItinerarySchema = new mongoose.Schema({
    username: String,
    itinerary_name: String,
    description: String,
    date_created: { type: Date, default: Date.now },
    num_views: Number,
    likes: [String], // an array of usernames that liked this itinerary
    shared: [String] // an array of usernames that are allowed to edit this itinerary
  });

  const CommentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    date_created: { type: Date, default: Date.now },
    itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }
  });

  const PlaceSchema = new mongoose.Schema({
    place_name: String
  });

  models.Itinerary = mongoose.model('Itinerary', ItinerarySchema);
  models.Comment = mongoose.model('Comment', CommentSchema);
  models.Place = mongoose.model('Place', PlaceSchema);

  console.log('mongoose models created');
}

module.exports = models;