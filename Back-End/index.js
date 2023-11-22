const aioKey = "";
const url = 'https://io.adafruit.com/api/v2/LaraGenovese/feeds/servo1/data';
const formData = new FormData();
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const util = require('util');
const credentials = require('./credential.json');
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");

const connection = mysql.createConnection(process.env.DATABASE_URL = 'mysql://s5wnjgvmqnjdlo5z92fk:pscale_pw_Gtujy1l6UwB6I2xSHZ2E1hvHvIN95cVif0AsWN6WXEv@aws.connect.psdb.cloud/proyecto?ssl={"rejectUnauthorized":true}');
connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});


const app = express();
app.use(express.json());
app.use(cors({
  origin: '*'
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403).json({ message: 'You are not logged in' });
  }
  try {
    const data = jwt.verify(token, process.env.SECRET_KEY);
    req.nombreUsuario = data.nombreUsuario;
    req.mail = data.mail;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

app.get("/status", (req, res) => {
  connection.query('SELECT * FROM boton_prendiendo LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({
        error: err
      })
    }
    res.json(results[0].name);
  });
});

app.post("/registrarse", (req, res) => {
  const { nombre, mail, password } = req.body;
  console.log(req.body);
  const updateQuery = `INSERT INTO usuario SET nombre = ?, mail = ?, contrasenia = ?`;
  const values = [nombre, mail, password];
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      // Manejar el error
    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
      const jwtToken = jwt.sign({ mail }, 'tu_clave_secreta', { expiresIn: '1h' });
      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 30),
        withCredentials: true,
        secure: true,
        sameSite: "none"
      };
  
      res.cookie("access_token", jwtToken, options)
      .status(200)
      .json({ message: true, jwtToken })
      .send()
    }
  })
  console.log("se corrio el insert")
});


//usuario 
app.get("/usuario/:email", (req, res) => {
  const userEmail = req.params.email;
  const selectQuery = `SELECT * FROM usuario WHERE mail = ?`;

  connection.query(selectQuery, userEmail, (error, results) => {
    if (error) {
      console.error('Error al obtener la información del usuario:', error);
      res.status(500).json({ error: 'Error al obtener la información del usuario' });
    } else {
      if (results.length > 0) {
        const userData = results[0]; // Suponiendo que el resultado es un solo usuario
        res.status(200).json(userData);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    }
  });
});


app.post("/InicioSesion", (req, res) => {
  const { mailfront, passwordfront } = req.body;
  const sql = 'SELECT * FROM usuario WHERE mail = ? AND contrasenia = ?';
  console.log(mailfront, passwordfront);
  connection.query(sql, [mailfront, passwordfront], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      // Manejar el error
    } else {
      if (results.length > 0) {
        console.log("los resultados coinciden");

        const jwtToken = jwt.sign({ mailfront }, 'tu_clave_secreta', { expiresIn: '1h' });
        const options = {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 30),
          withCredentials: true,
          secure: true,
          sameSite: "none"
        };
    
        res.cookie("access_token", jwtToken, options)
        .status(200)
        .json({ success: true, message: "inicio sesion success" })
        .send()
      }
      else {
        console.log("los resultados no coinciden");
        res.status(401).json({ success: false, message: 'Inicio de sesión fallido' });
      }
    }
  })
  console.log("se corrio el insert")
});


