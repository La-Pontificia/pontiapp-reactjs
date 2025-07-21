// import Echo from 'laravel-echo'
// import Pusher from 'pusher-js'
// import {
//   VITE_REVERB_APP_KEY,
//   VITE_REVERB_HOST,
//   VITE_REVERB_PORT,
//   VITE_REVERB_SCHEME
// } from '@/config/env'

// declare global {
//   interface Window {
//     Pusher: typeof Pusher
//   }
// }

// window.Pusher = Pusher

// const echo = new Echo({
//   broadcaster: 'reverb',
//   key: VITE_REVERB_APP_KEY as string,
//   wsHost: VITE_REVERB_HOST as string,
//   wsPort: parseInt(VITE_REVERB_PORT ?? '80'),
//   wssPort: parseInt(VITE_REVERB_PORT ?? '443'),
//   forceTLS: (VITE_REVERB_SCHEME ?? 'https') === 'https',
//   enabledTransports: ['ws', 'wss'],
//   disableStats: true
// })

// export default echo
