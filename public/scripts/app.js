$(document).ready(function () {
    var chaincodeId = "37509b64eb5c9df50fc083e7637f3651ec267bbb1d69d7f85c757aabdf83445722295600315dee34b499ebcb0ce322ce39cee9131544f1dd6828a31f06066053";
    var peerChaincodeEndpoint = "https://c465bd03f9354fa2ac26d8eeef78fb7f-vp0-api.0.secure.blockchain.ibm.com:443/chaincode";

    $("form#uploadFileForm").submit(function (event) {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            var request = {};
            request.jsonrpc = "2.0";
            request.method = "invoke";
            request.params = {};
            request.params.type = 1;
            request.params.chaincodeID = {};
            request.params.chaincodeID.name = chaincodeId;
            request.params.ctorMsg = {};
            request.params.ctorMsg.function = "put";
            request.params.ctorMsg.args = [$("#inputFile1")[0].files[0].name, reader.result];
            request.params.secureContext = "WebAppAdmin";
            request.id = 1;
            $.ajax({
                type: "POST",
                contentType: "application/json",
                timeout: 50000,
                url: peerChaincodeEndpoint,
                data: JSON.stringify(request),
                success: function (data) {
                    var request = {};
                    request.jsonrpc = "2.0";
                    request.method = "query";
                    request.params = {};
                    request.params.type = 1;
                    request.params.chaincodeID = {};
                    request.params.chaincodeID.name = chaincodeId;
                    request.params.ctorMsg = {};
                    request.params.ctorMsg.function = "getHashByFile";
                    request.params.ctorMsg.args = [reader.result];
                    request.params.secureContext = "WebAppAdmin";
                    request.id = 1;
                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        timeout: 50000,
                        url: peerChaincodeEndpoint,
                        data: JSON.stringify(request),
                        success: function (data) {
                            $("#fileHash").text(data.result.message);
                            return false;
                        }
                    });
                    return false;
                }
            });
        }, false);
        if ($("#inputFile1")[0].files[0]) {
            reader.readAsDataURL($("#inputFile1")[0].files[0]);
        }
        event.preventDefault();
    });

    $("form#checkIfFileExistsForm").submit(function (event) {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            var request = {};
            request.jsonrpc = "2.0";
            request.method = "query";
            request.params = {};
            request.params.type = 1;
            request.params.chaincodeID = {};
            request.params.chaincodeID.name = chaincodeId;
            request.params.ctorMsg = {};
            request.params.ctorMsg.function = "checkIfFileExists";
            request.params.ctorMsg.args = [reader.result];
            request.params.secureContext = "WebAppAdmin";
            request.id = 1;
            $.ajax({
                type: "POST",
                contentType: "application/json",
                timeout: 50000,
                url: peerChaincodeEndpoint,
                data: JSON.stringify(request),
                success: function (data) {
                    $("#ifFileExists").text(data.result.message);
                    return false;
                }
            });
        }, false);
        if ($("#inputFile2")[0].files[0]) {
            reader.readAsDataURL($("#inputFile2")[0].files[0]);
        }
        event.preventDefault();
    });

    $("form#getFileByHashForm").submit(function (event) {
        var request = {};
        request.jsonrpc = "2.0";
        request.method = "query";
        request.params = {};
        request.params.type = 1;
        request.params.chaincodeID = {};
        request.params.chaincodeID.name = chaincodeId;
        request.params.ctorMsg = {};
        request.params.ctorMsg.function = "getFileByHash";
        request.params.ctorMsg.args = [$("#fileHashInput").val()];
        request.params.secureContext = "WebAppAdmin";
        request.id = 1;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            timeout: 50000,
            url: peerChaincodeEndpoint,
            data: JSON.stringify(request),
            success: function (data) {
                $("#received-url").show();
                var file = JSON.parse(data.result.message);
                $("#received-url").attr("href", file.body)
                    .attr("download", file.name);
                return false;
            }
        });
        event.preventDefault();
    });
})
