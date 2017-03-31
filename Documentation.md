# Kitchen Kitten API documentation

### Create

+ Sign up user
  - Method: `PUT`
  - Url: `/api/users/`
  - Request Content-Type: `application/json`
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
  - Request Content-Type: `application/json`
  - Request body: `{"email": root@gmail.com, "password": root}`
  - Status code: `200` upon success, `500` Internal Server Error, `401` if password doesn't match usename
  - Response: Content-Type: `application/json`
  - Response body: `{"username":"root","email":"root@gmail.com","salt":"1xEAULBEOmK1q+G9aCKalw==","saltedHash":"ZJNud0rppGagOsWl9nXwOlYePkrrM1rXbZnZ/cDzODysCLBL3NFfpDdKnfSHCql2Z4qn1WHvjlnXHqL+ozBwtw==","numComments":0,"fav":[],"_id":"cRpvFMuSU54z1uFu","createdAt":"2017-03-31T20:29:50.105Z","updatedAt":"2017-03-31T20:29:50.105Z"}`
  

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"email": "root@gmail.com", "password": "root"}' -c cookie.txt https://cody-cat.herokuapp.com/api/signin/
```

### Get

+ Sign out
  - Method: `GET`
  - Url: `/api/signout/`
  - Response status: `302`, Found if successful. `500`, if an error has occurred.
  - Response: Content-Type: `text/plain`

```
  $ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/logout/
```

+ Get User (for profile setup)
  - Method: `GET`
  - Url: `/profile/setup`
  - Status code: `200` upon success, `500` if internal server error
  - Response: Content-Type: `application/json`
  - Response body: `{"username":"root","email":"root@gmail.com","salt":"1xEAULBEOmK1q+G9aCKalw==","saltedHash":"ZJNud0rppGagOsWl9nXwOlYePkrrM1rXbZnZ/cDzODysCLBL3NFfpDdKnfSHCql2Z4qn1WHvjlnXHqL+ozBwtw==","numComments":0,"fav":[],"_id":"cRpvFMuSU54z1uFu","createdAt":"2017-03-31T20:29:50.105Z","updatedAt":"2017-03-31T20:29:50.105Z"}`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/profile/setup
```

+ Get recipe setup, sets up the recipe database
  - Method: `GET`
  - Url: `/recipe/setup/:id`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found for active user, 
  - Response: Content-Type: `application/json`
  - Response body: `null`
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/setup/1
```

+ Get 6 recently uploaded recipes
  - Method: `GET`
  - Url: `/recipe/uploads`
  - Status code: `200` upon success, `403` if forbidden, `404` if no data found for active user
  - Response: Content-Type: `application/json`
  - Response body: object
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
  - Method: GET
  - Url: /recipe/fav/
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found for active user
  - Response: Content-Type: application/json
  - Response body: {resData: id, title and summary about the recipes}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/fav/
```

+ Get top favourited recipes
  - Method: GET
  - Url: /recipe/topFav/
  - Status code: 200 upon success, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {top recipes objects}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/recipe/topFav/
```

+ Get personal stats info (charts info)
  - Method: GET
  - Url: /stats/:chartId
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {first chart stats or second chart stats}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/stats/:chartId
```

+ Get profile image
  - Method: GET
  - Url: /api/images/:username
  - Status code: 200 upon success, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {image data}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/images/:username
```

+ Send email
  - Method: GET
  - Url: /send
  - Status code: 200 upon success
  - Response: Content-Type: text
  - Response body: "sent" or "error"
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/send
```

+ Upload profile image
  - Method: POST
  - Url: /profile/image
  - Request Content-Type: application/json
  - Request body: {"image": image file, "email": active user email}
  - Status code: 200 upon success, 403 if forbidden
  - Response: Content-Type: null

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"image": image file, "email": "root@gmail.com"}' -b cookie.txt https://cody-cat.herokuapp.com/profile/image/
```

+ Upload recipe
  - Method: PUT
  - Url: /api/recipe/
  - Request Content-Type: application/json, multipart/form-data
  - Request body: {"_id": id, "username":username, "title":title, "pic":pic, "ings":ings, "intro":intro, "steps":steps, "tip":tip, "rating": rating, "tags": tags}
  - Status code: 200 upon success, 409 if conflict in db, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {id: recipe_id}

```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"_id": id, "username":username, "title":title, "pic":pic, "ings":ings, "intro":intro, "steps":steps, "tip":tip, "rating": rating, "tags": tags}' -b cookie.txt https://cody-cat.herokuapp.com/api/recipe/
```

+ Add a comment
  - Method: PUT
  - Url: /api/comments/:r_id/
  - Request Content-Type: application/json
  - Request body: {"author": "cmt author", "content": "cmt content"}
  - Status code: 200 upon success, 409 if conflict in db, 404 if no image with r_id, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {"r_id": r_id}
  
```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"author": "test cmt", "content": "test"}' -b cookie.txt https://cody-cat.herokuapp.com/api/comments/10
```



+ Get a recipe's comments
  - Method: GET
  - Url: /api/comments/:id/
  - Status code: 200 upon seccess, 400 if id is invalid, 404 if no image with id, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {found: true/false, id: id, message: comments_data}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/comments/10/
```

+ upload recipe from remote to local db
  - Method: PUT
  - Url: /api/home/search/remote
  - Request Content-Type: application/json
  - Request body: 
  - Status code: 200 upon success, 409 if conflict in db, 404 if no image with r_id, 403 if forbidden
  - Response: Content-Type: text
  - Response body: "done"
  
```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"author": "test cmt", "content": "test"}' -b cookie.txt https://cody-cat.herokuapp.com/api/home/search/remote
```

+ search remote db
  - Method: PUT
  - Url: /api/search/remote/:mode
  - Status code: 200 upon success, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {recipe objects}
  
```
  $ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/search/remote/1
```

+ Get recipe by username and id
  - Method: GET
  - Url: /api/users/:username/recipes/:id/
  - Status code: 200 upon success, 403 if forbidden,404 if no recipe found
  - Response: Content-Type: application/json
  - Response body: {found: true/false, id:id, message: recipe data}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/users/root/recipes/10/
```

+ Get recipe pic
  - Method: GET
  - Url: /api/recipes/:id/pic/
  - Status code: 200 upon success, 409 if error in db,404 if no recipe found
  - Response: Content-Type: application/json
  - Response body: {picture}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/10/pic/
```

+ Get recipe step pics
  - Method: GET
  - Url: /api/recipes/:id/step/:number
  - Status code: 200 upon success, 409 if error in db,403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {picture}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/:id/step/1
```

+ Delete recipe by id
  - Method: DELETE
  - Url: /api/recipes/:id/
  - Status code: 200 upon success, 409 if conflict in db, 403 if forbidden
  - Response: Content-Type: null
```
$ curl -k --verbose --request DELETE -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/1/
```

+ Search local db
  - Method: GET
  - Url: /api/home/search/local
  - Status code: 200 upon success, 409 if error in db,403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {recipe data}
```
$ curl -k --verbose --request GET -b cookie.txt https://cody-cat.herokuapp.com/api/home/search/local
```

+ Delete a comment
  - Method: DELETE
  - Url: /api/recipes/:r_id/comments/:id/
  - Status code: 200 upon success, 409 if conflict in db, 404 if recipe not found, 403 if forbidden
  - Response: Content-Type: null
```
$ curl -k --verbose --request DELETE -b cookie.txt https://cody-cat.herokuapp.com/api/recipes/1/comments/1/
```

+ Update?





