export const routes = [
    {
        method: 'POST',
        path: '/tasks',
        handler: (req, res) => {
            const { id, title, description, completed_at, created_at, updated_at } = req.body

            const user = {
                id: 1,
                title: 'tarefa',
                description: 'descrição da tarefa',
                completed_at : null,
                created_at: new Date(),
                updated_at: new Date()
            }
            console.log('Cadastro OK', user)

        return res.writeHead(201).end(JSON.stringify(user))
    }
    }

]