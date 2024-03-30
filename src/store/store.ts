import {create} from 'zustand';

export type Product = {
  brandName: string;
  colour: string;
  description: string;
  id: string;
  mainImage: string;
  name: string;
  price: {
    amount: string;
    currency: string;
  };
  quantity?: string;
  sizes: number[];
  stockStatus: string;
  SKU: string;
};

export type ProductStore = {
  products: Product[];
  productByKeys: {[id: string]: Product};
  productsInCart: {
    [id: string]: {
      totalQuantity: number;
      sizes: {[id: string]: {quantity: number}};
    };
  };
  fetchProducts: Function;
  addToCart: Function;
  removeFromCart: Function;
  removeItem: Function;
};

const productStore = create<ProductStore>(set => ({
  products: [],
  productByKeys: {},
  productsInCart: {},
  fetchProducts: async () => {
    try {
      fetch(
        'https://s3-eu-west-1.amazonaws.com/api.themeshplatform.com/products.json',
      )
        .then(response => response.json())
        .then(data => {
          const products: ProductStore['products'] = data?.data;
          const productByKeys = products.reduce((acc, curValue) => {
            if (acc?.[curValue?.id]) return;
            return {
              ...acc,
              [curValue?.id]: curValue,
            };
          }, {});
          set({products});
          set({productByKeys});
        });
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  },

  addToCart: (productId: string, selectedSize: number) =>
    set(state => {
      if (state.productsInCart?.[productId]) {
        if (state.productsInCart?.[productId]?.sizes?.[selectedSize]) {
          return {
            productsInCart: {
              ...state.productsInCart,
              [productId]: {
                ...state.productsInCart?.[productId],
                totalQuantity:
                  state.productsInCart?.[productId]?.totalQuantity + 1,
                sizes: {
                  ...state.productsInCart?.[productId]?.sizes,
                  [selectedSize]: {
                    ...state.productsInCart?.[productId]?.sizes?.[selectedSize],
                    quantity:
                      state.productsInCart?.[productId]?.sizes?.[selectedSize]
                        ?.quantity + 1,
                  },
                },
              },
            },
          };
        }
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              ...state.productsInCart?.[productId],
              totalQuantity:
                state.productsInCart?.[productId]?.totalQuantity + 1,
              sizes: {
                ...state.productsInCart?.[productId]?.sizes,
                [selectedSize]: {quantity: 1},
              },
            },
          },
        };
      } else {
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              totalQuantity: 1,
              sizes: {
                [selectedSize]: {quantity: 1},
              },
            },
          },
        };
      }
    }),
  removeFromCart: (productId: string, selectedSize: number) =>
    set(state => {
      if (
        state.productsInCart?.[productId]?.sizes?.[selectedSize]?.quantity > 1
      ) {
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              ...state.productsInCart?.[productId],
              totalQuantity:
                state.productsInCart?.[productId]?.totalQuantity - 1,
              sizes: {
                ...state.productsInCart?.[productId]?.sizes,
                [selectedSize]: {
                  ...state.productsInCart?.[productId]?.sizes?.[selectedSize],
                  quantity:
                    state.productsInCart?.[productId]?.sizes?.[selectedSize]
                      ?.quantity - 1,
                },
              },
            },
          },
        };
      } else {
        return {
          productsInCart: {...state.productsInCart},
        };
      }
    }),
  removeItem: (productId: string, selectedSize: number) =>
    set(state => {
      const {[productId]: __, ...productsInCart} = state.productsInCart;
      const {[selectedSize]: _, ...rest} =
        state.productsInCart?.[productId]?.sizes;
      if (Object.keys(rest).length < 1) {
        return {
          productsInCart,
        };
      } else {
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              ...state.productsInCart?.[productId],
              totalQuantity:
                state.productsInCart?.[productId]?.totalQuantity -
                state.productsInCart?.[productId]?.sizes?.[selectedSize]
                  ?.quantity,
              sizes: rest,
            },
          },
        };
      }
    }),
}));

export default productStore;
