import { validations } from "indicative/validator";

const rules = () => {
  return {
    card_id: [
      validations.required(),
      validations.integer(),
      validations.range([1, 40]),
    ]
  }
}

const messages = () => {
  return {
    'card_id.required': 'Favor, envie o ID da carta jogada.',
    'card_id.integer': 'O ID da carta deve ser um número Inteiro.',
    'card_id.range': 'O ID da carta deve estar ser de 1 a 40.'
  }
}

export default { rules, messages };
