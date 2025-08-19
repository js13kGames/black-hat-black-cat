const esbuild = require('esbuild')
const { htmlPlugin } = require('@craftamap/esbuild-plugin-html')
const postcss = require('esbuild-postcss')

const { htmlTemplate } = require('./src/index.html')
;(async () => {
  const ctx = await esbuild.context({
    logLevel: 'info',
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    metafile: true,
    loader: { '.png': 'file' },
    write: false,
    plugins: [
      postcss(),
      htmlPlugin({
        files: [
          {
            entryPoints: ['src/index.ts'],
            filename: 'index.html',
            htmlTemplate,
          },
        ],
      }),
    ],
  })

  await ctx.watch()

  await ctx.serve({
    servedir: 'dist',
  })

  // ctx.dispose()
})()
