import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers

        if (!atoken) {
            return res.json({ success: false, message: 'Not Authorized. Please log in again.' });
        }

        const token_decode = await jwt.verify(atoken, process.env.JWT_SECRET);

        req.body.adminId = token_decode.id; // or use "aid" or any key used in JWT payload
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authAdmin;
