import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import React from 'react'
import { Helmet } from 'react-helmet'
import { businesses } from '~/const'
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
  const [, setCallingTickets] = React.useState<FirebaseAttentionTicket[]>([])
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
    <div className="flex flex-col w-full overflow-y-auto h-full flex-grow">
      <Helmet>
        <title>Turnos | PontiApp</title>
      </Helmet>
      {/* <div className="flex gap-2 [&>button]:border [&>button]:border-neutral-700 [&>button]:rounded-xl [&>button]:px-2 [&>button]:py-1">
        <button className="font-semibold" onClick={addAtStart}>
          Add item to start
        </button>
        <button className="font-semibold" onClick={addAtRandom}>
          Add item at random
        </button>
        <button className="font-semibold" onClick={removeAtStart}>
          Remove from start
        </button>
        <button className="font-semibold" onClick={removeAtRandom}>
          Remove random
        </button>
        <button className="font-semibold" onClick={reset}>
          Reset
        </button>
      </div> */}
      <div className="flex-grow divide-x overflow-y-auto divide-stone-500/30 flex">
        <div className="flex-grow h-full">
          {/* <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/_i1jtqlKQ_Q?si=2w990AWskCyseE8n"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe> */}
        </div>
        <div className="min-w-[35vw] flex flex-col overflow-y-auto">
          <nav className="p-5 text-center">
            <h1 className="text-4xl">
              {realtime.split(':').slice(0, 2).join(':')}:
              <span className="opacity-30">
                {realtime.split(':')[2].split(' ')[0]}
              </span>{' '}
              {realtime.split(':')[2].split(' ')[1]}
            </h1>
            <p className="text-xs dark:text-stone-300">
              {date.slice(0, 1).toUpperCase() + date.slice(1)}
            </p>
          </nav>
          <div className="border-t relative border-stone-500/40 overflow-y-auto flex flex-col">
            <h1 className="p-3 pb-0 dark:text-yellow-500 text-yellow-600 text-center">
              Proximos turnos
            </h1>
            <div
              aria-hidden
              className="absolute pointer-events-none select-none inset-0 bg-gradient-to-t from-white dark:from-[#121212] via-transparent z-[1]"
            ></div>
            <div className="divide-y divide-neutral-500/20 overflow-y-auto">
              <div className="flex justify-between text-sm font-semibold px-4 pb-2 opacity-50">
                <p className="">Persona</p>
                <p>Puesto</p>
              </div>
              {tickets.map((ticket) => {
                return (
                  <div
                    key={ticket.id}
                    className="flex p-3 px-4 items-center gap-2"
                  >
                    <h1 className="text-xl tracking-tight font-semibold line-clamp-1 flex-grow">
                      {ticket.personFirstNames}
                    </h1>
                    <div className="font-semibold text-xl text-blue-700 dark:text-blue-600">
                      {ticket.attentionPositionShortName}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <footer className="flex items-center border-t border-dashed border-stone-500/50 justify-center gap-10 p-5">
        {Object.entries(businesses).map(([, { acronym, logo, name }]) => (
          <img
            className="w-auto h-[27px] group-hover:scale-105"
            src={logo}
            loading="lazy"
            alt={acronym + ' Logo' + name}
          />
        ))}
      </footer>
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
//           'font-semibold dark:bg-stone-800 shadow-md shadow-black col-span-2 p-5 mt-4 grid place-content-center text-lg rounded-2xl w-full text-white',
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
//           'font-semibold text-center dark:bg-neutral-950 col-span-2 p-10 grid place-content-center rounded-2xl w-full text-white border-2 dark:border-stone-500/40'
//         )}
//       >
//         <h1 className="text-xl">{children}</h1>
//         <p className="text-sm text-yellow-600">#4 Matriculas | ELP</p>
//       </div>
//     </motion.div>
//   )
// }
