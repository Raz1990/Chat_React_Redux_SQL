"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var User_1 = require("../../src/Classess/User");
var Group_1 = require("../../src/Classess/Group");
var TempData = /** @class */ (function () {
    function TempData() {
    }
    TempData.generateGroups = function () {
        var friends, best_friends;
        friends = new Group_1.Group(1, 'Friends', []);
        best_friends = new Group_1.Group(2, 'Best Friends', []);
        friends.addNewMember(best_friends);
        friends.addNewMember(TempData.Raz);
        friends.addNewMember(TempData.Moshe);
        friends.addNewMember(TempData.Itay);
        best_friends.addNewMember(TempData.Raz);
        best_friends.addNewMember(TempData.Itay);
        best_friends.setParentGroup(friends);
        return [friends, best_friends];
    };
    TempData.generateMockUpConversations = function () {
        var time = 0;
        //raz with moshe
        TempData.addConversation(TempData.Raz, TempData.Moshe, 'שלום', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.Raz, 'מה נשמע צדיק?', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Raz, TempData.Moshe, 'הכל אחלה ומגניב', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.Raz, 'יופי, הכי טוב. קלוט את הלינק לאתר הבא:', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.Raz, 'google.com', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.Raz, 'dubJi.jfif', moment().add(time++, 's').format("HH:mm:ss"));
        time = 0;
        //raz with itay
        TempData.addConversation(TempData.Raz, TempData.Itay, 'שלום', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.Raz, 'מה אתה רוצה?', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Raz, TempData.Itay, 'יש לך חומר?', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.Raz, 'בוודאי. 500 ש"ח ל50 גרם.', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.Raz, 'crack.jpg', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.Raz, 'מזומן בלבד', moment().add(time++, 's').format("HH:mm:ss"));
        time = 0;
        //raz with Yuval
        TempData.addConversation(TempData.Yuval, TempData.Raz, 'עוגי', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Yuval, TempData.Raz, 'בוא להאפי האוור', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Raz, TempData.Yuval, 'אם יש פיצות, אני שם', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Yuval, TempData.Raz, 'יש פיצות ובחורות ובירות', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Raz, TempData.Yuval, 'איכסה בירות, רק פיצות ובחורות', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Yuval, TempData.Raz, 'סבבה אחי אני אשתה את כל הבירה בשבילך', moment().add(time++, 's').format("HH:mm:ss"));
        time = 0;
        //raz with group friends
        TempData.addConversation(TempData.Raz, TempData.group1, TempData.Raz.getName() + ': אהלן כולם, זה אני, עוגי!', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.group1, TempData.Moshe.getName() + ': עוגי זה לא בריא, זה חרטא ברטא', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Raz, TempData.group1, TempData.Raz.getName() + ': עוגי זה טעים, קח את זה בחזרה', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Moshe, TempData.group1, TempData.Moshe.getName() + ': לא רוצה', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.group1, TempData.Itay.getName() + ': עזבו אתכם עוגי, יש לי קראק. מי רוצה?', moment().add(time++, 's').format("HH:mm:ss"));
        TempData.addConversation(TempData.Itay, TempData.group1, TempData.Itay.getName() + ': מישהו?', moment().add(time++, 's').format("HH:mm:ss"));
    };
    TempData.addConversation = function (sender, receiver, content, time, real) {
        //if its the first time the sender ever sent a message
        if (!TempData.conversations[sender.getName()]) {
            TempData.conversations[sender.getName()] = {};
        }
        //will be useful in the future when getting info from the db
        var bubbleId = 0;
        //if its the first time the sender sent a message to a specific entity
        if (!TempData.conversations[sender.getName()][receiver.getName()]) {
            TempData.conversations[sender.getName()][receiver.getName()] = { val: [] };
        }
        else {
            var convo = TempData.conversations[sender.getName()][receiver.getName()].val;
            bubbleId = convo[convo.length - 1].id + 1;
        }
        //add the "bubble" to the correct conversation
        TempData.conversations[sender.getName()][receiver.getName()].val.push(TempData.newBubble(bubbleId, sender, receiver, content, time));
        //an echo back when talking "live"
        if (real) {
            if (receiver.getType() === 'group') {
                // currently sticks the convo to a static user,
                // in reality it will get the real sending user from the server
                TempData.addConversation(this.Itay, receiver, TempData.AIReply(receiver.getName()), time);
            }
            else {
                TempData.addConversation(receiver, sender, TempData.AIReply(receiver.getName()), time);
            }
        }
    };
    TempData.generateMockUpAnswers = function () {
        TempData.replies['Raz'] = ['פיצה ויומנגס וצ\'יפס', 'מה הקטע לדבר עם עצמך?', 'מדבר עם עצמך? באמת?', 'רפלקציה עצמית זה מגניב', 'מה נסגר לדבר עם עצמך?', 'הד הד הדדד', 'המחלקה הפסיכיאטרית בכיוון ההוא'];
        TempData.replies['Moshe'] = ['הכל חרטא ברטא תאמין לי', 'יש לי נוד שמביא צ\'ילדרן של נאד', 'אמן', 'לא אכפת לי, אתה צדיק'];
        TempData.replies['Itay'] = ['עכשיו תוסיף עוד 100 ש"ח', 'זה גורם למיינד פאק רציני', 'מארוול וDC הם אחלה', 'חם פה אש', 'אני שולח את זה לAPI חיצוני', 'אחלה AI לתשובות עשית', 'coc.png'];
        TempData.replies['Evgeni'] = ['יאללה לאכול', 'משהו פה לא מסתדר לי', 'צאו להפסקה'];
        TempData.replies['Ori'] = ['מגניב!', 'אז מה למדנו היום?', 'זה אוכל את זה?', 'נחמד', 'אני עושה npm i npm start וזהו'];
        TempData.replies['Yuval'] = ['עוגי שיגעוגי', 'פאו צ\'יקא-וואו-וואו', 'קמהאמאה!!!', 'HERO   ore o tataeru koe ya   kassai nante   hoshikute wa nai sa!!!', 'Ka ka ka ka kachi daze!!!', 'Omae Wa Mou Shindeiru!'];
        TempData.replies['Friends'] = [TempData.Itay.getName() + ': טוב לא חשוב הקראק נשאר אצלי', TempData.Moshe.getName() + ': קראק זה חרטא ברטא', TempData.Itay.getName() + ': אתם מפספסים אחלה קראק', TempData.Moshe.getName() + ': מישהו יכול לעזור לי עם הנוד שלי?', TempData.Itay.getName() + ': חברים חפרתם'];
        TempData.replies['Best Friends'] = ['תשובה גנרית'];
    };
    TempData.AIReply = function (receiver) {
        var rand = Math.floor(Math.random() * TempData.replies[receiver].length);
        var reply = TempData.replies[receiver][rand];
        return reply;
    };
    TempData.getConversation = function (sender, receiver) {
        if (TempData.conversations[sender.getName()][receiver.getName()]) {
            var convo = [];
            //the entity is a group and has many senders
            if (receiver.getType() === 'group') {
                var group = receiver;
                for (var _i = 0, _b = group.getGroupMembers(); _i < _b.length; _i++) {
                    var groupMember = _b[_i];
                    if (groupMember.getType() != 'group' && TempData.conversations[groupMember.getName()][receiver.getName()]) {
                        convo = convo.concat(TempData.conversations[groupMember.getName()][receiver.getName()].val);
                    }
                }
            }
            //the entity is a single user and has only one sender and receiver
            else {
                convo = convo.concat(TempData.conversations[sender.getName()][receiver.getName()].val);
                //temporary check if its the same fag talking to himself
                if (sender === receiver) { }
                else {
                    //if the receiver has a conversation of any sort
                    if (TempData.conversations[receiver.getName()]) {
                        convo = convo.concat(TempData.conversations[receiver.getName()][sender.getName()].val);
                    }
                }
            }
            convo.sort(TempData.compare);
            return convo;
        }
        return [];
    };
    TempData.compare = function (a, b) {
        if (a.timeSent < b.timeSent) {
            return -1;
        }
        if (a.timeSent > b.timeSent) {
            return 1;
        }
        // a must be equal to b
        return 0;
    };
    TempData.newBubble = function (bubbleId, sender, reciever, content, time) {
        return {
            id: bubbleId,
            content: content,
            sender: sender,
            receiver: reciever,
            timeSent: time
        };
    };
    TempData.allUsers = [
        new User_1.User(1, 'Raz', 'rrr', 27),
        new User_1.User(2, 'Moshe', 'holy_moses', 28),
        new User_1.User(3, 'Itay', 'CrackingCracks9001', 36),
        new User_1.User(4, 'Evgeni', 'var', 31),
        new User_1.User(5, 'Ori', 'magniv', 40),
        new User_1.User(6, 'Yuval', 'hamebulbal', 31),
    ];
    TempData.Raz = TempData.allUsers[0];
    TempData.Moshe = TempData.allUsers[1];
    TempData.Itay = TempData.allUsers[2];
    TempData.Evgeni = TempData.allUsers[3];
    TempData.Ori = TempData.allUsers[4];
    TempData.Yuval = TempData.allUsers[5];
    TempData.allGroups = TempData.generateGroups();
    TempData.group1 = TempData.allGroups[0];
    TempData.conversations = {};
    TempData._t = TempData.generateMockUpConversations();
    TempData.replies = {};
    TempData._a = TempData.generateMockUpAnswers();
    return TempData;
}());
exports.TempData = TempData;
//# sourceMappingURL=TempData.js.map