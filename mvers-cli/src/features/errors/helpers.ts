import chalk from 'chalk'

/**
 * Encapsulates ERROR Message
 * @param context
 * @param message
 */
export const errMsg = (context: string, message: string | any) => {
    console.clear()
    console.log(chalk.redBright(`❌ ${context}: ${message}`))
}
/**
 * Encapsulates INFO Message
 * @param context
 * @param message
 */
export const infoMsg = (context: string, message: string) => {
    console.clear()
    console.log(chalk.greenBright(`✅ ${context}: ${message}`))
}
/**
 * Encapsulates WARNING Message
 * @param context
 * @param message
 */
export const warnMsg = (context: string, message: string) => {
    console.clear()
    console.log(chalk.greenBright(`⚡ ${context}: ${message}`))
}
