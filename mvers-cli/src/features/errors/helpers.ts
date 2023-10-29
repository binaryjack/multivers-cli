import chalk from 'chalk'

export const errMsg = (context: string, message: string) =>
    console.log(chalk.redBright(`::no_entry:: ${context}: ${message}`))

export const infoMsg = (context: string, message: string) =>
    console.log(
        chalk.greenBright(`::white_check_mark:: ${context}: ${message}`)
    )

export const warnMsg = (context: string, message: string) =>
    console.log(chalk.greenBright(`::warning:: ${context}: ${message}`))
