import { validateAll } from "indicative/validator";

class Validator {
  static async validate<T = any>(payload: any, Action: any) {
    return validateAll(
      payload,
      Action.rules(),
      Action.messages ? Action.messages() : {},
      { removeAdditional: true }
    ).then((data) => data as T);
  }
}

export default Validator;
