import chalk from 'chalk'

export const errorTrace = (text: string, value: string) =>
    console.log(chalk.red(`${text}, ${value}`))
