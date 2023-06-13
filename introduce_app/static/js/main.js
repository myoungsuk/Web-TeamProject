$(function() {
    $('.profile-picture-box').click(function() {
        switch($(this).index()) {
            case 0:
                console.log("Junho!");
                break;
            case 1:
                console.log("Myoungsuk!");
                break;
            case 2:
                console.log("Sieun!");
                break;
            case 3:
                console.log("Eunsung!");
                break;
        }
    })
})