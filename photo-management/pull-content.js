const fs = require("fs");

const db = require("../server/db/index");

const RELEVANT_KEYS = [
  "key",
  "name",
  "title",
  "description",
  "latin",
  "order",
  "location",
  "tags",
];

(async function () {
  const photos = await db.list("photos");

  const pluckedContent = photos
    .sort((p1, p2) => p1.order - p2.order)
    .map((photo) => {
      return RELEVANT_KEYS.reduce((prevVal, curVal) => {
        prevVal[curVal] = photo[curVal];
        return prevVal;
      }, {});
    });
  fs.writeFileSync("content.json", JSON.stringify(pluckedContent, null, 2));
  process.exit();
})();
