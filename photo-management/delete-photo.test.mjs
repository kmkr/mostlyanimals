import fs from "fs";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const deletePhotoHandler = jest.fn(() => Promise.resolve({ key: "deleted" }));

jest.unstable_mockModule("../server/photos/delete/index.js", () => ({
  default: deletePhotoHandler,
}));

const { run } = await import("./delete-photo.mjs");

describe("delete photo feature", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    deletePhotoHandler.mockClear();
  });

  test("deletes requested photos from S3 and content.json", async () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify([
        { key: "keep" },
        { key: "delete-1" },
        { key: "delete-2" },
      ])
    );
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    const exitCode = await run(["delete-1", "delete-2"]);

    expect(exitCode).toBe(0);
    expect(deletePhotoHandler).toHaveBeenNthCalledWith(1, "delete-1");
    expect(deletePhotoHandler).toHaveBeenNthCalledWith(2, "delete-2");
    expect(JSON.parse(writeFileSync.mock.calls[0][1])).toEqual([{ key: "keep" }]);
  });

  test("supports skipping S3 deletion while updating content.json", async () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify([{ key: "delete-1" }])
    );
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    await run(["delete-1", "--skip-s3"]);

    expect(deletePhotoHandler).not.toHaveBeenCalled();
    expect(JSON.parse(writeFileSync.mock.calls[0][1])).toEqual([]);
  });

  test("continues removing content when S3 deletion fails", async () => {
    deletePhotoHandler.mockRejectedValueOnce(new Error("network failure"));
    jest.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify([{ key: "delete-1" }])
    );
    const writeFileSync = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    await run(["delete-1"]);

    expect(JSON.parse(writeFileSync.mock.calls[0][1])).toEqual([]);
  });

  test("returns a usage error when no keys are supplied", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(run([])).resolves.toBe(1);

    expect(error).toHaveBeenCalledWith(
      "Usage: node photo-management/delete-photo.js <key1> <key2> ... [--skip-s3]"
    );
  });
});
