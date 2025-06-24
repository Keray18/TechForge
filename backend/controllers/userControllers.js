const supabase = require("../supabaseClient");

const registerUser = async (req, res) => {
    try {
        const { companyName, username, email, password, confirmPassword } = req.body;
        const { data, error } = await supabase.auth.signUp({ companyName, username, email, password, confirmPassword });

        if(password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;   
        const { data, error } = await supabase.auth.signInWithPassword({ email, password});

        if(error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
module.exports = { registerUser, loginUser };
