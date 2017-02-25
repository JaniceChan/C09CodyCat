# C09CodyCat
+ **Project Title:**  
  Kitchen Kittens
+ **Team Members** 

|Name|Repos|Utroid|
|----|----|----|
|Janice Chan|https://github.com/janicechan|chanja39|
|Jiaan Li|https://github.com/chataignes|lijiaan|


+ **Description of web application**

Our web app will provide a collection of recipies uploaded by registered users. 
 1. Registered recipe owners can:
  - Upload own recipe: picture, ingredients, description (number of hours to make, type of dish, price, etc.), steps, and useful links (for grocery shopping) 
  - Delete own recipe 
  - Delete comments on own recipe 
 2. Registered users can: 
  - Browse recipes 
  - Rate recipes 
  - Upload image/text comments (with comment rating feature) to any recipe
  - Delete own comment 
  - Signout 
 3. Non-registered users: 
  - Signup and signin 

+ **Description of the key features that will be completed by the Beta version**

  Frontend and part of the backend completed for the web app. Backend completed for this part would include storage (db, uploads). The appropriate response codes may not be implemented at this stage. 

+ **Description of additional features that will be complete by the Final version**

  Remainder of the backend, authentication and security, and any additional features (shopping cart, favourites, etc.) of web app implemented. Portabaility of the web app would be ensured by this stage. 

+ **Description of the technology that you will use**

  Frontend: HTML, CSS, Javascript, (following RESTful API, CRUD)  
  Backend: JSON (packages to install include express, body-parser, multer, nedb, cookie-parser, express-validator), Ajax, NeDB

+ **Description of the technical challenges**
  1. Remember to follow the REST design for frontend
  2. Asynchronization issues 
  3. Authentication, certain users should have corresponding privileges
  4. Enable HTTPS to prevent eavesdropping/spoofing 
  5. Validate & sanitize user inputs to prevent spoofing/cross-site scripting 
  6. Secure cookies to prevent mixed-content attacks 
