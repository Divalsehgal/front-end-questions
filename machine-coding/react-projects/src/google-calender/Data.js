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
};

export const ConflictingData = [
    { startTime: "00:00", endTime: "01:30", color: "#f6be23", title: "#TeamDevkode" },
    { startTime: "3:30", endTime: "7:30", color: "#f6501e", title: "#TeamDevkode" },
    { startTime: "4:30", endTime: "8:30", color: "#f6501e", title: "#TeamDevkode" },
    { startTime: "6:30", endTime: "9:00", color: "#f6501e", title: "Demo" },
    { startTime: "11:00", endTime: "13:30", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "12:00", endTime: "13:30", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "9:30", endTime: "10:30", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "16:00", endTime: "17:00", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "15:00", endTime: "17:00", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "18:00", endTime: "19:00", color: "#f6501e", title: "#TeamDevkode" },
    { startTime: "20:30", endTime: "22:30", color: "#029be5", title: "#TeamDevkode" },
    { startTime: "20:30", endTime: "22:30", color: "#029be5", title: "#TeamDevkode" },
];

// Step 1: Convert meetings to events with indexes
let events = [];
ConflictingData.forEach((item, index) => {
    events.push({ time: timeToMinutes(item.startTime), type: 1, index });
    events.push({ time: timeToMinutes(item.endTime), type: -1, index });
});

// Step 2: Sort events
events.sort((a, b) => a.time - b.time || a.type - b.type);

let active_meetings = 0;
let meetingCount = new Map(); // Stores count per meeting

// Step 3: Process events
for (let event of events) {
    active_meetings += event.type; // Increment for start, decrement for end
    if (event.type === 1) {
        meetingCount.set(event.index, active_meetings);
    }
}

// Step 4: Assign the count back to ConflictingData
ConflictingData.forEach((item, index) => {
    item.count = meetingCount.get(index) || 0;
});


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





