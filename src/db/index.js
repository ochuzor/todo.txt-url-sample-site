import {FuseJsTodoIndexer} from '@ochuzor/todo.txt-indexer';
import {UrlTodoStore, TodoDb, JsonEncoder, B64Ecoder} from '@ochuzor/todo.txt-store';
import {UrlTodoExporter, WebFileExporter, StringTodoExporter} from '@ochuzor/todo.txt-export';

const indexer = new FuseJsTodoIndexer();
const encoder =  JsonEncoder.FromStringEcoder(new B64Ecoder());
const store = new UrlTodoStore(window.location, encoder);

const urlExporter = new UrlTodoExporter(window.location.origin, encoder);
const webFileExporter = new WebFileExporter('todo.txt', new StringTodoExporter());

const db = new TodoDb(indexer, store);

store.readData().forEach(todoDoc => indexer.addDoc(todoDoc));

function nextId() {
    const maxId = db.getAll().reduce((currentMax, doc) => {
        const id = parseInt(doc.id, 10);
        return !!id && (id < currentMax) ? currentMax : id;
    }, 1);
    return maxId + 1;
}

export { nextId, urlExporter, webFileExporter };
export default db;
