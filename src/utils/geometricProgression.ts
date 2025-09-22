import Decimal from "break_infinity.js";

const getTotalCost = (
  baseCost: Decimal,
  growthRate: Decimal,
  quantity: Decimal,
  amountToPurchase: Decimal
) => {
  return Decimal.sumGeometricSeries(
    amountToPurchase,
    baseCost,
    growthRate,
    quantity
  );
};

const getMaxAffordable = (
  baseCost: Decimal,
  growthRate: Decimal,
  quantity: Decimal,
  currency: Decimal
) => {
  return Decimal.affordGeometricSeries(
    currency,
    baseCost,
    growthRate,
    quantity
  );
};

export { getTotalCost, getMaxAffordable };
