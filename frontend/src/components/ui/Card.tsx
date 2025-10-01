import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, subtitle, action, children }: CardProps) {
  return (
    <div className={styles.card}>
      {(title || action) && (
        <div className={styles.cardHeader}>
          <div>
            {title ? <div className={styles.cardTitle}>{title}</div> : null}
            {subtitle ? <div className={styles.cardSubtitle}>{subtitle}</div> : null}
          </div>
          {action ?? null}
        </div>
      )}
      {children}
    </div>
  );
}
