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
  productsInCart: {[id: string]: {quantity: number}};
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
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              ...state.productsInCart?.[productId],
              quantity: state.productsInCart?.[productId]?.quantity + 1,
            },
          },
        };
      } else {
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {quantity: 1},
          },
        };
      }
    }),
  removeFromCart: (productId: string) =>
    set(state => {
      if (state.productsInCart?.[productId]?.quantity > 1) {
        return {
          productsInCart: {
            ...state.productsInCart,
            [productId]: {
              ...state.productsInCart?.[productId],
              quantity: state.productsInCart?.[productId]?.quantity - 1,
            },
          },
        };
      } else {
        return {
          productsInCart: {...state.productsInCart},
        };
      }
    }),
  removeItem: (productId: string) =>
    set(state => {
      const {[productId]: _, ...rest} = state.productsInCart;
      return {
        productsInCart: rest,
      };
    }),
}));

export default productStore;
