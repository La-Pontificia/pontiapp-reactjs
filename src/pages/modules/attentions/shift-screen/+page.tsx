import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import React from 'react'
import { Helmet } from 'react-helmet'
import { format } from '~/lib/dayjs'
import { fdb } from '~/lib/firebase'
import { FirebaseAttentionTicket } from '~/types/attention-ticket'

export default function AttentionsShiftScreen() {
  const [realtime, setRealtime] = React.useState<string>(
    new Date().toLocaleTimeString()
  )
  const date = React.useMemo(() => format(new Date(), 'dddd, DD [de] MMMM'), [])
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRealtime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // datas
  const [tickets, setTickets] = React.useState<FirebaseAttentionTicket[]>([])
  const [calling, setCallingTickets] = React.useState<
    FirebaseAttentionTicket[]
  >([])
  const [, setIsLoading] = React.useState(true)
  // const [businessIds, setBusinessIds] = React.useState<string[]>([])

  const getConditions = React.useMemo(() => {
    const conditions = [
      orderBy('created_at', 'asc'),
      where('created_at_date', '>=', format(new Date(), 'MM/DD/YYYY')),
      where('created_at_date', '<=', format(new Date(), 'MM/DD/YYYY')),
      where('state', 'in', ['calling', 'pending'])
    ]

    return conditions
  }, [])

  React.useEffect(() => {
    const q = query(collection(fdb, 'tickets'), ...getConditions)
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tickets: Array<any> = []
      querySnapshot.forEach((doc) => {
        tickets.push({
          ...doc.data(),
          id: doc.id
        })
      })
      setTickets(
        tickets
          .filter((t) => t.state !== 'calling')
          .map((ticket) => new FirebaseAttentionTicket(ticket))
      )

      setCallingTickets(
        tickets
          .filter((t) => t.state === 'calling')
          .map((ticket) => new FirebaseAttentionTicket(ticket))
      )

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [getConditions])

  return (
    <div
      style={{
        backgroundImage: 'url(/_bg.webp)'
      }}
      className="flex relative flex-col text-black w-full bg-cover bg-center overflow-y-auto h-full flex-grow"
    >
      <div className="absolute inset-0 bg-blue-600/30"></div>
      <Helmet>
        <title>Turnos | PontiApp</title>
      </Helmet>
      <div className="flex-grow overflow-y-auto relative flex">
        <div className="h-full flex-grow grid place-content-center">
          {calling.length > 0 && (
            <div className="bg-blue-700 min-w-[450px] animate-slideOut divide-y divide-blue-500 text-blue-50 rounded-xl p-2">
              <h1 className="text-center pb-3 pt-1 text-xl opacity-50 tracking-tight font-medium">
                Llamando...
              </h1>
              {calling.map((ticket) => {
                return (
                  <div
                    key={ticket.id}
                    className="flex p-3 px-5 items-center gap-5"
                  >
                    <h1 className="text-2xl tracking-tight font-semibold line-clamp-1 flex-grow">
                      {ticket.personFirstNames}
                    </h1>
                    <div className="font-semibold flex gap-2 text-xl px-3 opacity-80">
                      <span>Puesto</span>
                      {ticket.attentionPositionName}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="min-w-[450px] h-full flex p-2 flex-col overflow-y-auto">
          <div className="w-full h-full rounded-xl bg-stone-100 flex flex-col overflow-y-auto">
            <nav className="p-5 text-center bg-blue-600 text-white font-semibold tracking-tight">
              <h1 className="text-4xl">
                {realtime.split(':').slice(0, 2).join(':')}:
                <span className="opacity-50">
                  {realtime.split(':')[2].split(' ')[0]}
                </span>{' '}
                {realtime.split(':')[2].split(' ')[1]}
              </h1>
              <p className="text-xs opacity-80 pt-2">
                {date.slice(0, 1).toUpperCase() + date.slice(1)}
              </p>
            </nav>
            <div className="border-t relative border-blue-500/40 overflow-y-auto flex flex-col">
              <h1 className="p-3 pb-0  text-center">Proximos turnos</h1>
              <div className="divide-y divide-stone-500/30 overflow-y-auto">
                <div className="flex justify-between text-sm font-semibold px-5 pb-2 opacity-50">
                  <p className="">Persona</p>
                  <p className="px-5">Puesto</p>
                </div>
                {tickets.map((ticket) => {
                  return (
                    <div
                      key={ticket.id}
                      className="flex p-3 px-5 items-center gap-2"
                    >
                      <h1 className="text-xl tracking-tight font-semibold line-clamp-1 flex-grow">
                        {ticket.personFirstNames}
                      </h1>
                      <div className="font-semibold text-xl items-center flex px-3 gap-2 text-black">
                        <p className="text-nowrap text-sm max-w-[13ch] overflow-hidden text-ellipsis">
                          {ticket.attentionPositionName}
                        </p>
                        <p>{ticket.attentionPositionShortName}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <footer className="flex items-center border-t border-dashed border-stone-500/50 justify-center gap-10 p-5">
        {Object.entries(businesses).map(([, { acronym, logo, name }]) => (
          <img
            className="w-auto h-[27px] group-hover:scale-105"
            src={logo}
            loading="lazy"
            alt={acronym + ' Logo' + name}
          />
        ))}
      </footer> */}
    </div>
  )
}

// const transition = { type: 'spring', stiffness: 500, damping: 60, mass: 1 }

// function Ticket({
//   children,
//   onClick,
//   isPrincipal = false
// }: {
//   children: React.ReactNode
//   onClick: () => void
//   isPrincipal?: boolean
// }) {
//   return (
//     <motion.div
//       initial={{
//         height: 0,
//         scale: 0.7,
//         opacity: 0
//       }}
//       animate={{
//         height: 'auto',
//         scale: 1,
//         opacity: 1
//       }}
//       exit={{
//         height: 0,
//         scale: 0.5,
//         opacity: 0
//       }}
//       transition={transition}
//       className={cn('col-span-2', isPrincipal && 'col-span-1')}
//     >
//       <div
//         onClick={onClick}
//         className={cn(
//           'font-semibold bg-stone-800 shadow-md shadow-black col-span-2 p-5 mt-4 grid place-content-center text-lg rounded-2xl w-full text-white',
//           isPrincipal && ''
//         )}
//       >
//         {children}
//       </div>
//     </motion.div>
//   )
// }

// function TicketCalling({
//   children,
//   onClick
// }: {
//   children: React.ReactNode
//   onClick: () => void
// }) {
//   return (
//     <motion.div
//       initial={{
//         height: 0,
//         scale: 0.7,
//         opacity: 0
//       }}
//       animate={{
//         height: 'auto',
//         scale: 1,
//         opacity: 1
//       }}
//       exit={{
//         height: 0,
//         scale: 0.5,
//         opacity: 0
//       }}
//       transition={transition}
//       className={cn('col-span-1')}
//     >
//       <div
//         onClick={onClick}
//         className={cn(
//           'font-semibold text-center bg-neutral-950 col-span-2 p-10 grid place-content-center rounded-2xl w-full text-white border-2 border-stone-500/40'
//         )}
//       >
//         <h1 className="text-xl">{children}</h1>
//         <p className="text-sm text-yellow-600">#4 Matriculas | ELP</p>
//       </div>
//     </motion.div>
//   )
// }
