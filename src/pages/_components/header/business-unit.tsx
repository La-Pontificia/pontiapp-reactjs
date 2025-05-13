import {
  Menu,
  MenuItemRadio,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Persona
} from '@fluentui/react-components'
import { CaretDownFilled } from '@fluentui/react-icons'
import React from 'react'
import { useAuth } from '@/store/auth'

export default function BusinessUnitToggle() {
  const { businessUnits, businessUnit, handleToggleBusinessUnit } = useAuth()
  const [open, setOpen] = React.useState(false)

  return (
    <div className="px-2">
      <Menu
        checkedValues={{
          a: businessUnit ? [businessUnit.id] : []
        }}
        open={open}
        onOpenChange={(_, e) => setOpen(e.open)}
      >
        <MenuTrigger disableButtonEnhancement>
          <button
            onClick={() => setOpen(!open)}
            className="flex bg-sky-400/40 text-left dark:bg-sky-500/20 p-1.5 rounded-xl overflow-hidden items-center gap-2"
          >
            <img
              className="max-h-[25px] max-w-[100px]"
              src={businessUnit?.logoURLSquare}
              alt=""
            />
            <div className="flex flex-col">
              <p className="leading-4 font-semibold">
                {businessUnit?.acronym ?? 'Seleccionar'}
              </p>
              <p className="w-[12ch] opacity-70 text-xs leading-3 text-nowrap overflow-hidden text-ellipsis">
                {businessUnit?.name ?? 'Seleccionar'}
              </p>
            </div>
            <CaretDownFilled />
          </button>
        </MenuTrigger>
        <MenuPopover>
          <p className="text-xs opacity-70 px-3 py-2">
            Algunos modulos requieren una unidad de negocio por defecto, por
            favor selecciona una.
          </p>
          <MenuList>
            {businessUnits.map((item) => (
              <MenuItemRadio
                value={item.id}
                name="a"
                key={item.id}
                onClick={() => handleToggleBusinessUnit(item)}
              >
                <Persona
                  avatar={{
                    className: '!rounded-md',
                    image: {
                      className: 'p-1',
                      src: item.logoURLSquare
                    }
                  }}
                  name={item.acronym}
                  secondaryText={item.name}
                />
              </MenuItemRadio>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  )
}
