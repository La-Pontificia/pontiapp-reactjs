'use client'

import * as React from 'react'
import {
  Table as TablePrimitive,
  TableBody as TableBodyPrimitive,
  TableHeader as TableHeaderPrimitive,
  TableHeaderCell as TableHeaderCellPrimitive,
  TableRow as TableRowPrimitive,
  TableSelectionCell as TableSelectionCellPrimitive,
  TableCellLayout as TableCellLayoutPrimitive,
  TableCell as TableCellPrimitive
} from '@fluentui/react-components'

import { cn } from '~/utils'

const Table = React.forwardRef<
  React.ElementRef<typeof TablePrimitive>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive>
>(({ className, ...props }, ref) => (
  <TablePrimitive ref={ref} className={cn(className)} {...props} />
))
Table.displayName = 'Table'

const TableBody = React.forwardRef<
  React.ElementRef<typeof TableBodyPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableBodyPrimitive>
>(({ className, ...props }, ref) => (
  <TableBodyPrimitive
    ref={ref}
    className={cn(
      'divide-y !divide-stone-500/10 dark:!divide-stone-500/60',
      className
    )}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableHeader = React.forwardRef<
  React.ElementRef<typeof TableHeaderPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableHeaderPrimitive>
>(({ className, ...props }, ref) => (
  <TableHeaderPrimitive ref={ref} className={cn(className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableHeaderCell = React.forwardRef<
  React.ElementRef<typeof TableHeaderCellPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableHeaderCellPrimitive>
>(({ className, ...props }, ref) => (
  <TableHeaderCellPrimitive
    ref={ref}
    className={cn('text-sm !font-semibold', className)}
    {...props}
  />
))
TableHeaderCell.displayName = 'TableHeaderCell'

const TableRow = React.forwardRef<
  React.ElementRef<typeof TableRowPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableRowPrimitive>
>(({ className, ...props }, ref) => (
  <TableRowPrimitive ref={ref} className={cn(className)} {...props} />
))
TableRow.displayName = 'TableRow'

const TableSelectionCell = React.forwardRef<
  React.ElementRef<typeof TableSelectionCellPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableSelectionCellPrimitive>
>(({ className, ...props }, ref) => (
  <TableSelectionCellPrimitive
    ref={ref}
    className={cn('!py-1 semibold', className)}
    {...props}
  />
))
TableSelectionCell.displayName = 'TableSelectionCell'

const TableCellLayout = React.forwardRef<
  React.ElementRef<typeof TableCellLayoutPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableCellLayoutPrimitive>
>(({ className, ...props }, ref) => (
  <TableCellLayoutPrimitive
    ref={ref}
    className={cn('font-medium', className)}
    {...props}
  />
))
TableCellLayout.displayName = 'TableCellLayout'

const TableCell = React.forwardRef<
  React.ElementRef<typeof TableCellPrimitive>,
  React.ComponentPropsWithoutRef<typeof TableCellPrimitive>
>(({ className, ...props }, ref) => (
  <TableCellPrimitive ref={ref} className={cn('!py-1', className)} {...props} />
))
TableCell.displayName = 'TableCell'

export {
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableSelectionCell,
  TableCellLayout,
  TableCell
}
