import { useInView, useAnimation, motion } from "framer-motion";
import { FunctionComponent, useRef, useEffect } from "react";
import styles from '../Styles/_about.module.css';

interface TeamMember {
    name: string;
    role: string;
}

interface AnimatedCardProps {
    member: TeamMember;
    index: number;
}

const AnimatedCard: FunctionComponent<AnimatedCardProps> = ({
    member,
    index,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.1 });
    const controls = useAnimation();

    const direction = index % 2 === 0 ? 1 : -1; // 1 for right, -1 for left

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        } else {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const variants = {
        hidden: {
            opacity: 0,
            x: 200 * direction,
        },
        visible: {
            opacity: 1,
            x: 0,
        },
    };

    return (
        <motion.div
            ref={ref}
            className={`${styles.box}`}
            variants={variants}
            animate={controls}
            initial="hidden"
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={styles.teamMemberContent}>
                <h3 className={styles.teamMemberName}>{member.name}</h3>
                <p className={styles.teamMemberRole}>{member.role}</p>
            </div>
        </motion.div>
    );
};

export default AnimatedCard;