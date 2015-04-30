#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {


            bot = new thinker();

            //positive training data
          theDos = [[10,10],[10,10],[10,10], [9,9]];

          //negative training data
          theDonts = [[1,10],[1,10],[1,10], [1,9]];

          //the data to think on
          theHappening = [4,10];


          answer = bot.think(theDos, theDonts, theHappening );


          console.log(answer);


            res.setHeader('Content-Type', 'text/html');
            res.send(answer);
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();



//think app

function Perceptron(input, hidden, output)
{
    // create the layers
    var inputLayer = new Layer(input);
    var hiddenLayer = new Layer(hidden);
    var outputLayer = new Layer(output);

    // connect the layers
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // set the layers
    this.set({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });
}



var thinker = function(){

    var synaptic = require('synaptic'); // this line is not needed in the browser
    var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

    Perceptron.prototype = new Network();
    Perceptron.prototype.constructor = Perceptron;


    this.think = function(dos, donts, tEvent){


            var inputLayer = new Layer(2);
          var hiddenLayer = new Layer(3);
          var outputLayer = new Layer(1);

          inputLayer.project(hiddenLayer);
          hiddenLayer.project(outputLayer);

             myNetwork = new Network({
              input: inputLayer,
              hidden: [hiddenLayer],
              output: outputLayer
          }); 

            var learningRate = .001;
            var t = 0;
            var whichOneDo=0;
            var whichOneDont=0;
          for (var i = 0; i < 300000; i++)
          {
             
              
        
                try{

                    if(typeof dos[whichOneDo] == "undefined"){

                        whichOneDo=0;
                    }
                    
                    myNetwork.activate(dos[whichOneDo]);
                    myNetwork.propagate(learningRate, [1]);

                    }

                catch(err){


                }

                try{

                    if(typeof donts[whichOneDont] == "undefined"){

                        whichOneDont=0;
                    }
                    myNetwork.activate(donts[whichOneDont]);
                    myNetwork.propagate(learningRate, [0]);
                }

             catch(err){


             }

             whichOneDo = whichOneDo+1;
             whichOneDont= whichOneDont+1;
        }

         var r = myNetwork.activate(tEvent);

         console.log(dos);
         console.log(r);
        return r;
   
    }

   

}

console.log("navigate to root on your browser to see whats happening");
