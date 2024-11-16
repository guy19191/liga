import express from "express";
const router = express.Router();

const rules = [
    {
        id: 1,
        title: "חוקים כלליים",
        icon: "📜",
        rules: [
            "בכל שבוע יוכנסו הניחושים החדשים למחזור הקרוב של משחקי ליגת העל",
            "יש להכניס ניחוש עד תחילת הזמן הרשום על הניחוש",
            "בתחילת זמן הניחוש יוצג היחסים לניחוש המיוחס",
        ]
    },
    {
        id: 2,
        title: "מערכת הניקוד",
        icon: "🎯",
        rules: [
            "הניקוד יתקבל ע״פ שאר משתתפי הליגה",
            "ככול שלניחוש אחד יש יותר מנחשים הניחוש השני יהיה שווה יותר",
            "ניחוש שיהיה לו רק מנחש אחד, יחסו יהיה פי 10",
        ]
    },
    {
        id: 3,
        title: "ניחושים והגבלות",
        icon: "⚖️",
        rules: [
            "יתפרסם בקרוב"
        ]
    },
    {
        id: 4,
        title: "פרסים ובנוסים",
        icon: "🏆",
        rules: [
            "יתפרסם בקרוב"
        ]
    }
];


router.get('/v1/getRules',async (req, res) => {
    try {
        res.status(200).send(rules);
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;
