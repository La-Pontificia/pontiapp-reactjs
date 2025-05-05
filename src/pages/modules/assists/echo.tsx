import React from 'react'
import { api } from '@/lib/api'

export default function WebSocketExample() {
  const [message] = React.useState<string | null>(null)
  // const [count, setCount] = React.useState(0)

  const handleSendMessage = () => {
    void api.post('tests/websocket/message', {
      data: JSON.stringify({
        message:
          'El reporte de asistencias ya esta lista, puedes descargarlo desde aquí.'
      })
    })
  }
  return (
    <div>
      <h1>WebSocket Example</h1>
      <p>{message}</p>

      <button onClick={handleSendMessage}>Enviar mensaje</button>
    </div>
  )
}
