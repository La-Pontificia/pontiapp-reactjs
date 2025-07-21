/* eslint-disable @typescript-eslint/no-explicit-any */
export type BreadcrumbType = {
  name: string
  to: string | null
}

// import { capitalizeText } from '@/utils'
// import { ChevronRightFilled } from '@fluentui/react-icons'
// import React from 'react'
// import { Link } from 'react-router'

// export default function Breadcrumbs({
//   breadcrumbs
// }: {
//   breadcrumbs: BreadcrumbType[]
// }) {
//   return (
//     <div className="flex grow items-center gap-1">
//       {breadcrumbs.map((item, index) => (
//         <React.Fragment key={index}>
//           <div className="text-xl max-w-[17ch] tracking-tight text-nowrap overflow-hidden overflow-ellipsis">
//             {index !== breadcrumbs.length - 1 ? (
//               <Link
//                 className="hover:underline hover:text-blue-700 hover:dark:text-blue-400"
//                 to={item.to ?? ''}
//               >
//                 {capitalizeText(item.name)}
//               </Link>
//             ) : (
//               <span className="font-semibold">{capitalizeText(item.name)}</span>
//             )}
//           </div>
//           {index < breadcrumbs.length - 1 && (
//             <span className="opacity-50">
//               <ChevronRightFilled fontSize={15} />
//             </span>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   )
// }

import * as React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  partitionBreadcrumbItems,
  ButtonProps,
  makeStyles,
  Button,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
  useOverflowMenu,
  OverflowDivider,
  Tooltip,
  truncateBreadcrumbLongName,
  isTruncatableBreadcrumbContent,
  MenuItem
} from '@fluentui/react-components'
import {
  MoreHorizontalRegular,
  MoreHorizontalFilled,
  bundleIcon
} from '@fluentui/react-icons'
import type { PartitionBreadcrumbItems } from '@fluentui/react-components'
import { NavigateFunction, useNavigate } from 'react-router'
import { capitalizeText } from '@/utils'

const MoreHorizontal = bundleIcon(MoreHorizontalFilled, MoreHorizontalRegular)

type Item = {
  key: number
  item?: string
  itemProps?: {
    icon?: ButtonProps['icon']
    disabled?: boolean
    href?: string
  }
}

