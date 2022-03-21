export class Order {
  id!: number
  user_id!: number
  products!: Array<number>
  totalPrice!: number
  date!: Date
}
