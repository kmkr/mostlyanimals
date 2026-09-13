(async () => {
  const { run } = await import("./delete-photo.mjs");
  process.exit(await run(process.argv.slice(2)));
})();
