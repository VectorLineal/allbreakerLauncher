const jwt = require("jsonwebtoken");

//Checks if the given authentication cookie correponds to one of the generated authentication tokens
exports.validateAuth = async ({ req, res }, callback) => {
	const token = req.cookies.token;
	//console.log("COOKIES:", req.cookies);
	try {
		const user = jwt.verify(token, process.env.MY_SECRET);
		req.user = user;
		if (callback) await callback(req, res);
	} catch (err) {
		res.clearCookie("token");
		res.status(401).send({ message: "Required authentication" });
	}
};
