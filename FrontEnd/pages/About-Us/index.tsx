import { FunctionComponent } from 'react';
import styles from '../../src/Styles/_about.module.css';
import AnimatedCard from '../../src/Components/AnimatedCard';

interface TeamMember {
    name: string;
    role: string;
}

interface AboutProps {
    team: TeamMember[];
}

const About: FunctionComponent<AboutProps> = ({ team }) => {
    return (
        <div className={styles.aboutPage}>
            <h1>About Me</h1>

            {/* New Section: About Me and Project */}
            <section className={styles.descriptionSection}>
                <div className={styles.container}>
                    <p className={styles.aboutText}>
                        Hello! Im Esmatt, im the developer who has dedicated half a year to this gigantic project of mine, 
                        thank you so much for looking at it, I hope you find it useful and technically impressive! The stack ive been using
                        is Nextjs with Typescript, and asp.net core web api for the backend, Sass for styling, graphQL for data fetching and 
                        MS SQL Server for the database. Ive also used various other libraries and API such as SignalR, Mapbox, Quill and many others 
                    </p>
                </div>
            </section>

            {/* Existing Section: Meet the Team */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Id like to thank:</h2>
                    <div className={styles.sectionTeamGrid}>
                        {team.map((member, index) => (
                            <AnimatedCard
                                key={member.name}
                                member={member}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};




export const getStaticProps = async () => {
    // Simulating fetching team data
    const team: TeamMember[] = [
        {
            name: 'My mother',
            role: 'For taking care of me and supporting me while im studying and building this'
        },
        {
            name: 'My girlfriend',
            role: 'For giving me emotional support all the while ive been working on this project'
        },
        {
            name: 'Michelle Andersson',
            role: 'For being a great and supportive front end development teacher'
        },
        {
            name: 'Michiel Van Der Gragt',
            role: 'For being an awesome and supportive backend development teacher'
        },
        {
            name: 'Trevoir Williams',
            role: 'For teaching me .NET on Udemy'
        },
        {
            name: 'Jonas Schmedtmann',
            role: 'For teaching me Javascript on Udemy'
        },
        {
            name: 'Yihua Zhang',
            role: 'For teaching me React on Udemy'
        },
        {
            name: 'Maximillian Schwarzmuller',
            role: 'For teaching me NextJs on Udemy'
        },
        {
            name: 'Kwabena, Alejandra, Alen and everyone who has followed my project on LinkedIn',
            role: 'Thank you so much for liking and commenting on my posts, I reaally appreciate it!'
        }
        // Add more team members as needed
    ];

    return {
        props: {
            team,
        },
    };
};

// eslint-disable-next-line react-refresh/only-export-components
export default About;