import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogActions,
  Textarea
} from '@fluentui/react-components'
import {
  ArrowRightFilled,
  DocumentRegular,
  ScreenshotRecordRegular
} from '@fluentui/react-icons'
import { toast } from 'anni'
import React from 'react'
import { useScreenshot } from '~/hooks/use-screen-capture'
import { api } from '~/lib/api'
import { useAuth } from '~/store/auth'

const options = {
  error: {
    title: 'Enviar un error ⚠️'
  },
  suggestion: {
    title: 'Enviar una sugerencia 🚀'
  }
}
export default function Feedback({
  onOpenChange,
  open
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [form, setForm] = React.useState<{
    type: keyof typeof options
    message: string | null
    file: File | null
    fileURL: string | null
  }>({
    type: 'error',
    message: null,
    file: null,
    fileURL: null
  })
  const [type, setType] = React.useState<keyof typeof options>()
  const { user: authUser } = useAuth()

  const { handleScreenshot, waiting } = useScreenshot({
    onScreenshot: (file) =>
      setForm({ ...form, file, fileURL: URL.createObjectURL(file) }),
    onFinally: () => onOpenChange(true)
  })

  const handleUploadFile = async (): Promise<string | null> => {
    if (!form.file) return null
    const f = new FormData()
    f.append('file', form.file)
    f.append('path', `users/${authUser?.id}/feedback`)

    const res = await api.image<string>('uploads/image', {
      data: f
    })
    if (!res.ok) return null
    return res.data
  }

  const handleSubmit = async () => {
    const url = await handleUploadFile()
    const scriptURL =
      'https://script.google.com/macros/s/AKfycbx7NVGRPTZdgby-cb_S7atM6UpJFyhpdQ1xMb-QnUoCavM3Tl6fi09d5BrVw_jhIUQK/exec'

    const res = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: form.type,
        user: authUser?.fullName,
        imageURL: url ?? null,
        message: form.message,
        email: authUser?.email,
        date: new Date().toISOString()
      })
    })

    if (res.ok) {
      toast.success('Mensaje enviado correctamente')
      onOpenChange(false)
      setForm({
        type: 'error',
        message: null,
        file: null,
        fileURL: null
      })
    } else {
      toast.error('Ocurrió un error al enviar el mensaje')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(_, data) => {
          onOpenChange(data.open)
        }}
        modalType="modal"
      >
        <DialogSurface className="dark:bg-black w-[500px]">
          <DialogBody>
            <DialogTitle className="font-extrabold text-lg tracking-tight">
              {type && (
                <button onClick={() => setType(undefined)} className="pr-3">
                  <ArrowRightFilled className="-rotate-180" />
                </button>
              )}
              {options[type as keyof typeof options]?.title ??
                'Envia un error o sugerencia'}
            </DialogTitle>
            <DialogContent>
              <div className="flex flex-col w-full gap-2 pt-1">
                <h2 className="text-xs opacity-50">
                  {type ? 'Escribe tu mensaje' : 'Selecciona una opción'}
                </h2>
                {type ? (
                  <div className="w-full gap-3 grid">
                    <Textarea
                      value={form.message || ''}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Escribe tu mensaje"
                      rows={7}
                    />
                    {form.file && form.fileURL && (
                      <div className="grid grid-cols-3 rounded-xl max-h-[200px] overflow-auto gap-2 items-center">
                        <div className="w-full rounded-lg overflow-hidden">
                          <img src={form.fileURL!} alt="" />
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={() => inputRef.current?.click()}
                      icon={<DocumentRegular />}
                    >
                      {form.file ? 'Cambiar archivo' : 'Adjuntar archivo'}
                    </Button>
                    <input
                      onChange={(e) => {
                        if (e.target.files) {
                          const file = e.target.files[0]
                          setForm({
                            ...form,
                            file,
                            fileURL: URL.createObjectURL(file)
                          })
                        }
                      }}
                      ref={inputRef}
                      accept="image/*"
                      type="file"
                      className="hidden"
                    />
                    <Button
                      disabled={waiting}
                      onClick={async () => {
                        onOpenChange(false)
                        await new Promise((resolve) => setTimeout(resolve, 500))
                        handleScreenshot()
                      }}
                      icon={<ScreenshotRecordRegular />}
                    >
                      Capturar pantalla
                    </Button>
                  </div>
                ) : (
                  Object.entries(options).map(([key, value]) => (
                    <button
                      className="text-left hover:bg-stone-500/10 p-3 border border-stone-500/40"
                      key={key}
                      onClick={() => setType(key as keyof typeof options)}
                    >
                      {value.title}
                    </button>
                  ))
                )}
                <p className="text-xs opacity-60">
                  Ayuda a mejorar el PontiApp, si tienes alguna sugerencia o
                  error, por favor envíalo.
                </p>
              </div>
              <DialogActions className="flex">
                <Button
                  appearance="primary"
                  disabled={!form.message || waiting}
                  onClick={handleSubmit}
                >
                  Enviar {type === 'error' ? 'error' : 'sugerencia'}
                </Button>
                <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
              </DialogActions>
            </DialogContent>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}
