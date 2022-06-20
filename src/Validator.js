import { validate, validateAll } from "indicative/validator";

class Validator {
  static async validate(payload, Action) {
    return validateAll(payload, Action.rules(), Action.messages ? Action.messages() : {}, { removeAdditional: true })
    .then(resp => resp)
    .catch(err => ({ errors: err }));
  }
}

export default Validator;
