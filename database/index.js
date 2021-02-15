const mongoose = require("mongoose");

//Conexao com o mongodb Atlas que é o online
//mongoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false', {
mongoose.connect('mongodb+srv://SYSDBA:MASTER@cluster0.1jkkz.mongodb.net/gilson', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Conectado com sucesso DB")
}).catch((err)=>{
    console.log(err)
});