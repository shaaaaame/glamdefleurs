import placeholder from '../assets/img/Placeholder.jpg';

export function getProduct(productId){
    return PRODUCTS[productId]
}

// stores a list of product ids where product is popular
export const POPULAR_PRODUCTS = [2, 3]

export const PRODUCTS = {
    1: {
        productId: 1,
        productName: "Flowers",
        productPrice: 40,
        productImg: placeholder,
        productDesc: "Some nice flowers :D",
        productCategory: {
            main: 'weddings',
            child: 'ceremonies'
        },
    },
    2: {
        productId: 2,
        productName: "Flowers",
        productPrice: 50,
        productImg: placeholder,
        productDesc: "flower 2",
        productCategory: {
            main: 'weddings',
            child: 'ceremonies'
        },
    },
    3: {
        productId: 3,
        productName: "Birthday Flowers",
        productPrice: 10,
        productImg: placeholder,
        productDesc: "flower 3",
        productCategory: {
            main: 'special_occasions',
            child: 'birthdays'
        },
    },
}