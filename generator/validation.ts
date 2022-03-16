// @ts-nocheck
export const create_MNS_ = Joi.object({
  _VC_
});

export const edit_MNS_ = Joi.object({
  _MN__id: Joi.string().required(),
  _VE_
});

export const delete_MNS_ = Joi.object({
  _MN__id: Joi.string().required(),
});