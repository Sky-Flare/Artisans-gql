export const createShopMutation = `
mutation CreateShop($createShopInput: CreateShopInput!, $inputHoraireShop: [InputHoraireShop!]) {
  createShop(CreateShopInput: $createShopInput, InputHoraireShop: $inputHoraireShop) {
    name
  }
}`;
