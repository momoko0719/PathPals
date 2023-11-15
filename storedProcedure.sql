-- given a user id, get all the user's information
CREATE PROCEDURE getUser @userId varchar(50)
AS
SELECT * FROM tblUSER
WHERE user_id = @userId
GO;

-- given the owner's id, get all their itineraries
CREATE PROCEDURE getAllItineraries @userId varchar(50)
AS
SELECT i.* FROM tblITINERARY i, tblOWNERSHIP o
WHERE i.itinerary_id = o.itinerary_id
AND o.user_id = @userId
GO;

-- given an itinerary id, get the list of places
CREATE PROCEDURE getPlaces @itineraryId int
AS
SELECT p.* FROM tblPLACE p, tblPLACE_LIST pl, tblITINERARY i
WHERE pl.itinerary_id = i.itinerary_id
AND pl.place_id = p.place_id
AND i.itinerary_id = @itineraryId
GO;

-- given a user id and an itinerary id, get the user permission
CREATE PROCEDURE getPermission @userId varchar(50),
@itineraryId int
AS
SELECT p.permission_name
FROM tblPERMISSION p, tblUSER u, tblITINERARY i, tblOWNERSHIP o
WHERE u.user_id = o.user_id
AND i.itinerary_id = o.itinerary_id
AND o.permission_id = p.permission_id
AND u.user_id = @userId
AND i.itinerary_id = @itineraryId
GO;

-- given an itinerary id, list all comments
CREATE PROCEDURE getComments @itineraryId int
AS
SELECT v.comment FROM tblVIEW v, tblITINERARY i
WHERE v.itinerary_id = i.itinerary_id
AND i.itinerary_id = @itineraryId
GO;

-- given a user id, list all itinerary that they liked
CREATE PROCEDURE getLikedItineraries @userId varchar(50)
AS
SELECT i.itinerary_name FROM tblVIEW v, tblITINERARY i, tblUSER u
WHERE v.user_id = u.user_id
WHERE v.itinerary_id = i.itinerary_id
AND u.user_id = @userId
AND v.liked = 1
GO;

-- given a user id, list all itinerary that they stared
CREATE PROCEDURE getStaredItineraries @userId varchar(50)
AS
SELECT i.itinerary_name FROM tblVIEW v, tblITINERARY i, tblUSER u
WHERE v.user_id = u.user_id
WHERE v.itinerary_id = i.itinerary_id
AND u.user_id = @userId
AND v.stared = 1
GO;

-- given an itinerary id, get number of likes
CREATE PROCEDURE getLikes @itineraryId int
AS
SELECT COUNT(v.liked) FROM tblVIEW v, tblITINERARY i
WHERE v.itinerary_id = i.itinerary_id
AND i.itinerary_id = @itineraryId
AND v.liked = 1
GO;