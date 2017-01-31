module.exports.fs = require("fs");
module.exports.jsonfile = require('jsonfile')

module.exports.SAVE_FILE = "accounts.data"

module.exports.User = function(name, password, attr) {
    this.username = name;
    this.password = password;
    
    this.attr = attr; // used for storing extra variables
}

module.exports.users = [];

module.exports.save = function(filename) {
    
    module.exports.jsonfile.writeFileSync(module.exports.SAVE_FILE, module.exports.users);
}

module.exports.refreshFromFile = function() {
    module.exports.users = module.exports.jsonfile.readFileSync(module.exports.SAVE_FILE);
}

module.exports.createUser = function(n, p) {
    var u = new module.exports.User(n, p, {});
    module.exports.users.push(u);
    
    // save data
    module.exports.save(module.exports.SAVE_FILE);
    
    return u;
}

module.exports.removeUser = function(n) {
    var index = module.exports.users.indexOf(module.exports.getUserByName(n));
    if (index > -1) {
        module.exports.users.splice(index, 1);
        module.exports.save(module.exports.SAVE_FILE);
    }
}

module.exports.getUserByName = function(name) {
    for (var i = 0; i < module.exports.users.length; i++) {
        if (module.exports.users[i].username == name) {
            return module.exports.users[i];
        }
    }
    return undefined;
}

module.exports.getAll = function() {
    return module.exports.users;
}

module.exports.autoSave = setInterval(function() {module.exports.save(module.exports.SAVE_FILE)}, 1000 * 60); // auto-save every minute

module.exports.turnOffAutoSave = function() {
    if (module.exports.autoSave !== undefined) {
        clearInterval(module.exports.autoSave);
        module.exports.autoSave = undefined;
    }
}

module.exports.turnOnAutoSave = function() {
    if (module.exports.autoSave == undefined) {
        module.exports.autoSave = setInterval(function() {module.exports.save(module.exports.SAVE_FILE)}, 1000 * 60); // auto-save every minute
    }
}

// load accounts to begin with
module.exports.refreshFromFile();
