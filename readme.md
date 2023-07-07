You can make requests to the following endpoints:

http://localhost:3000/articles?keyword="9/11"&lang=en&country=us&max=10 to fetch articles and
http://localhost:3000/articles/:articleId to fetch a specific article by its ID.
The API supports query parameters for filtering articles by keyword, author, and title.
The responses will be cached using the memory-cache package, reducing the number of requests made to the GNews API.


Steps to Run:
1. ``npm i``
2. ``node app.js``