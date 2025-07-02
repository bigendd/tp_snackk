// 📁 src/features/users/components/users-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { User } from '../data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import LongText from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: 'id',
    header: () => <div>ID</div>,
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'email',
    header: () => <div>Email</div>,
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'userIdentifier',
    header: () => <div>User Identifier</div>,
    cell: ({ row }) => <div>{row.getValue('userIdentifier')}</div>,
  },
  {
    accessorKey: 'roles',
    header: () => <div>Roles</div>,
    cell: ({ row }) => {
      const roles: string[] = row.getValue('roles')
      return (
        <div className='flex flex-wrap gap-1'>
          {roles.map((role) => (
            <span
              key={role}
              className='rounded bg-muted px-2 py-0.5 text-xs font-medium'
            >
              {role.replace('ROLE_', '').toLowerCase()}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const roles: string[] = row.getValue(id)
      return roles.some((role) => value.includes(role))
    },
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
