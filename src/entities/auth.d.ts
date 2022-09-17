import { Room } from './room'

export type AuthUser = {
	id: number
	username: string
	type: number
	name: string
	phoneNo: string
	room: Room
}

export type AuthState = {
	token: string
	isAuthenticated: boolean
	information?: AuthInformation
}

export type AuthForm = {
	username: string
	password: string
	roomId?: any
}
