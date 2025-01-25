import { useContext } from "react";
import styles from '../Styles/_sidebar.module.css';
import { SidebarContext } from "./Sidebar";

interface SidebarItemProps {
    icon: JSX.Element;
    text: string;
    active?: boolean;
    alert?: boolean;
  }
  
  

  export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
    const { expanded } = useContext(SidebarContext);
  
    return (
      <li
        className={`${styles.menuItem} ${active ? styles.activeItem : styles.inactiveItem}`}
      >
        {icon}
        <span className={`${expanded ? styles.expandedText : styles.collapsedText}`}>
          {text}
        </span>
        {alert && <div className={styles.alertDot} />}
        {!expanded && (
          <div className={styles.tooltip}>
            {text}
          </div>
        )}
      </li>
    );
  }