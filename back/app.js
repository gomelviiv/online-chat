const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();


var jwt = require('jsonwebtoken');
var config = require('./config');
var VerifyToken = require('./VerifyToken');

const userScheme = new Schema({email: String, password: String}, {versionKey: false});
const messageScheme = new Schema({user: String, message: String}, {versionKey: false});
const chatScheme = new Schema({name: String, password: String, users: [ {user: String, statusUserInthisServer: String} ], messages: [ {message:String, user: String } ]},{ versionKey:false })

const User = mongoose.model('User', userScheme);
const Message = mongoose.model('Message', messageScheme)
const Chat = mongoose.model('Chat', chatScheme)

app.use('/images', express.static(__dirname + '/images'));
const allSmiles = {
     'ha' : 'http://localhost:3000/images/happy.png', 
     'ха' : 'http://localhost:3000/images/happy.png',
     'ахахах': 'http://localhost:3000/images/happy.png',
     'лол' : 'http://localhost:3000/images/happy.png',
     'кек' : 'http://localhost:3000/images/happy.png',
     ':)' : 'http://localhost:3000/images/happy.png',
     'угар' : 'http://localhost:3000/images/happy.png',
     'смешно' : 'http://localhost:3000/images/happy.png',
     'смех' : 'http://localhost:3000/images/happy.png',

     ';(': 'http://localhost:3000/images/sad.png',
     ':(': 'http://localhost:3000/images/sad.png',
     'bad': 'http://localhost:3000/images/sad.png',
     'плохо': 'http://localhost:3000/images/sad.png',
     'жаль': 'http://localhost:3000/images/sad.png',
     'слезы': 'http://localhost:3000/images/sad.png',
     'печаль': 'http://localhost:3000/images/sad.png',
}
// app.use((req, res, next) =>  {

// try {
//     next();
// }
// catch(ex){
//     console.log(ex.message);
//     throw ex;
//     }
// });

app.use(express.static(__dirname + "/public"));
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token,x-access-id');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
mongoose.connect("mongodb://localhost:27017/usersdb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    let server = app.listen(3000, function(){


    console.log("Сервер ожидает подключения...");
    });
    var io = require ('socket.io')(server);
    
    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(chatInformation){
            jwt.verify(chatInformation.token, config.secret, function(err, decoded) {
                if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                
                userId = decoded.id;
                const userMessage = chatInformation.message;
                const chatId = chatInformation.id;
                
                User.find({ _id: userId }, (err, user) =>{
                    if(err) return console.log(err);
                    
                    Chat.updateOne( { _id: chatId }, { $push: { messages: { message: userMessage, user: user[0].email}
                    }}, { safe: true, upsert: true }, (err, data) => {
                        io.emit('chat message', {user: user[0].email, message: chatInformation.message, _id: chatInformation.id}); 
                    })
                });
            });
            
        });
        socket.on('chat name', function(chatName){
            Chat.find({name: {$regex: `${chatName}`} }, function(err, chats){
                if(err) return console.log(err);
                io.emit('chat name', chats)
            });
        })
        socket.on('typing a message', (data)=>{
            jwt.verify(data.token, config.secret, function(err, decoded) {
                if (err) return io.emit('typing a message', { auth: false, message: 'Failed to authenticate token.' });
                User.find({ _id: decoded.id }, (err, user) =>{
                    if(err) return console.log(err);
                    
                    let sendSmile = '';
                    if(allSmiles.hasOwnProperty(data.message)){
                        sendSmile = allSmiles[data.message];
                    }
                    
                    io.emit('typing a message', {email: user[0].email, status: true, smile: sendSmile})
                    const timer = () => {
                        io.emit('typing a message', {email: user[0].email, status: false, smile: ''})
                    };
                    setTimeout(timer, 5 * 1000);
                })
            })
        })
    });
});
 



app.get("/api/users", function(req, res){
        
    User.find({}, function(err, users){
 
        if(err) return console.log(err);
        res.send(users)
    });
});

app.get("/api/chats", function(req, res){
        
    Chat.find({}, function(err, chats){
 
        if(err) return console.log(err);
        res.send(chats)
    });
});
app.get("/api/messages", function(req, res){
        
    Message.find({}, function(err, messages){
 
        if(err) return console.log(messages);
        res.send(messages)
    });
});

app.get("/api/logout",VerifyToken, function(err, res){
    res.send({ auth: false, token: null})
})  


