import React, { useState, useEffect } from 'react';
import SectionTitle from './ui/SectionTitle';
import FAQItem from './FAQItem';
import { faqService } from '../services/faq';

/**
 * FAQ Data List
 */
const FAQ_LIST = [
  {
    id: 'who-can-participate',
    question: 'Who can participate?',
    answer: 'ZAYATHON is open to all university students, engineering undergraduates, developers, designers, researchers, and tech enthusiasts worldwide. Both beginners making their first prototype and seasoned hackers are welcome!'
  },
  {
    id: 'team-size',
    question: 'What is the team size limit?',
    answer: 'Teams can consist of 1 to 4 members max (1 Team Leader + up to 3 Members). You can register with a pre-formed squad or register solo and join our hacker matching channels on Discord.'
  },
  {
    id: 'registration-fee',
    question: 'Is there any registration fee?',
    answer: 'No! Registration for ZAYATHON is 100% FREE. There are no registration fees, platform charges, or hidden costs to participate.'
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring?',
    answer: 'For onsite hackers: bring your laptop, charger, valid student/national ID card, and enthusiasm! For virtual hackers: bring a reliable internet connection, development environment, and discord account.'
  },
  {
    id: 'certificates',
    question: 'Will certificates be provided?',
    answer: 'Yes! All participants who submit a valid project before the deadline will receive an official verifiable ZAYATHON Digital Certificate of Participation. Track winners receive merit certificates, trophies, and cash prizes.'
  },
  {
    id: 'problem-statements',
    question: 'Can we work on our own problem statement?',
    answer: 'Yes! You can choose from any of our 9 domain tracks or enter the Open Innovation wildcard track to hack on your own novel idea.'
  }
];

const FAQ = () => {
  const [faqs, setFaqs] = useState(FAQ_LIST);
  const [openId, setOpenId] = useState('who-can-participate');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const liveFaqs = await faqService.getFAQs();
        if (liveFaqs && liveFaqs.length > 0) {
          setFaqs(liveFaqs);
          setOpenId(liveFaqs[0].id);
        }
      } catch (err) {
        console.warn('Using preset FAQ list fallback');
      }
    };
    fetchFaqs();
  }, []);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="section-container relative z-10 overflow-hidden">
      {/* Background Cyber Glow Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <SectionTitle 
        badge="Got Questions?"
        title="FREQUENTLY ASKED QUESTIONS"
        subtitle="Find answers to common questions about eligibility, registration, team limits, and event logistics."
      />

      {/* FAQ Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4 pt-2">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id || index}
            faq={faq}
            isOpen={openId === (faq.id || index)}
            onToggle={() => handleToggle(faq.id || index)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
