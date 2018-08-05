"use strict";

var SimpleSigner = window.uportconnect.SimpleSigner;
var Connect = window.uportconnect.Connect;
var connect = new Connect("WIGO4IT IDENTITY",
    {
        clientId: "2op3XWF4dpPYuyvFw5UpoQviVRs8wihzHZj",
        network: "rinkeby",
        signer: SimpleSigner("a0e388225b15ea1fbb0a86547971abc7556049b6d22dc073b7744403e7058e39")
    });

// uPort connect
const uportConnect = function () {
    connect.requestCredentials({
            requested: ["name", "phone", "country"],
            notifications: true // We want this if we want to recieve credentials
        }).then((credentials) => {
            console.log("Credentials:", credentials);

            updateCredentials(credentials);
            $("[data-toggle='popover']").popover("dispose");
            gotoStep2();
            renderGlobalState();
        },
        (err) => {
            console.log("Error:", err);
        });
};

const attest = () => {
    const PROPERTY_VALUE = "yes";
    console.log(connect);
    connect.attestCredentials({
            sub: globalState.uportId,
            claim: { "Stadspas": PROPERTY_VALUE },
            exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 * 12,  // Expires in one year
        }).then((retVal) => {
            if (retVal === "ok") {
                $(".btn-success").addClass("attested");
                $(".btn-success").html("Uitgegeven");
                $(".btn-success").attr("disabled", "disabled");
                $(".btn-success").focus();
                $("header").addClass("verified");
            }
        }).catch((error) => {
            console.error(error);
        });
};