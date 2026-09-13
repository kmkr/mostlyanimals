const { describe, expect, test } = require("@jest/globals");
const {
  isPortrait,
  reorderPhotos,
  reorderContent,
} = require("./reorder-content");

function photo(id, portrait) {
  return {
    id,
    resize: {
      small: {
        width: portrait ? 100 : 200,
        height: portrait ? 200 : 100,
      },
    },
  };
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
    const photos = [
      photo("landscape-1", false),
      photo("landscape-2", false),
      photo("portrait-1", true),
      photo("landscape-3", false),
      photo("landscape-4", false),
      photo("portrait-2", true),
    ];

    expect(reorderPhotos(photos).map(({ id }) => id)).toEqual([
      "portrait-1",
      "landscape-1",
      "landscape-2",
      "landscape-3",
      "landscape-4",
      "portrait-2",
    ]);
  });

  test("does not promote a portrait by more than three rows", () => {
    const photos = [
      ...Array.from({ length: 12 }, (_, index) =>
        photo(`landscape-${index}`, false)
      ),
      photo("portrait", true),
    ];
    const result = reorderPhotos(photos);
    const originalRow = Math.floor(photos.indexOf(photos[12]) / 3);
    const reorderedRow = Math.floor(result.indexOf(photos[12]) / 3);

    expect(originalRow - reorderedRow).toBeLessThanOrEqual(3);
  });

  test("is idempotent for a reordered catalog", () => {
    const photos = [
      photo("landscape-1", false),
      photo("landscape-2", false),
      photo("portrait-1", true),
      photo("landscape-3", false),
      photo("landscape-4", false),
      photo("portrait-2", true),
    ];

    const reordered = reorderPhotos(photos);
    expect(reorderPhotos(reordered)).toEqual(reordered);
  });
});

describe("reorderContent", () => {
  test("keeps featured photos before non-featured photos", () => {
    const content = [
      { ...photo("non-featured", false), featured: false },
      { ...photo("featured", true), featured: true },
    ];

    expect(reorderContent(content).map(({ id }) => id)).toEqual([
      "featured",
      "non-featured",
    ]);
  });

  test("produces rows with at most one portrait when enough landscapes exist", () => {
    const content = [
      ...Array.from({ length: 6 }, (_, index) => ({
        ...photo(`landscape-${index}`, false),
        featured: false,
      })),
      ...Array.from({ length: 2 }, (_, index) => ({
        ...photo(`portrait-${index}`, true),
        featured: false,
      })),
    ];

    expect(rows(reorderContent(content)).every((row) => {
      return row.filter(isPortrait).length <= 1;
    })).toBe(true);
  });
});
