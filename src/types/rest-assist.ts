import { AssistTerminal } from './assist-terminal'
import { User } from './user'

export class RestAssist {
  id: string
  terminalId: string
  datetime: string
  documentId: string
  terminal: AssistTerminal
  user: User
  constructor(data: RestAssist) {
    this.id = data.id
    this.datetime = data.datetime
    this.terminalId = data.terminalId
    this.terminal = data.terminal
    this.documentId = data.documentId
    this.user = data.user
    if (data.terminal) this.terminal = new AssistTerminal(data.terminal)
    if (data.user) this.user = new User(data.user)
  }
}
