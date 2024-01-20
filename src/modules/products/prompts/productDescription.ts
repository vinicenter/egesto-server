import { ProductDescriptionPromptParams } from 'src/modules/products/interfaces/product.interface';

export const makeProductDescriptionPrompt = (
  params: ProductDescriptionPromptParams,
) => {
  const prompt = `
    Write me a product description using this data:

    ${params.productName ? `Product name: ${params.productName}` : ''}

    ${params.productFamily ? `Product family: ${params.productFamily}` : ''}

    ${params.brandName ? `Product brand name: ${params.brandName}` : ''}

    ${
      params.brandDescription
        ? `Product brand about: ${params.brandDescription}`
        : ''
    }

    ${
      params.oldProductDescription
        ? `Old product description: ${params.oldProductDescription}`
        : ''
    }

    - This product description will be used in the company website. This need to be a MASTERPIECE.
    - If there is an old product description, you should use it as a base to write the new one. but use creativity.
    - I need you to speak about the product and quote bit of the product brand.
    - This description should be in brazilian portuguese.
    - You should respond using only plain-text, without formatting it.
  `.trim();

  return prompt;
};
