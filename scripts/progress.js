import chalk from 'chalk'
import cliProgress from 'cli-progress'

const progress = () => {
    const infiniteChars = ['--', '/', '|', '\\']
    let infiniteVar = 0

    let progressBar = new cliProgress.SingleBar()

    const start = (max) => {
        progressBar = new cliProgress.SingleBar({
            format:
                '{payload} |' +
                chalk.greenBright('{bar}') +
                '| {percentage}% || {value}/{total} Chunks ',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            linewrap: true,
            clearOnComplete: false,
            forceRedraw: true,
            hideCursor: true,
        })

        progressBar?.start(max, 0, {
            speed: 'N/A',
        })
    }

    const stop = () => {
        progressBar?.stop()
    }

    const incr = (payload) => {
        progressBar?.increment(1, { payload: payload })
    }

    const infinite = (text) => {
        infiniteVar++
        if (infiniteVar >= infiniteChars.length) {
            infiniteVar = 0
        }
        try {
            console.clear()
            console.info(
                chalk.blueBright(`${infiniteChars[infiniteVar]} ${text}`)
            )
        } catch {}
    }

    const info = (text) => {
        console.clear()
        console.log(chalk.blue(`${text}`))
    }

    return { start, stop, infinite, incr, info }
}

export default progress
