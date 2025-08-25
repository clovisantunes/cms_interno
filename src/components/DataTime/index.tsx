import { useState, useEffect } from "react";
import styles from './styles.module.scss';

const DateTimeLocation = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR');
  };

  return (
    <div className={styles.container}>
      <div className={styles.time}>{formatTime(currentTime)}</div>
      <div className={styles.date}>{formatDate(currentTime)}</div>
      <div className={styles.location}>
        <span className={styles.locationIcon}>📍</span>
        Sapiranga, RS
      </div>
    </div>
  );
};

export default DateTimeLocation;