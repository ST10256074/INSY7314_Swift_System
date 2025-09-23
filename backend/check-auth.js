import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication failed!" });
        }
        jwt.verify(token, " this secret should be longer than it is");
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed!" });
    }
};

export default checkAuth;
