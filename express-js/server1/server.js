import express from 'express';


const app = express();


app.listen(1984, () => {
   console.log('Up and up');
});

app.get('/bienvenida', (req, res) => {
   res.send('Esto no es una página html');
});


app.get('/otraBienvenida', (req, res) => {
  res.sendFile('bienvenida.html');
});
