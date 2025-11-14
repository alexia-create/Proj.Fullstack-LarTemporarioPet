const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.use(express.json());


app.get('/usuarios', async (req, res) => {
    try {

        const { rows } = await db.query('SELECT nome_completo, email FROM Usuarios');

        res.json(rows);

    } catch (err) {

        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro no servidor');
    }
});


const bcrypt = require('bcrypt');


app.post('/usuarios', async (req, res) => {
    const { nome_completo, email, senha, telefone, cidade, estado } = req.body;


    if (!nome_completo || !email || !senha || !cidade || !estado) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    try {

        const salt = await bcrypt.genSalt(10);
        const senha_hash = await bcrypt.hash(senha, salt);


        const querySQL = `
      INSERT INTO Usuarios (nome_completo, email, senha_hash, telefone, cidade, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nome_completo, email, cidade, estado; 
    `;


        const valores = [nome_completo, email, senha_hash, telefone, cidade, estado];


        const { rows } = await db.query(querySQL, valores);

        res.status(201).json(rows[0]);

    } catch (err) {

        if (err.code === '23505') {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }

        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro no servidor');
    }
});


const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }


    try {

        const payload = jwt.verify(token, 'SEGREDO_DO_JWT');


        req.usuario = payload;


        next();

    } catch (err) {

        res.status(403).json({ error: 'Token inválido.' });
    }
}


app.post('/login', async (req, res) => {

    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {

        const querySQL = 'SELECT * FROM Usuarios WHERE email = $1';
        const { rows } = await db.query(querySQL, [email]);


        if (rows.length === 0) {

            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }


        const usuario = rows[0];


        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {

            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }


        const payload = {
            id: usuario.id,
            nome: usuario.nome_completo,
            email: usuario.email
        };


        const token = jwt.sign(
            payload,
            'SEGREDO_DO_JWT',
            { expiresIn: '8h' }
        );

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome_completo,
                email: usuario.email
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/animais', verificarToken, async (req, res) => {

    const {
        nome_animal,
        tipo_animal,
        porte,
        idade_aproximada,
        sexo,
        historia_animal,
        cuidados_especiais
    } = req.body;


    const solicitante_id = req.usuario.id;


    if (!nome_animal || !tipo_animal || !porte || !historia_animal) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }


    try {
        const querySQL = `
      INSERT INTO Animais (solicitante_id, nome_animal, tipo_animal, porte, idade_aproximada, sexo, historia_animal, cuidados_especiais)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *; 
    `;

        const valores = [
            solicitante_id,
            nome_animal,
            tipo_animal,
            porte,
            idade_aproximada,
            sexo,
            historia_animal,
            cuidados_especiais
        ];

        const { rows } = await db.query(querySQL, valores);


        res.status(201).json(rows[0]);

    } catch (err) {
        console.error('Erro ao cadastrar animal:', err);
        res.status(500).send('Erro no servidor');
    }
});


app.get('/animais', async (req, res) => {
    try {

        const querySQL = `
      SELECT id, nome_animal, tipo_animal, porte 
      FROM Animais 
      WHERE status = 'buscando_lar'
      ORDER BY data_cadastro DESC;
    `;


        const { rows } = await db.query(querySQL);

        res.status(200).json(rows);

    } catch (err) {
        console.error('Erro ao listar animais:', err);
        res.status(500).send('Erro no servidor');
    }
});


app.get('/animais/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const querySQL = 'SELECT * FROM Animais WHERE id = $1';
        const { rows } = await db.query(querySQL, [id]);


        if (rows.length === 0) {
            return res.status(404).json({ error: 'Animal não encontrado.' });
        }


        const animal = rows[0];

        const solicitanteQuery = 'SELECT nome_completo, telefone FROM Usuarios WHERE id = $1';
        const solicitanteResult = await db.query(solicitanteQuery, [animal.solicitante_id]);

        const solicitante = solicitanteResult.rows[0];


        res.status(200).json({
            ...animal,
            solicitante_info: {
                nome: solicitante.nome_completo,
                telefone: solicitante.telefone
            }
        });

    } catch (err) {
        console.error('Erro ao buscar animal:', err);
        res.status(500).send('Erro no servidor');
    }
});


app.put('/animais/:id', verificarToken, async (req, res) => {

    const usuarioLogadoId = req.usuario.id;


    const { id: animalId } = req.params;


    const {
        nome_animal,
        tipo_animal,
        porte,
        idade_aproximada,
        sexo,
        historia_animal,
        cuidados_especiais,
        status
    } = req.body;


    if (!nome_animal || !tipo_animal || !porte || !historia_animal || !status) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    try {

        const animalQuery = 'SELECT solicitante_id FROM Animais WHERE id = $1';
        const { rows: animalRows } = await db.query(animalQuery, [animalId]);

        if (animalRows.length === 0) {
            return res.status(404).json({ error: 'Animal não encontrado.' });
        }

        const animal = animalRows[0];


        if (animal.solicitante_id !== usuarioLogadoId) {

            return res.status(403).json({ error: 'Acesso negado. Você não é o dono deste post.' });
        }


        const updateQuery = `
      UPDATE Animais 
      SET 
        nome_animal = $1, 
        tipo_animal = $2, 
        porte = $3, 
        idade_aproximada = $4, 
        sexo = $5, 
        historia_animal = $6, 
        cuidados_especiais = $7,
        status = $8
      WHERE id = $9
      RETURNING *; 
    `;

        const valores = [
            nome_animal,
            tipo_animal,
            porte,
            idade_aproximada,
            sexo,
            historia_animal,
            cuidados_especiais,
            status,
            animalId
        ];

        const { rows: updatedRows } = await db.query(updateQuery, valores);


        res.status(200).json(updatedRows[0]);

    } catch (err) {
        console.error('Erro ao atualizar animal:', err);
        res.status(500).send('Erro no servidor');
    }
});


app.delete('/animais/:id', verificarToken, async (req, res) => {

    const usuarioLogadoId = req.usuario.id;


    const { id: animalId } = req.params;

    try {

        const animalQuery = 'SELECT solicitante_id FROM Animais WHERE id = $1';
        const { rows: animalRows } = await db.query(animalQuery, [animalId]);

        if (animalRows.length === 0) {
            return res.status(404).json({ error: 'Animal não encontrado.' });
        }

        const animal = animalRows[0];


        if (animal.solicitante_id !== usuarioLogadoId) {
            return res.status(403).json({ error: 'Acesso negado. Você não é o dono deste post.' });
        }


        const deleteQuery = 'DELETE FROM Animais WHERE id = $1 RETURNING *;';
        const { rows: deletedRows } = await db.query(deleteQuery, [animalId]);


        res.status(200).json({
            message: 'Animal deletado com sucesso.',
            animal_deletado: deletedRows[0]
        });

    } catch (err) {

        if (err.code === '23503') {
            return res.status(400).json({ error: 'Não é possível deletar este animal, pois ele tem solicitações de hospedagem ativas.' });
        }
        console.error('Erro ao deletar animal:', err);
        res.status(500).send('Erro no servidor');
    }
});


app.listen(port, () => {
    console.log(`Servidor PousaPet rodando na porta ${port}`);
    console.log(`🔗 Teste a conexão em: http://localhost:${port}/usuarios`);
});