import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { 
  IconEdit, 
  IconTrash, 
  IconEye, 
  IconCheck, 
  IconX, 
  IconPrinter,
  IconCopy 
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useCommandeActions } from '../context/commande-context'
import { Commande } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<Commande>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const {
    openView,
    openEdit,
    openDelete,
    openValidate,
    openCancel
  } = useCommandeActions()

  const commande = row.original

  // Fonction pour copier l'ID de la commande
  const copyCommandeId = async () => {
    if (commande.id) {
      await navigator.clipboard.writeText(commande.id.toString())
      // Vous pourriez ajouter un toast ici
    }
  }

  // Fonction pour imprimer la commande (placeholder)
  const printCommande = () => {
    // Logique d'impression à implémenter
    console.log('Impression de la commande', commande.id)
  }

  // Déterminer quelles actions sont disponibles selon l'état de la commande
  // (vous pourriez avoir un champ 'statut' dans votre entité)
  const canEdit = true // À adapter selon votre logique métier
  const canDelete = true // À adapter selon votre logique métier
  const canValidate = true // À adapter selon le statut
  const canCancel = true // À adapter selon le statut

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        {/* Actions de visualisation */}
        <DropdownMenuItem
          onClick={() => openView(commande)}
        >
          Voir les détails
          <DropdownMenuShortcut>
            <IconEye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={copyCommandeId}
        >
          Copier l'ID
          <DropdownMenuShortcut>
            <IconCopy size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={printCommande}
        >
          Imprimer
          <DropdownMenuShortcut>
            <IconPrinter size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Actions de modification */}
        {canEdit && (
          <DropdownMenuItem
            onClick={() => openEdit(commande)}
          >
            Modifier
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        {/* Actions de gestion du statut */}
        {canValidate && (
          <DropdownMenuItem
            onClick={() => openValidate(commande)}
            className="text-green-600"
          >
            Valider
            <DropdownMenuShortcut>
              <IconCheck size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        {canCancel && (
          <DropdownMenuItem
            onClick={() => openCancel(commande)}
            className="text-orange-600"
          >
            Annuler
            <DropdownMenuShortcut>
              <IconX size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Action de suppression */}
        {canDelete && (
          <DropdownMenuItem
            onClick={() => openDelete(commande)}
            className="text-red-600 focus:text-red-600"
          >
            Supprimer
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}