app.get("/compartimento1", authorization, (req, res) => {
  const updateQuery = 'INSERT INTO pastilla SET envase = ?';
  const values = ['1'];
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      res.status(403).send({ error })
      // Manejar el error
    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
      // Hacer algo con los resultados
      res.status(200).send({ message: "Ok" })
    }
  })
});
app.get("/compartimento2", (req, res) => {
  const updateQuery = 'INSERT INTO pastilla SET envase = ?';
  const values = ['2'];
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      res.status(403).send({ error })
      // Manejar el error
    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
      // Hacer algo con los resultados
      res.status(200).send({ message: "Ok" })
    }
  })
});
app.get("/compartimento3", (req, res) => {
  const updateQuery = 'INSERT INTO pastilla SET envase = ?';
  const values = ['3'];
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      res.status(403).send({ error })
      // Manejar el error
    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
      // Hacer algo con los resultados
      res.status(200).send({ message: "Ok" })
    }
  })
});
app.get("/compartimento4", (req, res) => {
  const updateQuery = 'INSERT INTO pastilla SET envase = ?';
  const values = ['4'];
  connection.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);
      res.status(403).send({ error })
      // Manejar el error
    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
      // Hacer algo con los resultados
      res.status(200).send({ message: "Ok" })
    }
  })
});
app.post("/compartimento1informacion", authorization, async (req, res) => {
  try {
    const jwtToken = req.jwtToken;
    console.log(req)
    jwt.verify(jwtToken, 'tu_clave_secreta', (err, decoded) => {
      if (err) {
        console.error('Error al verificar el token:', err);
        return res.status(401).json({ error: 'Token inválido' });
      }

    });

    const { nombre, horario, fechainicio } = req.body;
    const updateQuery = 'UPDATE pastilla SET nombre = ?, hora = ?, fecha = ? WHERE envase = 1';

    const query = util.promisify(connection.query).bind(connection);
    const result = await query(updateQuery, [nombre, horario, fechainicio]);

    console.log('Actualización exitosa. Filas afectadas:', result.affectedRows);

    const jwtMailfront = req.jwtMailfront;


    // Crear evento en Google Calendar después de guardar en la base de datos
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    console.log(credentials);

    // Refer to the Node.js quickstart on how to setup the environment:
    // https://developers.google.com/calendar/quickstart/node
    // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
    // stored credentials.

    const event = {
      'summary': nombre,

      'description': 'A chance to hear more about Google\'s developer products.',
      'start': {
        'dateTime': fechainicio + 'T' + horario,
        'timeZone': 'America/Argentina/Buenos_Aires',
      },
      'end': {
        'dateTime': fechainicio + 'T' + horario,
        'timeZone': 'America/Argentina/Buenos_Aires',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
        { 'email': 'lpage@example.com' },
        { 'email': 'sbrin@example.com' },
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 24 * 60 },
          { 'method': 'popup', 'minutes': 10 },
        ],
      },
    };

    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function (err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    });
  }
  catch (err) {
    console.error('Error:', err);
    res.status(500).send({ error: 'Error al ejecutar la operación' });
  }
});

/*
app.post("/compartimento1informacion", (req, res) => {
  console.log(req.body)
  const { nombre, horario, fechainicio, } = req.body;
  const updateQuery = 'UPDATE pastilla SET nombre = ?, hora = ?, fecha = ? WHERE envase = 1';
  connection.query(updateQuery, [nombre, horario, fechainicio], (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta de actualización:', error);

    } else {
      console.log('Actualización exitosa. Filas afectadas:', results.affectedRows);
    
    
      
      var fechaActual = new Date();
      motor1 = 0
      const sql = 'SELECT * FROM pastilla WHERE envase = 1 AND fecha = ? AND hora = ?';
      connection.query(sql,[fecha,hora],(error, results) =>{
        if(error){
          console.error('Error al ejecutar la consulta de actualización:', error);
        }
        else{
          console.log("se agarraron los datos");
          if (fecha.Date == fechaActual.Date) {
            if ((hora == fechaActual.getHours &&  hora.getMinutes == fechaActual.getMinutes)) {
              motor1 = 'ON';
              console.log("se movio el motor")
            }
            else{
              motor1 = 'OFF';
            }
          }
        }
      })
    }
  })
});
*/


/*
var fechaActual = new Date();
const sql = 'SELECT * FROM pastilla WHERE envase = 1 AND fecha = ? AND hora = ?';
connection.query(sql,[fecha,hora], (error, results) => {
    if (error) {
    console.error('Error al ejecutar la consulta de actualización:', error);
    // Manejar el error
  } else {
    console.log("se agarraron los datos");
    if (fecha.Date == fechaActual.Date) {
      if ((hora == fechaActual.getHours &&  hora.getMinutes == fechaActual.getMinutes)) {
        motor1 = 'ON';
        console.log("se movio el motor")
      }
      else {
        motor1 = 'OFF';
      }
    }
  }
});
*/

/*
const sql = 'SELECT * FROM pastilla WHERE envase = 1 AND fecha = ? AND hora = ?';
connection.query(sql,[fecha,hora], (error, results) => {
    if (error) {
    console.error('Error al ejecutar la consulta de actualización:', error);
    // Manejar el error
  } else {
    console.log("se agarraron los datos");
    if (fecha == fechaActual) {
      if ((horaActual === horaInicio && minutoActual >= minutoInicio)) {
        motor1 = 'ON';
      }
      else {
        motor1 = 'OFF';
      }
    }
  }
});

formData.append('value', motor1);

fetch(url, {
  method: 'POST',
  headers: {
    "X-AIO-Key": aioKey
  },
  body: formData
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Request failed with status: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });

console.log('Se ejecuto SERVO 1');

////////////////////////////////////////////////////////
*/
app.listen(5000, () => {
  console.log("Example app listening on port 5000!");
});