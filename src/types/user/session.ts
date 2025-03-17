import {
  CircleOffRegular,
  DesktopKeyboardRegular,
  PhoneRegular,
  TabletRegular
} from '@fluentui/react-icons'
import { User } from '../user'
import { FiChrome } from 'react-icons/fi'
import { FaFirefox, FaEdge, FaInternetExplorer } from 'react-icons/fa'
import { ImSafari } from 'react-icons/im'
import { CgBrowser } from 'react-icons/cg'

export class Session {
  id: string
  user: User
  ip: string
  user_agent: string
  location: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  browser: string
  platform: string
  created_at?: Date
  updated_at?: Date

  constructor(data: Session) {
    this.id = data.id
    this.user = data.user
    this.ip = data.ip
    this.user_agent = data.user_agent
    this.location = data.location
    this.isMobile = data.isMobile
    this.isTablet = data.isTablet
    this.isDesktop = data.isDesktop
    this.browser = data.browser
    this.platform = data.platform
    this.created_at = data.created_at
    this.updated_at = data.updated_at

    if (data.user) this.user = new User(data.user)
  }

  get Device() {
    if (this.isMobile) return PhoneRegular
    if (this.isTablet) return TabletRegular
    if (this.isDesktop) return DesktopKeyboardRegular
    return CircleOffRegular
  }

  get deviceName() {
    if (this.isMobile) return 'Mobile'
    if (this.isTablet) return 'Tablet'
    if (this.isDesktop) return 'Desktop'
    return 'Unknown'
  }

  get browserName() {
    switch (this.browser) {
      case 'Chrome':
        return 'Google Chrome'
      case 'Firefox':
        return 'Mozilla Firefox'
      case 'Safari':
        return 'Apple Safari'
      case 'Edge':
        return 'Microsoft Edge'
      case 'IE':
        return 'Internet Explorer'
      default:
        return this.browser
    }
  }

  get platformName() {
    switch (this.platform) {
      case 'Windows':
        return 'Microsoft Windows'
      case 'Mac':
        return 'Apple macOS'
      case 'Linux':
        return 'Linux'
      case 'Android':
        return 'Android'
      case 'iOS':
        return 'iOS'
      default:
        return this.platform
    }
  }

  get locationName() {
    return this.location == 'Unknown' ? 'Ubicación Desconocida' : this.location
  }

  get BrowserIcon() {
    switch (this.browser) {
      case 'Chrome':
        return FiChrome
      case 'Firefox':
        return FaFirefox
      case 'Safari':
        return ImSafari
      case 'Edge':
        return FaEdge
      case 'IE':
        return FaInternetExplorer
      default:
        return CgBrowser
    }
  }
}
