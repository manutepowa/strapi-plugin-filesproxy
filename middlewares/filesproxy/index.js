const _ = require('lodash');
const fs = require('fs')
const https = require('https')
const Stream = require('stream').Transform

const hasModel = (model) => Object.keys(strapi.models).some(m => m === model)
const mapMediaFields = (attributes) => {
  const mediaFields = {}
  Object.entries(attributes).forEach(([key, value]) => {
    if (_.includes(value, 'upload')) {
      mediaFields[key] = value
    }
  });
  return mediaFields
}

const fetchFiles = async (files, site) => {
  files.forEach(file => {
    const fileURL = 'public/'+file
    if (!fs.existsSync(fileURL)) {
      const options = {
        hostname: site,
        port: 443,
        path: file,
        method: 'GET'
      }
      https.request(options, function (response) {
        const data = new Stream()

        if(response.statusCode !== 200) return

        response.on('data', function (chunk) {
          data.push(chunk)
        })
        response.on('end', function () {
          fs.writeFileSync(fileURL, data.read())
        })
        response.on('error', (e) => {
          console.error(e);
        });
      }).end()
    }
  })
}

const prepareFilesAndFormat = async (files) => {
  const {site} = strapi.config.middleware.settings.filesproxy

  files.forEach(async file => {
    if (file === null) return
    const filesWithFormats = file.formats === null
      ? [file.url]
      : [file.url, ...Object.values(file.formats).map(format => format.url)]

    await fetchFiles(filesWithFormats, site)
  });
}

const prepareRowFields = (mediaFields, row) => {
  Object.entries(mediaFields).forEach(async ([name, config]) => {
    const isMultiple = 'collection' in config
    const files = isMultiple
      ? row[name]
      : [row[name]]

    await prepareFilesAndFormat(files)
  })
}

module.exports = () => {
  return {
    initialize() {
      strapi.router.get('*', async (ctx, next) => {
        await next();
        if (_.isEmpty(ctx.body) || ctx.status === 404 || ctx.request.route === undefined) return;

        const model = ctx.request.route.controller
        if (!hasModel(model)) return;

        const attributes = strapi.models[model].attributes
        const mediaFields = mapMediaFields(attributes)

        if (_.isEmpty(mediaFields)) return

        ctx.body.forEach(row => {
          prepareRowFields(mediaFields, row)
        })
      })
    },
  };
};
