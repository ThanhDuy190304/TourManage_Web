res.clearCookie(process.env.ACCESS_TOKEN_NAME, { httpOnly: true, path: '/' });
res.clearCookie(process.env.REFRESH_TOKEN_NAME, { httpOnly: true, path: '/' });