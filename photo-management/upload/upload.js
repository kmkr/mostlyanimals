(async () => {
  const { run } = await import("./upload.mjs");
  await run(process.argv.slice(2));
})();
