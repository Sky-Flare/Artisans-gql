export const createCategoryShopMutation = `
mutation CreateCategoryShop($categoryShopInput: CategoryShopInput!) {
  createCategoryShop(CategoryShopInput: $categoryShopInput) {
     name
     picture
  }
}`;

export const categoriesShopQuery = `query categoryShop {
  categories_shop {
    name
    picture
  }
}`;
