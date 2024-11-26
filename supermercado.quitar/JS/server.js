const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Asegúrate de que esta línea esté presente
const bodyParser = require('body-parser');
const session = require('express-session'); // Agregar express-session
const cors = require('cors');




const app = express();
const uri = "mongodb://localhost:27017"; // Asegúrate de que la URL sea correcta para tu entorno
const client = new MongoClient(uri);
const dbName = 'SuperDB';
const secretKey = 'chayancito';

app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(cors());

// Configuración de sesiones
app.use(session({
    secret: secretKey, // Puedes cambiar el secreto por algo más seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(
            {
                message: 'Por favor, ' +
                    'ingrese un usuario' +
                    ' y contraseña válidos'
            });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        const userExists =
            await usersCollection.findOne({ username });
        if (userExists) {
            return res.status(400).json(
                { message: 'El nombre de usuario ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);

        res.status(201).json(
            { message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json(
            { message: 'Error interno del servidor' });
    } finally {
        await client.close();
    }
});

lo

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Por favor, ingrese un usuario y contraseña validos' })
    }

try {
    await client.connect();
    const db = client.db(dbName);
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' })
    }

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
    return res.status(401).json({ message: 'Contraseña incorrecta' })
}

req.session.user = { username: user.username, role: username === 'admin' ? 'admin' : user}

if (username === 'admin' && password === '1234') {
    return res.status(200).json({ redirect: 'admin.html' })
} else {
    return res.status(200).json({ redirect: 'index.html' })
}
} catch (error) {
    console.error('Error al iniciar sesión :', error);
    res.status(500).json({ message: 'Error interno del servidor'});
} finally {
    await client.close();
}
});

app.get('/admin.html', (req, res) => {
    if (req.session.user && req.session.user.role === 'admin') {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.redirect('/index.html');
    }
})



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
        Servidor ejecutando
         en el puerto ${PORT}`);
});
