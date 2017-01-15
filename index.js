module.exports.fs = require("fs");

module.exports.SAVE_FILE = "accounts.data"

module.exports.User = function(name, password, attr) {
    this.username = name;
    this.password = password;
    
    this.attr = attr; // used for storing extra variables
}

module.exports.users = [];

module.exports.unpackData = function(data) {
    module.exports.users = [];
    
    var lines = data.split("\n");
    
    for (var i = 0; i < lines.length; i += 3) {
        var user = lines[i];
        var pass = lines[i+1];
        var attrPairs = lines[i+2].split(";");
        
        var attr = {};
        for (var j = 0; j < attrPairs.length; j++) {
            var prop = attrPairs[j].split(":")[0];
            var val = attrPairs[j].split(":")[1];
            attr[prop] = val;
        }
        
        module.exports.users.push(new module.exports.User(user, pass, attr));
    }
    
}

module.exports.packData = function() {
    
    var data = "";
    
    for (var i = 0; i < module.exports.users.length; i++) {
        var u = module.exports.users[i];
        data += u.username + "\n";
        data += u.password + "\n";
        for (var property in u.attr) {
            data += property + ":" + u.attr[property] + ";";
        }
        data = data.slice(0, -1); // remove last semicolon
    }
    
    return data;
}

module.exports.refreshFromFile = function(filename) {
    module.exports.fs.readFile('/account_data/' + filename, 'utf8', function (err,data) {
      if (err) {
        return err;
      }
      module.exports.unpackData(data);
    });
}

module.exports.save = function(filename) {
    
    data = module.exports.packData();
    
    module.exports.fs.writeFile("/account_data/" + filename, data, function(err) {
        if(err) {
            return console.log(err);
        }
    });
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
        window.clearInterval(autoSave);
        module.exports.autoSave = undefined;
    }
}

module.exports.turnOnAutoSave = function() {
    if (module.exports.autoSave == undefined) {
        module.exports.autoSave = setInterval(function() {module.exports.save(module.exports.SAVE_FILE)}, 1000 * 60); // auto-save every minute
    }
}

// load accounts to begin with
module.exports.refreshFromFile(module.exports.SAVE_FILE);