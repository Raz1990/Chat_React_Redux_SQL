import * as express from 'express';
import * as Controllers from '../Controllers'

const messagesRouter = express.Router();

messagesRouter.post('/getHistory', Controllers.MessagesController.getMessagesHistory);

messagesRouter.post('/addMessage', Controllers.MessagesController.addMessage);

export default messagesRouter;