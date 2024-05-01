import { useState, useEffect } from 'react';
import moment from 'moment';

export default function DataTime() {
    const [currentTime, setCurrentTime] = useState(moment().format('hh:mm'));
    const currentPeriod = moment().format('A'); // Extracting the current period (AM or PM)
    const currentDate = moment().format('dddd, MMMM Do YYYY'); // Current date

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment().format('hh:mm'));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <p className='text-5xl font-semibold'>{currentTime} {currentPeriod}</p>
            <p className='text-lg'>{currentDate}</p>
        </>
    );
}
