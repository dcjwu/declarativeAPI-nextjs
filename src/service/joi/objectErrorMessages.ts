import { capitalizeWord } from "@utils/capitalizeWord"

import type { ObjectErrorMessagesType } from "@customTypes/service/joi"

const objectBaseErrorMessage = (requestObjectErrorText: string): string => {
   return `${capitalizeWord(requestObjectErrorText)} request cannot be empty`
}

const objectUnknownErrorMessage = (): string => {
   return "Not allowed fields"
}

export const objectErrorMessages = (requestObjectErrorText: string): ObjectErrorMessagesType => {
   return {
      "object.base": objectBaseErrorMessage(requestObjectErrorText),
      "object.unknown": objectUnknownErrorMessage()
   }
}