app.post("/api/signin", jsonParser, function(req, res){
    
    if(!req.body) return res.sendStatus(400);
    
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    User.find({ email: userEmail }, function(err, user){
        if(err) return console.log(err);        
        if(user.length == 0){
           return res.send({ auth: false })
        }
        if(user[0].password === userPassword){
            var token = jwt.sign({ id: user[0]._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            console.log(token)
            res.send({ auth: true, token: token, user: user })
        } else {
            res.send({ auth: false })
        }

    });
});
 
app.get("/api/users/:id", function(req, res){
         
    const id = req.params.id;
    User.findOne({_id: id}, function(err, user){
          
        if(err) return console.log(err);
        res.send(user);
    });
});

app.get("/api/chats", jsonParser, VerifyToken, function(req, res){
         
    Chat.find({_id: req.userId}, function(err, chats){
          
        if(err) return console.log(chats);
        res.send(user);
    });
});

app.post("/api/addusertochat", jsonParser, VerifyToken, function(req, res, next){
    
    if(!req.body) return res.sendStatus(400);
    const chatId = req.body.id;
    const status = req.body.status;
    if(status === 'true'){
        User.findOne({ _id: req.userId }, (err, user) =>{
            if(err) return console.log(err);
            Chat.findOne( {_id: chatId}, (err, chat) =>{
                for(let i=0; i<chat.users.length; i++){
                    if(chat.users[i].user == user.email){
                        return res.send({statusUserInthisServe: true})
                    } 
                }
                Chat.updateOne( { _id: chatId }, { $push: { users: { user: user.email, statusUserInthisServer: true}
                }}, { safe: true, upsert: true }, (err, data) => {
                })
                return res.send({statusUserInthisServer: true})
            })
        })
    } else {
        User.findOne({ _id: req.userId }, (err, user) =>{
            if(err) return console.log(err);
            Chat.findOne( {_id: chatId}, (err, chat) =>{
                for(let i=0; i<chat.users.length; i++){
                    if(chat.users[i].user == user.email){
                        chat.users.splice(i,1)
                        Chat.findOneAndUpdate( chatId,{ $set: { messages: chat.users
                        }},{ safe: true, upsert: true }, (err, data) => 
                            {
                                chat.save(function(err){
                                    if(err) return console.log(err);
                                });
                            })
                        
                        return res.send({statusUserInthisServer: false})
                    } 
                }
                return res.send({statusUserInthisServer: false})
            })
        })
    }

    
   
});

// app.delete("/api/addusertochat", jsonParser, VerifyToken, function(req, res, next){
    
//     if(!req.body) return res.sendStatus(400);
    
//     const chatId = req.body.id


//     User.findOne({ _id: req.userId }, (err, user) =>{
//         if(err) return console.log(err);
//         Chat.findOne( {_id: chatId}, (err, chat) =>{
//             for(let i=0; i<chat.users.length; i++){
//                 if(chat.users[i].user == user.email){
//                     return res.send(false)
//                 } 
//             }
//             Chat.updateOne( { _id: chatId }, { $push: { users: { user: user.email}
//             }}, { safe: true, upsert: true }, (err, data) => console.log(data))
//         })
//     })
   
// });


app.post("/api/chating", jsonParser, VerifyToken, function(req, res, next){
    
    if(!req.body) return res.sendStatus(400);
    
    const userMessage = req.body.message;
    const chatId = req.body.id;

    User.find({ _id: req.userId }, (err, user) =>{
        if(err) return console.log(err);

        Chat.updateOne( { _id: chatId }, { $push: { messages: { message: userMessage, user: user[0].email}
        }}, { safe: true, upsert: true }, (err, data) => {})

    })
   
});
app.post("/api/chats", jsonParser, VerifyToken, function(req, res, next){
    if(!req.body) return res.sendStatus(400);
    
    const nameChat = req.body.name;
    const passwordChat = req.body.password;
    console.log(`passwordChat: ${passwordChat}`)
    console.log('userid', req.userId)

    Chat.find({ name: nameChat }, (err, chat)=>{

        if(err) return console.log(err);

        if(chat.length === 1){
            console.log('find chat in system', chat)    
            res.send(false);
        } else {
            const chat = new Chat({ name: nameChat, password: passwordChat });
            chat.save(function(err){
                if(err) return console.log(err);
                res.send(chat);
            });
        }
    });
});
 
app.get("/api/eachchats", jsonParser, VerifyToken, function(req, res, next){
    if(!req.body) return res.sendStatus(400);
    
    var idChat = req.headers['x-access-id'];
    
    Chat.find({ _id:  idChat}, (err, chat)=>{

        if(err) return console.log(err);
        User.findOne({ _id: req.userId }, (err, user) =>{
            for(let i=0; i<chat[0].users.length; i++){
                if(chat[0].users[i].user == user.email){
                    res.send({ chat: chat, statusUserInthisServer: chat[0].users[i].statusUserInthisServer});
                }
            }
        })
   
    });
});



app.post("/api/users", jsonParser,  function (req, res) {
        
    if(!req.body) return res.sendStatus(400);

    console.log(req.body)
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    User.find({ email: userEmail }, (err, user)=>{

        if(err) return console.log(err);
        console.log('user', user)
        if(user.length === 1){
            console.log('find user in system', user)
            res.send(false);
        } else {
            const user = new User({email: userEmail, password: userPassword});       
            user.save(function(err){
                if(err) return console.log(err);
                res.send(user);
            });
        }
    })

   
});
     
app.delete("/api/users/:id", function(req, res){
         
    const id = req.params.id;
    User.findByIdAndDelete(id, function(err, user){
                
        if(err) return console.log(err);
        res.send(user);
    });
});
    
app.put("/api/users", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const userName = req.body.name;
    const userAge = req.body.age;
    const newUser = {age: userAge, name: userName};
     
    User.findOneAndUpdate({_id: id}, newUser, {new: true}, function(err, user){
        if(err) return console.log(err); 
        res.send(user);
    });
});

app.get('/api/check', VerifyToken, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
    
     res.status(200).send(user);
  });
  
});

app.get('/api/check-chat',jsonParser, VerifyToken, function(req, res){
    var idChat = req.headers['x-access-id'];
    Chat.find({_id: idChat}, function(err, chat){   
        if(err) return console.log(chat);
        res.send(chat);
    });
})




app.get('/api/chatforuser', VerifyToken, function(req, res, next) {
  
});