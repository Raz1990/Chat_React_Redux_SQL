import * as express from 'express';
import * as routes from "./Routers"
import * as cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use('/users', routes.usersRouter);
app.use('/groups', routes.groupsRouter);
app.use('/messages', routes.messagesRouter);

export default app;