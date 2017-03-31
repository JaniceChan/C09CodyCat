# Kitchen Kitten API documentation

+ Sign up user
  - Method: PUT
  - Url: /api/users/
  - Request Content-Type: application/json
  - Request body: {"username": root, "email": root@gmail.com, "password": root}
  - Status code: 200 upon success, 500 if error occurs, 409 if user exists
  - Response: Content-Type: application/json
  - Response body: {"username": root, "email": root@gmail.com, "password": root}
  

```
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"username": root, "email": root@gmail.com, "password": root}' https://localhost:3000/api/users/
```

+ Sign in user
  - Method: POST
  - Url: /api/signin/
  - Request Content-Type: application/json
  - Request body: {"email": root@gmail.com, "password": root}
  - Status code: 200 upon success, 500 if error occurs, 401 if password doesn't match usename
  - Response: Content-Type: application/json
  - Response body: {"email": root@gmail.com, "password": root}
  

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"email": "root@gmail.com", "password": "root"}' -c cookie.txt https://localhost:3000/api/signin/
```

+ Sign out
  - Method: `GET`
  - Url: `/api/signout/`
  - Response status: `200`, if successful. `500`, if an error has occurred.

```
  $ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/signout/
```

+ Get User (for profile setup)
  - Method: GET
  - Url: /profile/setup
  - Status code: 200 upon success, 500 if internal server error
  - Response: Content-Type: application/json
  - Response body: {user: user}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/profile/setup
```

+ Get recipe setup
  - Method: GET
  - Url: /recipe/setup/:id
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found for active user, 
  - Response: Content-Type: application/json
  - Response body: {resData: recipe object}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/recipe/setup/1
```

+ Get 6 recently uploaded recipes
  - Method: GET
  - Url: /recipe/uploads
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found for active user
  - Response: Content-Type: application/json
  - Response body: {recipes}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/recipe/uploads
```

+ Get if the recipe is favourited
  - Method: GET
  - Url: /recipe/ifFav/:id
  - Status code: 200 upon success, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {res: "Favourite this" or "Unfavourite"}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/recipe/ifFav/1
```

+ Get favourited recipes
  - Method: GET
  - Url: /recipe/fav/
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found for active user
  - Response: Content-Type: application/json
  - Response body: {resData: id, title and summary about the recipes}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/recipe/fav/
```

+ Get top favourited recipes
  - Method: GET
  - Url: /recipe/topFav/
  - Status code: 200 upon success, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {top recipes objects}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/recipe/topFav/
```

+ Get personal stats info (charts info)
  - Method: GET
  - Url: /stats/:chartId
  - Status code: 200 upon success, 403 if forbidden, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {first chart stats or second chart stats}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/stats/:chartId
```

+ Get profile image
  - Method: GET
  - Url: /api/images/:username
  - Status code: 200 upon success, 404 if no data found
  - Response: Content-Type: application/json
  - Response body: {image data}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/images/:username
```

+ Send email
  - Method: GET
  - Url: /send
  - Status code: 200 upon success
  - Response: Content-Type: text
  - Response body: "sent" or "error"
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/send
```

+ Upload profile image
  - Method: POST
  - Url: /profile/image
  - Request Content-Type: application/json
  - Request body: {"image": image file, "email": active user email}
  - Status code: 200 upon success, 403 if forbidden
  - Response: Content-Type: null

```
  $ curl -k --verbose --request POST --header 'Content-Type: application/json' --data '{"image": image file, "email": "root@gmail.com"}' -b cookie.txt https://localhost:3000/profile/image/
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
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"_id": id, "username":username, "title":title, "pic":pic, "ings":ings, "intro":intro, "steps":steps, "tip":tip, "rating": rating, "tags": tags}' -b cookie.txt https://localhost:3000/api/recipe/
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
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"author": "test cmt", "content": "test"}' -b cookie.txt https://localhost:3000/api/comments/10
```



+ Get a recipe's comments
  - Method: GET
  - Url: /api/comments/:id/
  - Status code: 200 upon seccess, 400 if id is invalid, 404 if no image with id, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {found: true/false, id: id, message: comments_data}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/comments/10/
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
  $ curl -k --verbose --request PUT --header 'Content-Type: application/json' --data '{"author": "test cmt", "content": "test"}' -b cookie.txt https://localhost:3000/api/home/search/remote
```

+ search remote db
  - Method: PUT
  - Url: /api/search/remote/:mode
  - Status code: 200 upon success, 403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {recipe objects}
  
```
  $ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/search/remote/1
```

+ Get recipe by username and id
  - Method: GET
  - Url: /api/users/:username/recipes/:id/
  - Status code: 200 upon success, 403 if forbidden,404 if no recipe found
  - Response: Content-Type: application/json
  - Response body: {found: true/false, id:id, message: recipe data}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/users/root/recipes/10/
```

+ Get recipe pic
  - Method: GET
  - Url: /api/recipes/:id/pic/
  - Status code: 200 upon success, 409 if error in db,404 if no recipe found
  - Response: Content-Type: application/json
  - Response body: {picture}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/recipes/10/pic/
```

+ Get recipe step pics
  - Method: GET
  - Url: /api/recipes/:id/step/:number
  - Status code: 200 upon success, 409 if error in db,403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {picture}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/recipes/:id/step/1
```

+ Delete recipe by id
  - Method: DELETE
  - Url: /api/recipes/:id/
  - Status code: 200 upon success, 409 if conflict in db, 403 if forbidden
  - Response: Content-Type: null
```
$ curl -k --verbose --request DELETE -b cookie.txt https://localhost:3000/api/recipes/1/
```

+ Search local db
  - Method: GET
  - Url: /api/home/search/local
  - Status code: 200 upon success, 409 if error in db,403 if forbidden
  - Response: Content-Type: application/json
  - Response body: {recipe data}
```
$ curl -k --verbose --request GET -b cookie.txt https://localhost:3000/api/home/search/local
```

+ Delete a comment
  - Method: DELETE
  - Url: /api/recipes/:r_id/comments/:id/
  - Status code: 200 upon success, 409 if conflict in db, 404 if recipe not found, 403 if forbidden
  - Response: Content-Type: null
```
$ curl -k --verbose --request DELETE -b cookie.txt https://localhost:3000/api/recipes/1/comments/1/
```

+ Update?





