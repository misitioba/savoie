import { default as momentOriginal } from 'moment-timezone'
export function moment(def) {
    return momentOriginal(def).tz('Europe/Paris')
}