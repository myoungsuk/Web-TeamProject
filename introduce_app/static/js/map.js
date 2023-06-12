$(document).ready(function () {
        let mapContainer = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(36.625607, 127.454562),
            level: 3
        };
        let map = new kakao.maps.Map(mapContainer, options);
    }
);