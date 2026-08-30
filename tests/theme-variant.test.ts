import { expect, test } from "bun:test"

test("dark utilities follow the selected theme class", async () => {
  const css = await Bun.file("src/app/globals.css").text()

  expect(css).toContain("@custom-variant dark (&:where(.dark, .dark *));")
})
