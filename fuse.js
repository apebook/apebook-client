const { FuseBox, BabelPlugin, UglifyJSPlugin,LessPlugin } = require("fuse-box");

let shim = {
  react: {
    exports: "window.React"
  }
};

const dest_build = process.env.BUILD_DEST || 'build';

const babelPlugin = BabelPlugin({
  config: {
    sourceMaps: true,
    "presets": ["latest","stage-2","react"],
    "plugins": [
      ["transform-class-properties"]
    ]
  }
});

let options = {
  homeDir: "./src",
  output: dest_build + "/$name.js",
  shim: shim,
  plugins: [babelPlugin,UglifyJSPlugin()]
};

if (process.env.NODE_ENV === 'dev') {
  options.plugins = [babelPlugin];
  options.debug = true;
  options.log = true;
}

const fuse = FuseBox.init(options);
if (process.env.NODE_ENV === 'dev') {
  fuse.bundle("index").sourceMaps(true).plugin(LessPlugin({importer : true}),CSSPlugin()).watch("src/**").instructions("!>index.js").hmr();
  fuse.dev({
    root: './',
    port : 3333
  });
} else {
  //fuse.bundle("index").plugin(SassPlugin({importer : true}),CSSPlugin()).instructions("!>index.js");
}
fuse.run();
