export default {
  webpack: function (cfg) {
    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();

      if (entries["main.js"]) {
        entries["main.js"].unshift("./src/polyfills/index.ts");
      }

      return entries;
    };

    return cfg;
  },
};
