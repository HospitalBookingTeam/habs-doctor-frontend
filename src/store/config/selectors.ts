import { RootState } from '..'

export const selectTime = (state: RootState) => state.config.time
