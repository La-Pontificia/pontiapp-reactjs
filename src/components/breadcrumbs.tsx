export type BreadcrumbType = {
  name: string
  to: string | null
}

import { ChevronRightFilled } from '@fluentui/react-icons'
import React from 'react'
import { Link } from 'react-router'

export default function Breadcrumbs({
  breadcrumbs
}: {
  breadcrumbs: BreadcrumbType[]
}) {
  return (
    <div className="flex grow items-center gap-1">
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <div className="text-xl max-w-[17ch] tracking-tight text-nowrap overflow-hidden overflow-ellipsis">
            {index !== breadcrumbs.length - 1 ? (
              <Link
                className="hover:underline hover:text-blue-700 hover:dark:text-blue-400"
                to={item.to ?? ''}
              >
                {item.name}
              </Link>
            ) : (
              <span className="font-semibold">{item.name}</span>
            )}
          </div>
          {index < breadcrumbs.length - 1 && (
            <span className="opacity-50">
              <ChevronRightFilled fontSize={15} />
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
