# Easy-Accounts
A simple nodejs module for account management.

# Installation
To install, use `npm`'s package manager in the command line:

```
npm install easy-accounts
```

Next, put this at the top of your code to include this package:

```
var accounts = require("easy-accounts");
```

Some example code:

```
accounts.createUser("TestUser", "password1234");
myuser = accounts.getUserByName("TestUser");
console.log(myuser.password); // ouput is 'password1234'

// auto-save is enabled by default, saves every minute
accounts.turnOffAutoSave();
accounts.turnOnAutoSave();

// manual saving
accounts.save("accounts.data");

// for editing users, use accounts.users
for (var i = 0; i < accounts.users.length; i++) {
    var user = accounts.users[i];
    // add arbitrary attributes to users, for example 'elevation'
    if (user.username == "TestUser") {
      user.attr['elevation'] = "Admin;
    }
}
```
