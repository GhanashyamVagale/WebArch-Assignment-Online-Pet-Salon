const express = require('express'); //middlware
const app = express(); 
const mongoose = require('mongoose');//this is the package used to connect to mongodb server
const bodyparser = require('body-parser');//this package reads the input from the webpage
const res = require('express/lib/response');

app.use(bodyparser.urlencoded({ extended: true }));
app.use('/styles', express.static('styles'));
app.use('/resources', express.static('resources'));
mongoose.connect("mongodb+srv://ghanashyam:abcd_1234@cluster0.u4bakvv.mongodb.net/Web_Arch");//this is the connection 

const Services = {
    serviceType: String,
    dateValue: String,
    userName: String,
    petName: String
}

const Users = {
    userName: String,
    password: String
}

const User = mongoose.model("Users", Users);
const Service = mongoose.model("Services", Services); // table creation happening here

async function getItems() {
    const Items = await Service.find({});
    return Items;
}

async function getUsers() {
    const Items = await User.find({});
    return Items;
}

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signin.html");
});

app.get("/index", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get('/ServiceList.html', function (req, res) {
    res.sendFile(__dirname + "/ServiceList.html");
});


app.get('/DeleteEntry.html', function (req, res) {
    res.sendFile(__dirname + "/DeleteEntry.html")
})

app.post("/fetchDetails", function (req, res) {
    getItems().then(function (FoundItems) {
        for (const ele of FoundItems) {
            if (ele.userName === req.body.userName) {
                if (ele.petName === req.body.petName) {
                    res.write("<h1> Services availed </h1>");
                    res.write("<h4>" + ele.serviceType + "</h4>");
                    console.log(ele.dateValue)
                    res.write("<p> Very excited to have <em>" + ele.petName + "</em> onboard. Don't worry <em>" + ele.userName + "</em> we will take good care of your pet </p>");
                }
            }
        }
    })
});

app.post("/signin", function (req, res) {
    let k;
    getUsers().then(function (FoundItems) {
        for (const ele of FoundItems) {
            if (req.body.uname === ele.userName) {
                if (req.body.psw === ele.password) {
                    res.sendFile(__dirname + "/index.html");
                }
            }
        }
    });
});

app.post("/register", function (req, res) {
    res.sendFile(__dirname + "/register.html");
})

app.post("/RegisterNewUser", function (req, res) {
    let newUser = new User({
        userName: req.body.uname,
        password: req.body.psw
    });
    newUser.save();
    res.sendFile(__dirname + "/index.html");
})

app.get("/form.html", function (req, res) {
    res.sendFile(__dirname + "/form.html");
});
app.get("/form2.html", function (req, res) {
    res.sendFile(__dirname + "/form2.html");
});

app.post("/boarding", function (req, res) {
    let newService = new Service({
        userName: req.body.userName,
        petName: req.body.petName,
        serviceType: req.body.service,
        dateValue: req.body.date
    });
    newService.save();
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>Success</title></head>');
    res.write('<body><h1>Registration Successful</h1></body>')
    res.write('<body><button><a href="/index">Home</a></button></body>')
});

const deleteDocument = async (userName, petName, serviceType) => {
    const result = await Service.deleteMany({ serviceType, petName });
    return result;
};

app.post("/deleteEntry", function (req, res) {
    const userName = req.body.userName;
    const petName = req.body.petName;
    const serviceType = req.body.serviceType;
    console.log(serviceType);
    let deleteStatus = deleteDocument(userName, petName, serviceType).then(result => {
        if (result.acknowledged == true) {
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>Delete Status</title></head>');
            res.write('<body><h3>Processing Delete Request ...</h3>');
            if (result.deletedCount > 0) {
                res.write("<body><h1>Deleted </h1>" + result.deletedCount + " entries successfully<br>");
                res.write('<body><button><a href="/index">Home</a></button></body>');
            } else {
                res.write("<body><h1>Didn't found any records </h1>");
                res.write('<body><button><a href="/deleteEntry.html">Try again</a></button></body>')
                res.write('<body><button><a href="/index">Home</a></button></body>');
            }
        }
    })
});
app.listen(3000, function () {
    console.log("Hello world!");
});