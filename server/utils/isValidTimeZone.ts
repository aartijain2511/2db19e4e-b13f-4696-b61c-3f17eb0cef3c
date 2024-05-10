export const isValidTimeZone = (tz: string | undefined): boolean => {
    try {
        if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
            return false
        }

        if (typeof tz !== 'string') {
            return false
        }

        Intl.DateTimeFormat(undefined, { timeZone: tz })
        return true
    } catch (error) {
        return false
    }
}