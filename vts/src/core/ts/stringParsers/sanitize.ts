export const sanitize = (val: string) => {
    const pass1 = val.replaceAll('import', '')
    const pass2 = pass1.replaceAll(`'`, '')
    const pass3 = pass2.replaceAll(`;`, '')
    const pass4 = pass3.replaceAll(`,`, ' ')
    const pass5 = pass4.replaceAll(`}`, ' ')
    const pass6 = pass5.replaceAll(`{`, ' ')
    const pass7 = pass6.replaceAll(`/`, '')

    return pass7.trim()
}
