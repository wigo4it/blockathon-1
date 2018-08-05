"use strict";

var SimpleSigner = window.uportconnect.SimpleSigner;
var Connect = window.uportconnect.Connect;

const connect = new Connect('Stadspas', {
    clientId: '2p1jpiF3y8etmroqd1D2akonNoDL7Kt8k5G',
    network: 'rinkeby',
    signer: SimpleSigner('a8566caad8918e3513b191f6e1298929a9c95b269c06e6e592c9eb53ef850c5b')
})

// uPort connect
const uportConnect = function () {
    connect.requestCredentials({
            /*requested: ["name", "phone", "country"],*/
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

const verify = () => {
    connect.requestCredentials({
            verified: ["Stadspas"]
        }).then((userProfile) => {
            console.log(userProfile);
            console.log(userProfile.verified[0].claim);
            if (userProfile.verified[0].claim.Stadspas === "yes") {
                $(".btn-success").addClass("verified");
                $(".btn-success").html("Bevestigd");
                $(".btn-success").attr("disabled", "disabled");
                $("header").addClass("verified");
            } else {
                $(".btn-success").addClass("btn-warning");
                $(".btn-success").removeClass("btn-success");

                $(".btn-warning").addClass("not-verified");
                $(".btn-warning").html("Geen Stadspas");
                $(".btn-warning").attr("disabled", "disabled");
                $(".btn-warning").focus();
            }
        }).catch ((error) => {
            console.error(error);
        });
};
