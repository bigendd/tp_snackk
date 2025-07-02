// 📁 src/features/categories/components/categories-columns.tsx
import { ColumnDef } from '@tanstack/react-table'
import { Category } from '../data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Category>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Sélectionner tout'
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
        aria-label='Sélectionner la ligne'
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
    accessorKey: 'nom',
    header: () => <div>Nom</div>,
    cell: ({ row }) => (
      <div className='w-fit text-nowrap font-medium'>{row.getValue('nom')}</div>
    ),
  },
  {
    accessorKey: 'disponible',
    header: () => <div>Statut</div>,
    cell: ({ row }) => {
      const isDisponible: boolean = row.getValue('disponible')
      return (
        <Badge 
          variant={isDisponible ? 'default' : 'secondary'}
          className={cn(
            'text-xs',
            isDisponible 
              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          )}
        >
          {isDisponible ? 'Disponible' : 'Indisponible'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const disponible: boolean = row.getValue(id)
      return value.includes(disponible.toString())
    },
  },


  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]