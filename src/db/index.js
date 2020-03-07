import {FuseJsTodoIndexer} from '@ochuzor/todo.txt-indexer';
import {UrlTodoStore, TodoDb, JsonEncoder, B64Ecoder} from '@ochuzor/todo.txt-store';

const indexer = new FuseJsTodoIndexer();
const encoder =  JsonEncoder.FromStringEcoder(new B64Ecoder());
const store = new UrlTodoStore(window.location, encoder);

const db = new TodoDb(indexer, store);

store.readData().forEach(todoDoc => indexer.addDoc(todoDoc));

function nextId() {
    return db.getAll().length + 1;
}

export { nextId };
export default db;
