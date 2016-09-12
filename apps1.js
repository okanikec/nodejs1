console.log('starting password manager');

var crypto = require('crypto-js');
var storage = require('node-persist');
storage.initSync(); // prepare computer to store variables
//storage.setItemSync('accounts', [{username: 'Ike', balance: 0}]);

var argv = require('yargs')
	.command('create','Create a new account', function(yargs){
		yargs.options({
			name:{
					demand: true,
					alias: 'n',
					description: 'Account name (eg: twitter, facebook)',
					type: 'string'
				},
			username:{
						demand: true,
						alias: 'u',
						description: 'Account username or email',
						type: 'string'
					},
			password:{
						demand: 'true',
						alias: 'p',
						description: 'Account password',
						type: 'string'
						
					},
			masterPassword:{
						demand: true,
						alias: 'm',
						description: 'Master Password',
						type: 'string'
					},					
		}).help('help');
	})
	.command('get','Get an existing account', function(yargs){
		yargs.options({
			name:{
					demand: true,
					alias: 'n',
					description: 'Account name(eg: twitter, facebook)',
				},
			masterPassword:{
					demand: true,
					alias: 'm',
					description: 'Master Password',
					type: 'string'
				},
		}).help('help')
	})
	.help('help')
	.argv;
	
var command = argv._[0];		
//create
// --name
// --username
// --password

//get
// --name

function getAccounts(masterPassword)
	{
		// use getItemsync
		var encryptedAccount = storage.getItemSync('accounts');
		var accounts = [];
		
		// decrypt
		if(typeof encryptedAccount !== 'undefined')
			{
					var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
					accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
			}
		
		
		// return accounts array
		return accounts;
	
	}

function saveAccounts(accounts, masterPassword)
	{
		// encrypt accounts
		var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
		
		// setItemsync 
		storage.setItemSync('accounts', encryptedAccounts.toString());
		
		// return accounts
		return accounts;
	
	}


function createAccount(account, masterPassword)
	{
		var accounts = getAccounts(masterPassword);
		
		accounts.push(accounts);
		
		saveAccounts(accounts, masterPassword);
		
		return account;
			
	
	}

 function getAccount(accountName, masterPassword)
 	{
 		var accounts = getAccounts(masterPassword);
		var matchedAccount;
		
		accounts.forEach(function(account)
			{
				if(account.name === accountName)
					{
						matchedAccount = account;
					}
			});

 	
 		return matchedAccount;
 	}

//createAccount({name: 'facebook', username: 'some@gmail.com', password: 'password123!'});

//var facebookAccount = getAccount('facebook');
//console.log(facebookAccount);

if (command === 'create')
	{
		var createdAccount = createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password,
		}, argv.masterPassword);
		console.log('Account Created!')
		console.log(createdAccount)
	}
else if (command == 'get')
	{
		var fetchedAccount = getAccount(argv.name, argv.masterPassword);
		
		if(typeof fetchedAccount == 'undefined')
			{
				console.log('Account not found!')
			}
		else
			{
				console.log('Account found!');
				console.log(fetchedAccount);
			}	
	}	