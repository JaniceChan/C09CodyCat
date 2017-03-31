# Kitchen Kitten API documentation

### Create

+ Sign up user
  - Method: `PUT`
  - Url: `/api/users/`
  - Request: `Content-Type: application/json`
  - Request body: `{"username": "root", "email": "root@gmail.com", "password": "root"}`
  - Status code: `200` upon success, `500` Internal Server Error, `409` if user exists (Conflict)
  - Response: Content-Type: `application/json`
  - Response body: `{"username":"root","email":"root@gmail.com","salt":"1xEAULBEOmK1q+G9aCKalw==","saltedHash":"ZJNud0rppGagOsWl9nXwOlYePkrrM1rXbZnZ/cDzODysCLBL3NFfpDdKnfSHCql2Z4qn1WHvjlnXHqL+ozBwtw==","numComments":0,"fav":[],"_id":"cRpvFMuSU54z1uFu","createdAt":"2017-03-31T20:29:50.105Z","updatedAt":"2017-03-31T20:29:50.105Z"}`
  

```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"username": "root", "email": "root@gmail.com", "password": "root"}' https://cody-cat.herokuapp.com/api/users/
```

+ Sign in user
  - Method: `POST`
  - Url: `/api/signin/`
  - Request: `Content-Type: application/json`
  - Request body: `{"email": root@gmail.com, "password": root}`
  - Status code: `200` upon success, `500` Internal Server Error, `401` if password doesn't match usename
  - Response: Content-Type: `application/json`
  - Response body: `{"username":"root","email":"root@gmail.com","salt":"1xEAULBEOmK1q+G9aCKalw==","saltedHash":"ZJNud0rppGagOsWl9nXwOlYePkrrM1rXbZnZ/cDzODysCLBL3NFfpDdKnfSHCql2Z4qn1WHvjlnXHqL+ozBwtw==","numComments":0,"fav":[],"_id":"cRpvFMuSU54z1uFu","createdAt":"2017-03-31T20:29:50.105Z","updatedAt":"2017-03-31T20:29:50.105Z"}`
  

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"email": "root@gmail.com", "password": "root"}' -c cookie.txt https://cody-cat.herokuapp.com/api/signin/
```

+ Upload profile image
  - Method: `POST`
  - Url: `/profile/image`
  - Request: `Content-Type application/json`
  - Request body: `{"image": image file, "email": active user email}`
  - Status code: `200` upon success, `403` if forbidden
  - Response: Content-Type: `null`

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"image": image file, "email": "root@gmail.com"}' -b cookie.txt https://cody-cat.herokuapp.com/profile/image/
```

+ Upload recipe
  - Method: `PUT`
  - Url: `/api/recipe/`
  - Request: `Content-Type: application/json, multipart/form-data`
  - Request body: `{"_id": id, "username":username, "title":title, "pic":pic, "ings":ings, "intro":intro, "steps":steps, "tip":tip, "rating": rating, "tags": tags}`
  - Status code: `200` upon success, `409` if conflict in db, `403` if forbidden
  - Response: Content-Type: `application/json`
  - Response body: `{id: recipe_id}`

```
  $ curl -k --verbose --request PUT --header 'Content-Type: multipart/form-data' --form file=@localfilename --data '{"_id": id, "username":username, "title":title, "pic":pic, "ings":ings, "intro":intro, "steps":steps, "tip":tip, "rating": rating, "tags": tags}' -b cookie.txt https://cody-cat.herokuapp.com/api/recipe/
```

+ Add a comment
  - Method: `PUT`
  - Url: `/api/comments/:r_id/`
  - Request: `Content-Type: application/json`
  - Request body: `{"author": "cmt author", "content": "cmt content"}`
  - Status code: `200` upon success, `409` if conflict in db, `404` if no image with r_id, `403` if forbidden
  - Response: Content-Type: `application/json`
  - Response body: `{"r_id": r_id}`
  
```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"author": "test cmt", "content": "test"}' -b cookie.txt https://cody-cat.herokuapp.com/api/comments/10
```

