const alias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: alias,
      options: {
        aliases: {
          actions: './src/actions',
          img: './src/img',
          libs: './src/libs',
          reducers: './src/reducers',
          store: './src/store',
          styles: './src/styles',
          utils: './src/utils',
          view: './src/view',
          apps: './src/view/apps',
          components: './src/view/components',
          containers: './src/view/containers',
          layouts: './src/view/layouts',
          pages: './src/view/pages',
        },
      },
    },
  ],
};
