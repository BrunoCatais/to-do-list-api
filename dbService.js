import {join, dirname} from 'path'
import {Low, JSONFile} from 'lowdb'
import {fileURLToPath} from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

db.data ||= {tarefas: [], listas: []}

await db.write()

class dbService {

    findListaById(id) {
        return db.data.listas.find(lista => lista.id === id)
    }

    findAllListas() {
        return db.data.listas
    }

    async deleteListaById(id) {
        let listaToBeDeleted = db.data.listas.find(lista => lista.id === id)
        db.data.listas = db.data.listas.filter(lista => lista !== listaToBeDeleted)

        let tarefasToBeDeleted = db.data.tarefas.filter(tarefa => tarefa.listaId === id)
        db.data.tarefas = db.data.tarefas.filter(tarefas => !tarefasToBeDeleted.includes(tarefas))
        await db.write()
    }

    async insertLista(nome, descricao) {
        let id = this.findNextListaId()
        let lista = {
            id: id,
            nome: nome,
            descricao: descricao
        }
        db.data.listas.push(lista)
        await db.write()
    }

    findNextListaId() {
        if (db.data.listas.length <= 0) {
            return 1
        } else {
            let lastLista = db.data.listas[db.data.listas.length - 1]
            return lastLista.id + 1
        }
    }

    findTarefasByListaId(listaId) {
        return db.data.tarefas.filter(tarefa => tarefa.listaId === listaId)
    }

    async insertTarefa(listaId, nome, descricao, data, etiqueta) {
        let id = this.findNextTarefaId(listaId)
        if (this.findListaById(listaId)) {
            let tarefa = {
                id: id,
                listaId: listaId,
                nome: nome,
                descricao: descricao,
                data: data,
                etiqueta: etiqueta
            }
            db.data.tarefas.push(tarefa)
            await db.write()
        }
    }

    findNextTarefaId(listaId) {
        let listaTarefas = this.findTarefasByListaId(listaId)
        if ( listaTarefas.length <= 0) {
            return 1
        } else {
            let lastTarefa = listaTarefas[listaTarefas.length - 1]
            return lastTarefa.id + 1
        }
    }

    async deleteTarefaByTarefaAndListaId(tarefaId, listaId) {
        let tarefaToBeDeleted = db.data.tarefas.find(tarefa => tarefa.id === tarefaId && tarefa.listaId === listaId)
        db.data.tarefas = db.data.tarefas.filter(tarefa => tarefa !== tarefaToBeDeleted)
        await db.write()
    }
}

export default new dbService()