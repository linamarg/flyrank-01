const Database = require('better-sqlite3');
const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();
if (row.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Buy milk', 0);
  insert.run('Walk the dog', 0);
  insert.run('Finish assignment', 1);
}

function getAll() {
    return db.prepare('SELECT * FROM tasks').all();
}

function getById(id) {
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
}

function create(title) {
    const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)').run(title, 0);
  return getById(result.lastInsertRowid);
}

function update(id, changes) {
  const task = getById(id);
  if (!task) return null;

  const newTitle = changes.title !== undefined ? changes.title : task.title;
  const newDone = changes.done !== undefined ? changes.done : task.done;

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(newTitle, newDone, id);

  return getById(id);
}

function remove(id) {
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    
    return result.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };