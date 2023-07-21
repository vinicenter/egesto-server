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

  const weight = product.production?.formulation.reduce((acc, curr) => {
    return (acc = acc + (curr?.considerInWeightCalculation ? curr.value : 0));
  }, 0);

  console.log(formulationCost, weight, product.unit.weight);

  const productCost = (formulationCost / weight) * product.unit.weight;

  return {
    unitCost: productCost,
    packCost: productCost * product.pack.numberOfUnitsInPack,
    weightPerFormulation: weight,
  };
};
