var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const {
  CheckLogin
} = require('../middleware/index');

const {
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
} = require('../controllers/IndexController');




// View Routes Are Here
router.get('/', Login);
router.get('/index', CheckLogin, Bot, index);
router.get('/user', CheckLogin, user);
router.get('/userchat', CheckLogin, userchat);
router.get('/startbot', CheckLogin, startbot);
router.get('/role', CheckLogin, role);
router.get('/client', CheckLogin, clients);
router.get('/client_mapping', CheckLogin, client_mapping);
router.get('/create', (req, res, next) => { 

  const saltRounds = 10;
  const hash = bcrypt.hashSync(req.body.password, saltRounds);
  res.send(hash);
});
// View Routes Are Here

// Ajax Routes Are Here
router.post('/UserLogin', UserLogin);
router.get('/logout', Logout);
router.get('/get_user', get_user);
router.post('/add_user', add_user);
router.post('/edit_user', edit_user);
router.post('/delete_user', delete_user);
router.get('/get_role', get_role);
router.post('/add_role', add_role);
router.post('/edit_role', edit_role);
router.post('/delete_role', delete_role);
router.get('/get_client', get_client);
router.post('/edit_client', edit_client);
router.post('/delete_client', delete_client);
router.post('/AllClientsByUserID', AllClientsByUserID);
router.post('/GetChatsByClientID', GetChatsByClientID);
router.post('/SendMsg', SendMsg);
router.get('/Get_Users_By_UserID', Get_Users_By_UserID);
router.post('/UpdateClientUserID', UpdateClientUserID);
router.get('/stop_bot', stop_bot);
// Ajax Routes Are Here

//router.use(Bot);
module.exports = router;
