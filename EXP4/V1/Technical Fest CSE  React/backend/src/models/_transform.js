// Shared toJSON: expose `id`, hide `_id`, `__v` and any secret fields.
export const jsonTransform = {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
};
