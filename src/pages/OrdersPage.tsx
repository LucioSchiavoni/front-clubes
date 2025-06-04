import { OrderList } from '@/components/orders/OrderList'
import DefaultLayout from '@/layouts/default'

const OrdersPage = () => {
  return (
    <DefaultLayout>
            <OrderList/>
    </DefaultLayout>

  )
}

export default OrdersPage