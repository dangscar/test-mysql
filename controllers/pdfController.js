const getUsers = (req, res) => {
    res.json([
        {
            id: 1,
            name: "Nguyen Van A"
        },
        {
            id: 2,
            name: "Tran Thi B"
        }
    ]);
};


module.exports = { getUsers }