# Strapi plugin filesproxy

Download on-demand production files in local development for each Strapi API response.

If you make a request to /products and this content type has file type fields and you are developing locally, it is possible that the files are only hosted in production.
This plugin downloads each file only when the request is made.