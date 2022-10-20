import { capitalizeWord } from "@utils/capitalizeWord"

describe("Capitalize Word", () => {
   test("String input", () => {
      expect(capitalizeWord("hello")).toBe("Hello")
   })
})