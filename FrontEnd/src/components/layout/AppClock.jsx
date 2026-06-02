import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import "./AppClock.css";

const MONTHS = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
];

function formatClockDate(date) {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} de ${month} ${hours}:${minutes}`;
}

function AppClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, []);

    return (
        <div className="app-clock" aria-label="Data e horário atual">
            <Clock3 size={16} />
            <time dateTime={now.toISOString()}>{formatClockDate(now)}</time>
        </div>
    );
}

export default AppClock;