+ upload recipe from remote to local db
  - Method: `PUT`
  - Url: `/api/home/search/remote`
  - Request: `Content-Type: application/json`
  - Request query: query separated by space
  - Status code: `200` upon success, `409` if conflict in db, `404` if no image with r_id, `403` if forbidden
  - Response: `Content-Type: text`
  - Response body: `"done"`
  
```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' -b cookie.txt https://cody-cat.herokuapp.com/api/home/search/remote?q=query+here
```


### Get

+ Sign out
  - Method: `GET`
  - Url: `/api/signout/`
  - Response status: `302`, Found if successful. `500`, if an error has occurred.
  - Response: `Content-Type: text/plain`

```
  $ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/logout/
```

+ Get User (for profile setup)
  - Method: `GET`
  - Url: `/profile/setup`
  - Status code: `200` upon success, `500` if internal server error
  - Response: `Content-Type: application/json`
  - Response body: `{"username":"root","email":"root@gmail.com","salt":"1xEAULBEOmK1q+G9aCKalw==","saltedHash":"ZJNud0rppGagOsWl9nXwOlYePkrrM1rXbZnZ/cDzODysCLBL3NFfpDdKnfSHCql2Z4qn1WHvjlnXHqL+ozBwtw==","numComments":0,"fav":[],"_id":"cRpvFMuSU54z1uFu","createdAt":"2017-03-31T20:29:50.105Z","updatedAt":"2017-03-31T20:29:50.105Z"}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/profile/setup
```

+ Get recipe setup, sets up the recipe database
  - Method: `GET`
  - Url: `/recipe/setup/:id`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found for active user, 
  - Response: `Content-Type: application/json`
  - Response body: `null`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/setup/1
```

+ Get 6 recently uploaded recipes
  - Method: `GET`
  - Url: `/recipe/uploads`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found for active user
  - Response: `Content-Type: application/json`
  - Response body: recipe object, at most 6 returned, for example: `{"username":"root@gmail.com","intro":"asdf","title":"test","ings":"","steps":"<p>Write your steps nicely here</p>","tip":"asdfasdf","ready":"asdf","rating":1,"tags":"sdf","_id":1,"pic":{"fieldname":"pic","originalname":"Screen Shot 2017-03-26 at 12.49.35 PM.png","encoding":"7bit","mimetype":"image/png","destination":"uploads/","filename":"683c1a15b530e1d958be2f904ad188d5","path":"uploads/683c1a15b530e1d958be2f904ad188d5","size":245819},"imageUrl":"/api/recipes/1/pic/","createdAt":{"$$date":1490587033399},"updatedAt":{"$$date":1490588138597}}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/uploads
```

+ Get if the recipe is favourited
  - Method: `GET`
  - Url: `/recipe/ifFav/:id`
  - Status code: `200` upon success, `403` if forbidden
  - Response: `Content-Type: application/json`
  - Response body: `{res: "Favourite this"}` or `{res: "Unfavourite"}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/ifFav/1
```

+ Get favourited recipes
  - Method: `GET`
  - Url: `/recipe/fav/`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found for active user
  - Response: `Content-Type: application/json`
  - Response body: favourited recipe object(s), please see `GET /recipe/uploads` for an example
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/fav/
```

+ Get top favourited recipes
  - Method: `GET`
  - Url: `/recipe/topFav/`
  - Status code: `200` upon success, `404` if no data found
  - Response: `Content-Type: application/json`
  - Response body: top favourited recipe object(s), please see `GET /recipe/uploads` for an example
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/topFav/
```

+ Get personal stats info (charts info)
  - Method: `GET`
  - Url: `/stats/:chartId`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found
  - Response: `Content-Type: application/json`
  - Response body: first chart: stats object containing numFav, numUploads, and numComments attributes. Second chart: stats object containing rookie, junior, apprentice, senior, and master attributes.
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/stats/1
```

+ Get profile image
  - Method: `GET`
  - Url: `/api/images/:username`
  - Status code: `200` upon success, `404` if no data found
  - Response: `Content-Type: application/json`
  - Response body: profile picture object
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/images/root@gmail.com
```

+ Send email
  - Method: `GET`
  - Url: `/send`
  - Status code: `200` upon success
  - Response: `Content-Type: text/plain`
  - Response body: `"sent"` or `"error"`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/send
```

