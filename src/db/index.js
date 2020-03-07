import {FuseJsTodoIndexer} from '@ochuzor/todo.txt-indexer';
import {UrlTodoStore, TodoDb, JsonEncoder, B64Ecoder} from '@ochuzor/todo.txt-store';
import {UrlTodoExporter, WebFileExporter, StringTodoExporter} from '@ochuzor/todo.txt-export';

const indexer = new FuseJsTodoIndexer();
const encoder =  JsonEncoder.FromStringEcoder(new B64Ecoder());
const store = new UrlTodoStore(window.location, encoder);

const exporter = new UrlTodoExporter(window.location.origin, encoder);
const webFileExporter = new WebFileExporter('todo.txt', new StringTodoExporter());

// const ls = [{id: 1, text: 'its a good show @computer'}];
// console.log(exporter.export(ls))
// webFileExporter.export(ls);

const db = new TodoDb(indexer, store);

store.readData().forEach(todoDoc => indexer.addDoc(todoDoc));

function nextId() {
    return db.getAll().length + 1;
}

export { nextId, exporter, webFileExporter };
export default db;
