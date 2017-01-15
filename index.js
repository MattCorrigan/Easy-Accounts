var fs = require("fs");

SAVE_FILE = "accounts.data"

var User = function(name, password, attr) {
    this.username = name;
    this.password = password;
    
    this.attr = attr; // used for storing extra variables
}

var users = [];

function unpackData(data) {
    users = [];
    
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
        
        users.push(new User(user, pass, attr));
    }
    
}

function packData() {
    
    var data = "";
    
    for (var i = 0; i < users.length; i++) {
        var u = users[i];
        data += u.username + "\n";
        data += u.password + "\n";
        for (var property in u.attr) {
            data += property + ":" + u.attr[property] + ";";
        }
        data = data.slice(0, -1); // remove last semicolon
    }
    
    return data;
}

function refreshFromFile(filename) {
    fs.readFile('/account_data/' + filename, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      unpackData(data);
    });
}

function save(filename) {
    
    data = packData();
    
    fs.writeFile("/account_data/" + filename, data, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function createUser(n, p) {
    var u = new User(n, p, {});
    users.push(u);
    
    // save data
    save(SAVE_FILE);
    
    return u;
}

function removeUser(n) {
    var index = users.indexOf(getUserByName(n));
    if (index > -1) {
        users.splice(index, 1);
        save(SAVE_FILE);
    }
}

function getUserByName(name) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].username == name) {
            return users[i];
        }
    }
    return undefined;
}

function getAll() {
    return users;
}

var autoSave = setInterval(function() {save(SAVE_FILE)}, 1000 * 60); // auto-save every minute

function turnOffAutoSave() {
    if (autoSave !== undefined) {
        window.clearInterval(autoSave);
        autoSave = undefined;
    }
}

function turnOnAutoSave() {
    if (autoSave == undefined) {
        autoSave = setInterval(function() {save(SAVE_FILE)}, 1000 * 60); // auto-save every minute
    }
}

// load accounts to begin with
refreshFromFile(SAVE_FILE);

exports.printMsg = function() {
  console.log("Loaded accounts package");
}