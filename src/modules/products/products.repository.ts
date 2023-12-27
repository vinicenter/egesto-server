import { ProductModelType } from './interfaces/product.interface';

export const calculateTotalCost = (product: ProductModelType) => {
  const formulationCost = product.production?.formulation.reduce(
    (acc, curr) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return acc + curr.value * curr.feedstock?.priceWithoutIcms;
    },
    0,
  );

  const totalVolume = product.production?.formulation.reduce((acc, curr) => {
    return (acc = acc + (curr?.considerInVolumeProduced ? curr.value : 0));
  }, 0);

  const weightFormulation = product.production?.formulation.reduce(
    (acc, curr) => {
      return (acc = acc + (curr?.considerInWeightCalculation ? curr.value : 0));
    },
    0,
  );

  const productCost =
    (formulationCost / weightFormulation) * product.unit.weight;

  const weightPerFormulation = totalVolume * product.unit.weight;

  const packCostMultiplier = product.production?.useCustomPackCostMultiplier
    ? product.production?.useCustomPackCostMultiplier
    : product.pack.numberOfUnitsInPack;

  return {
    unitCost: productCost,
    packCost: productCost * packCostMultiplier,
    weightPerFormulation,
    isWeightPerFormulationValid:
      weightPerFormulation.toFixed(2) === weightFormulation.toFixed(2),
    weightFormulationDifference: weightPerFormulation - weightFormulation,
  };
};
