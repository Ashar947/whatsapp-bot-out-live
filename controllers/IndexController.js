const DAL = require('../config/dal');
const bcrypt = require('bcrypt');
var bot = require('../bot.js');
var client = require('../bot.js');

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}

const Connected_DAL = new DAL(config);
var count = 0

function Bot(req, res, next) {

    if (count === 0) {
        client.on('message', (message) => {
            var Message = message.body;
            var ClientNo = message.from;
            var twoDigit = ClientNo.slice(0, 2);

            if (twoDigit === '92') {
                InsertClient(ClientNo, Message)
            }

        });

        async function InsertClient(ClientNo, Message) {

            var SP = 'SP_SELECT_CLIENT_BY_NUMBER';
            var Params = [ClientNo];

            var result = await Connected_DAL.GetData(SP, Params);

            if (result.length > 0) {

                var ClientID = result[0].id;
                var SP2 = 'SP_ADD_MSG';
                var Params2 = [ClientID, Message, '1'];
                var result = await Connected_DAL.InsertData(SP2, Params2);

                if (result)
                    req.app.get('io').emit('clients', Params2);

            } else {

                var SP2 = 'SP_ADD_CLIENT';
                var Params2 = [1, ClientNo];
                var result2 = await Connected_DAL.InsertData(SP2, Params2);

                if (result2) {

                    var SP3 = 'SP_SELECT_CLIENT';
                    var Params3 = [];
                    var result3 = await Connected_DAL.GetData(SP3, Params3);

                    if (result3)
                        req.app.get('io').emit('all_clients', result3);

                    InsertClient(ClientNo, Message);
                } else {
                    console.error(result2);
                }

            }
        }
    }

    count++;
    next();
}

function Login(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
}

async function index(req, res, next) {

    res.render('index', {
        title: 'Dashboard',
        UserID: req.session.UserID
    });
}

function user(req, res, next) {
    res.render('user', {
        title: 'Users',
        UserID: req.session.UserID
    });
}

async function userchat(req, res, next) {

    res.render('userchat', {
        title: 'Users Chat',
        UserID: req.session.UserID
    });
}

function startbot(req, res, next) {

    client.on('qr', (qr) => {
        console.log(qr);
        req.app.get('io').emit('qrCode', qr);
    });

    client.on('ready', () => {
        req.session.BotReady = true;
        req.session.save();
        console.log('client is ready');
        req.app.get('io').emit('botReady', true);
    });

    res.render('startbot', {
        title: 'Start Bot',
        UserID: req.session.UserID
    });
}

function role(req, res, next) {
    res.render('role', {
        title: 'Role',
        UserID: req.session.UserID
    });
}

function clients(req, res, next) {
    res.render('client', {
        title: 'Clients',
        UserID: req.session.UserID
    });
}

function client_mapping(req, res, next) {
    res.render('client_mapping', {
        title: 'Client Mapping',
        UserID: req.session.UserID
    });
}

