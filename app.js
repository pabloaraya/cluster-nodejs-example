

/* to call the library */
var cluster = require('cluster');

/* Function to factor a number */
function factorizar(n){
  var i = 2, res = [];
  while(i <= n){
    if(n%i && i++) continue;
    n = n/i;
    res[i] = res[i] || 0;
    res[i]++;
  }
  return res.reduce(function(memo, current, index){
    memo.push(index + (current > 1 ? '^' + current : ''));
    return memo;
  }, []).join(' x ');
}

/* I verify if the first execution is the master */
if(cluster.isMaster){

  /* I count the cpu numbers the machine */
	var cpuCount = require('os').cpus().length;
	for(var i = 0; i < cpuCount; i++){
		cluster.fork();
	}
  cluster.on('fork', function(worker){
    console.log('fork '+worker.id);
  });
  cluster.on('online', function(worker) {
    console.log('online '+worker.id);
  });
  cluster.on('listening', function(worker, address){
    console.log('listening: '+worker.id+' '+address.address + ":" + address.port);
  });
  cluster.on('exit', function(worker){
    console.log('worker ' + worker.id + ' died!');
    cluster.fork();
  });
}else{
	var express = require('express');
  var app = express();

  app.get('/', function (req, res) {
		res.send(factorizar(Math.floor(Math.random()*100000000)));
  });
 
  app.listen(3000);
  console.log('Application running!');
}