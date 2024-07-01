"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currency, Curriencies } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { UserSettings } from "@prisma/client"
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings"
import { toast } from "sonner"



export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOptions, setSelectedOptions] = React.useState<Currency | null>(
    null
  )

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: () => fetch('/api/user-settings').then(res => res.json()),
  })

  React.useEffect(()=>{
    if(!userSettings.data) return;
    const userCurrency = Curriencies.find(
      (currency)=>currency.value===userSettings.data.currency
    )
    if(userCurrency) setSelectedOptions(userCurrency);
  },[userSettings.data]);

  const mutation = useMutation({
    mutationFn:UpdateUserCurrency,
    onSuccess:(data:UserSettings)=>{
      toast.success('Currency updated successfully',{
        id:'update-currency'
      });

      setSelectedOptions(
        Curriencies.find(c=>c.value===data.currency) || null
      );
    },
    onError:(e)=>{
      toast.error('Something went wrong',{
        id:'update-currency'
      });
    }
  });
  

  const selectOption = React.useCallback((currency:Currency | null)=>{
    if(!currency){
      toast.error('Please select a currency');
      return;
    }
    toast.loading('Updating currency...',{
      id:'update-currency',
    });
    mutation.mutate(currency.value)
  },[mutation])

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
              {selectedOptions ? <>{selectedOptions.label}</> : <>Set Currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CurrencyList setOpen={setOpen} selectOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
            {selectedOptions ? <>{selectedOptions.label}</> : <>Set currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <CurrencyList setOpen={setOpen} selectOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}

function CurrencyList({
  setOpen,
  selectOption,
}: {
  setOpen: (open: boolean) => void
  selectOption: (currency: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Curriencies.map((currency) => (
            <CommandItem
              key={currency.label}
              value={currency.label}
              onSelect={(value) => {
                selectOption(
                  Curriencies.find((currency) => currency.label === value) || null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
