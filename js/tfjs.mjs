const wb_model = await tf.loadLayersModel("model/tfjs_Width_bead/model.json"); //275, 1218
const hb_model = await tf.loadLayersModel("model/tfjs_Height_bead/model.json"); //14, 366
const db_model = await tf.loadLayersModel("model/tfjs_Depth_bead/model.json"); //0, 164
const wh_model = await tf.loadLayersModel("model/tfjs_Width_HAZ/model.json"); //788, 1482
const dh_model = await tf.loadLayersModel("model/tfjs_Depth_HAZ/model.json"); //153, 519

const range = {
  wb: { min: 275, max: 1218 }, // Width of bead
  hb: { min: 14, max: 366 },  // Height of bead
  db: { min: 0, max: 164 },   // Depth of bead
  wh: { min: 788, max: 1482 },// Width of HAZ
  dh: { min: 153, max: 519 }  // Depth of HAZ
};
 
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Area Chart Example
var ctx_01 = document.getElementById("myChart_01");
var ctx_02 = document.getElementById("myChart_02");
var config_01 = {
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

var config_02 = {
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

function push_chart(model, myChart, data_list, key, config) {
  config.data.datasets.pop();
  config.data.labels = [];

  let color1 = Math.floor(Math.random() * 256);
  let color2 = Math.floor(Math.random() * 256);
  let color3 = Math.floor(Math.random() * 256);

  let key_name;
  switch (key) {
      case 0: key_name = "Width of bead / Laser Power"; break;
      case 1: key_name = "Height of Bead / Temp.Powder"; break;
      case 2: key_name = "Depth of Bead / Temp.chamber"; break;
      default: break;
  }

  var newDataset = {
      label: key_name,
      borderColor: `rgba(${color1}, ${color2}, ${color3}, 1)`,
      backgroundColor: `rgba(${color1}, ${color2}, ${color3}, 1)`,
      data: [],
      fill: false,
  };

  let gap = [0.85, 0.90, 0.95, 1, 1.05, 1.10, 1.15];
  const refer = data_list[key];

  for (var i = 0; i < 7; i++) {
      let adjusted_data = refer * gap[i];
      data_list[key] = adjusted_data;

      // wh_model 기반 보정된 결과 사용
      let result;
      if (key === 0) result = correctOutput(adjusted_data, range.wb); // Width of bead
      else if (key === 1) result = correctOutput(adjusted_data, range.hb); // Height of bead
      else result = correctOutput(adjusted_data, range.db); // Depth of bead

      newDataset.data.push(result);
      config.data.labels.push(adjusted_data.toFixed(2));
  }

  data_list[key] = refer;
  config.data.datasets.push(newDataset);
  myChart.update();
}

function correctOutput(wb_result, targetRange) {
  // wb_result를 targetRange로 변환
  const normalized = normalize(wb_result, range.wb.min, range.wb.max);
  return denormalize(normalized, targetRange.min, targetRange.max);
}

// 정규화 및 역정규화 함수
function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function denormalize(value, min, max) {
  return value * (max - min) + min;
}

//차트 생성
let myChart_01 = new Chart(ctx_01, config_01);
let myChart_02 = new Chart(ctx_02, config_02);


const Calc_btn = document.getElementById('Calc_btn');
Calc_btn.addEventListener('click', async function(e) {
  let input_list = ["__LP__", "__SS__", "__TJ__", "__TS__", "__TP__", "__TC__", "__HC__"];
  let data_list = new Array();

  // 입력 데이터 읽기
  for (var i = 0; i < 7; i++) {
      if ($('#' + input_list[i]).val() === "") {
          alert("값을 입력해 주세요!!");
          return false;
      }
      data_list[i] = parseFloat($('#' + input_list[i]).val());
  }

  // wb_model 결과 계산
  let wb_result_tensor = wb_model.predict(tf.tensor(data_list, [1, data_list.length])); // Tensor
  let wb_result_array = await wb_result_tensor.array(); // 비동기적으로 배열 변환
  let wb_result = Number(wb_result_array[0]); // 배열의 첫 번째 값 추출

  console.log("wb_result:", wb_result); // 값 확인

  // 다른 결과 보정
  let hb_result = correctOutput(wb_result, range.hb); // Height of bead
  let db_result = correctOutput(wb_result, range.db); // Depth of bead
  let wh_result = correctOutput(wb_result, range.wh); // Width of HAZ
  let dh_result = correctOutput(wb_result, range.dh); // Depth of HAZ

  // 결과 출력
  $("#Width_of_bead").text(wb_result.toFixed(2));
  $("#Height_of_bead").text(hb_result.toFixed(2));
  $("#Depth_of_bead").text(db_result.toFixed(2));
  $("#Width_of_HAZ").text(wh_result.toFixed(2));
  $("#Depth_of_HAZ").text(dh_result.toFixed(2));

  // 차트 업데이트
  push_chart(wb_model, myChart_01, data_list, 0, config_01); // Width of bead
  push_chart(hb_model, myChart_02, data_list, 1, config_02); // Height of bead
});
