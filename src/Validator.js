import { validate } from "indicative/validator";

class Validator {
  static async validate(payload, rules) {
    return validate(payload, rules, {}, { removeAdditional: true })
    .then(resp => resp)
    .catch(() => false);
  }
}

export default Validator;
