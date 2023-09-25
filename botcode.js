const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3');

// Create or connect to the database
const db = new sqlite3.Database('subjects.db');

db.run(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    name TEXT,
    notes TEXT,
    syllabus TEXT,
    assignments TEXT,
    previous_year_questions TEXT
  )`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Table "subjects" created successfully.');
  }
});

const subjectsData = [
  ['COMPUTER GRAPHICS', 'Link to notes for Subject 1', 'Link to syllabus for Subject 1', 'Link to assignments for Subject 1', 'Link to previous year questions for Subject 1'],
  ['FUNDAMENTAL OF DATA', 'Link to notes for Subject 2', 'Link to syllabus for Subject 2', 'Link to assignments for Subject 2', 'Link to previous year questions for Subject 2'],
  // Add more subjects and resources
];

const insertSubjectData = db.prepare('INSERT INTO subjects (name, notes, syllabus, assignments, previous_year_questions) VALUES (?, ?, ?, ?, ?)');

subjectsData.forEach((subject) => {
  insertSubjectData.run(subject);
});

const getSubjectInfo = (subjectId, callback) => {
  db.get('SELECT * FROM subjects WHERE id = ?', [subjectId], (err, row) => {
    if (err) {
      console.error(err.message);
      callback(null);
    } else {
      callback(row);
    }
  });
};

const updateSubject = (subjectId, notes, syllabus, assignments, previousYearQuestions) => {
  db.run(
    'UPDATE subjects SET notes = ?, syllabus = ?, assignments = ?, previous_year_questions = ? WHERE id = ?',
    [notes, syllabus, assignments, previousYearQuestions, subjectId],
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );
};

const deleteSubject = (subjectId) => {
  db.run('DELETE FROM subjects WHERE id = ?', [subjectId], (err) => {
    if (err) {
      console.error(err.message);
    }
  });
};

const subjects = {
  1: {
    name: 'COMPUTER GRAPHICS',
    notes: 'https://mega.nz/file/D2AlwYgY#0S10f17gF5TfQ8olrsuS6aciDVZzk9k9rWvMfhS_zVU',
    syllabus: 'https://mega.nz/file/O7xWVb7A#QDjbmshicEWH5WdRlbFkqWEqglzSaVawfCIAZJw2OJA',
    assignments: 'Link to assignments for COMPUTER GRAPHICS',
    previous_year_questions: 'https://mega.nz/file/67hjTSwI#ua75zlzjaL2v50orFtXtHTHCPEPDfKR4YFOfp_KyC7o',
  },
  2: {
    name: 'FUNDAMENTAL OF DATA STRUCTURE',
    notes: 'Link to notes for FDS',
    syllabus: 'https://mega.nz/file/O7xWVb7A#QDjbmshicEWH5WdRlbFkqWEqglzSaVawfCIAZJw2OJA',
    assignments: 'Link to assignments for FDS',
    previous_year_questions: 'https://mega.nz/file/C2oEHCgY#vM7Z7oPLwYfFONSb9AYbhpO3aFrFBM4GIzxRYtJz8xM',
  },
  // Add more subjects
};

const token = '6312810364:AAFCpsbOAEOwTuDt2t4ThdPqE2sQtO1GQOg';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Helpdesk Bot! Please select a subject by typing /select_subject.');
});

bot.onText(/\/select_subject/, (msg) => {
  const chatId = msg.chat.id;
  const keyboard = {
    reply_markup: {
      keyboard: Object.keys(subjects).map((subjectId) => [subjectId + '. ' + subjects[subjectId].name]),
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  };
  bot.sendMessage(chatId, 'Please select a subject:', keyboard);
});

bot.onText(/\d+\./, (msg) => {
  const chatId = msg.chat.id;
  const userChoice = msg.text.split('.')[0].trim();
  const subject = subjects[userChoice];
  if (subject) {
    const response = `Subject: ${subject.name}\n\nNotes: ${subject.notes}\nSyllabus: ${subject.syllabus}\nAssignments: ${subject.assignments}\nPrevious Year Questions: ${subject.previous_year_questions}`;
    bot.sendMessage(chatId, response);
  } else {
    bot.sendMessage(chatId, 'Invalid subject selection. Please select a valid subject.');
  }
});

console.log('Bot is running...');
