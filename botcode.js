const TelegramBot = require('node-telegram-bot-api');
const sqlite3 = require('sqlite3');

// Create or connect to the database
const db = new sqlite3.Database('subjects.db');

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY,
    year TEXT,
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

// Define subjects data for each year
const firstYearSubjectsData = [
  ['SME', 'Link to notes for SME', 'Link to syllabus for SME', 'Link to assignments for SME', 'Link to previous year questions for SME'],
  ['CHEMISTRY', 'Link to notes for CHEMISTRY', 'Link to syllabus for CHEMISTRY', 'Link to assignments for CHEMISTRY', 'Link to previous year questions for CHEMISTRY'],
  ['PHYSICS', 'Link to notes for PHYSICS', 'Link to syllabus for PHYSICS', 'Link to assignments for PHYSICS', 'Link to previous year questions for PHYSICS'],
  ['MATHS1', 'Link to notes for MATHS1', 'Link to syllabus for MATHS1', 'Link to assignments for MATHS1', 'Link to previous year questions for MATHS1'],
  ['MATHS2', 'Link to notes for MATHS2', 'Link to syllabus for MATHS2', 'Link to assignments for MATHS2', 'Link to previous year questions for MATHS2'],
  ['PAPS', 'Link to notes for PAPS', 'Link to syllabus for PAPS', 'Link to assignments for PAPS', 'Link to previous year questions for PAPS'],
  ['EGR&AUTOCAD', 'Link to notes for EGR&AUTOCAD', 'Link to syllabus for EGR&AUTOCAD', 'Link to assignments for EGR&AUTOCAD', 'Link to previous year questions for EGR&AUTOCAD'],
  ['BXE', 'Link to notes for BXE', 'Link to syllabus for BXE', 'Link to assignments for BXE', 'Link to previous year questions for BXE'],
  ['BEE', 'Link to notes for BEE', 'Link to syllabus for BEE', 'Link to assignments for BEE', 'Link to previous year questions for BEE'],
  ['EM', 'Link to notes for EM', 'Link to syllabus for EM', 'Link to assignments for EM', 'Link to previous year questions for EM'],
  // Add more subjects for the first year
];

const secondYearSubjectsData = [
  // Define subjects for the second year
  ['COMPUTER GRAPHICS', 'Link to notes for Subject 1', 'Link to syllabus for Subject 1', 'Link to assignments for Subject 1', 'Link to previous year questions for Subject 1'],
  ['FUNDAMENTAL OF DATA', 'Link to notes for Subject 2', 'Link to syllabus for Subject 2', 'Link to assignments for Subject 2', 'Link to previous year questions for Subject 2'],
];

// Insert subjects data into the database
const insertSubjectData = db.prepare('INSERT INTO subjects (year, name, notes, syllabus, assignments, previous_year_questions) VALUES (?, ?, ?, ?, ?, ?)');

const insertSubjects = (year, subjectsData) => {
  subjectsData.forEach((subject) => {
    insertSubjectData.run([year, ...subject]);
  });
};

// Insert subjects data for each year
insertSubjects('First year', firstYearSubjectsData);
insertSubjects('Second year', secondYearSubjectsData);

// Rest of your code...
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
