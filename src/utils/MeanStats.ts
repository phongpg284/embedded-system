import dayjs from "dayjs"

function MeanStats(data: any[], start: Date, jump: number, total: Date, key: string) {
    const marks = []
    let startPoint = start
    const filterData: any[] = []
    while (startPoint <= total) {
        filterData.push([])
        marks.push(startPoint)
        startPoint = dayjs(startPoint).add(jump, key).toDate()
    }

    let currentMarksIndex = 0
    const sortedData = data.filter((a) => a.startTime < total && a.startTime >= start).sort((a, b) => a.startTime - b.startTime)
    sortedData.forEach((history) => {
        while (history.startTime > marks[currentMarksIndex + 1]) {
            currentMarksIndex++
        }
        filterData[currentMarksIndex].push(history)
    })
    const totalFilterData = filterData.map((week) => {
        if (week?.length > 0) {
            const total = week.reduce((prev, current) => {
                return {
                    frequency: prev.frequency + current.frequency,
                    voltage: prev.voltage + current.voltage,
                    step: prev.step + current.step,
                    duration: prev.duration + current.duration,
                    restTime: prev.restTime + current.restTime,
                }
            })
            return total
        } else {
            return {
                frequency: 0,
                voltage: 0,
                step: 0,
                duration: 0,
                restTime: 0,
            }
        }
    })
    const meanData = totalFilterData.map((week, index) => {
        const meanDataWeek = week
        Object.keys(week).forEach((key) => {
            meanDataWeek[key] = (week[key] / filterData[index].length).toFixed(2)
        })
        meanDataWeek.stepPerMinute = ((meanDataWeek.step / meanDataWeek.duration) * 60).toFixed(2)
        return meanDataWeek
    })
    return meanData
}

export default MeanStats
