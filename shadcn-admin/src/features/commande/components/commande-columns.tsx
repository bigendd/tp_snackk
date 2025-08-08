import { ColumnDef } from '@tanstack/react-table'
import { Commande } from '../data/schema'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<Commande>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
        className="translate-y-[2px]"
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
        aria-label="Sélectionner la ligne"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto hover:bg-transparent"
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        CMD-{row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto hover:bg-transparent"
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return (
        <div className="text-sm">
          <div className="font-medium">
            {date.toLocaleDateString('fr-FR')}
          </div>
          <div className="text-muted-foreground text-xs">
            {date.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )
    },
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'user.nom',
    header: () => <div>Client</div>,
    cell: ({ row }) => {
      const commande = row.original
      return (
        <div className="w-fit text-nowrap">
          {commande.user?.nom || (
            <span className="text-muted-foreground italic">
              Client anonyme
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'modeCons',
    header: () => <div>Mode</div>,
    cell: ({ row }) => {
      const mode: string = row.getValue('modeCons')
      const modeLabels = {
        'SUR_PLACE': 'Sur place',
        'A_EMPORTER': 'À emporter',
        'LIVRAISON': 'Livraison'
      }
      
      const modeColors = {
        'SUR_PLACE': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        'A_EMPORTER': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        'LIVRAISON': 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      }

      return (
        <Badge
          variant="secondary"
          className={cn(
            'text-xs font-medium',
            modeColors[mode as keyof typeof modeColors]
          )}
        >
          {modeLabels[mode as keyof typeof modeLabels] || mode}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const mode: string = row.getValue(id)
      return value.includes(mode)
    },
  },
  {
    accessorKey: 'moyenPaiment',
    header: () => <div>Paiement</div>,
    cell: ({ row }) => {
      const moyen: string = row.getValue('moyenPaiment')
      const moyenLabels = {
        'CARTE': 'Carte',
        'ESPECE': 'Espèces',
        'CHEQUE': 'Chèque',
        'VIREMENT': 'Virement'
      }

      return (
        <span className="text-sm">
          {moyenLabels[moyen as keyof typeof moyenLabels] || moyen}
        </span>
      )
    },
  },
  {
    id: 'totalTTC',
    accessorFn: (row) => row.commandeInfo?.totalTTC,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 h-auto hover:bg-transparent"
      >
        Total
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = row.original.commandeInfo?.totalTTC || 0
      return (
        <div className="font-semibold text-right">
          {total.toFixed(2)} €
        </div>
      )
    },
    sortingFn: 'basic',
  },
  {
    id: 'nbArticles',
    accessorFn: (row) => row.commandeProduits?.length || 0,
    header: () => <div className="text-center">Articles</div>,
    cell: ({ row }) => {
      const nbArticles = row.original.commandeProduits?.length || 0
      const totalQuantite = row.original.commandeProduits?.reduce(
        (sum, cp) => sum + cp.quantite, 0
      ) || 0
      
      return (
        <div className="text-center text-sm">
          <div className="font-medium">{nbArticles}</div>
          <div className="text-muted-foreground text-xs">
            ({totalQuantite} unités)
          </div>
        </div>
      )
    },
  },
  {
    id: 'statut',
    header: () => <div>Statut</div>,
    cell: ({ row }) => {
      // Exemple de logique de statut basée sur vos données
      // Vous pouvez adapter selon votre logique métier
      const commande = row.original
      const hasProducts = (commande.commandeProduits?.length || 0) > 0
      const hasTotal = (commande.commandeInfo?.totalTTC || 0) > 0
      
      let statut = 'En attente'
      let variant: 'default' | 'secondary' | 'destructive' = 'secondary'
      let colorClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'

      if (hasProducts && hasTotal) {
        statut = 'Confirmée'
        variant = 'default'
        colorClass = 'bg-green-100 text-green-800 hover:bg-green-200'
      }

      return (
        <Badge
          variant={variant}
          className={cn('text-xs font-medium', colorClass)}
        >
          {statut}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      // Logique de filtrage selon le statut
      return value.includes('confirmed') // À adapter
    },
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
    meta: {
      className: 'sticky right-0 z-10 bg-background',
    },
  },
]