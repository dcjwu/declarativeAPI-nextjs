import { capitalizeWord } from "@utils/capitalizeWord"

export const objectBaseErrorMessage = (requestObjectErrorText: string): string => {
   return `${capitalizeWord(requestObjectErrorText)} request cannot be empty`
}