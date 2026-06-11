const express = require('express');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios.routes');
const servicosRoutes = require('./routes/servicos.routes');
const agendamentosRoutes = require('./routes/agendamentos.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

// Servir os arquivos estaticos do front-end (HTML/JS) a partir de src/public
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/agendamentos', agendamentosRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
//teste