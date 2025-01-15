import { ItemSidebarNav, ReusableSidebar } from '~/components/reusable-sidebar'
import {
  DocumentFilled,
  DocumentRegular,
  FolderFilled,
  FolderRegular,
  PersonFilled,
  PersonRegular
} from '@fluentui/react-icons'
import { useAuth } from '~/store/auth'

export const EdasSidebar = () => {
  const { user: authUser } = useAuth()
  return (
    <ReusableSidebar homePath="/m/edas" title="Edas">
      <nav className="pr-2 py-2 px-3">
        <ItemSidebarNav
          has="edas:my"
          avatar={authUser.photoURL}
          href="/m/edas/my"
        >
          Mis edas
        </ItemSidebarNav>
        <ItemSidebarNav
          has="edas:collaborators"
          icon={PersonRegular}
          iconActive={PersonFilled}
          href="/m/edas/collaborators"
        >
          Colaboradores
        </ItemSidebarNav>
        <ItemSidebarNav
          has="edas:show"
          icon={FolderRegular}
          iconActive={FolderFilled}
          href="/m/edas"
        >
          Edas
        </ItemSidebarNav>
        <div className="font-semibold px-5 pt-5 pb-2">Ajustes y otros</div>
        <ItemSidebarNav
          has="edas:years"
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/edas/terminals"
        >
          Años
        </ItemSidebarNav>
        <ItemSidebarNav
          has="edas:questionnaires"
          icon={DocumentRegular}
          iconActive={DocumentFilled}
          href="/m/edas/questionnaires"
        >
          Cuestionarios
        </ItemSidebarNav>
      </nav>
    </ReusableSidebar>
  )
}
