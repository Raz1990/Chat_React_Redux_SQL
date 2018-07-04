import * as express from 'express';
import * as Controllers from '../Controllers'

const usersRouter = express.Router();

usersRouter.get('/', Controllers.UsersController.getAllUsers);

usersRouter.get('/:id', Controllers.UsersController.getUserById);

usersRouter.post('/login', Controllers.UsersController.getUserByNameXORPassword);

usersRouter.post('/addUser', Controllers.UsersController.addUser);

usersRouter.delete('/deleteUser', Controllers.UsersController.deleteUser);

usersRouter.put('/updateUser', Controllers.UsersController.updateUser);

/*usersRouter.get('/:name', (req, res) => {
    const name = req.params.name;
    res.send('user name: ', name);
});*/

export default usersRouter;