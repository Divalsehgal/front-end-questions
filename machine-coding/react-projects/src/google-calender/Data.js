export const NonConflictingData = [
    {
        startTime: "00:00",
        endTime: "01:30",
        color: "#f6be23",
        title: "#TeamDevkode",
    },
    {
        startTime: "4:30",
        endTime: "7:30",
        color: "#f6501e",
        title: "#TeamDevkode",
    },
    {
        startTime: "12:00",
        endTime: "13:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "9:00",
        endTime: "10:00",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "16:00",
        endTime: "19:00",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "20:30",
        endTime: "22:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
]

export const timeToMinutes = (str) => {
    const [hour, minutes] = str.split(":").map(Number);
    return hour * 60 + minutes;
}
export const ConflictingData = [
    {
        startTime: "00:00",
        endTime: "01:30",
        color: "#f6be23",
        title: "#TeamDevkode",
    },
    {
        startTime: "3:30",
        endTime: "7:30",
        color: "#f6501e",
        title: "#TeamDevkode",
    },
    {
        startTime: "4:30",
        endTime: "8:30",
        color: "#f6501e",
        title: "#TeamDevkode",
    },
    {
        startTime: "6:30",
        endTime: "9:00",
        color: "#f6501e",
        title: "Demo",
    },
    {
        startTime: "11:00",
        endTime: "13:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "12:00",
        endTime: "13:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "9:30",
        endTime: "10:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "16:00",
        endTime: "17:00",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "15:00",
        endTime: "17:00",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "18:00",
        endTime: "19:00",
        color: "#f6501e",
        title: "#TeamDevkode",
    },
    {
        startTime: "20:30",
        endTime: "22:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
    {
        startTime: "20:30",
        endTime: "22:30",
        color: "#029be5",
        title: "#TeamDevkode",
    },
]

ConflictingData.forEach(item => item.count = 0);
// Sort events by startTime to enable easier overlap checking
ConflictingData.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

for (let i = 0; i < ConflictingData.length - 1; i++) {
    const citem = ConflictingData[i];
    const cItemEndTime = timeToMinutes(citem.endTime);

    for (let j = i + 1; j < ConflictingData.length - 1; j++) {
        const nitem = ConflictingData[j];
        const nItemStartTime = timeToMinutes(nitem.startTime);


        if (cItemEndTime <= nItemStartTime) { break };

        nitem.count = nitem.count + 1
    }
}


export const generateTimeData = () => {
    const timeData = [];
    for (let i = 0; i < 24; i++) {
        const period = i < 12 ? "AM" : "PM";
        const hour = i % 12 === 0 ? 12 : i % 12;
        timeData.push({
            id: i + 1,
            time: `${hour}:00${period}`
        });
    }
    return timeData;
};





