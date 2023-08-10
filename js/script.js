var isInfoButtonClosed = localStorage.getItem('isInfoButtonClosed');
var isCookiesInfoClosed = localStorage.getItem('isCookiesInfoClosed');
var isCookiesInfoVisible = localStorage.getItem('isCookiesInfoVisible');

function CloseInformCookies() {
    var mii = document.getElementById('Inform-User-Cookies');
    mii.style.display = 'none';
    window.localStorage.setItem('isCookiesInfoClosed', 'true');
}

function hideInfoCookies() {
    try {
        var mii = document.getElementById('Inform-User-Cookies');
        mii.style.display = 'none';
    } catch (err) {

    }
}

// i Agree button color
function colorWhite() {
    document.getElementById("iAgree").style.color = "white";
}

window.onload = function() {

    if (isCookiesInfoClosed == 'true') {
        var c1 = hideInfoCookies();
    }

}