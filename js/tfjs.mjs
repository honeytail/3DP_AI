const wb_model = await tf.loadLayersModel("model/model.json");
const hb_model = await tf.loadLayersModel("model/model.json");
const db_model = await tf.loadLayersModel("model/model.json");
const wh_model = await tf.loadLayersModel("model/model.json");
const dh_model = await tf.loadLayersModel("model/model.json");

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Area Chart Example
var ctx_01 = document.getElementById("myChart_01");
var ctx_02 = document.getElementById("myChart_02");
var config = {
  type: 'line',
  data: {
    labels: ["-15%", "-10%", "-5%", "0", "5%", "10%", "15%"],
    datasets: [{
      lineTension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: ''
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {

      }
    }
  }
};

//차트 그리기
let myChart_01 = new Chart(ctx_01, config);
let myChart_02 = new Chart(ctx_02, config);

function push_chart(model, myChart, data_list, key){

    config.data.datasets.pop();

    for(var j=0; j<7; j++){
        config.data.labels.pop();
    }

    var color1 = Math.floor(Math.random() * 256);
    var color2 = Math.floor(Math.random() * 256);
    var color3 = Math.floor(Math.random() * 256);
    
    console.log(color1 + " " + color2 + " " + color3);
    let key_name;
    
    switch (key) {
        case 0:
            key_name = "Width of bead / Laser Power"
            break;
        case 4:
            key_name = "Height of Bead / Temp.Powder"
            break;
        case 5:
            key_name = "Depth of Bead / Temp.chamber"
            break;
        case 6:
            key_name = "Width of HAZ / Hum. Cham"
            break;
        default:
            break;
    }

    var newDataset = {
        label: key_name,
        borderColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
        backgroundColor : 'rgba('+color1+', '+color2+', '+color3+', 1)',
        data: [],
        fill: false
    }
    
    
    let gap = [0.85, 0.90, 0.95, 1, 1.05, 1.10, 1.15];
    const refer = data_list[key];
    var arr = data_list;

    // newDataset에 데이터 삽입
    for (var i=0; i< 7; i++){
        //console.log(refer);
        arr[key] = refer * gap[i];
        console.log("gap: "+gap[i]);
        console.log("data: "+arr);
        console.log("refer: "+refer);
        var result = model.predict(tf.tensor(arr, [1,arr.length])).arraySync();
        var num = parseInt(result);
        console.log("num: "+num);
        newDataset.data.push(num);
        config.data.labels.push(arr[key].toFixed(2));
    }

    data_list[key] = refer;
    
    // chart에 newDataset 푸쉬
    config.data.datasets.push(newDataset);
    
    myChart.update();	//차트 업데이트
    myChart_02.update();
    console.log("exit");

    return 0;
  
}


const Calc_btn = document.getElementById('Calc_btn');
Calc_btn.addEventListener('click', function(e){
  
    let input_list = ["__LP__", "__SS__", "__TJ__", "__TS__", "__TP__", "__TC__", "__HC__"];
    let data_list = new Array();
    for(var i=0; i<7; i++){
        if($('#'+input_list[i]).val() == ""){
            alert("값을 입력해 주세욧!!");
            return false;
        }
        data_list[i] = parseFloat($('#'+input_list[i]).val());
        console.log(data_list[i]);
    }

    let wb_result = wb_model.predict(tf.tensor(data_list, [1,data_list.length])).arraySync();
    let hb_result = hb_model.predict(tf.tensor(data_list, [1,data_list.length])).arraySync();
    let db_result = db_model.predict(tf.tensor(data_list, [1,data_list.length])).arraySync();
    let wh_result = wh_model.predict(tf.tensor(data_list, [1,data_list.length])).arraySync();
    let dh_result = dh_model.predict(tf.tensor(data_list, [1,data_list.length])).arraySync();

    $("#Width_of_bead").text(parseFloat(wb_result).toFixed(2));
    $("#Height_of_bead").text(parseFloat(hb_result).toFixed(2));
    $("#Depth_of_bead").text(parseFloat(db_result).toFixed(2));
    $("#Width_of_HAZ").text(parseFloat(wh_result).toFixed(2));
    $("#Depth_of_HAZ").text(parseFloat(dh_result).toFixed(2));

    //console.log(Math.round(result * 100) / 100);
    //console.log("결과 : " + result);
    //console.log("원본"+data_list);

    push_chart(wb_model, myChart_01, data_list, 0);

});