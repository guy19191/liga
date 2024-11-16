import React, { useState } from 'react';
import './rules.css';
import BottomMenu from "./BottomMenu";

const RulesComponent = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const rulesData = [
        {
            id: 1,
            title: "חוקים כלליים",
            icon: "📜",
            rules: [
                "חוק לדוגמה 1",
                "חוק לדוגמה 2",
                "חוק לדוגמה 3",
            ]
        },
        {
            id: 2,
            title: "מערכת הניקוד",
            icon: "🎯",
            rules: [
                "חוק ניקוד 1",
                "חוק ניקוד 2",
                "חוק ניקוד 3",
            ]
        },
        {
            id: 3,
            title: "ניחושים והגבלות",
            icon: "⚖️",
            rules: [
                "הגבלה 1",
                "הגבלה 2",
                "הגבלה 3",
            ]
        },
        {
            id: 4,
            title: "פרסים ועונשים",
            icon: "🏆",
            rules: [
                "חוק פרסים 1",
                "חוק פרסים 2",
                "חוק פרסים 3",
            ]
        }
    ];

    const toggleSection = (id) => {
        setExpandedSection(expandedSection === id ? null : id);
    };

    return (
        <div className="rules-container">
            {/* Header */}
            <div className="rules-header">
                <h1>חוקי המשחק</h1>
                <p>כל מה שצריך לדעת כדי להתחיל לשחק</p>
            </div>

            {/* Rules Content */}
            <div className="rules-content">
                {rulesData.map((section) => (
                    <div key={section.id} className="rules-section">
                        <button
                            className="section-button"
                            onClick={() => toggleSection(section.id)}
                        >
                            <div className="section-header">
                                <span className="section-icon">{section.icon}</span>
                                <h2 className="section-title">{section.title}</h2>
                            </div>
                            <span className={`arrow-icon ${expandedSection === section.id ? 'expanded' : ''}`}>
                ▼
              </span>
                        </button>

                        <div className={`section-content ${expandedSection === section.id ? 'expanded' : ''}`}>
                            <div className="section-content-inner">
                                <ul className="rules-list">
                                    {section.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Navigation */}
            <div className="quick-nav">
                <h3>ניווט מהיר</h3>
                <div className="quick-nav-buttons">
                    {rulesData.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => toggleSection(section.id)}
                            className={`quick-nav-button ${
                                expandedSection === section.id ? 'active' : ''
                            }`}
                        >
                            {section.icon} {section.title}
                        </button>
                    ))}
                </div>
            </div>
            <BottomMenu/>
        </div>
    );
};

export default RulesComponent;