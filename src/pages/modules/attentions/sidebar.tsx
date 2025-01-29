import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  BoardSplitFilled,
  BoardSplitRegular,
  BuildingFilled,
  BuildingRegular,
  DeviceMeetingRoomFilled,
  DeviceMeetingRoomRegular,
  DocumentTableFilled,
  DocumentTableRegular,
  PersonSupportFilled,
  PersonSupportRegular,
  SparkleFilled,
  SparkleRegular,
  TaskListSquarePersonFilled,
  TaskListSquarePersonRegular,
  TicketDiagonalFilled,
  TicketDiagonalRegular
} from '@fluentui/react-icons'

export default function AttentionsSidenar() {
  return (
    <ReusableSidebar homePath="/m/attentions" title="Atenciones y tickets">
      <nav className="pr-2 py-2 px-3">
        <ItemSidebarNav
          icon={SparkleRegular}
          iconActive={SparkleFilled}
          has={['attentions:register']}
          href="/m/attentions/register"
        >
          Registro Rápido
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['attentions:answerTickets']}
          icon={PersonSupportRegular}
          iconActive={PersonSupportFilled}
          href="/m/attentions/answer-tickets"
        >
          Iniciar atención
        </ItemSidebarNav>
        <ItemSidebarNav
          has={['attentions:shiftScreen']}
          icon={DeviceMeetingRoomRegular}
          iconActive={DeviceMeetingRoomFilled}
          href="/m/attentions/shift-screen"
        >
          Pantalla de Turnos
        </ItemSidebarNav>

        <ItemSidebarNav
          has={['attentions:show']}
          icon={TaskListSquarePersonRegular}
          iconActive={TaskListSquarePersonFilled}
          href="/m/attentions"
        >
          Atenciones
        </ItemSidebarNav>

        <ItemSidebarNav
          has={['attentions:tickets']}
          icon={TicketDiagonalRegular}
          iconActive={TicketDiagonalFilled}
          href="/m/attentions/tickets"
        >
          Tickets
        </ItemSidebarNav>

        <ItemSidebarNav
          has={['attentions:reportFiles']}
          icon={DocumentTableRegular}
          iconActive={DocumentTableFilled}
          href="/m/attentions/report-files"
        >
          Archivos de reportes
        </ItemSidebarNav>

        <div className="font-semibold pl-4 pt-5 pb-2 dark:text-blue-400 text-blue-700 text-xs">
          Ajustes
        </div>
        <ItemSidebarNav
          has={['attentions:positions']}
          icon={BoardSplitRegular}
          iconActive={BoardSplitFilled}
          href="/m/attentions/positions"
        >
          Puestos de Atención
        </ItemSidebarNav>

        <ItemSidebarNav
          has={['attentions:businessUnits']}
          icon={BuildingRegular}
          iconActive={BuildingFilled}
          href="/m/attentions/business-units"
        >
          Uni. de Negocios
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
