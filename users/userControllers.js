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
        res.status(201).send('Tài khoản đã được tạo thành công');
    } catch (error) {
        res.status(400).send('Đã xảy ra lỗi khi tạo tài khoản');
        console.error('Lỗi khi đăng ký người dùng:', error);
    }
}

exports.login = async (req, res) => {
    try {
        // Chấp nhận thông tin "login", có thể là email hoặc tên người dùng
        const { login, password } = req.body;
        const user = await User.findOne({ $or: [{ email: login }, { userName: login }] });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(400).json({ message: 'Người dùng không tồn tại' });
        }

        // So sánh mật khẩu
        if (await bcrypt.compare(password, user.password)) {
            // Đăng nhập thành công, trả về userId
            res.status(200).json({ message: 'Đăng nhập thành công', userId: user._id });
        } else {
            res.status(400).json({ message: 'Thông tin đăng nhập không chính xác' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Đã xảy ra lỗi khi đăng nhập' });
        console.error('Lỗi khi đăng nhập:', error);
    }
}