+ Get a recipe's comments
  - Method: `GET`
  - Url: `/api/comments/:id/`
  - Status code: `200` upon seccess, `400` if id is invalid, `404` if no image with id, `403` if forbidden
  - Response: `Content-Type: application/json`
  - Response body: `{found: true/false, id: id, message: comments_data}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/comments/10/
```

+ search remote db, retrieve summarized recipes and put into local db
  - Method: `GET`
  - Url: `/search/remote/:mode`
  - Status code: `200` upon success, `403` if forbidden
  - Response: `Content-Type: application/json`
  - Response body: spoonacular recipe objects
  
```
  $ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/search/remote/summary
```

+ Get recipe by username and id
  - Method: `GET`
  - Url: `/api/users/:username/recipes/:id/`
  - Status code: `200` upon success, `403` if forbidden, `404` if no recipe found
  - Response: `Content-Type: application/json`
  - Response body: `{found: true/false, id: id, message: recipe data}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/users/root@gmail.com/recipes/10/
```

+ Get recipe pic
  - Method: `GET`
  - Url: `/api/recipes/:id/pic/`
  - Status code: `200` upon success, `409` if error in db, `404` if no recipe found
  - Response: `Content-Type: application/json`
  - Response body: recipe picture object
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/10/pic/
```

+ Get recipe step pics
  - Method: `GET`
  - Url: `/api/recipes/:id/step/:number`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden
  - Response: `Content-Type: application/json`
  - Response body: recipe steps picture object
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/2/step/1
```

+ Search local db, limited to 9
  - Method: `GET`
  - Url: `/api/home/search/local`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden
  - Response: `Content-Type: application/json`
  - Response body: at most 9 local database recipe object(s), please see `GET /recipe/uploads` for an example
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/home/search/local
```

### Update

+ Update user's profile database phone data
  - Method: `PATCH`
  - Url: `/profile/setup/phone/:phoneNum`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden, `500` Internal Server Error
  - Response: `Content-Type: application/json`
  - Response body: `null`

```
curl -k --verbose --request PATCH --header 'Content-Type: application/json' -c cookie.txt https://cody-cat.herokuapp.com/profile/setup/phone/9051234567
```

+ Update user's profile database address data
  - Method: `PATCH`
  - Url: `/profile/setup/address/:addr`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden, `500` Internal Server Error
  - Response: `Content-Type: application/json`
  - Response body: `null`

```
curl -k --verbose --request PATCH --header 'Content-Type: application/json' -c cookie.txt https://cody-cat.herokuapp.com/profile/setup/address/abc
```

+ Update user's profile database favourite recipes data
  - Method: `PATCH`
  - Url: `/user/fav/:id`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden, `500` Internal Server Error
  - Response: `Content-Type: application/json`
  - Response body: user object

```
curl -k --verbose --request PATCH --header 'Content-Type: application/json' -c cookie.txt https://cody-cat.herokuapp.com/user/fav/2
```

+ Update recipe's rating info
  - Method: `PATCH`
  - Url: `/recipe/rating/2`
  - Status code: `200` upon success, `409` if error in db, `403` if forbidden, `500` Internal Server Error
  - Response: `Content-Type: application/json`
  - Response body: `"pass"`

```
curl -k --verbose --request PATCH --header 'Content-Type: application/json' -c cookie.txt https://cody-cat.herokuapp.com/recipe/rating/2
```


### Delete

+ Delete recipe by id
  - Method: `DELETE`
  - Url: `/api/recipes/:id/`
  - Status code: `200` upon success, `409` if conflict in db, `403` if forbidden
  - Response: `Content-Type: null`
```
$ curl -k --verbose --request DELETE -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/1/
```

+ Delete a comment
  - Method: `DELETE`
  - Url: `/api/recipes/:r_id/comments/:id/`
  - Status code: `200` upon success, `409` if conflict in db, `404` if recipe not found, `403` if forbidden
  - Response: `Content-Type: null`
```
$ curl -k --verbose --request DELETE -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/1/comments/1/
```
