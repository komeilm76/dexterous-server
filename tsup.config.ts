// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/index.ts"],
//   format: ["esm", "cjs"],        // builds both ESM and CommonJS
//   dts: true,                     // generate .d.ts files
//   sourcemap: true,               // useful for debugging
//   clean: true,                   // clean output directory before build
//   outDir: "build",
//   target: "es2020",              // modern but widely compatible
//   platform: "node",              // for Express (use "browser" if frontend)
//   splitting: false,              // keep as a single file
//   minify: false,                 // disable minification for easier debugging
//   shims: true,                   // add __dirname / import.meta compatibility
//   outExtension({ format }) {
//     return format === "esm" ? { js: ".mjs" } : { js: ".cjs" };
//   }
// });

import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "build/esm",
    outExtension: () => ({ js: ".mjs" }),
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2020",
    platform: "node",
  },
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outDir: "build/cjs",
    outExtension: () => ({ js: ".cjs" }),
    dts: true,
    sourcemap: true,
    clean: false,
    target: "es2020",
    platform: "node",
  },
]);