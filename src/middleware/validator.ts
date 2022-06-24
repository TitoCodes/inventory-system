import Validators from "./validators/index";

export default function (validator: any) {
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator doesn't exist`);

  return async function (req: any, res: any, next: any) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err: any) {
      if (err.isJoi)
        return next(res.status(422).json({ message: err.message }));
      next(res.status(500).json());
    }
  };
}
