/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { FormValues } from './form'
import {
  Avatar,
  Button,
  Combobox,
  Field,
  Option,
  Spinner
} from '@fluentui/react-components'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { RmData } from '~/types/RmData'
import React from 'react'
import { AddFilled } from '@fluentui/react-icons'
import { toast } from 'anni'
import { useDebounced } from '~/hooks/use-debounced'

export default function AreaForm({
  control,
  setValue,
  readOnly
}: {
  control: Control<FormValues, any>
  setValue: UseFormSetValue<FormValues>
  readOnly: boolean
}) {
  const [q, setQ] = React.useState('')
  const { data, isLoading, refetch } = useQuery<RmData[]>({
    queryKey: ['areas', 'rm', q],
    queryFn: async () => {
      const res = await api.get<RmData[]>(`rm/areas?q=${q ? q : ''}`)
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new RmData(data))
    }
  })

  const { mutate: create } = useMutation({
    mutationKey: ['areas', 'rm', 'create', q],
    mutationFn: () =>
      api.post<RmData>('rm/areas/store', {
        data: JSON.stringify({ name: q }),
        alreadyHandleError: false
      }),
    onSuccess: (res) => {
      if (res.ok) refetch()
    },
    onError: () => {
      setValue('area', null as any)
      toast.error('Error al crear')
    }
  })

  const { onChange } = useDebounced({
    onCompleted: (e) => {
      setValue('area', null as any)
      setQ(e)
    }
  })

  return (
    <Controller
      control={control}
      rules={{ required: 'Requerido' }}
      name="area"
      render={({ field, fieldState: { error } }) => (
        <Field
          validationState={error ? 'error' : 'none'}
          validationMessage={error?.message}
          label="Área"
          orientation="horizontal"
          required
        >
          <Combobox
            onOpenChange={() => {
              setQ('')
            }}
            readOnly={readOnly}
            open={readOnly ? false : undefined}
            input={{
              autoComplete: 'off'
            }}
            onOptionSelect={async (_, option) => {
              if (!option.optionValue) field.onChange(null)
              field.onChange(option.optionValue)
              setQ('')
            }}
            defaultValue={field.value ? field.value : ''}
            defaultSelectedOptions={field.value ? [field.value] : undefined}
            onInput={onChange}
          >
            {isLoading ? (
              <div className="p-5 grid place-content-center">
                <Spinner />
              </div>
            ) : data && data.length > 0 ? (
              data.map((d) => (
                <Option text={d.name} key={d.name} value={d.name}>
                  <Avatar color="colorful" name={d.name} />
                  <p className="font-medium">{d.name}</p>
                </Option>
              ))
            ) : (
              <Button
                style={{
                  justifyContent: 'flex-start'
                }}
                onClick={() => {
                  setValue('area', q)
                  create()
                }}
                appearance="transparent"
                icon={<AddFilled />}
              >
                Registrar "{q}"
              </Button>
            )}
          </Combobox>
        </Field>
      )}
    />
  )
}
