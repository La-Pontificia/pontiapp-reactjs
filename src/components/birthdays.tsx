import { useLocalStorage, useWindowSize } from '@uidotdev/usehooks'
import Modal from './modals'
import Confetti from 'react-confetti'
import { User } from '~/types/user'
import { useAuth } from '~/store/auth'
import { Avatar } from '@fluentui/react-components'
import { AddRegular, PersonRegular } from '@fluentui/react-icons'
import { getRandomMessageBirthday } from '~/utils'
import { format } from '~/lib/dayjs'

// const Card1 = ({ user }: { user: User }) => {
//   return (
//     <div className="min-w-max shadow-black/40 text-white shadow-xl rounded-sm select-none overflow-hidden relative">
//       <div className="absolute flex justify-center items-center h-[80%] inset-x-0">
//         <Avatar
//           color="colorful"
//           icon={<PersonRegular fontSize={80} />}
//           style={{
//             width: '180px',
//             height: '180px'
//           }}
//           image={{
//             src: user.photoURL
//           }}
//         />
//         <div className="absolute pt-5 pr-5">
//           <img src="/1_mask.webp" width={270} alt="" />
//         </div>
//       </div>
//       <div className="absolute text-center inset-x-0 bottom-0 h-[38%]">
//         <h1 className="font-semibold tracking-tight text-2xl">
//           {user.displayName}
//         </h1>
//         <p className="text-sm opacity-80 ">
//           {user.role.name} - {user.role.department.area.name}
//         </p>
//         <p className="max-w-[28ch] tracking-tight text-amber-200 text-lg pt-4 mx-auto">
//           ¡{getRandomMessageBirthday()}!
//         </p>
//       </div>
//       <img src="/1.webp" className="max-h-[90vh] h-[600px] min-w-max" />
//     </div>
//   )
// }

// const Card2 = ({ user }: { user: User }) => {
//   return (
//     <div className="min-w-max shadow-black/40 text-white shadow-xl rounded-sm overflow-hidden relative">
//       <div className="absolute flex justify-center items-center h-[50%] pb-4 pl-2 inset-x-0">
//         <Avatar
//           color="steel"
//           icon={<PersonRegular fontSize={80} />}
//           style={{
//             width: '226px',
//             height: '226px'
//           }}
//           image={{
//             src: user.photoURL
//           }}
//         />
//       </div>
//       <div className="absolute text-center inset-x-0 bottom-0 h-[43%]">
//         <h1 className="font-semibold tracking-tight text-2xl">
//           {user.displayName}
//         </h1>
//         <p className="text-sm opacity-80 ">
//           {user.role.name} - {user.role.department.area.name}
//         </p>
//         <p className="max-w-[28ch] tracking-tight font-semibold drop-shadow-sm text-blue-200 text-lg pt-2 mx-auto">
//           ¡{getRandomMessageBirthday()}!
//         </p>
//       </div>
//       <img src="/2.webp" className="max-h-[90vh] h-[600px] min-w-max" />
//     </div>
//   )
// }

const Card3 = ({ user }: { user: User }) => {
  return (
    <div className="min-w-max shadow-black/40 shadow-xl text-orange-900 rounded-sm overflow-hidden relative">
      <div className="absolute flex justify-center items-center h-[95%] inset-x-0">
        <Avatar
          color="colorful"
          icon={<PersonRegular fontSize={80} />}
          style={{
            borderRadius: 0,
            width: '160px',
            height: '160px'
          }}
          image={{
            src: user.photoURL
          }}
        />
        <div className="absolute pt-5 pr-5">
          <img src="/3_mask.webp" width={230} alt="" />
        </div>
      </div>
      <div className="absolute text-center inset-x-0 bottom-0 h-[31%]">
        <h1 className="font-bold tracking-tight text-2xl">
          {user.displayName}
        </h1>
        <p className="text-sm font-medium opacity-80">
          {user.role.name} - {user.role.department.area.name}
        </p>
        <p className="max-w-[28ch] tracking-tight text-yellow-900 font-semibold text-base pt-6 mx-auto">
          ¡{getRandomMessageBirthday()}!
        </p>
      </div>
      <img src="/3.webp" className="max-h-[90vh] h-[600px] min-w-max" />
    </div>
  )
}

export default function BirthdayBoys() {
  const now = format(new Date(), 'YYYY-MM-DD')
  const [showed, setShowed] = useLocalStorage('birthdayModalShowed', false)
  const [date, setDate] = useLocalStorage('birthdayModalDate', now)

  if (date !== now) {
    setShowed(false)
    setDate(now)
  }

  const { width, height } = useWindowSize()
  const { birthdayBoys } = useAuth()

  if (birthdayBoys.length === 0) return null

  if (date === now && showed) return null

  // const RenderRandomCard = ({ user }: { user: User }) => {
  //   const cards = [Card1, Card3]
  //   const i = Math.floor(Math.random() * cards.length)
  //   const Card = cards[i]
  //   return <Card user={user} />
  // }

  return (
    <Modal onClose={() => setShowed(true)}>
      {(set) => (
        <div className="h-full relative">
          <Confetti width={width!} height={height!} />
          <div className="fixed top-5 pointer-events-auto right-5 z-10">
            <button
              onClick={() => set(false)}
              className="rotate-45 hover:scale-105 rounded-full bg-neutral-500/50 aspect-square transition-transform px-2"
            >
              <AddRegular fontSize={30} />
            </button>
          </div>
          <div className="h-full mx-auto select-none px-10 flex items-center w-fit relative">
            <div className="flex [&>div]:pointer-events-auto relative items-center py-10 gap-10 overflow-auto">
              {birthdayBoys.map((user, index) => (
                <Card3 key={index} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
