import {FuseJsTodoIndexer} from '@ochuzor/todo.txt-indexer';
import {UrlTodoStore, TodoDb} from '@ochuzor/todo.txt-store';

const indexer = new FuseJsTodoIndexer();
const store = new UrlTodoStore();

const db = new TodoDb(indexer, store);

store.readData().forEach(todoDoc => db.addDoc(todoDoc));

function nextId() {
    return db.getAll().length + 1;
}

export { nextId };
export default db;
