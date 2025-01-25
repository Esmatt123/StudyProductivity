import React, { useState } from 'react';
import styles from '../../src/Styles/_faq.module.css';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqPageProps {
  faqs: FAQItem[];
}

const FaqPage: React.FC<FaqPageProps> = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    if (activeIndex === index) {
      // Close the active FAQ
      setActiveIndex(null);
    } else {
      // Open the selected FAQ
      setActiveIndex(index);
    }
  };

  return (
    <div className={styles.faqPage}>
      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <div className={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`${styles.faq} ${activeIndex === index ? styles.active : ''}`}
          >
            <h3 className={styles.faqTitle}>{faq.question}</h3>
            <p className={styles.faqText}>{faq.answer}</p>
            <button
              className={`${styles.faqToggle} ${activeIndex === index ? styles.active : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              {activeIndex === index ? (
                <FaTimes className={styles.icon} />
              ) : (
                <FaChevronDown className={styles.icon} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const faqs: FAQItem[] = [
    {
      question: "I'd like to hire you, where can I contact you?",
      answer:
        'You can send me an email on the contact page, go to my LinkedIn which is Esmatt Morra, or just call me on +46 0700 97 74 50',
    },
    {
      question: 'How did you implement this or that feature?',
      answer:
        "If you'd like to know how I implement certain features in this app, contact me via email or reach out on LinkedIn, and we can discuss further.",
    },
    {
      question: "What's your email?",
      answer: 'esmatt98@hotmail.com',
    },
    {
      question: "What's your GitHub?",
      answer: 'Esmatt123',
    },
  ];

  return {
    props: {
      faqs,
    },
  };
};

export default FaqPage;