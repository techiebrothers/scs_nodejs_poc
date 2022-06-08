'use strict';
var dbConn = require('../../config/db.config');
const moment = require('moment');
//User object create
var User = function (item) {
    this.id = item.id ? item.id : 0;
    this.name = item.name;
    this.first_name = item.first_name ? item.first_name : '';
    this.last_name = item.last_name ? item.last_name : '';
    this.email = item.email;
    this.role = item.role ? item.role : 'user';
    this.password = item.password ? item.password : '';
    this.status = item.status ? item.status : 'active';
    this.phone = item.phone ? item.phone : '';
    this.profile_picture = item.profile_picture ? item.profile_picture : '';

    this.reset_request = item.reset_request != undefined ? item.reset_request : 1;
    this.login_ipaddress = item.login_ipaddress ? item.login_ipaddress : '';
    this.last_login_date = item.last_login_date ? item.last_login_date : null;
    this.reset_token = this.reset_token ? this.reset_token : '';

    this.created_by = item.created_by ? item.created_by : 0;
    this.created_date = new Date();
    this.updated_by = item.updated_by ? item.updated_by : 0;
    this.updated_date = item.updated_date ? item.updated_date : null;
};

var CronJob = require('cron').CronJob;
var job = new CronJob('1 * * * * *', function () {
    console.log('You will see this message every minute');
    // var sql = "SELECT * FROM subscriptions WHERE status='active' AND DATE_FORMAT(CONVERT_TZ(subscription_to,'+00:00','+00:00'), '%Y-%m-%d %H:%i:%s') < DATE_FORMAT(CONVERT_TZ('" + moment().utc().format("YYYY-MM-DD HH:mm:ss") + "','+00:00','+00:00'), '%Y-%m-%d %H:%i:%s')";
    // dbConn.query(sql, [], function (err, res) {

    //     if (res.length > 0) {
    //         var sql = "UPDATE subscriptions SET status='expired' WHERE status='active' AND DATE_FORMAT(CONVERT_TZ(subscription_to,'+00:00','+00:00'), '%Y-%m-%d %H:%i:%s') < DATE_FORMAT(CONVERT_TZ('" + moment().utc().format("YYYY-MM-DD HH:mm:ss") + "','+00:00','+00:00'), '%Y-%m-%d %H:%i:%s')";
    //         dbConn.query(sql, [], function (err, res) {
    //             if (err) {
    //                 console.log("error: ", err);
    //                 // result(err, null);
    //             }
    //             else {
    //                 console.log(res.insertId);
    //                 // result(null, res.insertId);
    //             }
    //         });
    //     }
    // });
}, null, true, 'America/Los_Angeles');
job.start();

User.create = function (item, result) {
    item.updated_by = item.created_by;
    item.created_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    item.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    dbConn.query("INSERT INTO users SET ?", item, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
        // console.log('User.create', this.sql);
    });
};
User.create_permission = function (item, result) {
    item.updated_by = item.created_by;
    item.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    dbConn.query("INSERT INTO users_permission SET ?", item, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });
};
User.update_permission = function (item, result) {
    item.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    dbConn.query("UPDATE users_permission SET access=?, updated_by=?, updated_date=? WHERE user_id=?", [item.access, item.created_by, item.updated_date, item.user_id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res.insertId);
        }
        // console.log('User.update_permission', this.sql);
    });
};
User.dummy_query = function (req, result) {
    dbConn.query(req.param("query"), function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
        // console.log('dummy_query', this.sql);
    });
};
User.findById = function (req, id, result) {
    var sql = "SELECT u.* FROM users AS u WHERE u.id = ? ";

    dbConn.query(sql, id, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
        // console.log('User.findById >>>', this.sql);
    });
};
User.findByEmail = function (req, result) {
    var sql = "SELECT u.* FROM users AS u WHERE u.email = ? ORDER BY u.first_name";

    dbConn.query(sql, req.body.email, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res);
        }
        console.log('User.findByEmail >>>', this.sql);
    });
};
User.update_last_login = function (req, id, result) {
    const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    dbConn.query("UPDATE users SET last_login_date=?, login_ipaddress=? WHERE id=?", [moment().utc().format("YYYY-MM-DD HH:mm:ss"), ipaddress, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            result(null, res.insertId);
        }
        // console.log('update_last_login >>>>> ', this.sql);
    });
};
User.findAll = function (req, count, result) {
    const start = req.body.page > 0 ? req.body.limit * (req.body.page - 1) : 0;
    var sql = "SELECT u.* FROM users AS u WHERE u.id!=0 ORDER BY {{sort}}";

    var where = ' ';

    var sort = 'u.first_name';
    sql = sql.replace('{{sort}}', sort);

    if (!count) {
        sql = sql + " LIMIT ?,?";
    }
    dbConn.query(sql, [start, req.body.limit], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
        // console.log('User.findAll', this.sql);
    });
};
User.update = function (item, result) {
    item.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    var sql = "UPDATE users SET name=?, first_name=?, last_name=?, email=?, phone=?, role=?, reset_request=?, updated_by=?, updated_date=? {{profile_picture}} WHERE id = ?";

    var profile_picture = item.profile_picture ? ', profile_picture="' + item.profile_picture + '"' : '';
    sql = sql.replace('{{profile_picture}}', profile_picture);
    dbConn.query(sql, [item.name, item.first_name, item.last_name, item.email, item.phone, item.role, item.reset_request, item.created_by, item.updated_date, item.id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
        console.log('User.update', this.sql);
    });
};
User.updateAssignedRoles = function (item, result) {
    item.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    var sql = "UPDATE users SET role=?, updated_by=?, updated_date=? WHERE id = ?";
    dbConn.query(sql, [item.role, item.created_by, item.updated_date, item.id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
        // console.log('User.update', this.sql);
    });
};
User.changePassword = function (id, password, result) {
    dbConn.query("UPDATE users SET reset_request=0, password=? WHERE id = ?", [password, id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.delete = function (id, is_hard, result) {
    var query = "UPDATE users SET status='deleted' WHERE id = ?";
    if (is_hard == 1) {
        query = "DELETE FROM users WHERE id = ?";
    }
    dbConn.query(query, [id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
    });
};
User.update_reset_password_token = function (token, email, result) {
    dbConn.query("UPDATE users SET reset_request=1, reset_token=? WHERE email = ?", [token, email], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.update_reset_password = function (data, result) {
    dbConn.query("UPDATE users SET reset_request=0, reset_token=?, password=? WHERE email = ?", [data.token, data.password, data.email], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
    });
};
User.reset_user_password = function (req, result) {
    req.body.updated_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");

    dbConn.query("UPDATE users SET password=?, reset_request=?, updated_by=?, updated_date=? WHERE id = ?", [req.body.password, req.body.reset_request, req.body.updated_by, req.body.updated_date, req.body.id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        } else {
            result(null, res);
        }
        // console.log('User.reset_user_password >>>', this.sql);
    });
};
User.updateStatus = function (req, result) {
    var query = "UPDATE users SET status=? WHERE id = ?";
    dbConn.query(query, [req.body.status, req.body.id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
        // console.log('User.updateStatus', this.sql);
    });
};
User.deleteUserid_type = function (req, result) {
    var query = "DELETE FROM userid_type WHERE user_id = ?";
    dbConn.query(query, [req.body.id], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            result(null, res);
        }
        // console.log('User.updateStatus', this.sql);
    });
};
module.exports = User;