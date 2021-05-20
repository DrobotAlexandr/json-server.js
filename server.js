const http = require('http');
const path = require('path');
const fs = require('fs');
const port = 3000;

const requestHandler = (request, response) => {

    let endpoint = getEndpoint(request);

    let endpointResponse = '';

    if (fs.existsSync(createEndpoint(endpoint))) {
        endpointResponse = fs.readFileSync(endpoint).toString();
    } else {
        endpointResponse = 'Endpoint no exists!';
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');

    response.end(
        endpointResponse
    );

    function createEndpoint(endpoint) {

        let arEndpoint = endpoint.split('/');

        let path = '';

        let json = getJson();

        let i = 0;
        arEndpoint.forEach(folder => {
            i++;

            if (i !== arEndpoint.length) {
                path += folder + '/';
            } else {
                path += folder;
            }

            if (folder.indexOf('.') + 1 === 0) {
                if (!fs.existsSync(path)) {
                    fs.mkdir(path, '0777', () => {
                    });
                }
            } else {
                if (!fs.existsSync(path)) {
                    if (folder !== 'favicon.ico') {
                        fs.writeFileSync(path, json);
                    }
                }
            }

        });

        return endpoint;

        function getJson() {

            return '{ "status" : "ok" }';;

        }
    }

    function getEndpoint(request) {
        return path.dirname(require.main.filename) + '' + request.url;
    }
};

const server = http.createServer(requestHandler);

	server.listen(port, (err) => {

});