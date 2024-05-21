import * as v from "valibot";
export const SigninSchema = v.object({
  data: v.string([
    v.minLength(5, 'Should be at least 5 character(s)'),
    v.maxLength(256),
  ]),
  password: v.string([v.minLength(8, 'Should be at least 8 character(s)'), v.maxLength(512)]),
});

export const SignupSchema = v.object({
  username: v.string([v.minLength(5, 'Should be at least 5 character(s)'), v.maxLength(16)]),
  email: v.string([v.email('Email is invalid!'), v.minLength(11, 'Should be at least 11 character(s)'), v.maxLength(256)]),
  displayName: v.string([v.minLength(1), v.maxLength(64)]),
  registerCode: v.string([v.custom((input) => {
    return input === '' || (typeof input === 'string' && input.length === 32)
  }, 'Should be 32 characters')]),
  password: v.string([v.minLength(8), v.maxLength(512)]),
  password2: v.string([v.minLength(8), v.maxLength(512)]),
},
  [
    v.forward(
      v.custom(
        (input) => input.password === input.password2,
        'The two passwords do not match.'
      ),
      ['password2']
    ),
  ]
)

export type SignupInput = v.Input<typeof SignupSchema>;