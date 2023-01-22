const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session   = require('express-session');
const FileStore = require('session-file-store')(session);
const flash     = require('express-flash');
//importando conexão com banco de dados
const db = require("./db/conn.js");

//css
app.use(express.static('./public'));

//Configuração das sessões
app.use(
  session({
      name: 'session',
      secret: 'nosso-secret',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
          logFn: function () {},
          path: require('path').join(require('os').tmpdir(), 'sessions')
      }),
      cookie: {
          secure: false,
          maxAge: 360000,
          expires: new Date(Date.now(), +360000),
          httpOnly: true
      }
  })
);

//Setar sessões para requisição
app.use((req, res, next) => {
  if(req.session.userId){
      res.locals.session = req.session
  }
  next()
});

//Configurando Flash Messagens
app.use(flash());


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//Middlewares para receber dados do form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//css
app.use(express.static('./public'));

//rota pagina inicial
app.get("/", (req, res) => {
  res.redirect("/login");
});

//tela login
app.get("/login", (req, res) => {
  res.render('login/login');
})

//cadastro usuarios
app.get("/cadastrar", (req, res) => {
  const perfil = Perfil.findAll().then(() => {
    res.render("cadastro", { perfil });
  });
});

app.get("/faq", (req, res) => {
  res.render('faq');
})

//importando rota /usuario
const usuario = require("./routes/usuario");
app.use("/usuarios", usuario);

//importanto rota reserva
const reserva = require('./routes/reservaRoutes');
app.use('/reservas', reserva);

//importando rota /login
const login = require("./routes/loginRoutes");
app.use("/login", login);

//importando rota /menu
const menu = require("./routes/menuRoutes");
app.use("/menu", menu);

//Importando models
const Perfil = require("./models/Perfi");
const Usuario = require("./models/Usuario");
const Funcionario = require("./models/Funcionario");
const Associado = require("./models/Associado");
const Dependente = require("./models/Dependente");
const Detalhe = require("./models/Detalhes_alteracao");
const Area = require("./models/Areas_reserva");
const Reserva = require("./models/Reserva");
const Login = require("./models/Login");

//importando conexão dependentes
const dependentesRoutes = require('./routes/dependentesRoutes');
app.use('/dependentes', dependentesRoutes);

//Sincronizando models antes de ligar o servidor
db.sync()
// db.sync({force: true})
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000...");
    });
  })
  .catch((err) => {
    throw err;
  });
