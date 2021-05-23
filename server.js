const http = require('http');
const fs = require('fs');
const port = 3000;

const requestHandler = (request, response) => {

    let endpoint = getEndpoint(request);

    let endpointResponse = '';

    if (endpoint) {

        endpoint = createEndpoint(endpoint);

        if (fs.existsSync(endpoint)) {
            endpointResponse = fs.readFileSync(endpoint).toString();
        } else {
            endpointResponse = 'Endpoint no exists!';
        }

    } else {
        endpointResponse = 'Json server is ready!';
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    response.end(
        endpointResponse
    );


    function createEndpoint(endpoint) {

        createEndpointFolders(endpoint);

        function getJson() {
            return '{ "status" : "ok" }';
        }

        function createEndpointFolders(endpoint) {

            let arEndpoint = endpoint.split('/');

            let path = '';

            let i = 0;
            arEndpoint.forEach(folder => {
                i++;

                if (i !== arEndpoint.length) {
                    path += folder + '/';
                } else {
                    path += folder;
                }

                if (folder.indexOf('.') + 1 === 0) {
                    if (!fs.existsSync(endpoint)) {
                        fs.mkdir(path, '0777', () => {
                        });
                    }
                }
            });

        }

        if (!fs.existsSync(endpoint) && endpoint.indexOf('favicon.ico') + 1 === 0) {
            fs.open(endpoint, 'w', () => {

                fs.writeFileSync(endpoint, getJson());

            });
        }

        return endpoint;

    }

    function getEndpoint(request) {

        if (request.url === '/') {
            return false;
        }

        return __dirname + '' + request.url;
    }
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {

});