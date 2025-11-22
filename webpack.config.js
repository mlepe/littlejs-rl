/*
 * File: webpack.config.js
 * Project: LittleJS RL
 * File Created: Sunday, 26th October 2025 3:20:39 pm
 * Author: Matthieu LEPERLIER (m.leperlier42@gmail.com)
 * -----
 * Last Modified: Sunday, 26th October 2025 3:20:39 pm
 * Modified By: Matthieu LEPERLIER (m.leperlier42@gmail.com>)
 * -----
 * Copyright 2025 - 2025 Matthieu LEPERLIER
 */

const path = require('node:path');
const fs = require('node:fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  // Use webpack's --mode flag or default to development
  const mode = argv.mode || 'development';

  return {
    mode: mode,
    entry: {
      app: './src/index.ts',
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.join(__dirname, 'src'),
          publicPath: '/src',
        },
      ],
      hot: true,
      port: process.env.PORT || 8080,
      host: process.env.HOST || 'localhost',
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        // API endpoint to save tileset data to project folder
        devServer.app.post('/api/save-tileset', async (req, res) => {
          try {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk.toString();
            });

            req.on('end', () => {
              const { fileType, content, filename } = JSON.parse(body);

              // Determine target directory based on file type
              let targetDir;
              if (fileType === 'json') {
                targetDir = path.join(
                  __dirname,
                  'src',
                  'data',
                  'base',
                  'tilesets'
                );
              } else if (fileType === 'typescript') {
                targetDir = path.join(__dirname, 'src', 'ts');
              } else {
                return res.status(400).json({ error: 'Invalid file type' });
              }

              // Ensure directory exists
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }

              // Write file
              const filePath = path.join(targetDir, filename);
              fs.writeFileSync(filePath, content, 'utf8');

              console.log(`[TilesetViewer] Saved ${filename} to ${targetDir}`);
              res.json({
                success: true,
                path: filePath,
                message: `Saved to ${filePath}`,
              });
            });
          } catch (error) {
            console.error('[TilesetViewer] Save error:', error);
            res.status(500).json({
              error: 'Failed to save file',
              details: error.message,
            });
          }
        });

        return middlewares;
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement',
      }),
      new Dotenv({
        systemvars: true,
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          loader: 'file-loader',
        },
        {
          test: /\.json$/i,
          type: 'asset/resource',
          generator: {
            filename: 'data/[path][name][ext]',
          },
        },
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { test: /\.tsx?$/, loader: 'ts-loader' },
        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    performance: {
      hints: false,
      maxAssetSize: 100000,
      maxEntrypointSize: 400000,
    },
  };
};
