const settings = () => {
    const statingNewVersionFrom = 2
    const notProjectImport = ['@', 'react', 'reportWebVitals']
    const relationEntity = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ]

    const getUniqueId = (id) => {
        if (id < relationEntity.length) {
            return relationEntity[id]
        }
        const iteration = Math.ceil(id / relationEntity.length)
        const _id = Math.abs(id - relationEntity.length)
        const output = []

        if (iteration > relationEntity.length) {
            const iterationOverflowResult = getUniqueId(iteration)
            output.push(iterationOverflowResult)
        }
        output.push(relationEntity[iteration])
        output.push(relationEntity[_id])

        return output.join('')
    }

    return {
        notProjectImport,
        relationEntity,
        getUniqueId,
        statingNewVersionFrom,
    }
}
export default settings
//module.exports = { settings }
