import { capitalizeWord } from "@utils/capitalizeWord"

import type { FieldErrorMessagesType } from "@customTypes/service/joi"

const anyRequiredErrorMessage = (field: string): string => {
   return `${capitalizeWord(field)} is a required field`
}

const stringEmptyErrorMessage = (field: string): string => {
   return `${capitalizeWord(field)} cannot be empty`
}
 
const stringBaseErrorMessage = (field: string): string => {
   return `${capitalizeWord(field)} must be of type string`
}

const stringEmailErrorMessage = (field: string): string => {
   return `${capitalizeWord(field)} must be a valid email address`
}

const stringMinErrorMessage = (field: string, count: number): string => {
   return `${capitalizeWord(field)} must be at least ${count} characters long`
}

export const fieldErrorMessages = (field: string, countMin?: number): FieldErrorMessagesType => {
   return {
      "any.required": anyRequiredErrorMessage(field),
      "string.empty": stringEmptyErrorMessage(field),
      "string.base": stringBaseErrorMessage(field),
      "string.email": stringEmailErrorMessage(field),
      "string.min": stringMinErrorMessage(field, countMin ?? 0)
   }
}