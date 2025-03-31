// importar la libreria que instalamos
import express from "express" 
import fs from "fs"

const app = express()

const port = 3000

app.use(express.json()) //quiero que mi aplicacion utilice json

//definir mis endpoint
    // la primera parte del code " / "
//entra la direccion del servidor y mostrar un log en la consola del servidor
app.get("/" , (req, res)=>{
    fs.readFile("./html/home.html", "utf8",
        (err, html) =>{ //me va a manar dos cosas un error y un objeto html
            if(err){
                res.status(500).send("Tere was an error: "+err)
                return
            }
            console.log("Sending page..")
            res.send(html)
            console.log("Page sent!")
        })
})


app.get("/person" , (req, res)=>{
    console.log("Hello server")

    const person ={
        name : "SeteveJobs",
        email : "stevejobs@apple.com",
        message: "Hello world from server"
    }

    res.json(person)
})

app.listen(port, ()=>
{
    console.log(`Example app listening on port ${port}`)
})