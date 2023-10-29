export class ProgressBar {
    _min = 0
    _max = 100
    _width = 25
    _increment = 0
    _blocks: string[] = []
    _blocksFilled: string[] = []
    _fullEmpty = '░' // ?? String.fromCharCode(10303)
    _fullFill = '▓' // ?? String.fromCharCode(10303)
    _infiniteState = 0

    constructor(width?: number, max?: number) {
        this._max = max ?? 100
        this._width = width ?? 25
        this.build()
    }
    public increment(topic: string) {
        this._increment++

        const pct = Math.floor((this._increment * 100) / this._max)

        const ratio = Math.floor((pct * this._width) / 100)

        const output =
            ratio - 1 < 0
                ? this._blocks
                : [
                      ...this._blocksFilled.slice(0, ratio),
                      ...this._blocks.slice(ratio),
                  ]

        process.stdout.clearLine(0)
        process.stdout.cursorTo(0)
        process.stdout.write(
            `${topic} [${output.join('')}] ${pct}% ${this._increment}/${
                this._max
            }`
        )

        if (this._increment === this._max) {
            process.stdout.write('\r\n')
        }
    }

    public startInfinite() {
        setTimeout(() => {
            this._infiniteState = 1
        }, 100)
    }
    public stopInfinite() {
        setTimeout(() => {
            this._infiniteState = 0
        }, 100)
    }

    public infinite(topic: string) {
        const infiniteBlocks = ['▖', '▗', '▝', '▘']

        while (this._infiniteState === 1) {
            let i = 0
            while (i < infiniteBlocks.length) {
                if (i > infiniteBlocks.length) {
                    i = 0
                }

                process.stdout.clearLine(0)
                process.stdout.cursorTo(0)
                process.stdout.write(`${topic} ${infiniteBlocks[i]}`)

                i++
            }
        }
    }

    public build() {
        for (let i = 0; i < this._width; i++) {
            this._blocks.push(this._fullEmpty)
        }
        for (let i = 0; i < this._width; i++) {
            this._blocksFilled.push(this._fullFill)
        }
    }

    public start() {
        ///
        console.clear()
    }
    public stop() {
        ///
        console.clear()
    }
}

export const testProgressBar = async () => {
    const pBar = new ProgressBar(25, 500)
    for (let i = 0; i < pBar._max; i++) {
        pBar.increment(`current ${i}`)
        await sleep(2)
    }
}

export const testInfiniteProgressBar = async () => {
    const pBar = new ProgressBar(25, 20000)

    pBar.startInfinite()
    pBar.infinite('Topic 1')
    for (let i = 0; i < pBar._max; i++) {
        await sleep(2)
    }
    pBar.stopInfinite()
}

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
