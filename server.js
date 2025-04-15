const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const {MongoClient} = require("mongodb");
const url="mongodb://localhost:27017";

const client=new MongoClient(url);
app.use(express.urlencoded({ extended: true }));
async function connect(){
	try{
		await client.connect();
		console.log('MongoDB Connected');
	}
	catch(err)
	{
		console.log('err occ');
		process.exit(1);
	}
}


const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(urlencodedParser);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each HTML page
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});

app.get('/about', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/women', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'dress.html'));
});

app.get('/del', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'delete.html'));
});

app.get('/registrationindex', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'registrationindex.html'));
});

app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/view_user', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'view_user.html'));
});
app.get('/contact', function (request, response) {
    response.sendFile(path.join(__dirname, 'public', 'contact.html'));
});
app.get('/insertregister',async function(req,res){
	
	var doc = {
        name: req.query.name,
        username: req.query.uname,
        email: req.query.email,
        phoneNumber: req.query.phone,
        password: req.query.password,
        
    };
    
	const db=client.db("Boutique");
	const coll=db.collection("register");
	var result=await coll.insertOne(doc);
	res.redirect('homepage.html');


	res.end();
});

app.get('/insertlogin', async function(req, res) {
    const doc = {
        email: req.query.email,
        password: req.query.password,
    };

    try {
        // Connect to the MongoDB database
        const db = client.db("Boutique");
        
        // Access the register and login collections
        const register = db.collection("register");
        const login = db.collection("login");

        // Find the user in the register collection
        const user = await register.findOne({ email: doc.email });

        // Check if the user exists and the password matches
        if (user && user.password === doc.password) {
            // Insert login details into the login collection
            await login.insertOne({ email: doc.email, timestamp: new Date() });
            // Redirect to homepage after successful login
            res.redirect('addcart.html');
        } else {
            // Redirect back to login page with error message
            res.redirect('login.html?error=invalid_credentials');
        }
    } catch (error) {
        console.error("Error during login:", error);
        // Redirect back to login page with error message
        res.redirect('login.html?error=login_error');
    }
});



app.get('/insertadmin', async function(req, res) {
    const { email, password } = req.query;

    try {
        // Connect to the MongoDB database
        const db = client.db("Boutique");
        
        // Access the admin collection
        const admin = db.collection("admin");

        // Check if the user is an admin
        const adminperson = await admin.findOne({ email: email, password: password });
        
        if (adminperson) {
            // Redirect to the admin page after successful login
            res.redirect('adminpage.html');
        } else {
            // Redirect back to the login page with an error message
            res.redirect('adminlogin.html?error=invalid_credentials');
        }
    } catch (error) {
        console.error("Error during admin login:", error);
        // Redirect back to the login page with an error message
        res.redirect('adminlogin.html?error=login_error');
    }
});

app.post('/add-to-cart',async(req,res)=>
{
    try {
        const{productId,quantity}=req.body;

        const productDetails = products[productId];
        const pdb = client.db('Boutique');
        const ccoll= pdb.collection("cart");
        await ccoll.insertOne({
            name:productDetails.name,
            price:productDetails.price,
            quantity:productDetails.quantity
        });
    }catch (error)
    {
        console.error("Error inserting data into MongoDB:", error);
        res.status(500).send("Error inserting data into MongoDB");
    }
});

app.post('/update-quantity', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Retrieve product details from your products array
        const productDetails = products[productId];

        // Update product quantity in the database
        const pdb = client.db('Boutique');
        const ccoll = pdb.collection("cart");
        await ccoll.updateOne(
            { name: productDetails.name },
            { $set: { quantity: quantity } }
        );

        res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        console.error("Error updating product quantity in MongoDB:", error);
        res.status(500).send("Error updating product quantity in MongoDB");
    }
});




app.get('/delete',async function(req,res){
	
	var doc={email:req.query.email};
	const db=client.db("Boutique");
	const coll=db.collection("register");
	var result=await coll.deleteOne(doc);
	res.write("<h1>deleted Ok</h1>");
    res.write("||<a href='adminpage.html'>Home</a>");
	res.end();
});

app.get('/findall',async function(req,res){
    const db = client.db("Boutique");
    const coll = db.collection("register");
    var result = await coll.find({},{_id:0,username:1,email:1,phoneNumber:1
        ,password:1}).toArray();
    
	res.write("<h1>Customers:</h1>");
    res.write("<ol>");
    
    for(var i=0;i<result.length;i++)
    {
        res.write("<li>");
        res.write("NAME :"+result[i].username+"<br>"+"EMAIL :"+result[i].email+"<br>"+"MOBILE NO :"+result[i].phoneNumber+"<br>"+"PASSWORD :"+result[i].password+"<br>"+"<br><br>");
        res.write("</li>");
    }
	res.write("</ol>")
    res.write("||<a href='adminpage.html'>Home</a>");
    res.end();
});

app.get('/update',async function(req,res){
	
	var doc=req.query.email;
	var newdoc=req.query.npassword;

	const db=client.db("Boutique");
	const coll=db.collection("register");
	var result=await coll.updateOne({email: doc}, {$set:{password:newdoc}});
	res.redirect( 'homepage.html');

	res.end();
});
app.post("/", function (request, response) {
    var num1 = request.body.num1;
    response.write("<h1>POST WORKING</h1>");
    response.end();
});

const PORT = 3001;

app.listen(PORT, function () {
    console.log(`Server is running at http://localhost:${PORT}`);
    connect();
});
