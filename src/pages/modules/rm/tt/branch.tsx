/* eslint-disable @typescript-eslint/no-explicit-any */
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { FormValues } from './form'
import {
  Combobox,
  Field,
  Option,
  Persona,
  Spinner
} from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/lib/api'
import { RmData } from '~/types/RmData'
import React from 'react'
import { useDebounced } from '~/hooks/use-debounced'

export default function BranchForm({
  control,
  setValue,
  readOnly
}: {
  control: Control<FormValues, any>
  setValue: UseFormSetValue<FormValues>
  readOnly: boolean
}) {
  const [q, setQ] = React.useState('')
  const { data, isLoading } = useQuery<RmData[]>({
    queryKey: ['branches', 'rm', q],
    queryFn: async () => {
      const res = await api.get<RmData[]>(`rm/branches?q=${q ? q : ''}`)
      if (!res.ok) {
        return []
      }
      return res.data.map((data) => new RmData(data))
    }
  })

  const { onChange } = useDebounced({
    onCompleted: (e) => {
      setValue('branch', null as any)
      setQ(e)
    }
  })

  return (
    <Controller
      control={control}
      rules={{ required: 'Requerido' }}
      name="branch"
      render={({ field, fieldState: { error } }) => (
        <Field
          validationState={error ? 'error' : 'none'}
          validationMessage={error?.message}
          label="Sede"
          orientation="horizontal"
          required
        >
          <Combobox
            onOpenChange={() => {
              setQ('')
            }}
            input={{
              autoComplete: 'off'
            }}
            readOnly={readOnly}
            open={readOnly ? false : undefined}
            onOptionSelect={async (_, option) => {
              if (!option.optionValue) field.onChange(null)
              field.onChange(option.optionValue)
              setQ('')
            }}
            defaultValue={
              field.value ? data?.find((e) => e.id === field.value)?.name : ''
            }
            defaultSelectedOptions={field.value ? [field.value] : undefined}
            onInput={onChange}
          >
            {isLoading ? (
              <div className="p-5 grid place-content-center">
                <Spinner />
              </div>
            ) : (
              data &&
              data.length > 0 &&
              data.map((d) => (
                <Option text={d.name} key={d.id} value={d.id}>
                  <Persona
                    avatar={{
                      name: d.name,
                      color: 'colorful'
                    }}
                    secondaryText={d.address}
                    name={d.name}
                  />
                </Option>
              ))
            )}
          </Combobox>
        </Field>
      )}
    />
  )
}
