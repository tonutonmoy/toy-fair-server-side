const express= require('express');

const app= express();

const cors= require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;



app.use(cors())
app.use(express.json())


app.get('/',(req,res)=>{

    res.send('hello bd')
})









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.andsvfa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


     const database = client.db("toysDB");
    const allToysCollation = database.collection("allToys");


    // find allToys

    app.get('/allToys',async(req,res)=>{


       
      const result = await allToysCollation.find().toArray();


      res.send(result)


    })



    // add a toy

   app.post('/addAToy',async(req,res)=>{

    
        const addAToy= req.body

       
       
      const result = await allToysCollation.insertOne(addAToy);


      res.send(result)


    })


  // my toys

    app.get('/myToys',async(req,res)=>{

      console.log(req.query)

      let query= {};

    if(req.query?.email){

      query={sellerEmail: req.query?.email}
    }


  

  const result= await allToysCollation.find(query ).toArray()

  // console.log(result)

  res.send(result)

   })
   





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



















app.listen(port,()=>{

    console.log(port,"is running")
});





