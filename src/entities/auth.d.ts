export type AuthUser = {
	id: number
	username: string
	type: number
	name: string
	phoneNo: string
}

export type AuthState = {
	token: string
	isAuthenticated: boolean
	roomId?: number
	room?: RoomData
	information?: AuthInformation
}

export type AuthForm = {
	username: string
	password: string
	roomId?: any
}
