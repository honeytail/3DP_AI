var latitude;
var longitude;
var name = "생산기술연구원";
var address = "대구 달성군 유가읍 테크노순환로 320";

$.ajax({
    url: 'csvdata.csv',
    dataType: 'text',
}).done(successFunction);

function successFunction(data) {
    var allRows = data.split(/\r?\n|\r/);
    var table = '<table>';

    console.log(allRows.length);

    for (var singleRow = 0; singleRow < allRows.length-1; singleRow++) {
        
        if (singleRow === 0) {
            console.log('for1-'+singleRow);
        } else {
            var rowCells = allRows[singleRow].split(',');
            console.log(rowCells);
    
            for (var i = 0; i < rowCells.length; i++) {
                if (i == 0) {
                    latitude = rowCells[i];
                } else if(i ==1){
                    longitude = rowCells[i];
                } else if(i ==2){
                    name = rowCells[i];
                } else{
                    address = rowCells[i];
                }
            }
        } 
    }

    console.log(latitude);
    console.log(longitude);

    var cityhall = new naver.maps.LatLng(latitude, longitude),
    map = new naver.maps.Map('map', {
        center: cityhall.destinationPoint(0, 500),
        zoom: 15
    }),
    marker = new naver.maps.Marker({
        map: map,
        position: cityhall
    });

    var contentString = [
            '<div class="iw_inner">',
            '   <h3>'+name+'</h3>',
            '   <p>'+address+'<br />',
            '       02-120 | 공공,사회기관 &gt; 특별,광역시청<br />',
            '       <a href="http://www.seoul.go.kr" target="_blank">www.seoul.go.kr/</a>',
            '   </p>',
            '</div>'
    ].join('');

    var infowindow = new naver.maps.InfoWindow({
        content: contentString
    });

    naver.maps.Event.addListener(marker, "click", function(e) {
        if (infowindow.getMap()) {
            infowindow.close();
        } else {
            infowindow.open(map, marker);
        }
    });

    //infowindow.open(map, marker);
}
    

//var HOME_PATH = window.HOME_PATH || '.';
//'       <img src="'+ HOME_PATH +'/img/example/hi-seoul.jpg" width="55" height="55" alt="서울시청" class="thumb" /><br />',