const useTooltipStyles = makeStyles({
  tooltip: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const OverflowGroupDivider: React.FC<{
  groupId: number
}> = (props) => {
  return (
    <OverflowDivider groupId={props.groupId.toString()}>
      <BreadcrumbDivider data-group={props.groupId} />
    </OverflowDivider>
  )
}

const renderBreadcrumbItem = (
  el: Item,
  isLastItem: boolean = false,
  navigate: NavigateFunction
) => {
  const buttonProps = {
    ...el.itemProps,
    onClick: (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      navigate(el.itemProps?.href ?? '')
    },
    className:
      '!text-lg data-[first]:!font-semibold data-[first]:!text-xl font-medium dark:data-[first]:!text-blue-400 data-[first]:!text-blue-700',
    'data-first': el.key === 0 ? '' : undefined
  }

  return (
    <React.Fragment key={`button-items-${el.key}`}>
      {isTruncatableBreadcrumbContent(el.item ?? '', 20) ? (
        <BreadcrumbItem>
          <Tooltip
            withArrow
            content={capitalizeText(el.item ?? '')}
            relationship="label"
          >
            <BreadcrumbButton {...buttonProps} current={isLastItem}>
              {truncateBreadcrumbLongName(capitalizeText(el.item ?? ''), 20)}
            </BreadcrumbButton>
          </Tooltip>
        </BreadcrumbItem>
      ) : (
        <BreadcrumbItem>
          <BreadcrumbButton {...buttonProps} current={isLastItem}>
            {el.item}
          </BreadcrumbButton>
        </BreadcrumbItem>
      )}
      {!isLastItem && <OverflowGroupDivider groupId={el.key} />}
    </React.Fragment>
  )
}

const getTooltipContent = (breadcrumbItems: readonly Item[] | undefined) => {
  if (!breadcrumbItems) {
    return ''
  }
  return breadcrumbItems.reduce((acc, initialValue, _, arr) => {
    return (
      <>
        {acc}
        {arr[0].item !== initialValue.item && ' > '}
        {initialValue.item}
      </>
    )
  }, <React.Fragment />)
}

const OverflowMenu = (
  props: PartitionBreadcrumbItems<Item> & {
    navigate: NavigateFunction
  }
) => {
  const { overflowItems, startDisplayedItems, endDisplayedItems, navigate } =
    props
  const { ref, isOverflowing, overflowCount } =
    useOverflowMenu<HTMLButtonElement>()

  const tooltipStyles = useTooltipStyles()

  if (!isOverflowing && overflowItems && overflowItems.length === 0) {
    return null
  }

  const overflowItemsCount = overflowItems
    ? overflowItems.length + overflowCount
    : overflowCount
  const tooltipContent =
    overflowItemsCount > 3
      ? `${overflowItemsCount} items`
      : {
          children: getTooltipContent(overflowItems),
          className: tooltipStyles.tooltip
        }

  return (
    <BreadcrumbItem>
      <Menu hasIcons>
        <MenuTrigger disableButtonEnhancement>
          <Tooltip withArrow content={tooltipContent} relationship="label">
            <Button
              id="menu"
              appearance="subtle"
              ref={ref}
              icon={<MoreHorizontal />}
              aria-label={`${overflowItemsCount} more items`}
              role="button"
            />
          </Tooltip>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {isOverflowing &&
              startDisplayedItems.map((item: Item) => (
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(item.itemProps?.href ?? '')
                  }}
                  id={item.key.toString()}
                  key={item.key}
                >
                  {item.item}
                </MenuItem>
              ))}
            {overflowItems &&
              overflowItems.map((item: Item) => (
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(item.itemProps?.href ?? '')
                  }}
                  id={item.key.toString()}
                  key={item.key}
                >
                  {item.item}
                </MenuItem>
              ))}
            {isOverflowing &&
              endDisplayedItems &&
              endDisplayedItems.map((item: Item) => (
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    navigate(item.itemProps?.href ?? '')
                  }}
                  id={item.key.toString()}
                  key={item.key}
                >
                  {item.item}
                </MenuItem>
              ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </BreadcrumbItem>
  )
}

const BreadcrumbOverflowExample = ({
  breadcrumbs
}: {
  breadcrumbs: BreadcrumbType[]
}) => {
  const {
    startDisplayedItems,
    overflowItems,
    endDisplayedItems
  }: PartitionBreadcrumbItems<Item> = partitionBreadcrumbItems({
    items: breadcrumbs.map((item, index) => ({
      key: index,
      item: item.name,
      itemProps: {
        href: item.to ?? ''
      }
    })),
    maxDisplayedItems: 4
  })

  const navigate = useNavigate()

  return (
    <Breadcrumb size="large" className="grow">
      {startDisplayedItems.map((item: Item) => {
        const isLastItem = item.key === breadcrumbs.length - 1
        return renderBreadcrumbItem(item, isLastItem, navigate)
      })}
      {overflowItems && (
        <>
          <OverflowMenu
            navigate={navigate}
            overflowItems={overflowItems}
            startDisplayedItems={startDisplayedItems}
            endDisplayedItems={endDisplayedItems}
          />
          <BreadcrumbDivider />
        </>
      )}
      {endDisplayedItems &&
        endDisplayedItems.map((item: Item) => {
          const isLastItem = item.key === breadcrumbs.length - 1
          return renderBreadcrumbItem(item, isLastItem, navigate)
        })}
    </Breadcrumb>
  )
}

export default BreadcrumbOverflowExample
