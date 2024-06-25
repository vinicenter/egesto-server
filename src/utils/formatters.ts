import { ProductModelType } from 'src/modules/products/interfaces/product.interface';

export function formatCnpjCpf(value: string) {
  const cnpjCpf = value.replace(/\D/g, '');

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    '$1.$2.$3/$4-$5',
  );
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    maximumFractionDigits: 5,
    minimumFractionDigits: 5,
  }).format(value);
}

export const getProductUnitPrice = (
  price: number,
  product: ProductModelType,
) => {
  return (
    price /
    (product?.production?.useCustomPackCostMultiplier ||
      product?.pack?.numberOfUnitsInPack ||
      0)
  );
};
