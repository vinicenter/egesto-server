export const populateFormulation = [
  {
    path: 'feedstocks',
    populate: 'feedstock',
  },
  {
    path: 'products',
    populate: {
      path: 'product',
      populate: {
        path: 'production',
        populate: {
          path: 'formulation',
          populate: [
            {
              path: 'feedstocks',
              populate: 'feedstock',
            },
          ],
        },
      },
    },
  },
];
