const { describe, expect, test } = require("@jest/globals");
const {
  isPortrait,
  reorderPhotos,
  reorderContent,
  MAX_PHOTO_SHIFT,
} = require("./reorder-content");

function photo(id, portrait, sortIndex = 0) {
  return {
    key: id,
    id,
    sortIndex,
    resize: {
      small: {
        width: portrait ? 100 : 200,
        height: portrait ? 200 : 100,
      },
    },
  };
}

function withSortIndices(photos) {
  return photos.map((item, index) => ({
    ...item,
    sortIndex: (photos.length - index) * 1000,
  }));
}

function rows(photos) {
  return Array.from(
    { length: Math.ceil(photos.length / 3) },
    (_, index) => photos.slice(index * 3, index * 3 + 3)
  );
}

describe("reorderPhotos", () => {
  test("identifies portrait photos from their dimensions", () => {
    expect(isPortrait(photo("portrait", true))).toBe(true);
    expect(isPortrait(photo("landscape", false))).toBe(false);
  });

  test("uses the expected portrait positions for mixed rows", () => {
    const photos = withSortIndices([
      photo("landscape-1", false),
      photo("landscape-2", false),
      photo("portrait-1", true),
      photo("landscape-3", false),
      photo("landscape-4", false),
      photo("portrait-2", true),
    ]);

    expect(reorderPhotos(photos).map(({ id }) => id)).toEqual([
      "portrait-1",
      "landscape-1",
      "landscape-2",
      "landscape-3",
      "landscape-4",
      "portrait-2",
    ]);
  });

  test("keeps portrait order when filling portrait positions", () => {
    const photos = withSortIndices([
      ...Array.from({ length: 12 }, (_, index) =>
        photo(`landscape-${index}`, false)
      ),
      photo("portrait-1", true),
      photo("portrait-2", true),
    ]);
    const result = reorderPhotos(photos);

    expect(result.filter(isPortrait).map(({ id }) => id)).toEqual([
      "portrait-1",
      "portrait-2",
    ]);
  });

  test("is idempotent for a reordered catalog", () => {
    const photos = withSortIndices([
      photo("landscape-1", false),
      photo("landscape-2", false),
      photo("portrait-1", true),
      photo("landscape-3", false),
      photo("landscape-4", false),
      photo("portrait-2", true),
    ]);

    const reordered = reorderPhotos(photos);
    expect(reorderPhotos(reordered)).toEqual(reordered);
  });

  test("is idempotent when portraits are far behind landscapes", () => {
    const photos = withSortIndices([
      ...Array.from({ length: 12 }, (_, index) =>
        photo(`landscape-${index}`, false)
      ),
      photo("portrait-1", true),
      photo("portrait-2", true),
    ]);

    const reordered = reorderPhotos(photos);
    expect(reorderPhotos(reordered)).toEqual(reordered);
  });

  test("moves portraits only when every resulting position stays within three rows", () => {
    const photos = withSortIndices([
      ...Array.from({ length: 9 }, (_, index) =>
        photo(`landscape-${index}`, false)
      ),
      photo("near-portrait", true),
      ...Array.from({ length: 20 }, (_, index) =>
        photo(`landscape-after-${index}`, false)
      ),
      photo("distant-portrait", true),
    ]);

    const result = reorderPhotos(photos);
    const baselineIndices = new Map(
      photos.map(({ key }, index) => [key, index])
    );

    expect(result[0].id).toBe("near-portrait");
    expect(
      Math.max(
        ...result.map((item, index) =>
          Math.abs(index - baselineIndices.get(item.key))
        )
      )
    ).toBeLessThanOrEqual(MAX_PHOTO_SHIFT);
    expect(
      result.findIndex(({ id }) => id === "distant-portrait")
    ).toBeGreaterThanOrEqual(21);
  });

  test("orders input by sortIndex and rejects duplicate or missing values", () => {
    const ordered = withSortIndices([
      photo("landscape", false),
      photo("portrait", true),
      photo("landscape-2", false),
    ]);

    expect(reorderPhotos([ordered[1], ordered[0], ordered[2]])[0].id).toBe(
      "portrait"
    );
    expect(() =>
      reorderPhotos([
        ordered[0],
        { ...ordered[1], sortIndex: ordered[0].sortIndex },
      ])
    ).toThrow(`Duplicate sortIndex: ${ordered[0].sortIndex}`);
    expect(() => reorderPhotos([{ ...ordered[0], sortIndex: undefined }])).toThrow(
      "Photo landscape has an invalid sortIndex"
    );
  });
});

describe("reorderContent", () => {
  test("keeps featured photos before non-featured photos", () => {
    const content = [
      { ...photo("non-featured", false, 0), featured: false },
      { ...photo("featured", true, 1000), featured: true },
    ];

    expect(reorderContent(content).map(({ id }) => id)).toEqual([
      "featured",
      "non-featured",
    ]);
  });

  test("produces rows with at most one portrait when enough landscapes exist", () => {
    const content = withSortIndices([
      ...Array.from({ length: 6 }, (_, index) => ({
        ...photo(`landscape-${index}`, false),
        featured: false,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        ...photo(`portrait-${index}`, true),
        featured: false,
      })),
    ]);

    expect(rows(reorderContent(content)).every((row) => {
      return row.filter(isPortrait).length <= 1;
    })).toBe(true);
  });
});
