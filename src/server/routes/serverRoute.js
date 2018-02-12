import Express from 'express'

import index from '../api/index'
import user from '../api/user'
import clientList from '../api/clientList'
import captchas from '../api/captchas'
import importTable from '../api/importTable'
const app = Express.Router()

app.get('/', index)
app.get('/list/:id', index)
app.get('/userinfo/:id', index)
app.get('/add/:id', index)
app.get('/vLogin', user.vLogin)
app.post('/onLogin', user.onLogin)
app.get('/singout', user.singout)
app.get('/captchas', captchas.getCaptchas)
app.post('/register', user.register)
app.post('/createClient', clientList.createClient)
app.get('/clientList', clientList.showClient)
app.get('/getClient/:client_id', clientList.getClient)
app.put('/clients/:client_id', clientList.editorClient)
app.delete('/client/:client_id', clientList.delClient)
app.get('/search', clientList.searchClient)

app.get('/test', importTable.test)
app.post('/fileTest', importTable.fileTest)
export default app