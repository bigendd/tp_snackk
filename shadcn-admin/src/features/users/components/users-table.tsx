import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface UsersTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
}

export function UsersTable<TData>({ data, columns }: UsersTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  const roleColumn = table.getColumn('roles')

  const roleFilterOptions = [
    { label: 'User', value: 'ROLE_USER' },
    { label: 'Admin', value: 'ROLE_ADMIN' },
    { label: 'Super Admin', value: 'ROLE_SUPER_ADMIN' },
  ]

  return (
    <div className='space-y-4 w-full'>
      <div className='flex flex-wrap items-center gap-2'>
        {roleColumn && (
          <DataTableFacetedFilter
            column={roleColumn}
            title='Rôle'
            options={roleFilterOptions}
          />
        )}

        {table.getState().columnFilters.length > 0 && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Réinitialiser les filtres
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
