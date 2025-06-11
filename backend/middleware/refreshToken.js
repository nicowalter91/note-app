const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);
    
    const refreshToken = cookies.refreshToken;
    
    try {
        // Verifiziere den Refresh-Token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Finde den Benutzer und prüfe, ob der Token in der Liste ist
        const user = await User.findOne({ 
            _id: decoded._id,
            'refreshTokens.token': refreshToken 
        });
        
        if (!user) return res.sendStatus(403);
        
        // Generiere neuen Access-Token
        const accessToken = jwt.sign(
            { 
                _id: user._id, 
                email: user.email, 
                fullName: user.fullName 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        
        res.json({ accessToken });
    } catch (err) {
        return res.sendStatus(403);
    }
};

const clearRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    
    const refreshToken = cookies.refreshToken;
    
    try {
        // Finde den Benutzer und entferne den Token
        await User.updateOne(
            { 'refreshTokens.token': refreshToken },
            { $pull: { refreshTokens: { token: refreshToken } } }
        );
        
        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500);
    }
};

module.exports = { handleRefreshToken, clearRefreshToken };