async function UserLogin(req, res, next) {

    var Data = req.body;
    var SP = 'SP_SELECT_USER_LOGIN';
    var Params = [Data.email];
    var Password = req.body.password;
    var match = false;

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {

            var Hash = result[0].password;
            match = bcrypt.compareSync(Password, Hash);

            if (match) {

                req.session.UserLogin = true;
                req.session.UserID = result[0].id;
                res.send({
                    result: true
                });

            } else {
                throw Error('password:Password Not Correct.');
            }

        } else {
            throw Error('email:Email Not Correct.');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

function Logout(req, res, next) {

    req.session.destroy();
    res.send(true);

}

async function get_user(req, res, next) {

    var SP = 'SP_SELECT_USER';
    var Params = [];

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('User Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }

}

async function add_user(req, res, next) {

    var Data = req.body;
    var HashPassword = bcrypt.hashSync(Data.Password, 10);
    var SP = 'SP_ADD_USER';
    var Params = [parseInt(Data.RoleID), Data.Name, Data.Email, HashPassword, parseInt(Data.Status)];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('User Not Add')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function edit_user(req, res, next) {

    var Data = req.body;
    var HashPassword = bcrypt.hashSync(Data.Password, 10);
    var SP = 'SP_EDIT_USER';
    var Params = [Data.id, parseInt(Data.RoleID), Data.Name, Data.Email, HashPassword, parseInt(Data.Status)];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('User Not Updated')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function delete_user(req, res, next) {

    var Data = req.body;
    var SP = 'SP_DELETE_USER';
    var Params = [Data.UserId];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('User Not Deleted')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function get_role(req, res, next) {

    var SP = 'SP_SELECT_ROLE';
    var Params = [];

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('Role Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }

}

async function add_role(req, res, next) {

    var Data = req.body;
    var SP = 'SP_ADD_ROLE';
    var Params = [Data.RoleName];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('Role Not Add')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function edit_role(req, res, next) {

    var Data = req.body;
    var SP = 'SP_EDIT_ROLE';
    var Params = [Data.RoleId, Data.RoleName];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('Role Not Updated')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function delete_role(req, res, next) {

    var Data = req.body;
    var SP = 'SP_DELETE_ROLE';
    var Params = [Data.RoleId];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('Role Not Deleted')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function get_client(req, res, next) {

    var SP = 'SP_SELECT_CLIENT';
    var Params = [];

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('Clients Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }

}

async function edit_client(req, res, next) {

    var Data = req.body;
    var SP = 'SP_EDIT_CLIENT';
    var Params = [Data.id, Data.Client_Name, Data.Client_Email];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('Client Not Updated')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function delete_client(req, res, next) {

    var Data = req.body;
    var SP = 'SP_DELETE_CLIENT';
    var Params = [Data.id];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) res.send(result)
        else throw Error('Client Not Deleted')

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function AllClientsByUserID(req, res, next) {

    var Data = req.body;
    var SP = 'SP_SELECT_ALL_CLIENTS_BY_USERID';
    var Params = [parseInt(Data.UserID)];

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('Clients Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function GetChatsByClientID(req, res, next) {

    var Data = req.body;
    var SP = 'SP_SELECT_CHAT_BY_CLIENT_ID';
    var Params = [parseInt(Data.ClientID)];

    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('Clients Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function SendMsg(req, res, next) {

    var Data = req.body;

    try {

        if (Data.ClientNo !== "" && Data.message !== "") {
            var result = await client.sendMessage(Data.ClientNo, Data.message);

            if (result._data) {

                var SP = "SP_ADD_MSG";
                var Params = [parseInt(Data.ClientID), Data.message, '2'];

                var result2 = await Connected_DAL.InsertData(SP, Params);

                if (result2) res.send(Params);
            } else {
                res.send({
                    err: 'Something Went Wrong.'
                });
            }

        } else {
            res.send(false);
        }

    } catch (error) {
        console.log(error);
    }
}


async function Get_Users_By_UserID(req, res, next) {

    var UserID = parseInt(req.query.UserID);

    if (UserID === 1) var SP = 'SP_SELECT_ADMIN_USER';
    if (UserID === 2) var SP = 'SP_SELECT_TEAM_LEAD_USER';

    var Params = [UserID];
    var result = await Connected_DAL.GetData(SP, Params);

    try {

        if (result.length > 0) {
            res.send(result);
        } else {
            throw Error('Clients Not Found');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}


async function UpdateClientUserID(req, res, next) {

    var Data = req.body;
    var SP = 'SP_UPDATE_CLIENT_USERID';
    var Params = [parseInt(Data.UserID), parseInt(Data.ClientID)];

    var result = await Connected_DAL.InsertData(SP, Params);

    try {

        if (result) {
            res.send(result);
        } else {
            throw Error('Clients Not Update');
        }

    } catch (err) {
        console.log(err.message);
        res.send({
            error: err.message
        });
    }
}

async function stop_bot(req, res, next){
    await client.logout();
    await client.destroy();
    await client.initialize();
    res.send(true);
}

module.exports = {
    Bot,
    Login,
    index,
    user,
    userchat,
    startbot,
    role,
    clients,
    client_mapping,
    UserLogin,
    Logout,
    get_user,
    add_user,
    edit_user,
    delete_user,
    get_role,
    add_role,
    edit_role,
    delete_role,
    get_client,
    edit_client,
    delete_client,
    AllClientsByUserID,
    GetChatsByClientID,
    SendMsg,
    Get_Users_By_UserID,
    UpdateClientUserID,
    stop_bot
};