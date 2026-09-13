import fs from "fs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const s3Uploader = jest.fn(() => Promise.resolve({ uri: "/uploaded" }));
const resize = jest.fn((filePath, width, name) =>
  Promise.resolve({
    sizeLabel: name,
    width,
    height: width / 2,
    buffer: Buffer.from(name),
  })
);
const metadata = jest.fn(() =>
  Promise.resolve({
    width: 3000,
    height: 2000,
    description: "A test photo",
    shot_at: new Date("2024-05-06T00:00:00Z"),
  })
);

jest.unstable_mockModule("../../server/photos/s3/s3-uploader.js", () => ({
  default: s3Uploader,
}));
jest.unstable_mockModule("./gm.js", () => ({
  resize,
  metadata,
}));
jest.unstable_mockModule("./temp-file-writer.js", () => ({
  default: jest.fn(() => Promise.resolve({ path: "/tmp/resized.jpg" })),
}));
jest.unstable_mockModule("./id-generator.js", () => ({
  id: jest.fn(() => "generated-id"),
}));

const {
  getYearFromShotAt,
  replaceKeyInContentJson,
  updateContentJson,
  processAndUploadFile,
  upload,
} = await import("./upload.mjs");

describe("upload feature", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    s3Uploader.mockClear();
    resize.mockClear();
    metadata.mockClear();
  });

  test("uploads every configured resized image with the expected S3 key", async () => {
    const file = {
      originalname: "cat.jpg",
      mimetype: "image/jpeg",
    };
    const resizedResults = [{ buffer: Buffer.from("thumb") }];

    const uploads = upload("photo-id", file, [
      resizedResults[0],
      resizedResults[0],
      resizedResults[0],
      resizedResults[0],
      resizedResults[0],
      resizedResults[0],
    ]);

    await Promise.all(uploads);

    expect(s3Uploader).toHaveBeenCalledTimes(6);
    expect(s3Uploader).toHaveBeenNthCalledWith(
      1,
      resizedResults[0].buffer,
      "photo-id/mostlyanimals_photo-id_thumb.jpg",
      "image/jpeg"
    );
    expect(s3Uploader).toHaveBeenNthCalledWith(
      2,
      resizedResults[0].buffer,
      "photo-id/mostlyanimals_photo-id_xs.jpg",
      "image/jpeg"
    );
  });

  test("processes, resizes, uploads, and returns photo metadata", async () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(Buffer.from("source"));

    const photo = await processAndUploadFile("/photos/cat.jpg", "photo-id");

    expect(resize).toHaveBeenCalledTimes(6);
    expect(s3Uploader).toHaveBeenCalledTimes(6);
    expect(metadata).toHaveBeenCalledWith("/tmp/resized.jpg");
    expect(photo).toMatchObject({
      key: "photo-id",
      name: "cat.jpg",
      description: "A test photo",
      width: 3000,
      height: 2000,
    });
    expect(photo.resize).toMatchObject({
      thumb: { width: 220, height: 110 },
      xsmall: { width: 500, height: 250 },
    });
  });

  test("prepends new photos to content and adds their capture year", () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify([{ key: "old" }]));
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    updateContentJson([
      {
        key: "new",
        name: "cat.jpg",
        width: 3000,
        height: 2000,
        description: "A cat",
        shot_at: "2024-05-06T00:00:00Z",
        resize: {},
      },
    ]);

    expect(JSON.parse(writeFileSync.mock.calls[0][1])).toEqual([
      expect.objectContaining({ key: "new", tags: ["2024"] }),
      { key: "old" },
    ]);
  });

  test("replaces an existing photo and avoids duplicate capture years", () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify([
        {
          key: "photo-id",
          tags: ["2024", "animal"],
          title: "Keep this",
        },
      ])
    );
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    replaceKeyInContentJson("photo-id", {
      name: "updated.jpg",
      width: 100,
      height: 200,
      resize: {},
      shot_at: new Date("2024-01-01"),
    });

    const replaced = JSON.parse(writeFileSync.mock.calls[0][1])[0];
    expect(replaced).toMatchObject({
      key: "photo-id",
      name: "updated.jpg",
      title: "Keep this",
      tags: ["2024", "animal"],
    });
  });

  test("returns null for invalid capture dates", () => {
    expect(getYearFromShotAt("not-a-date")).toBeNull();
    expect(getYearFromShotAt(null)).toBeNull();
  });
});
