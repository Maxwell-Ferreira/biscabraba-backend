import { validateAll } from "indicative/validator";

class Validator {
  static async validate(payload, Action) {
    return validateAll(
      payload,
      Action.rules(),
      Action.messages ? Action.messages() : {},
      { removeAdditional: true }
    );
  }
}

export default Validator;
