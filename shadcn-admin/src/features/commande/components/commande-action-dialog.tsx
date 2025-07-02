'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

// 👉 Adapter ce schéma selon ton vrai modèle de commande
const formSchema = z.object({
  client: z.string().min(1, { message: 'Le nom du client est requis.' }),
  livree: z.boolean(),
})

type CommandeForm = z.infer<typeof formSchema>

interface Commande {
  id?: number
  client: string
  livree: boolean
}

interface Props {
  currentRow?: Commande
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandeActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow

  const form = useForm<CommandeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          client: currentRow.client,
          livree: currentRow.livree,
        }
      : {
          client: '',
          livree: false,
        },
  })

  const onSubmit = (values: CommandeForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isEdit ? 'Modifier la commande' : 'Ajouter une commande'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Modifiez les informations de la commande ici.'
              : 'Créez une nouvelle commande ici.'}
            Cliquez sur sauvegarder quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <Form {...form}>
            <form
              id='commande-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='client'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Client</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nom du client'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='livree'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Livrée</FormLabel>
                    <FormControl>
                      <div className='col-span-4 flex items-center'>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className='ml-3 text-sm text-gray-600'>
                          {field.value ? 'Oui' : 'Non'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type='submit' form='commande-form'>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
