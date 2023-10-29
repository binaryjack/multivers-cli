import chalk from 'chalk'

export const errMsg = (context: string, message: string | any) => {
    console.clear()
    console.log(chalk.redBright(`❌ ${context}: ${message}`))
}

export const infoMsg = (context: string, message: string) => {
    console.clear()
    console.log(chalk.greenBright(`✅ ${context}: ${message}`))
}

export const warnMsg = (context: string, message: string) => {
    console.clear()
    console.log(chalk.greenBright(`⚡ ${context}: ${message}`))
}
