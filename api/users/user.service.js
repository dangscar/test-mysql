const pool = require('../../config/database')

module.exports = {
    create: (data, callBack) => {
        pool.query(
            `insert into registration(firstName, lastName, gender, email, password, number) value (?,?,?,?,?,?)`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        );
    },
    getUsers: callBack => {
        pool.query(
            `SELECT * FROM registration`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getUserByUserId: (id, callBack) => {
        pool.query(
            `SELECT * FROM registration WHERE id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    updateUser: (data, callBack) => {
        pool.query(
            `update registration set firstName = ?, lastName = ?, gender = ?, email = ?, password = ?, number = ? where id = ?`,
            [
                data.first_name,
                data.last_name,
                data.gender,
                data.email,
                data.password,
                data.number,
                data.id
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        );
    },
    deleteUser: (id, callBack) => {
        pool.query(
            `delete from registration WHERE id = ?`,
            [id],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results)
            }
        )
    },
    getUserByUserEmail: (email, callBack) => {
        pool.query(
            `select * from registration WHERE email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error)
                }
                return callBack(null, results[0])
            }
        )
    },
};