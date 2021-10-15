# Strapi plugin filesproxy

Download on-demand production files in local development for each Strapi API response.

## Description

When you make a request to `/example`, whose content type has file type fields and you are developing locally, if your files are only hosted in production, this plugin helps you to download each file only when the request is made.

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