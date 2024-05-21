export const VoucherType = {
  DISCOUNT: 'DISCOUNT',
  POINT: 'POINT',
} as const;
export type VoucherType = (typeof VoucherType)[keyof typeof VoucherType];
