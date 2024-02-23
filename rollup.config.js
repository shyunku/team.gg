import { spawn } from "child_process";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
// import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";
import sveltePreprocess from "svelte-preprocess";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import PackageJson from "./package.json" assert { type: "json" };

const production = !process.env.ROLLUP_WATCH;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scssAliasPath = path.resolve(__dirname, "src/");

const isProduction = process.env.NODE_ENV === "production";
dotenv.config({
  path: isProduction ? ".production.env" : ".dev.env",
});

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
      preprocess: sveltePreprocess({
        scss: {
          importer: [
            {
              find: "@",
              replacement: scssAliasPath,
            },
          ],
        },
      }),
      onwarn: (warning, handler) => {
        if (warning.code === "a11y-click-events-have-key-events") return;
        handler(warning);
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    // css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
      exportConditions: ["svelte"],
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: production,
      use: [
        [
          "sass",
          {
            includePaths: ["./src/styles"],
          },
        ],
      ],
    }),
    alias({
      entries: [{ find: "@", replacement: scssAliasPath }],
    }),
    replace({
      preventAssignment: true,
      APP_SERVER_HOST: JSON.stringify(process.env.APP_SERVER_HOST),
      APP_SERVER_PORT: JSON.stringify(process.env.APP_SERVER_PORT),
      APP_VERSION: JSON.stringify(PackageJson.version),
      APP_SECURE: JSON.stringify(isProduction ? true : false),
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
