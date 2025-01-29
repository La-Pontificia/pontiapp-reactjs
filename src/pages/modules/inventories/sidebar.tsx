import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  ArrowCircleDownFilled,
  ArrowCircleDownRegular,
  DocumentBulletListFilled,
  DocumentBulletListRegular,
  GiftFilled,
  GiftRegular,
  ShoppingBagFilled,
  ShoppingBagRegular
} from '@fluentui/react-icons'

export default function InventoriesSidebar() {
  return (
    <ReusableSidebar homePath="/m/inventories" title="Enfermeria">
      <nav className="pr-2 py-2 px-3">
        <ItemSidebarNav
          icon={ShoppingBagRegular}
          iconActive={ShoppingBagFilled}
          href="/m/inventories/pharmacy/items"
          has={['events:show']}
        >
          Artículos
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={GiftRegular}
          iconActive={GiftFilled}
          href="/m/inventories/pharmacy/packages"
          has={['events:show']}
        >
          Paquetes
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={ArrowCircleDownRegular}
          iconActive={ArrowCircleDownFilled}
          href="/m/inventories/pharmacy/shoppings"
          has={['events:show']}
        >
          Compras
        </ItemSidebarNav>
        <ItemSidebarNav
          icon={DocumentBulletListRegular}
          iconActive={DocumentBulletListFilled}
          href="/m/inventories/pharmacy/sales"
          has={['events:show']}
        >
          Ventas
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
