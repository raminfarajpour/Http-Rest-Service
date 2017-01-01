/*
    Maher Ashori    
    maher.ashori@gmail.com
    1/1/2017
*/
angular.module("HttpRestApp", []).service("RestService", function ($http, $q) {
    var baseUrl, headers, arraybuffer;

    this.testCurrentHeader = function () {
        console.log("HttpRestApp > RestService > headers", headers);
    }

    this.setBaseUrl = function (url, httpHeaders) {
        baseUrl = url;
        headers = httpHeaders;
    };

    this.addHeader = function (key, value) {
        headers[key] = value;
    }

    this.activeArrayBuffer = function () {
        arraybuffer = true;
    }

    var httpConfig = function (method, api, params, data, isQueryString, url) {
        var routeParameters = "";
        var httpConfigUrl;
        var httpUrl;

        url ? httpUrl = url : httpUrl = baseUrl;

        if (isQueryString) {
            httpConfigUrl = httpUrl + api;
        } else {
            if (params === null) {
                httpConfigUrl = httpUrl + api;
            } else {
                if (params.length === 1) {
                    httpConfigUrl = httpUrl + api + "/" + params[0];
                } else {
                    angular.forEach(params, function (parameter) {
                        routeParameters += parameter + "/";
                    });
                    httpConfigUrl = httpUrl + api + "/" + routeParameters;
                }
            }
        }

        var httpObject = {
            method: method,
            async: true,
            headers: headers,
            data: data,
            params: params,
            url: httpConfigUrl
        }

        if (arraybuffer) httpObject["responseType"] = "arraybuffer";

        var deferred = $q.defer();

        $http(httpObject).success(function (response) {
            deferred.resolve(response);
        }).error(function (error) {
            console.error("HttpRestApp error:", error);
            deferred.reject(error);
        });

        return deferred.promise;
    };

    this.get = function (params, api, isQueryString, url) {
        return httpConfig("GET", api, params, null, isQueryString, url);
    }

    this.post = function (command, api, url) {
        return httpConfig("POST", api, null, command, false, url);
    }

    this.put = function (command, api, url) {
        return httpConfig("PUT", api, null, command, false, url);
    }

    this.delete = function (params, api, isQueryString, url) {
        return httpConfig("DELETE", api, params, null, isQueryString, url);
    }
});
