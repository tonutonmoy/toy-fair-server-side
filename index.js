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
    // await client.connect();


     const database = client.db("toysDB");
    const allToysCollation = database.collection("allToys");


    // Creating index

    const indexKeys={toyName: 1,subCategory: 1};

    const indexOption= {name: "toyNameAndSubCategory"};

    const IndexResult = allToysCollation.createIndex(indexKeys,indexOption)




    // find by toy name

    app.get('/findByToyName',async(req,res)=>{


      const name= req.query.name;

      
        

      const result = await allToysCollation.find({

       $or: [

        {toyName: { $regex: name, $options: "i"}},
        {subCategory: { $regex: name, $options: "i"}},
       ]

      }).toArray()

      

      res.send(result)

    })

  

    // find allToys

    app.get('/allToys',async(req,res)=>{

     const skip= 0;

     const limit= 20;
       
      const result = await allToysCollation.find().skip(skip).limit(limit).toArray();


      res.send(result)


    })



    // find 1 data

    app.get('/viewDetails/:id',async(req,res)=>{

      const id = req.params.id;


      const query={_id : new ObjectId(id)}


      const result = await allToysCollation.findOne(query)

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

     

      let query= {};

    if(req.query?.email){

      query={sellerEmail: req.query?.email}
    }


     const result= await allToysCollation.find(query ).toArray()

 

    res.send(result)

     });


    


   // get single toy
   
    app.get('/updateToy/:id',async(req,res)=>{

     
      const id = req.params.id;

     
      
      const query={_id: new ObjectId(id)}

    


     const result= await allToysCollation.findOne(query )

 

      res.send(result)

      });
   



    //  update toy
   
    app.put('/updateSingleToy/:id',async(req,res)=>{

     
      const id = req.params.id;

      const updateData=req.body
      
      const query={_id: new ObjectId(id)}

    
    

   
     const options = { upsert: true };

        const updateDoc = {
          $set: {
           description: updateData?.description,
           price: updateData?.price,
           quantity: updateData?.quantity
          },
        };

        const result = await allToysCollation.updateOne(query, updateDoc,options);


 

    res.send(result)

     });
   


    // delete a toy

    
    app.delete('/deleteAToy/:id',async(req,res)=>{

        const  id = req.params.id;

        

       const  query = {_id: new ObjectId(id)};

          const result=  await allToysCollation.deleteOne(query)

          res.send(result)
    })



    // sort by price

    app.get('/sortByPrice',async(req,res)=>{

      const email= req.query.email;
      const text= req.query.text;



      const query={sellerEmail: email }
      

      let order=0;

      if(text==='high'){


        order= -1;
      }
      
    
      if(text==='low'){


        order= 1;
      }

    
     


      const result=  await allToysCollation.find(query).sort({price: order}).toArray()

      
      res.send(result)


    });









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





