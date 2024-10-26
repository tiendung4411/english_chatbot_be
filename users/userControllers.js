const User = require('./userModel');
const bcrypt = require('bcryptjs');



exports.register = async (req, res) => {
    try {
        const { email, userName, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            userName,
            password: hashedPassword
        });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send(error);
    }
}
exports.login = async (req, res) => {
    try {
        //we will accept the "login" input, it can be either email or username
        const { login, password } = req.body;
        const user = await User.findOne({ $or: [{ email: login }, { userName: login }] });
        if (!user) {
            return res.status(400).send('User not found');
        }
        if (await bcrypt.compare(password, user.password)) {
            res.send('Logged in');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    };
}

