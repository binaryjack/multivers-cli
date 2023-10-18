import chalk from 'chalk'

export const trace = (text: string, value: string) =>
    console.log(chalk.greenBright(`${text}, ${value}`))
