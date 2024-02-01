import { ProductModelType } from './interfaces/product.interface';

type GetTotalValueParam = Partial<{
  value: number;
  considerInVolumeProduced: boolean;
  considerInWeightCalculation: boolean;
}>;

const getTotalVolume = (values?: GetTotalValueParam[]) => {
  if (!values) return 0;

  return values.reduce((acc, curr) => {
    return (acc = acc + (curr?.considerInVolumeProduced ? curr.value : 0));
  }, 0);
};

const getTotalWeight = (values?: GetTotalValueParam[]) => {
  if (!values) return 0;

  return values.reduce((acc, curr) => {
    return (acc = acc + (curr?.considerInWeightCalculation ? curr.value : 0));
  }, 0);
};

export const calculateTotalCost = (product: ProductModelType) => {
  const formulationCostFeedstock =
    product.production?.formulation?.feedstocks.reduce((acc, curr) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return acc + curr.value * curr.feedstock?.priceWithoutIcms;
    }, 0) || 0;

  const formulationCostProduct =
    product.production?.formulation?.products.reduce((acc, curr) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return acc + curr.value * curr.product?.productionCost?.unitCost;
    }, 0) || 0;

  const formulationCost = formulationCostFeedstock + formulationCostProduct;

  const totalVolume =
    getTotalVolume(product.production?.formulation?.feedstocks) +
    getTotalVolume(product.production?.formulation?.products);

  const weightFormulation =
    getTotalWeight(product.production?.formulation?.feedstocks) +
    getTotalWeight(product.production?.formulation?.products);

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
