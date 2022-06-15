import dbService from './dbService.js'
import express from 'express'
import connectTimout from 'connect-timeout'

const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(connectTimout(4000))

// GetAllListas
app.get('/api/listas', (req, res) => {
    let listas = dbService.findAllListas()
    res.send(listas)
})

// GetListaById
app.get('/api/listas/:id', (req, res) => {
    let id = parseInt(req.params.id)
    let lista = dbService.findListaById(id)
    res.send(lista)
})

// InsertLista
app.post('/api/listas', (req, res) => {
    if (req.body.nome && req.body.descricao) {
        dbService.insertLista(req.body.nome, req.body.descricao)
        res.send(req.body)
    }
})

// DeleteListaById
app.delete('/api/listas/:id', (req, res) => {
    let id = parseInt(req.params.id)
    dbService.deleteListaById(id).then(() => res.sendStatus(200))
})

// GetTarefasByListaId
app.get('/api/tarefas/:listaId', (req, res) => {
    let listaId = parseInt(req.params.listaId)
    let tarefas = dbService.findTarefasByListaId(listaId)
    res.send(tarefas)
})

// InsertTarefa
app.post('/api/tarefas', (req, res) => {
    if (req.body.listaId && req.body.nome && req.body.descricao && req.body.data && req.body.etiqueta) {
        dbService.insertTarefa(req.body.listaId, req.body.nome, req.body.descricao, req.body.data, req.body.etiqueta)
        res.send(req.body)
    }
})

// DeleteTarefaByTarefaAndListaId
app.delete('/api/listas/:listaId/tarefas/:tarefaId', (req, res) => {
    let listaId = parseInt(req.params.listaId)
    let tarefaId = parseInt(req.params.tarefaId)
    dbService.deleteTarefaByTarefaAndListaId(tarefaId, listaId).then(() => res.sendStatus(200))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})