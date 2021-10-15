# Strapi plugin filesproxy

Download on-demand production files in local development for each Strapi API response.

## Description

If you make a request to /products and this content type has file type fields and you are developing locally, it is possible that the files are only hosted in production.
This plugin downloads each file only when the request is made.

## Install in Strapi

Installing is simple and the plugin is enabled by default just a simple:

- `npm i -s strapi-plugin-filesproxy`
- `yarn add strapi-plugin-filesproxy`

In a Strapi project, tested on v3.6.8

## Configuration

**1.** Add your FilesProxy configuration to your `config/middleware.js` file:

```javascript
{
  // ... more middleware configurations
    filesproxy: {
        enabled: true,
        site: "productionUrl.com"
        // site: production host to download files
    }
  // ... more middleware configurations
}
```